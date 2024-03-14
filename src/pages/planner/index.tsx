import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid'
import { useInfiniteQuery, useQuery } from 'react-query'
import Typography from 'src/@core/components/common/Typography'
import { showAPIErrorAsToast } from 'src/@core/utils/ApiHelpers'
import { get } from 'src/@core/utils/request'
import {
  GET_CALENDAR_DATA,
  USER_PLANNER,
  getUserCalendarEventsForActiveProduct,
  getUserGroupInfoWithId,
  getUserRecommendedTasks,
} from 'src/apis/user'
import CustomizedTab from 'src/components/common/CustomizedTab'
import Recordings from './tabs/Recordings'
import UpcomingClasses from './tabs/UpcomingClasses'

import { useEffect, useMemo } from 'react'
import { CustomBreadcrumbs } from 'src/@core/components/common/Breadcrumb'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import { useUserContext } from 'src/@core/context/UserContext'
import { ThemeColor } from 'src/@core/layouts/types'
import { Product } from 'src/apis/type'
import useUserScores from 'src/apis/useUserScore'
import { getProductCodeForProductName, getRecordingsFromEvents, parseBatches, plannerTasksTimeCalc } from './helpers'

const PlannerPage = () => {
  const { userInit, activeProductFromUserInit, userTasksWithGroupAndSectionsQuery } = useUserContext()

  const userPlannerQuery = useQuery({
    queryKey: ['userPlanner'],
    queryFn: () => get(USER_PLANNER) as Promise<UserPlannerQueryResponse>,
    onError: showAPIErrorAsToast,
  })
  const userRecommendedTasksQuery = useQuery({
    queryKey: ['userRecommendedTasks'],
    queryFn: () => get(getUserRecommendedTasks) as Promise<tasks.UserRecommendedTask>,
    onError: showAPIErrorAsToast,
  })

  const userSelectedProductInfo = useQuery({
    queryKey: ['userGroupInfoForActiveProduct', activeProductFromUserInit],
    queryFn: () =>
      get(getUserGroupInfoWithId((activeProductFromUserInit as Product).id)) as Promise<
        [{ expiry: number; startDate: number }]
      >,
    onError: showAPIErrorAsToast,
    enabled: !!activeProductFromUserInit,
  })

  const minAndMaxParamsForWebinars = useMemo(() => {
    if (!userSelectedProductInfo.data) return undefined

    const minDate = Number(userSelectedProductInfo.data[0].startDate)
    const maxDate = userSelectedProductInfo.data[0].expiry
      ? Number(userSelectedProductInfo.data[0].expiry)
      : minDate + 86400 * 180

    return {
      timeMin: new Date(minDate * 1000).toISOString(),
      timeMax: new Date(maxDate * 1000).toISOString(),
    }
  }, [userSelectedProductInfo])

  const infiniteActiveProductWebinars = useInfiniteQuery({
    queryKey: ['infiniteUserActiveProductCalendarEvents', userInit?.data?.course],
    getPreviousPageParam: () => null,
    queryFn: ({ pageParam }) => {
      return get(
        getUserCalendarEventsForActiveProduct(getProductCodeForProductName(userInit?.data?.course as string)),
        {
          queryParams: {
            ...minAndMaxParamsForWebinars,
            ...(pageParam ? { pageToken: pageParam } : {}),
          },
        },
      ) as Promise<GetUserWebinarsForActiveProductResponse>
    },
    getNextPageParam: lastPageResponse => lastPageResponse.nextPageToken,
  })
  useEffect(() => {
    if (infiniteActiveProductWebinars.isLoading || !infiniteActiveProductWebinars.hasNextPage) return
    // Trigger next page fetch
    infiniteActiveProductWebinars.fetchNextPage()
  }, [
    infiniteActiveProductWebinars.data,
    infiniteActiveProductWebinars.isLoading,
    infiniteActiveProductWebinars.hasNextPage,
  ])

  const flattenWebinars = useMemo(() => {
    return infiniteActiveProductWebinars.data?.pages.map(page => page.items).flat()
  }, [infiniteActiveProductWebinars])

  const getUserBatchesQuery = useQuery({
    queryKey: ['userCalendarData'],
    queryFn: () => get(GET_CALENDAR_DATA) as Promise<BatchCalendarDataResponse>,
    onError: showAPIErrorAsToast,
  })

  const userBatches = useMemo(
    () => (getUserBatchesQuery?.data?.data?.length ? parseBatches(getUserBatchesQuery?.data?.data) : []),
    [getUserBatchesQuery.data],
  )

  // const editExamDateMutation = useMutation({
  //   mutationFn: (updatedExamDateInSeconds: number) =>
  //     patch(userProducts, {
  //       examDate: updatedExamDateInSeconds,
  //     }),
  //   onError: showAPIErrorAsToast,
  //   onSuccess: () => {
  //     Toast.success('Successfully updated prep start date')
  //   },
  // })

  const [plannerTasks, pendingTasksCount] = useMemo(() => {
    if (
      userRecommendedTasksQuery.data?.data &&
      userInit?.data.prepDate &&
      userPlannerQuery.data?.data &&
      userInit?.data.examDate
    ) {
      const { tasks, pendingTasksCount } = plannerTasksTimeCalc({
        // @ts-ignore
        taskRecords: userTasksWithGroupAndSectionsQuery.data?.records || {},
        prepDate: userInit?.data.prepDate,
        plannerTasks: userPlannerQuery.data?.data,
        examDate: userInit?.data.examDate,
      })
      return [
        tasks.map(task => {
          return {
            ...task,
            color: plannerEventTypesColor.task,
            meta: {
              ...task.meta,
              taskType: 'task',
            },
          }
        }),
        pendingTasksCount,
      ]
    }

    return [[], 0]
  }, [userRecommendedTasksQuery, userPlannerQuery, userInit, userTasksWithGroupAndSectionsQuery])

  const webinars = useMemo(() => {
    return (
      flattenWebinars?.map(webinar => {
        return {
          ...webinar,
          id: webinar.id + webinar.start.dateTime,
          title: webinar.summary,
          start: new Date(webinar.start.dateTime).getTime(),
          end: new Date(webinar.end.dateTime).getTime(),
          color: plannerEventTypesColor.webinars,
          meta: {
            ...webinar,
            taskType: 'webinars',
          },
        }
      }) || []
    )
  }, [flattenWebinars])

  const combinedEvents = useMemo(
    () => [...plannerTasks, ...webinars, ...userBatches],
    [plannerTasks, webinars, userBatches],
  )

  // @ts-ignore
  const recordingFromEvents = useMemo(() => getRecordingsFromEvents(webinars), [webinars])

  const { getUserTargetScoreQuery, getUserBatchAndFltScoreQuery } = useUserScores()

  if (userRecommendedTasksQuery.isLoading || userPlannerQuery.isLoading || infiniteActiveProductWebinars?.isLoading)
    return <FallbackSpinner />

  const plannerTabs = [
    {
      value: 'upcomingClasses',
      label: 'Upcoming Classes',
      component: (
        <UpcomingClasses
          // @ts-ignore
          eventsToShow={combinedEvents}
          timeSpentOnPortal={((userPlannerQuery.data?.totaltimespent ?? 0) / 1000 / 60 / 60).toFixed(2)}
          totalCompleted={userRecommendedTasksQuery.data?.meta.totalCompleted ?? 0}
          totalTasks={userRecommendedTasksQuery.data?.meta.totalTasks ?? 0}
          lastFltScore={Number(getUserBatchAndFltScoreQuery.data?.fltyscrore.lasttest.score) || 0}
          targetScore={getUserTargetScoreQuery.data?.targetScore || 0}
        />
      ),
    },
    {
      value: 'recordings',
      label: 'Recordings',
      component: <Recordings recordings={recordingFromEvents} />,
    },
  ]

  return (
    <Grid>
      <CustomBreadcrumbs />
      <Grid container spacing={6}>
        <Grid
          item
          xs={12}
          sx={{
            '& .css-il18an-MuiTabPanel-root': {
              paddingRight: '0px !important',
            },
          }}
        >
          <Typography variant='h5' mb={4}>
            You are running behind the schedule on {pendingTasksCount} tasks. Catch up, mate!
          </Typography>
          <CustomizedTab tabs={plannerTabs}>
            {plannerTabs.map(item => (
              <TabPanel key={item.value} value={item.value} sx={{ pl: 0 }}>
                {item.component}
              </TabPanel>
            ))}
          </CustomizedTab>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PlannerPage

type CalendarColors = {
  webinars: ThemeColor
  class: ThemeColor
  task: ThemeColor
}

export const plannerEventTypesToColorMap: CalendarColors = {
  webinars: 'primary',
  class: 'info',
  task: 'warning',
}

export const plannerEventTypesColor = {
  webinars: '#00875A', // '#7367F0'
  class: '#34ADFF',
  task: '#FF9F43',
}

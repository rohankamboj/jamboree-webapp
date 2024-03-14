import { Box, Theme, useMediaQuery, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid'

import Typography from 'src/@core/components/common/Typography'
import IconifyIcon from 'src/@core/components/icon'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'
import { useUserContext } from 'src/@core/context/UserContext'
import { convertEpochTimeToJSDate } from 'src/@core/utils/helpers'
import PrepStartAndTargetDateModal from '../modal/PrepStartAndTargetDateModal'

import { useState } from 'react'
import Toast from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { patch } from 'src/@core/utils/request'
import { userProducts } from 'src/apis/user'
import TargetScore from 'src/pages/dashboard/components/TargetScore'
import {
  courseToMaxMinAndIncrementsType,
  courseToScoreMap,
  noDataMinMaxAndIncrements,
} from 'src/pages/dashboard/helpers'
import { getDayMonthAndYearFromTimestamp } from 'src/utils'
import PlannerCalendar from '../components/PlannerCalendar'
import { getProductCodeForProductName } from '../helpers'
import AverageFLTScoreModal from '../modal/AverageFLTScoreModal'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig
type CalendarEventStartEndTitle = {
  id: string
  title: string
  start: number
  end: number
}
export type PlannerCalendarEventType = {
  color: string
  meta:
    | (UserPlannerQueryResponse['data'][number] & { taskType: 'task' })
    | (WebinarItem & { taskType: 'webinars' })
    | (Batch & { taskType: 'class' })
  // | (WebinarItem & { taskType: 'class' })
} & CalendarEventStartEndTitle

const UpcomingClasses = ({
  totalTasks,
  totalCompleted,
  timeSpentOnPortal,
  lastFltScore,
  targetScore,
  eventsToShow,
}: {
  totalTasks: number
  totalCompleted: number
  timeSpentOnPortal: string
  lastFltScore: number
  targetScore: number
  eventsToShow: PlannerCalendarEventType[]
}) => {
  const theme = useTheme()
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { userActiveProduct, userInit } = useUserContext()
  const [isPrepStartAndTargetScoreModalOpen, setIsPrepStartAndTargetScoreModalOpen] = useState<
    'targetDate' | 'prepDate' | null
  >(null)

  const queryClient = useQueryClient()

  const activeProductCode = userActiveProduct
    ? (getProductCodeForProductName(userActiveProduct) as keyof courseToMaxMinAndIncrementsType)
    : 'NO_PRODUCT'
  const activeProductMixMaxAndIntervalScore =
    activeProductCode in courseToScoreMap ? courseToScoreMap[activeProductCode] : noDataMinMaxAndIncrements

  const [isAverageFLTScoreModalOpen, setIsAverageFLTScoreModalOpen] = useState(false)

  const targetDate = userInit?.data.examDate ? convertEpochTimeToJSDate(userInit?.data.examDate) : undefined
  const prepStartDate = userInit?.data.prepDate ? convertEpochTimeToJSDate(userInit?.data.prepDate) : undefined

  const updateTargetScoreAndDateMutation = useMutation({
    mutationFn: (variables: {
      data: {
        examDate?: number
        prepDate?: number
        targetScore?: number
      }
      onSuccess?: () => void
      onError?: () => void
    }) => patch(userProducts, variables.data),
    onSuccess: (_, variables) => {
      variables.onSuccess?.()
      // submitPMFormMutation.mutate({ transformedData: variables.data, cvPath: variables.data.meta.workex.cv })
      queryClient.invalidateQueries(['userBatchAndFltScore'])
      queryClient.invalidateQueries(['userTargetScore'])
      queryClient.invalidateQueries(['userEvents'])
      queryClient.invalidateQueries(['userRecommendedTasks'])
      queryClient.invalidateQueries(['user init'])
      Toast.success('Your target score has been updated.')
      return
    },
  })

  //   TODO: Trigger a date picker modal on onclick.
  // function handleOnClickEditExamDate() {
  //   // one day in seconds
  //   const onedayInSeconds = 86400
  //   // @ts-ignore
  //   return editExamDateMutation(userInit?.data.examDate + onedayInSeconds)
  // }

  // function handleOnClickPrepDateChange() {}

  return (
    <Grid container spacing={5}>
      {isPrepStartAndTargetScoreModalOpen && (
        <PrepStartAndTargetDateModal
          isOpen={!!isPrepStartAndTargetScoreModalOpen}
          handleClose={() => setIsPrepStartAndTargetScoreModalOpen(null)}
          isTargetDate={isPrepStartAndTargetScoreModalOpen === 'targetDate'}
          // TODO: @rohan fix this, so when we change prepStartDate from modal, then targetDate will automatically deleted, need to figure out
          date={
            isPrepStartAndTargetScoreModalOpen === 'targetDate'
              ? // @ts-ignore
                getDayMonthAndYearFromTimestamp(targetDate || new Date().getTime())
              : getDayMonthAndYearFromTimestamp(prepStartDate as unknown as string)
          }
          updateTargetScoreAndDateMutation={updateTargetScoreAndDateMutation}
        />
      )}
      {isAverageFLTScoreModalOpen && (
        <AverageFLTScoreModal
          isOpen={isAverageFLTScoreModalOpen}
          handleClose={() => setIsAverageFLTScoreModalOpen(false)}
          score={targetScore}
          updateTargetScoreAndDateMutation={updateTargetScoreAndDateMutation}
        />
      )}
      <Grid item xs={12} xl={9}>
        {/* Planner Calender */}
        <PlannerCalendar events={eventsToShow} />

        {/* Planner End */}

        <StyledBorderedBox borderRadius={1} padding={4} width='100%' mt={4} py={4}>
          <Typography variant='h5' borderBottom={border} pb={2}>
            Planner Analytics
          </Typography>

          <Box
            display='flex'
            flexDirection={isSm ? 'column' : 'row'}
            gap={4}
            justifyContent='space-between'
            alignItems='center'
            mt={4}
          >
            <PlannerAnalyticsCard
              content={totalTasks}
              subHeading='Task'
              heading='Total Number of Task'
              icon='fluent:task-list-square-24-regular'
              color='#EB763C'
              iconBgColor='#FBE4D8'
              isSm={isSm}
            />

            <PlannerAnalyticsCard
              content={totalCompleted}
              subHeading='Task'
              heading='Completed Tasks'
              icon='fluent:task-list-square-24-regular'
              color={theme.palette.primary.main}
              iconBgColor={theme.palette.primary.light}
              isSm={isSm}
            />

            <PlannerAnalyticsCard
              content={timeSpentOnPortal}
              subHeading='hours'
              heading='Hours Spent on Portal'
              icon='fa-regular:clock'
              color={theme.palette.secondary.main}
              iconBgColor='#F6F6F7'
              isSm={isSm}
            />
          </Box>
        </StyledBorderedBox>
      </Grid>
      <Grid
        item
        xs={12}
        xl={3}
        sx={{
          paddingTop: '0px !important',
        }}
      >
        <TargetScore
          openEditModal={() => setIsAverageFLTScoreModalOpen(true)}
          lastFltScore={lastFltScore}
          targetScore={targetScore}
          activeProductMixMaxAndIntervalScore={activeProductMixMaxAndIntervalScore}
          title='Average FLT Score'
          label1='Last FLT Score'
          label2='Avg Target Score'
          labelBoxBgColor='#F9FAFC'
        />

        <StyledBorderedBox borderRadius={1} mt={4}>
          <Box borderBottom={border} padding={4}>
            <Box
              borderRadius={1}
              display='flex'
              flexDirection='column'
              padding={4}
              bgcolor={theme.palette.primary.light}
            >
              <Box display='flex' justifyContent='space-between'>
                <Typography variant='h5'>Target Date</Typography>
                <Typography
                  sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => setIsPrepStartAndTargetScoreModalOpen('targetDate')}
                >
                  Edit
                </Typography>
              </Box>
              <Typography variant='h5' color={theme.palette.primary.main}>
                {!!targetDate && getDayMonthAndYearFromTimestamp(targetDate as unknown as string)}
              </Typography>
            </Box>
          </Box>
          <Box display='flex' justifyContent='space-between' paddingX={5} paddingY={4} bgcolor='#F9FAFC'>
            <Box display='flex' flexDirection='column' gap={2}>
              <Typography variant='h6'>Prep Start Date</Typography>

              <Typography variant='h5'>
                {!!prepStartDate && getDayMonthAndYearFromTimestamp(prepStartDate as unknown as string)}
              </Typography>
            </Box>
            <Typography
              sx={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => setIsPrepStartAndTargetScoreModalOpen('prepDate')}
            >
              Edit
            </Typography>
          </Box>
        </StyledBorderedBox>
      </Grid>
    </Grid>
  )
}

/* <Grid item xs={12} xl={1}>
        // TODO: Format into coorect format
        // 'dd MMM yyyy'
        Target Date {targetDate?.toDateString()}
        <Button onClick={handleOnClickEditExamDate}>Edit</Button>
        <br />
        Prep Start Date {prepStartDate?.toDateString()}
        <Button onClick={handleOnClickPrepDateChange}>Edit</Button>
      </Grid>  */

const PlannerAnalyticsCard = ({
  content,
  subHeading,
  heading,
  icon,
  color,
  iconBgColor,
  isSm,
}: {
  content: string | number | undefined
  subHeading: string
  heading: string
  icon: string
  color: string
  iconBgColor: string
  isSm: boolean
}) => {
  return (
    <Box width={isSm ? '100%' : '32%'} display='flex' justifyContent='space-between' alignItems='start'>
      <Box display='flex' flexDirection='column' gap={1}>
        <Box display='flex' alignItems='center' gap={1}>
          <Typography variant='h4' color={subHeading === 'hours' ? undefined : color}>
            {content}
          </Typography>
          <Typography variant='paragraphSmall'>{subHeading}</Typography>
        </Box>
        <Typography variant='h5'>{heading}</Typography>
      </Box>
      <Box
        borderRadius={2}
        padding={2}
        bgcolor={iconBgColor}
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <IconifyIcon color={color} icon={icon} width={35} />
      </Box>
    </Box>
  )
}

export default UpcomingClasses

import { Box, Grid, Theme, useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'
import Toast from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import Typography from 'src/@core/components/common/Typography'
import { useUserContext } from 'src/@core/context/UserContext'
import { showAPIErrorAsToast } from 'src/@core/utils/ApiHelpers'
import { get, patch } from 'src/@core/utils/request'
import useUserScores from 'src/apis/useUserScore'
import { getUserCalenderEventsForProduct, getUserRecommendedTasks, userProducts } from 'src/apis/user'
import { getProductCodeForProductName } from '../planner/helpers'
import CourseProgressWithCurrentActiveTask from './components/CourseProgressWithCurrentActiveTask'
import KakshaAIIntegration from './components/KakshaAIIntegration'
import QuickLinks from './components/QuickLinks'
import TargetScore from './components/TargetScore'
import UpcomingWebinars from './components/UpcomingWebinars'
import ExamDate from './components/examDate'
import AskQuestionModal from './components/examDate/AskQuestionModal'
import { courseToMaxMinAndIncrementsType, courseToScoreMap, noDataMinMaxAndIncrements } from './helpers'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'

const Dashboard = () => {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const { userActiveProduct, userInit } = useUserContext()

  const activeProductCode = userActiveProduct
    ? (getProductCodeForProductName(userActiveProduct) as keyof courseToMaxMinAndIncrementsType)
    : 'NO_PRODUCT'
  const activeProductMixMaxAndIntervalScore =
    activeProductCode in courseToScoreMap ? courseToScoreMap[activeProductCode] : noDataMinMaxAndIncrements

  const [slideForExamDateModal, setSlideForExamDateModal] = useState<number | null>(null)

  const queryClient = useQueryClient()

  const userRecommendedTasksQuery = useQuery({
    queryKey: ['userRecommendedTasks'],
    queryFn: () => get(getUserRecommendedTasks) as Promise<tasks.UserRecommendedTask>,
    onError: showAPIErrorAsToast,
  })
  // const userSelectedProductInfo = useQuery({
  //   queryKey: ['user', userActiveProduct],
  //   queryFn: () => get(getUserGroupInfoWithId(userActiveProduct as string)) as Promise<unknown>,
  //   onError: showAPIErrorAsToast,
  //   enabled: !!userActiveProduct,
  // })

  const updateTargetScoreAndExamDateMutation = useMutation({
    mutationFn: (variables: {
      data: {
        hasAttempted: number
        examDate: number
        targetScore: number
      }
      onSuccess?: () => void
      onError?: () => void
    }) => patch(userProducts, variables.data),
    onSuccess: (_, variables) => {
      variables.onSuccess?.()
      queryClient.invalidateQueries(['userBatchAndFltScore'])
      queryClient.invalidateQueries(['userTargetScore'])
      queryClient.invalidateQueries(['userEvents'])
      queryClient.invalidateQueries(['userRecommendedTasks'])
      queryClient.invalidateQueries(['user init'])

      Toast.success('Your target score and exam date has been updated.')
      return
    },
    onError: showAPIErrorAsToast,
  })

  const userSelectedProductEvents = useQuery({
    queryKey: ['userEvents', userActiveProduct],
    queryFn: () =>
      get(getUserCalenderEventsForProduct(getProductCodeForProductName(userActiveProduct as string)), {
        queryParams: {
          timeMin: new Date().toISOString(),
          timeMax: new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          maxResults: '3',
        },
      }) as Promise<GetUserWebinarsForActiveProductResponse>,
    onError: showAPIErrorAsToast,
    enabled: !!userActiveProduct,
  })

  const { getUserTargetScoreQuery, getUserBatchAndFltScoreQuery } = useUserScores()

  const examDate = userInit?.data?.examDate ?? 0
  const targetScore = getUserTargetScoreQuery.data?.targetScore ?? 0

  useEffect(() => {
    if (!slideForExamDateModal) {
      if (examDate === undefined || targetScore === undefined) {
        setSlideForExamDateModal(1)
      }
    }
  }, [examDate, targetScore, userInit])

  if (userRecommendedTasksQuery.isLoading || !userRecommendedTasksQuery.data) return <FallbackSpinner />

  return (
    <>
      <CustomHelmet title='Dashboard' />
      <Grid container>
        <Grid item xs={12} md={9} lg={8} xl={9}>
          <Box
            border='1px solid #FF9F43'
            bgcolor='#FFF0E1'
            borderRadius={1}
            display='flex'
            justifyContent='space-between'
            height={isSm ? '180px' : '150px'}
            mb='26px'
          >
            <Box display='flex' flexDirection='column' gap={2} padding='24px'>
              <Typography variant='h4'>Hi, {userInit?.data?.name}</Typography>
              <Typography variant='paragraphLead' color='#b56a22'>
                You have only <span style={{ color: 'red' }}>3</span> tasks to complete this week.
              </Typography>
              <Typography>Everything is under control. you can carry on with you next task</Typography>
            </Box>
            <Box sx={{ ...(isSm && { display: 'none' }) }}>
              <img src='/images/boy.png' alt='boy' height={'100%'} />
            </Box>
          </Box>
          <CourseProgressWithCurrentActiveTask recommendedTasks={userRecommendedTasksQuery} />

          <Box display='flex' mt='26px' gap='26px' sx={{ ...(isSm && { flexDirection: 'column' }) }}>
            <UpcomingWebinars webinars={userSelectedProductEvents.data?.items} />
            <KakshaAIIntegration />
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          md={3}
          lg={4}
          xl={3}
          sx={{
            ...(isSm ? { marginTop: '26px' } : { paddingLeft: '26px' }),
          }}
        >
          {slideForExamDateModal && (
            <AskQuestionModal
              updateTargetScoreAndExamDateMutation={updateTargetScoreAndExamDateMutation}
              currentSlide={slideForExamDateModal}
              setModalVisibility={setSlideForExamDateModal}
              data={{
                date: examDate,
                targetScore: targetScore,
                hasAttempted: 1,
                selectedCourseMinMaxAndIncrements: activeProductMixMaxAndIntervalScore,
              }}
            />
          )}
          <ExamDate openSetExamDateModal={() => setSlideForExamDateModal(2)} examDate={examDate} />
          <TargetScore
            openEditModal={() => setSlideForExamDateModal(4)}
            lastFltScore={Number(getUserBatchAndFltScoreQuery.data?.fltyscrore.lasttest.score ?? '0')}
            targetScore={targetScore}
            activeProductMixMaxAndIntervalScore={activeProductMixMaxAndIntervalScore}
            title='Target Score'
            label1='FLT Score'
            label2='Target Score'
            editTextColor='#96B2FE'
            label1ScoreColor='#E9900B'
          />
          {/* <UpcomingClass />
        <ActivityTracker /> */}
          <QuickLinks />
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard

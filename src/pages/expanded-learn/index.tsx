import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Skeleton,
  Theme,
  useMediaQuery,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Toast from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { AxiosErrorWithErrorMessage } from 'src/@core/context/UserContext'
import { formatSecondsToDateString } from 'src/@core/utils/helpers'
import { get, put } from 'src/@core/utils/request'
import useUpdateTaskStatus from 'src/apis/useUpdateTaskStatus'
import { GET_QUIZ_SUMMARY, getResourceWithId, getVideoResourceURL, userNotes } from 'src/apis/user'
import PastAttemptQuizReport from 'src/components/quiz-report/PastAttemptQuizReport'
import Player from '../quiz-player/Player'
import useTests from '../quiz/hooks/useTests'
import TimelineComponent from './Timeline'
import Question from '/question.svg'
import Typography from 'src/@core/components/common/Typography'
import {
  CustomizedBreadcrumb,
  StyledBreadcrumbLink,
  StyledLastBreadcrumb,
  StyledTitle,
} from 'src/@core/components/common/Breadcrumb'
import themeConfig from 'src/configs/themeConfig'

type IData = {
  note: string
}

const generateBreadcrumbs = (sectionName: string) => [
  <StyledBreadcrumbLink underline='hover' key='1' to='/'>
    Dashboard
  </StyledBreadcrumbLink>,
  <StyledLastBreadcrumb key='2'>{sectionName}</StyledLastBreadcrumb>,
]

function ExpandedLearnPage() {
  const navigate = useNavigate()

  const [showNotes, setShowNotes] = useState(false)

  const [triggerVideoPlayerLoading, setTriggerVideoPlayerLoading] = useState(false)
  const [hasUserAttemptedQuiz, setHasUserAttemptedQuiz] = useState(false)
  const [showPastAttemptQuizReport, setShowPastAttemptQuizReport] = useState(false)
  const [preTestQuizSubmissionResponse, setPreTestQuizSubmissionResponse] = useState<UserQuizSubmissionResult>()
  // const videoRef = useRef<HTMLVideoElement>()

  // const handleVideoInterval = () => {
  //   console.log('Hello')
  // }

  // useEffect(() => {
  //   // Start logging when the video plays
  //   const videoElement = document.getElementById('video')
  //   const handlePlay = () => {
  //     setInterval(handleVideoInterval, 5000) // Log every five seconds thereafter
  //   }

  //   // Attach event listener for video play
  //   videoElement?.addEventListener('play', handlePlay)

  //   // Cleanup function to remove the event listener when the component unmounts
  //   return () => {
  //     videoElement?.removeEventListener('play', handlePlay)
  //   }
  // }, [handleVideoInterval])

  const { border } = themeConfig

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IData>()
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { id: resourceId, subsectionId = null } = useParams()

  useEffect(() => {
    if (!resourceId) return
    setHasUserAttemptedQuiz(false)
  }, [resourceId])

  const queryClient = useQueryClient()

  // TODO: Mark task as ended should be only called for the last subsection.
  const { markTaskAsStarted, markTaskAsEnded } = useUpdateTaskStatus()

  const resourceQuery = useQuery({
    queryKey: ['resourceQuery', resourceId],
    onSuccess: data => {
      markTaskAsStarted.mutate({ taskID: data.activeTask.taskID })
    },
    queryFn: () =>
      get(getResourceWithId(resourceId as string), {
        queryParams: {
          details: '1',
          notes: '1',
        },
      }) as Promise<tasks.header>,
  })

  const currentTaskPreQuiz: QuizDetails =
    'qKeys' in (resourceQuery.data?.activeTask?.resource || {})
      ? resourceQuery.data?.activeTask?.resource
      : resourceQuery.data?.activeTask?.resource?.hasOwnProperty('quizDetails')
      ? // @ts-ignore
        resourceQuery.data?.activeTask?.resource.quizDetails
      : null

  const handleSubmitPreTestQuiz = (userResponse: BaseQuizSubmission) => {
    submitQuizMutation.mutate({
      data: {
        ...userResponse,
        // quizID: resourceQuery.data?.activeTask.resourceID as string,
        quizID: currentTaskPreQuiz.quizID as string,
        status: 2,
      },
      onSuccess: handleQuizSubmissionSuccess,
    })
  }

  const getPreTestQuizPastAttemptsQuery = useQuery({
    queryKey: ['preTestQuizPastAttemptsQuery', resourceId, subsectionId, resourceQuery.data?.activeTask.resourceID],
    queryFn: () =>
      get(GET_QUIZ_SUMMARY, {
        queryParams: {
          // TODO: Need to figure out which one needs to be exactly used here.
          quizID: (currentTaskPreQuiz?.quizID || resourceQuery.data?.activeTask?.resourceID) as string,
          // quizID: resourceQuery.data?.activeTask.resourceID as string,
        },
      }) as Promise<PreTestQuizPastAttemptsAPIResponse>,

    enabled: !!resourceQuery.data?.activeTask.resourceID || !!currentTaskPreQuiz?.quizID,

    onError: (error: AxiosErrorWithErrorMessage) => {
      if (error?.response?.status === 404) {
        return
      } else {
        Toast.error(error.errorMessage)
      }
    },
  })

  const currentlyViewingTaskDetails = subsectionId
    ? // @ts-ignore
      resourceQuery.data?.activeTask.resource?.children?.[Number(subsectionId) - 1]
    : resourceQuery.data?.activeTask.resource

  const resourceCurrentlyViewingSectionQuery = useQuery({
    queryKey: ['resourceVideoSrc', currentlyViewingTaskDetails?.src, subsectionId],
    queryFn: () =>
      get(getVideoResourceURL, {
        queryParams: {
          src: currentlyViewingTaskDetails?.src as string,
          explanation: 'false',
          qid: 'null',
        },
      }) as Promise<{ quality: string; src: string; url: string }>,
    enabled: !!subsectionId && !!currentlyViewingTaskDetails?.src,
  })

  useEffect(() => {
    if (subsectionId || subsectionId === null) {
      setTriggerVideoPlayerLoading(true)
      setTimeout(() => {
        setTriggerVideoPlayerLoading(false)
      }, 100)
    }
  }, [subsectionId, resourceId])

  const handleNavigateToNextSection = () => {
    // If there are subsections, navigate to the next subsection

    // @ts-ignore
    if (resourceQuery?.data?.activeTask.resource?.children?.length) {
      // @ts-ignore
      const isLastSection = Number(subsectionId) === resourceQuery?.data?.activeTask.resource?.children?.length
      if (!isLastSection) {
        navigate(`/app/learn/view/${resourceQuery?.data?.activeTask.taskID}/${Number(subsectionId) + 1}`)
        return
      }
    }

    // If the current task has more than one task in the task group, navigate to the next task
    // Find index of the current task in the task group
    const currentTaskIndex = resourceQuery.data?.data?.findIndex(
      task => task.taskID === resourceQuery.data?.activeTask.taskID,
    )
    if (!currentTaskIndex || currentTaskIndex === -1) return
    // Check if is the last task in the task group
    const isLastTask = currentTaskIndex === (resourceQuery?.data?.data?.length || 0) - 1
    if (isLastTask) {
      alert('This is the last task in the task group')
      return
    }
    const nextTask = resourceQuery.data?.data?.[currentTaskIndex + 1]
    if (nextTask) {
      navigate(`/app/learn/view/${nextTask.taskID}`)
      return
    }

    // if (resourceQuery.data?.nextTgroup) {
    //   navigate(`/app/learn/${resourceQuery.data?.nextTgroup.tGroup.id}`)
    // }
  }

  const createNoteMutation = useMutation({
    onSuccess: () => {
      Toast.success('Note added successfully.')
      queryClient.invalidateQueries(['resourceQuery'])
    },
    mutationFn: (variables: { data: { note: string; tid: string } }) => put(userNotes, variables.data),
    onError: (error: any) => {
      Toast.error(error.errorMessage)
    },
  })

  const handleAddNotes = (formData: IData) => {
    createNoteMutation.mutate({
      data: {
        note: formData.note,
        tid: resourceId as string,
      },
    })
  }

  const { submitQuizMutation } = useTests()

  const rightSideContent = useMemo(() => {
    switch (resourceQuery.data?.activeTask.type) {
      case 'link':
        return (
          <iframe
            // @ts-ignore
            onLoad={() => markTaskAsEnded.mutate({ taskID: resourceQuery.data?.activeTask.taskID })}
            src={resourceQuery.data?.activeTask.resourceID}
            style={{ width: '100%', height: '1200px', border: 'none' }}
          ></iframe>
        )
      case 'video':
      case 'playlist':
        return resourceCurrentlyViewingSectionQuery.isLoading || triggerVideoPlayerLoading ? (
          <div>
            <Skeleton animation='wave' height={500} width='100%' variant='rectangular' />
          </div>
        ) : (
          <video
            onEnded={() => {
              handleNavigateToNextSection()
              // @ts-ignore
              markTaskAsEnded.mutate({ taskID: resourceQuery.data?.activeTask.taskID })
            }}
            autoPlay
            controlsList='nodownload'
            width='100%'
            controls
            style={{ borderRadius: 6, marginTop: 10, objectFit: 'fill' }}
            id='video'
          >
            <source
              src={subsectionId ? resourceCurrentlyViewingSectionQuery?.data?.url : currentlyViewingTaskDetails?.url}
              type='video/mp4'
            />
          </video>
        )
      case 'quiz':
        return (
          <>
            <Button variant='tonal' onClick={() => setHasUserAttemptedQuiz(false)}>
              Start Quiz
            </Button>
            <br />
            <br />
            <br />
            <br />
          </>
        )

      default:
        return <Typography variant='h1'>Unsupported content type {resourceQuery.data?.activeTask.type}</Typography>
    }
  }, [
    resourceQuery.data?.activeTask,
    resourceCurrentlyViewingSectionQuery.isLoading,
    resourceCurrentlyViewingSectionQuery.data,
    !!subsectionId,
    triggerVideoPlayerLoading,
  ])

  if (resourceQuery.isLoading) return <FallbackSpinner />

  const handleQuizSubmissionSuccess = (data: UserQuizSubmissionResult) => {
    alert('Quiz Response was recorded successfully.')
    setPreTestQuizSubmissionResponse(data)
    queryClient.invalidateQueries(['preTestQuizPastAttemptsQuery'])
    handleMarkTestCompleted()
    setHasUserAttemptedQuiz(true)
  }

  const handleMarkTestCompleted = () => {
    if (!resourceQuery.data?.activeTask.taskID) {
      Toast.error('No active task Id found')
      return
    }
    markTaskAsEnded.mutate({ taskID: resourceQuery.data?.activeTask.taskID })
  }

  const handlePartiallySubmitQuiz = (userResponse: BaseQuizSubmission) => {
    submitQuizMutation.mutate({
      data: {
        ...userResponse,
        // quizID: resourceQuery.data?.activeTask.resourceID as string,
        quizID: currentTaskPreQuiz.quizID as string,
        status: 1,
      },
      onSuccess: handleQuizSubmissionSuccess,
    })
  }

  if (showPastAttemptQuizReport || preTestQuizSubmissionResponse) {
    return (
      <div style={{ inset: 0, position: 'fixed', zIndex: 10000, backgroundColor: 'white' }}>
        <PastAttemptQuizReport
          preTestQuizSubmissionResponse={preTestQuizSubmissionResponse}
          quizPastAttemptsQuery={getPreTestQuizPastAttemptsQuery}
          handleOnClickContinue={() => {
            setShowPastAttemptQuizReport(false)
            setPreTestQuizSubmissionResponse(undefined)
          }}
        />
      </div>
    )
  }

  if (currentTaskPreQuiz && !hasUserAttemptedQuiz) {
    if (!currentTaskPreQuiz?.quizID || !resourceQuery.data?.activeTask.resourceID)
      return <>No valid quiz id was found...</>
    return (
      <div style={{ inset: 0, position: 'fixed', zIndex: 10000, backgroundColor: 'white' }}>
        <Player
          quizName={currentTaskPreQuiz.quiz.quizName}
          quizQuestions={currentTaskPreQuiz.items}
          handleSubmitQuiz={handleSubmitPreTestQuiz}
          // TODO: need to also sumbit the quiz from here.
          onPressExitSection={() => setHasUserAttemptedQuiz(true)}
          handlePartiallySubmitQuiz={handlePartiallySubmitQuiz}
          // TODO: need to see if this we need to poopulted this..
          previousUserSubmissions={{
            questionIDs: [],
            optionSelected: [],
            timeTaken: [],
          }}
        />
      </div>
    )
  }

  const handleNavigateToAllModules = () => {
    navigate(-1)
  }

  return (
    <Grid>
      <CustomHelmet title='Learn' />
      <Box display='flex' alignItems={'center'} gap={4} mb={2}>
        <Box
          display='flex'
          alignItems='center'
          gap={2}
          sx={{
            borderRight: '2px solid #d6dce1',
          }}
        >
          <StyledTitle
            sx={{
              borderRight: '0px !important',
            }}
          >
            Learn
          </StyledTitle>
        </Box>
        <CustomizedBreadcrumb>{generateBreadcrumbs('Learn')}</CustomizedBreadcrumb>
      </Box>
      <Typography variant='paragraphSmall'>
        Learn phase for Quantitative has 11 modules, consisting of either a major or few minor topics. In each topic,
        the relevant theory and the related formula has been covered. Further you will find few examples to exhibit the
        application of the concepts. After you have covered the topic, we recommend you to do the related questions from
        the GMAT Official Guide. Expected time for completing this phase is approximately 60 hours.
      </Typography>
      <Grid container spacing={7} my={1}>
        {/* Modules Section */}
        <Grid item xs={12} md={showNotes ? 12 : 4} xl={3} sx={{ overflowY: 'clip' }} order={{ xs: 2, md: 1 }}>
          <Typography variant='h4'>{resourceQuery.data?.tGroup?.taskgroupAlias}</Typography>
          <Box sx={{ overflow: 'scroll' }} mt={3}>
            <Box width='100%' display='flex' flexDirection='column' rowGap={1} justifyContent='center'>
              <TimelineComponent
                taskGroup={resourceQuery.data?.tGroup}
                task={resourceQuery.data?.activeTask}
                taskSections={resourceQuery.data?.data}
                isActiveTask
              />
              <TimelineComponent
                taskGroup={resourceQuery.data?.nextTgroup?.tGroup}
                task={undefined}
                // task={resourceQuery.data?.nextTgroup}
                taskSections={resourceQuery.data?.nextTgroup?.tasks}
              />
              <Button
                sx={{
                  mt: 2,
                }}
                variant='outlined'
                color='primary'
                onClick={handleNavigateToAllModules}
              >
                All Modules
                <Icon icon='tabler:chevron-right' />
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Video and notes section */}
        <Grid item xs={12} md={showNotes ? 12 : 8} xl={9} order={{ xs: 1, md: 2 }}>
          <Grid container spacing={7}>
            <Grid item xs={12} md={showNotes ? 6 : 12} xl={showNotes ? 8 : 12} order={{ xs: 2, md: 1 }}>
              <Box
                display='flex'
                flexDirection={isSm ? 'column' : 'row'}
                justifyContent='space-between'
                alignItems={isSm ? 'start' : 'center'}
              >
                <Box>
                  <Typography variant='h4' color='grey.200'>
                    {resourceQuery.data?.tGroup?.taskgroupName}
                  </Typography>
                  <Typography variant='paragraph' color='grey.600'>
                    {currentlyViewingTaskDetails?.title}
                  </Typography>
                </Box>
                <Box display='flex' gap={4} width={isSm ? '100%' : 'auto'}>
                  {getPreTestQuizPastAttemptsQuery.data?.attempts?.length && (
                    <Button
                      variant='tonal'
                      color='primary'
                      fullWidth={isSm}
                      onClick={() => setShowPastAttemptQuizReport(true)}
                    >
                      <Icon icon='tabler:history' />
                    </Button>
                  )}

                  {!showNotes && (
                    <Button fullWidth={isSm} variant='tonal' color='primary' onClick={() => setShowNotes(true)}>
                      <Icon icon='tabler:file-plus' style={{ marginRight: 6 }} />
                      Add Note
                    </Button>
                  )}
                </Box>
              </Box>
              {/* <Box padding={2} border={border} my={3} borderRadius={1}>
                <Typography variant='h5'>Integrated Reasoning (IR)</Typography>
                <Typography variant='h6' borderLeft='4px solid #FF9F43' paddingLeft={1} color='grey.600'>
                  Let’s solve another SC question by using the elimination method.
                </Typography>
              </Box> */}

              {rightSideContent}

              {resourceQuery?.data?.tGroup?.taskgroupDescription && (
                <Accordion style={{ boxShadow: 'none', marginBottom: 15 }} sx={{ boxShadow: 0, border, my: 4 }}>
                  <AccordionSummary expandIcon={<Icon icon={'tabler:chevron-down'} />}>
                    <Box>
                      <Box display='flex' alignItems='center' gap={2}>
                        <img src={Question} />
                        <Typography>Following question are to be practiced after completing this task:</Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ boxShadow: 0 }}>
                    <Typography
                      bgcolor={'#F8F8FC'}
                      padding={2}
                      dangerouslySetInnerHTML={{
                        __html: resourceQuery?.data?.tGroup?.taskgroupDescription ?? '',
                      }}
                    />
                  </AccordionDetails>
                </Accordion>
              )}
              {/* @ts-ignore */}
              <Button LinkComponent={Link} to='/app/contact-admin' variant='outlined' color='secondary'>
                Contact Admin
                <Icon icon='tabler:chevron-right' />
              </Button>
            </Grid>
            {showNotes && (
              <Grid item xs={12} md={6} xl={4} order={{ xs: 1, md: 2 }}>
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                  <Typography variant='h4' color='grey.200'>
                    Notes
                  </Typography>
                  <Icon icon='tabler:x' onClick={() => setShowNotes(false)} style={{ cursor: 'pointer' }} />
                </Box>

                <Typography variant='paragraphSmall' color='grey.200'>
                  Write something here
                </Typography>
                <form onSubmit={handleSubmit(handleAddNotes)}>
                  <Controller
                    name='note'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        value={value}
                        onChange={onChange}
                        fullWidth
                        placeholder='Add Notes'
                        multiline
                        minRows={4}
                        sx={{ my: 2 }}
                      />
                    )}
                  />
                  {errors.note && (
                    <Typography mb={2} color={theme => theme.palette.error.main}>
                      Enter your note first.
                    </Typography>
                  )}

                  <Button fullWidth variant='outlined' color='primary' type='submit'>
                    Create Notes
                  </Button>
                </form>
                {resourceQuery.data?.notes?.map(({ note, lastUpdatedOn }) => (
                  <Box borderRadius={1} border={border} my={4}>
                    <Box
                      display='flex'
                      padding={3}
                      justifyContent='space-between'
                      alignItems='center'
                      bgcolor={'#F6F7FC'}
                    >
                      <Typography variant='paragraphSmall'>04 Oct, 2023</Typography>

                      <Typography variant='paragraphSmall' color='#A5A3AE'>
                        {/*  */}
                        {formatSecondsToDateString(lastUpdatedOn?.toString())}
                      </Typography>
                    </Box>
                    <Typography padding={2} color='#848190'>
                      {note}
                    </Typography>
                  </Box>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ExpandedLearnPage

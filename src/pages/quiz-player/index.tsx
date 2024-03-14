// @ts-nocheck
import { Box, Button, Grid, Theme, Typography, useMediaQuery } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router'
import { useLocation, useNavigate } from 'react-router-dom'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import Icon from 'src/@core/components/icon'
import { LOCAL_STORAGE_KEYS } from 'src/@core/constants'
import useLocalStorage from 'src/@core/hooks/useLocalStorage'
import { showAPIErrorAsToast } from 'src/@core/utils/ApiHelpers'
import { get } from 'src/@core/utils/request'
import { getTestWithId } from 'src/apis/user'
import DragAndDropComponent, { Sections } from 'src/components/common/DragAndDropComponent'
import Error404 from '../NotFound'
import useTests from '../quiz/hooks/useTests'
import Player from './Player'
import { CustomQuizSectionalInstructions, getStaticInstructionsForCustomTest } from './customQuizSectionalInstructions'
import QuizPlayerImage from '/images/QuizPlayer.png'
import TranslucentLoader from 'src/@core/components/common/TranslucentLoader'
import useUpdateTaskStatus from 'src/apis/useUpdateTaskStatus'

type QuizDetailsAPIResponse = {
  sections: Array<{
    section: string
    sequence: string
  }>
  test: {
    testID: number
    testName: string
    course: string
    testType?: string
    sequence?: number
    completedOn?: number
  }
  section: QuizSection
  structure: QuizQuestionType1[]
}

const QuizPlayer = () => {
  const { testID = null } = useParams()

  const { submitCustomQuizMutation } = useTests()
  const submitCustomQuiz = submitCustomQuizMutation({
    onSuccess: (_, variables) => {
      variables.status === 2 && navigate(`/pages/quiz-summary/?attemptId=${variables.attemptID}`, { replace: true })
    },
  })

  // Custom quiz states
  // TODO: Need to handle multiple sections for the quiz.

  const { pathname } = useLocation()
  const isCustomQuiz = pathname.includes('custom-test-player')

  const [customQuizSectionsWithQuestionsMeta] = useLocalStorage<KakshaQuizWithSectionsAndQuestionsMetaFromQuestionBank>(
    LOCAL_STORAGE_KEYS.CURRENT_CUSTOM_QUIZ_META,
  )
  const [customQuizAttemptId] = useLocalStorage<string | undefined>(LOCAL_STORAGE_KEYS.ATTEMPT_ID)

  const [customQuizCurrentSectionIdx, setCustomQuizCurrentSectionIdx] = useState(0)
  const [customQuizCreateMeta] = useLocalStorage<CustomAndPersonalizedQuizFilters>(LOCAL_STORAGE_KEYS.CREATE_QUIZ_META)
  // Custom quiz states end

  const queryClient = useQueryClient()

  const [isQuizInProgress, setIsQuizInProgress] = useState(false)

  const { markTaskAsEnded, markTaskAsStarted } = useUpdateTaskStatus()

  useEffect(() => {
    if (testID)
      markTaskAsStarted.mutate({
        taskID: testID,
      })
  }, [testID])

  const getTestDetailsWithSectionsQuery = useQuery({
    queryKey: ['testDetailsWithSummary', testID],
    enabled: !!testID,
    queryFn: () =>
      // As string because the query is only enabled.
      get(getTestWithId(testID as string), {
        queryParams: {
          sections: 'all',
        },
      }) as Promise<QuizDetailsAPIResponse>,
    onError: showAPIErrorAsToast,
    // refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  // const { getKakshaQuestionBankQuery, createCustomQuizMutation } = useKakshaQuestionBank()

  // const getQuizSectionsW = useQuery({
  //   queryKey: ['testDetailsWithSummary', testID],
  //   enabled: !!testID,
  //   queryFn: () =>
  //     // As string because the query is only enabled.
  //     get(getTestWithId(testID as string), {
  //       queryParams: {
  //         sections: 'all',
  //       },
  //     }) as Promise<QuizDetailsAPIResponse>,
  //   onError: showAPIErrorAsToast,
  // })

  console.log({ customQuizSectionsWithQuestionsMeta })

  const { quizSection, testMeta, sectionInstructions, quizQuestions } = useMemo(() => {
    // if (isCustomQuiz) {
    // }

    let quizQuestions: (QuizQuestionType1 | KakshaQuestionBankQuestionMeta)[] = []
    // TODO: This might have to moved to inside isSingleSectionQuiz
    const quizSection: QuizSection | CustomQuizSectionWithQuestionsMeta | undefined = isCustomQuiz
      ? customQuizSectionsWithQuestionsMeta[customQuizCurrentSectionIdx]
      : getTestDetailsWithSectionsQuery?.data?.section
    const quizQuestionAndSectionData = getTestDetailsWithSectionsQuery?.data?.structure

    // TODO: Quiz Can have multiple instructions for single section
    let sectionInstructions: Array<string> = []
    // This might need to change for multiple sections.
    const isSingleSectionQuiz = !!quizSection

    // Seperate the quiz questions and section instructions.
    if (!isCustomQuiz && isSingleSectionQuiz && quizSection) {
      const quizQuestionIdx = new Set(quizSection?.questionKeys)

      quizQuestionAndSectionData?.forEach((_section, idx) => {
        if (quizQuestionIdx.has(idx)) {
          quizQuestions.push(_section)
        } else {
          console.log('Found section instructionsss....')
          sectionInstructions.push(_section.instructionText)
        }
      })
    }

    // TODO: Need to handle multiple sections for the quiz.
    if (isCustomQuiz) {
      quizQuestions = customQuizSectionsWithQuestionsMeta?.[customQuizCurrentSectionIdx]?.questions ?? []
      // TODO: Need to add the logic for showing all sections screens
      sectionInstructions = customQuizSectionsWithQuestionsMeta?.[customQuizCurrentSectionIdx]?.section
        ? [
            getStaticInstructionsForCustomTest(
              customQuizSectionsWithQuestionsMeta?.[customQuizCurrentSectionIdx]?.section,
            ),
          ]
        : []
    }

    return {
      sectionInstructions,
      quizSection,
      testMeta: getTestDetailsWithSectionsQuery.data?.test,
      quizQuestions,
      customQuizCurrentSectionIdx,
    }
  }, [
    getTestDetailsWithSectionsQuery.data,
    isCustomQuiz,
    customQuizSectionsWithQuestionsMeta,
    customQuizCurrentSectionIdx,
  ])

  const isLastSectionOfCustomQuiz = customQuizCurrentSectionIdx === customQuizSectionsWithQuestionsMeta?.length - 1

  const doesQuizHaveMultipleSections = (getTestDetailsWithSectionsQuery.data?.sections?.length ?? 0) > 1
  const quizTimer = isCustomQuiz
    ? // Custom quiz time is in minutes instead of seconds
      ((quizSection as CustomQuizSectionWithQuestionsMeta).section_time || 0) * 60
    : (quizSection as QuizSection)?.time ?? 0

  const navigate = useNavigate()

  useEffect(() => {
    if (isQuizInProgress) return
    if (sectionInstructions === null && quizQuestions.length) {
      setIsQuizInProgress(true)
    }
  }, [sectionInstructions, isQuizInProgress, quizQuestions])

  // const submitQuizMutation = submitTestPlayerQuiz({
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['testDetailsWithSummary', testID])
  //   },
  //   onError: showAPIErrorAsToast,
  // })

  const handleNavigateToTestSummary = (attemptId: string) => {
    navigate(`/app/test/summary/${attemptId}`, { replace: true })
  }
  const { updateTestPlayerQuiz } = useTests()
  const updateQuizMutation = updateTestPlayerQuiz({
    onSuccess: async data => {
      queryClient.invalidateQueries(['testDetailsWithSummary', testID])
      if (testID) await markTaskAsEnded.mutateAsync({ taskID: testID })
      if (data?.message === 'Test Over') {
        handleNavigateToTestSummary(data?.attemptID as string)
      }
    },
    onError: showAPIErrorAsToast,
  })

  const attemptId: string | undefined = isCustomQuiz ? customQuizAttemptId : quizSection?.attemptID

  const handleSubmitQuizSection = async (data: LearnViewQuizSubmission) => {
    if (!attemptId) return alert('Attempt ID not found')
    setIsQuizInProgress(false)
    if (isCustomQuiz) {
      await submitCustomQuiz.mutateAsync({
        ...data,
        status: 2,
        attemptID: attemptId,
      })
    } else {
      await updateQuizMutation.mutateAsync({
        attemptID: attemptId,
        ...data,
        status: 2,
      })
    }
  }

  // if (getTestDetailsWithSectionsQuery.isRefetching)

  const handleStartCurrentQuizSection = () => setIsQuizInProgress(true)

  const handleExitQuizInstructionsSection = async () => {
    // TODO: Add handling for custom quiz.
    if (!attemptId) return alert('Attempt ID not found')

    if (isCustomQuiz) {
      // @ts-ignore
      const questionIds = quizQuestions?.map(({ questionid }) => questionid) ?? []
      await submitCustomQuiz.mutateAsync({
        questionIDs: questionIds,
        status: isLastSectionOfCustomQuiz ? 2 : 1,
        attemptID: attemptId,
        timeTaken: Array(questionIds.length).fill(null),
        optionSelected: Array(questionIds.length).fill(null),
        // @ts-ignore
        lastSeenQuestionID: '',
      })
      if (!isLastSectionOfCustomQuiz) {
        setCustomQuizCurrentSectionIdx(prev => prev + 1)
      }
      setIsQuizInProgress(false)
      return
    }

    // @ts-ignore
    const questionIDs = quizQuestions?.map(({ testQuestionID }) => testQuestionID) ?? []
    await updateQuizMutation.mutateAsync({
      questionIDs,
      status: 2,
      attemptID: attemptId,
      timeTaken: Array(questionIDs.length).fill(null),
      optionSelected: Array(questionIDs.length).fill(null),
      // @ts-ignore
      lastSeenQuestionID: null,
    })

    // Move to next section if exists....
  }
  const handleOnPressExitFromQuizPlayer = async (data: BaseQuizSubmission) => {
    if (!attemptId) return alert('Attempt ID not found')

    // TODO: Need to update this to add null values for unanswered questions.
    // @ts-ignore
    const questionIDs = quizQuestions?.map(({ testQuestionID }) => testQuestionID) ?? []

    // TODO: Add handling for multiple sections.
    if (isCustomQuiz) {
      await submitCustomQuiz.mutateAsync({
        ...data,
        status: isLastSectionOfCustomQuiz ? 2 : 1,
        attemptID: attemptId,
        // Add 0 for unanswered questions.
        timeTaken: data.timeTaken.concat(Array(questionIDs.length - data.timeTaken.length).fill(0)),
      })
      if (!isLastSectionOfCustomQuiz) {
        setCustomQuizCurrentSectionIdx(prev => prev + 1)
      }
      setIsQuizInProgress(false)
      return
    }

    await updateQuizMutation.mutateAsync({
      ...data,
      questionIDs,
      status: 2,
      attemptID: attemptId,
      // Add 0 for unanswered questions.
      timeTaken: data.timeTaken.concat(Array(questionIDs.length - data.timeTaken.length).fill(0)),
    })
    setIsQuizInProgress(false)
  }

  const handlePartiallySubmitQuiz = async (data: BaseQuizSubmission) => {
    if (!attemptId) return alert('Attempt ID not found')
    if (isCustomQuiz) {
      return await submitCustomQuiz.mutateAsync({
        ...data,
        status: 1,
        attemptID: attemptId,
      })
    }

    await updateQuizMutation.mutateAsync({
      ...data,
      // Partial submission
      status: 1,
      attemptID: attemptId,
    })
  }

  const userPreviousSubmissionData: Omit<BaseQuizSubmission, 'lastSeenQuestionID'> = useMemo(() => {
    if (!quizSection)
      return {
        questionIDs: [],
        optionSelected: [],
        timeTaken: [],
      }
    return {
      questionIDs: quizSection?.questionIDs?.map(id => Number(id)) ?? [],
      optionSelected: quizSection?.optionSelected ?? [],
      timeTaken: quizSection?.timeTaken ?? [],
    }
  }, [quizSection])

  const handleBeginQuizForCurrentSection = () => {
    // const
    // TODO: Update this to include other info like time taken, which quiz section is in progress.
    setIsQuizInProgress(true)
  }

  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  // if (true) return <DragAndDropComponent sections={getTestDetailsWithSectionsQuery.data?.sections} />

  const quizName = useMemo(() => {
    if (isCustomQuiz) {
      console.log({ customQuizCreateMeta })
      if (!customQuizCreateMeta) return 'No valid quiz name was found...'
      return customQuizCreateMeta?.quizname
    } else {
      // TODO: Add Check if the quizSection of the QuizSection type.
      if (!quizSection || !('currentNum' in quizSection)) return 'Invalid Section Data...'
      return `${testMeta?.testName}  Section ${quizSection?.currentNum} of ${quizSection?.totalNum} `
    }
  }, [isCustomQuiz, testMeta, quizSection, customQuizCreateMeta])

  if (!testID && !isCustomQuiz) {
    return <Error404 />
  }

  if (getTestDetailsWithSectionsQuery.isLoading) return <FallbackSpinner />

  const reordarableSections = getTestDetailsWithSectionsQuery.data?.sections
  const handleSetSectionOrder = (sections: Sections[]) => {
    get(getTestWithId(testID as string), {
      queryParams: {
        sequence: JSON.stringify(sections.map(({ sequence }) => sequence)),
      },
      processData: () => {
        queryClient.invalidateQueries(['testDetailsWithSummary', testID])
      },
    })
  }
  if (doesQuizHaveMultipleSections) {
    return <DragAndDropComponent sections={reordarableSections} onClick={handleSetSectionOrder} />
  }

  if (quizQuestions.length === 0) return <p>No questions found in quiz....</p>

  if (isQuizInProgress) {
    return (
      <>
        {getTestDetailsWithSectionsQuery.isRefetching && <TranslucentLoader />}
        <Player
          isCustomTest={isCustomQuiz}
          quizTimer={quizTimer}
          // @ts-ignore
          quizQuestions={quizQuestions ?? []}
          previousUserSubmissions={userPreviousSubmissionData}
          quizName={quizName}
          // quizDetails={{ items: quizQuestions as QuizQuestionType1[], ...getTestDetailsWithSectionsQuery.data?.test }}
          // @ts-ignore
          handleSubmitQuiz={handleSubmitQuizSection}
          handlePartiallySubmitQuiz={handlePartiallySubmitQuiz}
          onPressExitSection={handleOnPressExitFromQuizPlayer}
          lastSeenQuestionID={quizSection?.lastSeenQuestionID}
        />
      </>
    )
  }

  const showSectionDescriptionAsHtml = isCustomQuiz

  if (sectionInstructions && !isQuizInProgress)
    return (
      <Grid container columnSpacing={isSm ? 0 : 6} mb={'0px !important'}>
        {getTestDetailsWithSectionsQuery.isRefetching && <TranslucentLoader />}
        <Grid height='100vh' item md={5} xl={4} sx={{ ...(isSm && { display: 'none' }) }}>
          <img
            style={{ backgroundColor: '#F8F7FA' }}
            src={QuizPlayerImage}
            alt='QuizPlayerImage'
            width='100%'
            height='100%'
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={7}
          xl={8}
          display='flex'
          flexDirection='column'
          gap={2}
          justifyContent='space-between'
          sx={{
            ...(isMd ? { padding: '50px !important' } : { padding: '80px !important' }),
            overflow: 'scroll',
            height: '100vh',
          }}
        >
          {!showSectionDescriptionAsHtml ? (
            // @ts-ignore
            <TestInstructions
              sectionInstructions={sectionInstructions}
              // testMeta={testMeta}
              quizName={quizName}
              quizTimer={quizTimer}
              handleStartCurrentQuizSection={handleStartCurrentQuizSection}
            />
          ) : (
            <CustomQuizSectionalInstructions
              createMeta={customQuizCreateMeta}
              currentCustomQuizSection={quizSection as CustomQuizSectionWithQuestionsMeta}
              handleStartCurrentQuizSection={handleStartCurrentQuizSection}
              // TODO: See if there are multiple instructions for a single section.
              // Also need to handle the preview of all the sections.
              instructionText={sectionInstructions[0]}
            />
          )}
          <Box display='flex' justifyContent={'space-between'} alignItems='center'>
            <Button variant='tonal' color='secondary' onClick={handleExitQuizInstructionsSection}>
              Exit Section
            </Button>
            {/* @ts-ignore */}
            <Button variant='contained' color='primary' onClick={handleBeginQuizForCurrentSection}>
              Next
            </Button>
          </Box>
        </Grid>
      </Grid>
    )
  return <p>Unhandled Quiz State</p>
}

export const InfoWithIcon = ({ icon, title, description }: { icon: string; title: string; description: string }) => {
  return (
    <Box display='flex' gap={2} width='50%'>
      {/* Icon */}
      <Box bgcolor='#F1F0F2' display='flex' alignItems='center' justifyContent='center' width={'40px'} borderRadius={1}>
        <Icon icon={icon} />
      </Box>
      <Box>
        <Typography variant='h6'>{title}</Typography>
        {/* @ts-ignore */}
        <Typography variant='paragraphSmall'>{description}</Typography>
      </Box>
    </Box>
  )
}

export default QuizPlayer

const TestInstructions = ({
  sectionInstructions,
  quizName,
  quizTimer,
  handleStartCurrentQuizSection,
}: {
  sectionInstructions: string[]
  testMeta: QuizDetailsAPIResponse['test']
  quizName: string
  quizTimer: number
  handleStartCurrentQuizSection: () => void
}) => {
  useEffect(() => {
    if (sectionInstructions.length === 0) {
      handleStartCurrentQuizSection()
    }
  }, [sectionInstructions])

  return (
    <Box>
      <Typography variant='h5'>{quizName}</Typography>
      {/* <Typography variant='paragraphMedium'>{instructionText}</Typography> */}
      <Box display='flex' gap={4}>
        <InfoWithIcon icon='time' title='Time' description={`${quizTimer / 60} minutes`} />
        {/* <InfoWithIcon icon='question' title='Questions' description={`${testMeta?.totalQuestions}`} /> */}
      </Box>

      <Typography dangerouslySetInnerHTML={{ __html: sectionInstructions ?? '' }} />
    </Box>
  )
}

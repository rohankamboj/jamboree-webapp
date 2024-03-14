import { Box, Button, Grid, Theme, Typography, useMediaQuery } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useDebouncedCallback } from 'src/@core/hooks/useDebouncedCallback'
import CountdownTimer from './CountdownTimer'

import IconifyIcon from 'src/@core/components/icon'
import useTests from '../quiz/hooks/useTests'
import QuizAnswerSection from './components/quizAnswerSection'
import QuizQuestionSection from './components/quizQuestionSection'
import { getQuestionIdBasedOnType } from './helpers'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig
interface BaseQuizPlayerProps {
  quizTimer?: number
  quizName: string
  handleSubmitQuiz: (response: BaseQuizSubmission) => void
  onPressExitSection: (currentUserResponse: BaseQuizSubmission) => void
  handlePartiallySubmitQuiz: (currentUserResponse: BaseQuizSubmission) => void
  previousUserSubmissions: Omit<BaseQuizSubmission, 'lastSeenQuestionID'>
  lastSeenQuestionID?: number
}

interface QuizPlayerProps extends BaseQuizPlayerProps {
  quizQuestions: Array<QuizQuestionType> | Array<QuizQuestionType1>
  isCustomTest?: never
}
interface CustomQuizPlayerProps extends BaseQuizPlayerProps {
  quizQuestions: Array<KakshaQuestionBankQuestionMeta>
  isCustomTest: boolean
}

const sampleQuestionResponseTemplate = {
  questionType: '',
  section: '',
  course: '',
  primaryTopic: '',
  questionText: '',
  optionText: '[]',
  passage: '',
  explanation: '',
  correctAnswers: '3',
  videoExplanation: '',
  conceptual: '["Weaken"]',
  isLoading: true,
}

export const allowedQuestionTypes: AllowedQuestionType[] = [
  'mcq',
  'awa',
  'rc_mcq',
  'sc_1b',
  'sc_2b',
  'sc_3b',
  'mmcq',
  'rc_mcq',
  'rc_mmcq',
  'neq',
  'ir_2pa',
  'ir_ta',
  'ir_msr_mdcq',
  'ir_msr_mcq',
  'ir_gi',
  'rc_tool',
  'rc_ts',
]

const Player = (props: QuizPlayerProps | CustomQuizPlayerProps) => {
  const { previousUserSubmissions, handleSubmitQuiz, quizQuestions, quizName, lastSeenQuestionID } = props
  const userSubmissions = useRef(previousUserSubmissions)
  const idxForLastSeenQuestionID =
    lastSeenQuestionID && previousUserSubmissions
      ? previousUserSubmissions?.questionIDs.indexOf(lastSeenQuestionID)
      : -1

  const quizStartAtIndex = idxForLastSeenQuestionID >= 0 ? idxForLastSeenQuestionID : 0

  const [currentlyViewingQIdx, setCurrentlyViewingQIndex] = useState(quizStartAtIndex)

  // This will be set to option number selected by user in case of MCQ
  const [currentQuestionUserResponse, setCurrentQuestionUserResponse] = useState<any | null>(null)

  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const isCustomTest = props.isCustomTest
  const currentQuestionMeta = isCustomTest ? quizQuestions[currentlyViewingQIdx] : null

  // Get Question based on Id from API. This happens for custom quiz.
  const { getQuizQuestionWithQuestionIdQuery } = useTests()
  const { data: quizQuestionFromAPI, isLoading: isLoadingQuestion } = getQuizQuestionWithQuestionIdQuery(
    isCustomTest ? (currentQuestionMeta as KakshaQuestionBankQuestionMeta).questionid.toString() : undefined,
  )

  const currentQuestion = isCustomTest
    ? // This is from API response.
      quizQuestionFromAPI?.data?.[0] ?? (sampleQuestionResponseTemplate as unknown as CustomQuizQuestionType)
    : (quizQuestions[currentlyViewingQIdx] as QuizQuestionType | QuizQuestionType1)

  const currentQuestionId = getQuestionIdBasedOnType(currentQuestion)

  const currentQuestionType = 'qType' in currentQuestion ? currentQuestion.qType : currentQuestion.questionType

  const currentQuesOptions = 'itemOptions' in currentQuestion ? currentQuestion.itemOptions : currentQuestion.optionText

  const isLastQuestion = currentlyViewingQIdx === quizQuestions.length - 1

  const currentQuizQuestionStartedAt = useRef(new Date().getTime())

  // If the quiz was previously attempted this would have the value.
  useEffect(() => {
    setCurrentQuestionUserResponse(userSubmissions.current?.optionSelected?.[currentlyViewingQIdx] ?? null)
  }, [currentlyViewingQIdx, userSubmissions.current])

  // This handles the case when there are multiple sections in the quiz.
  useEffect(() => {
    userSubmissions.current = previousUserSubmissions
  }, [previousUserSubmissions])

  // // Automatically submit the quiz on component unmount.

  const submitQuizDebounced = useDebouncedCallback(() => {
    // @ts-ignore
    handleSubmitQuiz({ ...userSubmissions.current, lastSeenQuestionID: currentQuestionId })
  }, 500)

  const handleOnPageReload = () => {
    // @ts-ignore
    recordCurrentQuestionResponse(currentQuestionId, true)
    // @ts-ignore
    props.handlePartiallySubmitQuiz({ ...userSubmissions.current, lastSeenQuestionID: currentQuestionId })
  }

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      handleOnPageReload()
      return ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [currentQuestionId, userSubmissions.current])

  const handleExpireTime = () => {
    recordCurrentQuestionResponse(currentQuestionId as number, true)
    console.error("Time's up")
    submitQuizDebounced()
  }

  function getTimeTakenForCurrentQuestionAndUpdateForNext() {
    const currentTime = new Date().getTime()
    const currentQuestionStartedAt = currentQuizQuestionStartedAt.current
    const timeTaken = Math.round(currentTime - currentQuestionStartedAt)
    currentQuizQuestionStartedAt.current = currentTime
    return timeTaken
  }

  const recordCurrentQuestionResponse = (currentQuestionId: number, isEmptyInputConsideredValid?: boolean) => {
    const isCurrentAnswerInvalid =
      !isEmptyInputConsideredValid &&
      (currentQuestionUserResponse === undefined || currentQuestionUserResponse === null)

    console.log(isCurrentAnswerInvalid)
    // Check if user has either attempted the current question.
    // if (isCurrentAnswerInvalid ) {
    //   alert(`No option was selected for current question ${currentlyViewingQIdx + 1}`)
    //   return
    // }

    const currentQuestionIdxInUserSubmission = userSubmissions.current.questionIDs.indexOf(currentQuestionId)

    // Record User Choice in Payload
    // TODO: Fix this types.
    if (allowedQuestionTypes.includes(currentQuestionType)) {
      // This will be a valid idx if the user has already attempted the current question or left it out in the middle.
      if (currentQuestionIdxInUserSubmission >= 0) {
        userSubmissions.current.questionIDs[currentQuestionIdxInUserSubmission] = currentQuestionId
        userSubmissions.current.optionSelected[currentQuestionIdxInUserSubmission] = currentQuestionUserResponse as any

        userSubmissions.current.timeTaken[currentQuestionIdxInUserSubmission] =
          getTimeTakenForCurrentQuestionAndUpdateForNext()

        return true
      }
      userSubmissions.current.optionSelected.push(currentQuestionUserResponse as any)
      userSubmissions.current.questionIDs.push(currentQuestionId)
      userSubmissions.current.timeTaken.push(getTimeTakenForCurrentQuestionAndUpdateForNext())

      return true
    } else {
      alert(`Unsupported Question type => ${currentQuestionType}`)
      return
    }
  }

  const handleMoveToPreviousQuestion = () => {
    if (currentlyViewingQIdx > 0) {
      setCurrentlyViewingQIndex(currentlyViewingQIdx - 1)
      setCurrentQuestionUserResponse(userSubmissions.current.optionSelected[currentlyViewingQIdx - 1] ?? null)
    }
  }

  const handleMoveToNextQuestion = () => {
    if (!currentQuestionId) {
      alert('No related question id for current question was found.')
      console.log('Current Question', currentQuestion)
      return
    }
    if (!recordCurrentQuestionResponse(currentQuestionId)) return alert('Current Question response was not recorded.')

    if (isCustomTest && !isLastQuestion) {
      props.handlePartiallySubmitQuiz({ ...userSubmissions.current, lastSeenQuestionID: currentQuestionId })
    }
    if (isLastQuestion) {
      handleSubmitQuiz({ ...userSubmissions.current, lastSeenQuestionID: currentQuestionId })
    } else {
      setCurrentlyViewingQIndex(c => c + 1)
    }
  }

  const handleOnPressExitQuiz = () => {
    if (!currentQuestionId) return alert('no quiz id was found.')
    recordCurrentQuestionResponse(currentQuestionId, true)
    const itemCountToPad = quizQuestions.length - userSubmissions.current.questionIDs.length
    // Add remaning quiz ids
    const userSubmissionsWithEmptySections = isCustomTest
      ? userSubmissions.current
      : {
          optionSelected: userSubmissions.current.optionSelected.concat(Array(itemCountToPad).fill(null)),
          questionIDs: quizQuestions.map(getQuestionIdBasedOnType),
          timeTaken: userSubmissions.current.timeTaken.concat(Array(itemCountToPad).fill(0)),
        }
    // @ts-ignore
    props.onPressExitSection({ ...userSubmissionsWithEmptySections, lastSeenQuestionID: currentQuestionId })
  }

  const quizCountdownTimer = useMemo(() => {
    if (props.quizTimer) {
      if (props.previousUserSubmissions.timeTaken.length) {
        return (
          props.quizTimer - (props.previousUserSubmissions?.timeTaken?.reduce((acc, curr) => acc + curr, 0) ?? 0) / 1000
        )
      }
      return props.quizTimer
    }
    return null
  }, [props.quizTimer, props.previousUserSubmissions])

  return (
    <Grid border={border} margin={2} borderRadius={1}>
      <Box
        display='flex'
        padding={2}
        borderBottom={border}
        sx={{
          ...(isSm
            ? { flexDirection: 'column', alignItems: 'start' }
            : { justifyContent: 'space-between', alignItems: 'center' }),
        }}
      >
        <Typography variant='h4'>{quizName}</Typography>

        {!!quizCountdownTimer && (
          <CountdownTimer onExpireTimer={handleExpireTime} timeToCountDown={quizCountdownTimer} />
        )}
      </Box>

      <Box
        display='flex'
        width='100%'
        borderBottom='1px solid #A5A3AE'
        sx={{ ...(isSm ? { flexDirection: 'column' } : { justifyContent: 'space-between', height: '80vh' }) }}
      >
        {/* Question Section */}
        <Box padding={4} sx={{ ...(isSm ? { width: '100%' } : { width: '50%' }), overflow: 'scroll' }}>
          <Box display='flex' alignItems='center' gap={2} marginBottom={3}>
            <Box
              bgcolor='#E6EAE7'
              display='flex'
              justifyContent='center'
              alignItems='center'
              padding={2}
              borderRadius='100%'
              border='2px solid #A5A3AE'
            >
              <IconifyIcon icon='tabler:clipboard-list' color='#A5A3AE' />
            </Box>
            <Typography variant='h5'>Question</Typography>
          </Box>
          <QuizQuestionSection
            question={currentQuestion}
            questionType={currentQuestionType}
            setUserResponse={setCurrentQuestionUserResponse}
            userResponse={currentQuestionUserResponse}
          />
        </Box>

        {/* Answer Section */}
        <Box
          padding={4}
          sx={{
            ...(isSm
              ? { width: '100%', borderTop: '1px solid #A5A3AE' }
              : { width: '50%', borderLeft: '1px solid #A5A3AE' }),
            overflow: 'scroll',
          }}
        >
          <Box display='flex' alignItems='center' gap={2} marginBottom={3}>
            <Box
              bgcolor={'#E6EAE7'}
              display='flex'
              justifyContent='center'
              alignItems='center'
              padding={2}
              borderRadius='100%'
              border='2px solid #A5A3AE'
            >
              <IconifyIcon icon='tabler:clipboard-check' color='#A5A3AE' />
            </Box>
            <Typography variant='h5'>Answer</Typography>
          </Box>
          <Box width={isMd ? '100%' : '75%'} display='flex' flexDirection='column' gap={4} marginTop={4}>
            <QuizAnswerSection
              isLoadingQuestion={isLoadingQuestion}
              questionType={currentQuestionType}
              question={currentQuestion}
              questionOptions={currentQuesOptions}
              userResponse={currentQuestionUserResponse}
              setUserResponse={setCurrentQuestionUserResponse}
            />
          </Box>
        </Box>
      </Box>
      <Box padding={4} display='flex' justifyContent='space-between' alignItems='center'>
        <Button variant='tonal' color='secondary' onClick={handleOnPressExitQuiz}>
          Exit Section
        </Button>
        <Box display='flex' gap={2} alignItems='center'>
          <Typography>
            Question {currentlyViewingQIdx + 1} of {quizQuestions.length}
          </Typography>

          {currentlyViewingQIdx > 0 && (
            <Button type='button' variant='contained' color='secondary' onClick={handleMoveToPreviousQuestion}>
              {'Prev'}
            </Button>
          )}
          <Button type='button' variant='contained' color='primary' onClick={handleMoveToNextQuestion}>
            {isLastQuestion ? 'Submit' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Grid>
  )
}

export default Player

import { Box } from '@mui/material'
import { useParams, useSearchParams } from 'react-router-dom'

import { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import Toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import Typography from 'src/@core/components/common/Typography'
import { ButtonBox, ResponsiveContainer, StyledBox, StyledBox2, StyledButton } from 'src/@core/styles/QuizReportsStyles'
import { get } from 'src/@core/utils/request'
import useUpdateTaskStatus from 'src/apis/useUpdateTaskStatus'
import { GET_RESOURCE } from 'src/apis/user'
import { RCToolResource } from '.'
import { RCToolQuestionSection } from '../quiz-player/components/quizQuestionSection'
import useTests from '../quiz/hooks/useTests'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig
const PracticeQuizReport = React.lazy(() => import('./PracticeQuizReport'))

interface ActiveTask {
  taskID: string
  taskName: string
  duration: string
  type: string
  resourceID: string
  testStatus: string
  resource: Resource
}

interface Resource {
  quiz: Quiz
  items: Item[]
  qKeys: number[]
  quizID: string
}

interface Quiz {
  quizName: string
  quizTime: string
}

interface Item {
  type: string
  id: number
  itemText: string
  qType: string
  itemOptions: any
  passage: string
}

export function splitPassageIntoArrayAndRemoveP(passage: string) {
  return passage.replace('<p>', '').replace('</p>', '').split(' ')
}

const RCTestPlayer = () => {
  const { taskId } = useParams()

  const [searchParams, setSearchParams] = useSearchParams()

  const [selectedWordIdxSet, setSelectedWordIdxSet] = useState([])

  const [userSubmissionResult, setUserSubmissionResult] = useState<UserQuizSubmissionResult>()

  let userSubmissions: any = {
    questionIDs: [],
    optionSelected: [],
    timeTaken: [],
  }

  const { data: rcToolResource, isLoading } = useQuery<{ data: RCToolResource; activeTask: ActiveTask }>({
    queryKey: ['getRCToolResource', taskId],
    queryFn: async () => {
      const resp = (await get(`${GET_RESOURCE}/${taskId}`, {
        queryParams: {
          type: 'rctool',
        },
      })) as {
        data: RCToolResource
        activeTask:
          | ActiveTask
          | (ActiveTask & {
              resource: {
                error: string
              }
            })
      }
      if ('error' in resp.activeTask?.resource) {
        throw new AxiosError(resp.activeTask.resource.error)
      }
      return resp as { data: RCToolResource; activeTask: ActiveTask }
    },
  })

  const { markTaskAsEnded, markTaskAsStarted } = useUpdateTaskStatus()

  // Mark task as started.
  useEffect(() => {
    markTaskAsStarted.mutate({ taskID: taskId as string })
  }, [])

  const { submitQuizMutation } = useTests()
  const handleSubmitQuiz = (submissionData: LearnViewQuizSubmission) => {
    submitQuizMutation.mutate({
      data: submissionData,
      onSuccess: data => {
        markTaskAsEnded.mutate({ taskID: taskId as string })
        Toast.success('Your response has been recorded.')
        setUserSubmissionResult(data)
      },
    })
  }

  const totalQuestions = rcToolResource?.activeTask.resource.items?.length || 0

  const currentQuestionNumber = Number(searchParams.get('q') || 1)

  const currentQuestion = totalQuestions
    ? rcToolResource?.activeTask.resource.items[currentQuestionNumber - 1]
    : undefined

  const handleSubmitAnswer = (e: any) => {
    e.preventDefault()
    if (!currentQuestion) return
    userSubmissions.questionIDs.push(currentQuestion?.id)
    // @ts-ignore
    userSubmissions.optionSelected.push(Array.from(selectedWordIdxSet))

    if (totalQuestions > currentQuestionNumber) {
      setSearchParams({ q: (currentQuestionNumber + 1).toString() })
    }

    if (totalQuestions === currentQuestionNumber) {
      handleSubmitQuiz({
        ...userSubmissions,
        timeTaken: [],
        quizID: rcToolResource?.activeTask.resource.quizID,
      })
    }
  }

  if (isLoading) return <FallbackSpinner />

  if (userSubmissionResult) return <PracticeQuizReport userSubmissionResult={userSubmissionResult} />

  return (
    <>
      <CustomHelmet title='RC Test Player' />
      <Box border={border} padding={5} borderRadius={1}>
        <Typography variant='h4'>RC Tool: {rcToolResource?.activeTask?.taskName}</Typography>
        <Box my={4}>
          <Typography variant='paragraphMedium'>
            Question {currentQuestionNumber}/{totalQuestions}
          </Typography>
          <ResponsiveContainer display='flex' mt={4}>
            <StyledBox>
              <Box display='flex' flexWrap='wrap'>
                <RCToolQuestionSection
                  passageText={currentQuestion?.passage}
                  userResponse={selectedWordIdxSet}
                  setUserResponse={setSelectedWordIdxSet}
                />
              </Box>
            </StyledBox>
            <StyledBox2>
              <Typography variant='paragraphMain'>{currentQuestion?.itemText ?? 'No data found'}</Typography>
            </StyledBox2>
          </ResponsiveContainer>
        </Box>
        <ButtonBox>
          <StyledButton onClick={handleSubmitAnswer} variant='contained' color='primary'>
            Submit
          </StyledButton>
        </ButtonBox>
      </Box>
    </>
  )
}

export default RCTestPlayer

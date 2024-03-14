import { Box, Button, Grid, Theme, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useState } from 'react'
import { type UseQueryResult } from 'react-query'
import QuestionWithOptions from './questionWithOptions'
import themeConfig from 'src/configs/themeConfig'

const { border } = themeConfig

function getDayMonthAndYearFromTimestamp(dateTimeInSeconds: string) {
  const date = new Date(Number(dateTimeInSeconds) * 1000)
  return `${date.getDate()} ${date.toLocaleString('default', {
    month: 'short',
  })} ${date.getFullYear()}, ${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`
}

const PastAttemptQuizReport = ({
  quizPastAttemptsQuery,
  preTestQuizSubmissionResponse,
  handleOnClickContinue,
}: {
  preTestQuizSubmissionResponse: any
  quizPastAttemptsQuery: UseQueryResult<PreTestQuizPastAttemptsAPIResponse, unknown>
  handleOnClickContinue: () => void
}) => {
  const isPastAttempt = !preTestQuizSubmissionResponse
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const theme = useTheme()
  const [currentlyViewingQIdx, setCurrentlyViewingQIdx] = useState(0)
  const [currentlyViewingPastAttemptIdx, setCurrentViewingPastAttemptIdx] = useState(0)

  if (quizPastAttemptsQuery.isLoading) return <div>Loading...</div>

  if (!quizPastAttemptsQuery.data) return <div>No data</div>

  const { attempts } = quizPastAttemptsQuery.data

  // use added on property to sort the attempts, addedOn can be null or a string that has time in seconds
  const attemptsSortedByLatestAddedOn = attempts.sort((a, b) => {
    if (a.addedOn === null) return 1
    if (b.addedOn === null) return -1
    return Number(b.addedOn) - Number(a.addedOn)
  })

  const questions = preTestQuizSubmissionResponse
    ? preTestQuizSubmissionResponse.items
    : quizPastAttemptsQuery.data.items

  const currentlyViewingPastAttempt = preTestQuizSubmissionResponse
    ? preTestQuizSubmissionResponse
    : attempts[currentlyViewingPastAttemptIdx]

  const currentlyViewingQuestion = questions[currentlyViewingQIdx]
  // const correctAnswer = getAlphabetAtIndex(Number(currentlyViewingQuestion.itemAnswer))
  // const selectedOption = getAlphabetAtIndex(quizReport.optionSelected[currentlyViewingQIdx])

  const userSelectedOption = currentlyViewingPastAttempt.optionSelected[currentlyViewingQIdx]
  const correctAnswerForCurrentQuestion = currentlyViewingQuestion.itemAnswer

  return (
    <Grid>
      {/* <Box border={border} display='flex' gap={3} margin={8} borderRadius={1}>
      //  @ts-ignore 
        <Typography variant='paragraphMain' borderRight={border} padding={5}>
          Past Attempts
        </Typography>
      </Box> */}
      <Box display='flex' sx={{ ...(isSm && { flexDirection: 'column' }) }} gap={4} marginX={4}>
        {isPastAttempt ? (
          <Box
            width={isSm ? '100%' : '20%'}
            paddingY={6}
            display='flex'
            flexDirection='column'
            gap={4}
            overflow='scroll'
            height={isSm ? '30vh' : '100vh'}
          >
            <Typography variant='h5'>Attempts Dates</Typography>
            {attemptsSortedByLatestAddedOn.map((item, i) => (
              <Typography
                key={i + 1}
                border={border}
                borderRadius={1}
                variant='h6'
                padding={4}
                sx={{
                  cursor: 'pointer',
                  ...(currentlyViewingPastAttemptIdx === i && {
                    borderLeft: `5px solid ${theme.palette.primary.main}`,
                  }),
                  '&:hover': {
                    borderLeft: `5px solid ${theme.palette.primary.main}`,
                  },
                }}
                onClick={() => setCurrentViewingPastAttemptIdx(i)}
              >
                {/* Date format to be used 8 Jan 2024, 1:30 AM */}
                {!item.addedOn ? `Quiz Attempt ${i + 1}` : getDayMonthAndYearFromTimestamp(item.addedOn)}
              </Typography>
            ))}
          </Box>
        ) : (
          <Box
            width={isSm ? '100%' : '20%'}
            padding={isSm ? 0 : 4}
            paddingY={isSm ? 4 : undefined}
            display='flex'
            overflow='scroll'
            maxHeight={isSm ? '30vh' : '100vh'}
            flexDirection='column'
            gap={4}
          >
            {questions.map((_: any, i: number) => (
              <QuestionsList
                key={i + 1}
                currentlyViewingQIdx={currentlyViewingQIdx}
                setCurrentlyViewingQIdx={setCurrentlyViewingQIdx}
                index={i}
              />
            ))}
          </Box>
        )}
        <Box width={isSm ? '100%' : '80%'}>
          {isPastAttempt && (
            <Box paddingY={4} display='flex' gap={4} overflow={'scroll'}>
              {questions.map((_: any, i: number) => (
                <QuestionsList
                  key={i + 1}
                  currentlyViewingQIdx={currentlyViewingQIdx}
                  setCurrentlyViewingQIdx={setCurrentlyViewingQIdx}
                  index={i}
                />
              ))}
            </Box>
          )}
          <Box
            display='flex'
            padding={4}
            sx={{
              ...(isSm
                ? { flexDirection: 'column', alignItems: 'start' }
                : { justifyContent: 'space-between', alignItems: 'center' }),
            }}
          >
            {/* <Typography variant='h6'>{quizReport.quiz.quizName}</Typography> */}
            <Typography>
              {currentlyViewingPastAttempt?.addedOn
                ? `Taken on ${getDayMonthAndYearFromTimestamp(currentlyViewingPastAttempt.addedOn)}`
                : 'NA'}
            </Typography>
          </Box>

          <QuestionWithOptions
            correctAnswer={correctAnswerForCurrentQuestion}
            userSelectedOption={userSelectedOption}
            question={currentlyViewingQuestion}
          />
          <Box display='flex' justifyContent='end' mt={5}>
            <Button variant='contained' onClick={handleOnClickContinue}>
              Continue
            </Button>
          </Box>
        </Box>
      </Box>
    </Grid>
  )
}

const QuestionsList = ({
  currentlyViewingQIdx,
  setCurrentlyViewingQIdx,
  index,
}: {
  currentlyViewingQIdx: number
  setCurrentlyViewingQIdx: (currentlyViewingQIdx: number) => void
  index: number
}) => {
  const theme = useTheme()
  return (
    <Typography
      border={border}
      borderRadius={1}
      variant='h6'
      padding={4}
      sx={{
        cursor: 'pointer',
        ...(currentlyViewingQIdx === index && {
          borderBottom: `3px solid ${theme.palette.primary.main}`,
        }),
        '&:hover': {
          borderBottom: `3px solid ${theme.palette.primary.main}`,
        },
      }}
      onClick={() => setCurrentlyViewingQIdx(index)}
    >{`Question ${index + 1}`}</Typography>
  )
}

export default PastAttemptQuizReport

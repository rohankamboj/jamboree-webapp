import {
  Box,
  Collapse,
  Divider,
  Grid,
  GridProps,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { MathJax } from 'better-react-mathjax'
import { Fragment, useState } from 'react'
import { useQuery } from 'react-query'
import { get } from 'src/@core/utils/request'
import { getTestQuestionMetaForSummary } from 'src/apis/user'
import QuizAnswerSection from 'src/pages/quiz-player/components/quizAnswerSection'
import QuizQuestionSection from 'src/pages/quiz-player/components/quizQuestionSection'
import CustomQuizAnswerComparisonBox from 'src/pages/quiz/components/CustomQuizAnswerComparisonBox'
import { calculateQuestionDifficulty, difficultyToLabelMap, formatTime } from 'src/pages/summary'
import { SummarySectionNameWithQuestion } from 'src/pages/summary/components/AnalysisAndSolution'
import Typography from '../../../../@core/components/common/Typography'
import themeConfig from 'src/configs/themeConfig'

const tableHeaderRows = [
  {
    label: 'Q. NO',
  },
  {
    label: 'SUBJECT',
  },
  {
    label: 'TIME TAKEN (IN SECONDS)',
  },
  {
    label: '% USERS WHO GOT IT RIGHT',
  },
  {
    label: 'DIFFICULTY',
  },
  {
    label: 'RESULT',
  },
]

const { border } = themeConfig

const StyledGrid = styled(Grid)<GridProps>(() => ({
  border,
  borderRadius: 1,
}))

function getQuestionLabelToRender(question: SummarySectionNameWithQuestion['questions'][number]) {
  const tags = Object.values(question.tags)
  const tagsAndSubTags = tags?.map((tag, idx) => (
    <Typography variant='paragraphMedium'>
      <strong>{tag.tagName}</strong>
      {tag.subTags?.map(subTag => <Typography variant='paragraphMedium'> | {subTag}</Typography>)}
      {idx < tags.length - 1 ? ' | ' : ''}
    </Typography>
  ))
  return tagsAndSubTags
}
// #imeAnalysisSection
const TimeAnalysisTable = ({
  questionsToRender,
  section,
}: {
  questionsToRender: SummarySectionNameWithQuestion['questions']
  section: string
}) => {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  if (isSm) {
    return questionsToRender.map((question, idx) => {
      return (
        <QuestionInfoAndExplanation section={section} key={question.id} questionNumber={idx + 1} question={question} />
      )
    })
  }

  if (section === 'awa') {
    return (
      <>
        {questionsToRender.map((question, idx) => {
          return (
            <QuestionInfoAndExplanation
              section={section}
              key={question.id}
              questionNumber={idx + 1}
              question={question}
            />
          )
        })}
      </>
    )
  }

  return (
    <StyledGrid>
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              {tableHeaderRows.map(({ label }, idx) => (
                <TableCell
                  key={idx}
                  align={idx === 1 ? 'left' : 'center'}
                  {...(idx === 2 ? { colSpan: 2 } : { rowSpan: 2 })}
                  sx={{
                    border,
                  }}
                >
                  <Typography variant='h6' sx={{ ...(idx === 0 && { width: '60px' }) }}>
                    {label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell align='center'>
                <Typography variant='h6' color={t => t.palette.primary.main}>
                  By You
                </Typography>
              </TableCell>
              <TableCell align='center'>
                <Typography variant='h6' color={t => t.palette.info.main}>
                  By All
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questionsToRender.map((question, idx) => {
              return (
                <QuestionInfoAndExplanation
                  section={section}
                  key={question.id}
                  questionNumber={idx + 1}
                  question={question}
                />
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledGrid>
  )
}

export default TimeAnalysisTable

const QuestionInfoAndExplanation = ({
  question,
  questionNumber,
  section,
}: {
  question: SummarySectionNameWithQuestion['questions'][number]
  questionNumber: number
  section: string
}) => {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const theme = useTheme()
  const [isExplanationVisible, setIsExplanationVisible] = useState(section === 'awa')

  const testQuestionInfo = useQuery({
    queryKey: ['getQuestionInfo', question.id],
    queryFn: () => get(getTestQuestionMetaForSummary(question.id)) as Promise<TestQuestionSummaryMetaResponse>,
    enabled: !!isExplanationVisible && 'id' in question,
  })

  const byYou = formatTime(Number(question.timeTaken))
  const byAll = formatTime((Number(question.totalTime ?? 0) * 10) / Number(question.responsesTotal ?? 1))
  const percentageUserGotItRight = (
    (Number(question.responsesCorrect ?? 0) / Number(question.responsesTotal ?? 1)) *
    100
  ).toFixed(2)

  if (testQuestionInfo.isLoading) {
    return <Typography>Loading...</Typography>
  }
  if (!testQuestionInfo.data?.data[0] && testQuestionInfo.isSuccess)
    return <Typography>No data found for quiz..</Typography>

  if (section === 'awa') {
    return (
      <Box border={border} padding={4}>
        {!!testQuestionInfo.data?.data.length && (
          <QuestionExplanation isAWA questionMeta={testQuestionInfo.data?.data[0]} question={question} />
        )}
      </Box>
    )
  }

  if (isSm) {
    return (
      <Fragment>
        <Box
          key={question.id}
          display='flex'
          alignItems='end'
          padding={4}
          my={4}
          borderRadius={1}
          justifyContent='space-between'
          border={border}
          borderBottom={`5px solid ${question.result == 1 ? theme.palette.primary.main : theme.palette.error.main}`}
          sx={{
            cursor: 'pointer',
          }}
          onClick={() => setIsExplanationVisible(visible => !visible)}
        >
          <Box display='flex' alignItems='center' gap={4}>
            <Typography px={2}>{questionNumber}</Typography>
            <Box borderLeft={border} paddingLeft={2}>
              <Typography>{question.type}</Typography>
              <Box display='flex' gap={1} alignItems='center'>
                <Typography> Difficulty</Typography>
                <Typography
                  variant='h6'
                  sx={{
                    textTransform: 'capitalize',
                  }}
                >
                  {question.difficulty
                    ? question.difficulty
                    : difficultyToLabelMap[calculateQuestionDifficulty(question)] ?? 'NA'}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Typography
            color={question.result == 1 ? 'primary' : 'error'}
            sx={{
              textTransform: 'capitalize',
            }}
          >
            {question.result == 1 ? 'Correct' : question.result == 0 ? 'Incorrect' : 'NA'}
          </Typography>
        </Box>

        {isExplanationVisible && (
          <Fragment>
            <Box
              display='flex'
              justifyContent='space-between'
              borderTop={`1px solid ${theme.palette.grey[400]}`}
              borderBottom={`1px solid ${theme.palette.grey[400]}`}
            >
              <Box paddingY={4}>
                <Typography variant='h6'>Time taken (in seconds)</Typography>
                <Box display='flex' justifyContent='space-between'>
                  <Box>
                    <Typography>By You</Typography>
                    <Typography
                      mt={2}
                      color={theme.palette.primary.main}
                      paddingX={2}
                      bgcolor={theme.palette.primary.light}
                    >
                      {byYou}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography>By All</Typography>
                    <Typography
                      mt={2}
                      color={theme.palette.info.main}
                      paddingX={2}
                      bgcolor={theme.palette.primary.light}
                    >
                      {byAll}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Divider flexItem orientation='vertical' color={theme.palette.grey[400]} />
              <Box paddingY={4} display='flex' flexDirection='column' justifyContent='space-between'>
                <Typography variant='h6'>% users who got it right</Typography>
                <Typography display='flex' alignItems='end'>
                  {percentageUserGotItRight} %
                </Typography>
              </Box>
            </Box>
            {!!testQuestionInfo.data?.data.length && (
              <QuestionExplanation questionMeta={testQuestionInfo.data?.data[0]} question={question} />
            )}
          </Fragment>
        )}
      </Fragment>
    )
  }

  return (
    <Fragment>
      <TableRow
        sx={{
          cursor: 'pointer',
          bgcolor: isExplanationVisible
            ? question.result == 1
              ? 'primary.light'
              : question.result == 0
              ? 'error.light'
              : 'brown'
            : undefined,
          '&:hover': {
            bgcolor: 'grey.300',
          },
        }}
        onClick={() => setIsExplanationVisible(visible => !visible)}
      >
        <TableCell align='center'>
          <Typography>{questionNumber}.</Typography>
        </TableCell>
        <TableCell align='left'>
          <Typography
            sx={{
              width: '440px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {getQuestionLabelToRender(question)}
          </Typography>
        </TableCell>
        <TableCell align='center'>
          <Typography color='primary'>{byYou}</Typography>
        </TableCell>
        <TableCell align='center'>
          <Typography>{byAll}</Typography>
        </TableCell>
        <TableCell align='center'>
          <Typography>{percentageUserGotItRight} %</Typography>
        </TableCell>
        <TableCell align='center'>
          <Typography
            sx={{
              textTransform: 'capitalize',
            }}
          >
            {question.difficulty
              ? question.difficulty
              : difficultyToLabelMap[calculateQuestionDifficulty(question)] ?? 'NA'}
          </Typography>
        </TableCell>
        <TableCell align='center'>
          <Typography
            color={question.result == 1 ? 'primary' : 'error'}
            sx={{
              textTransform: 'capitalize',
            }}
          >
            {question.result == 1 ? 'Correct' : question.result == 0 ? 'Incorrect' : 'NA'}
          </Typography>
        </TableCell>
      </TableRow>
      {!!testQuestionInfo.data?.data.length && (
        <TableRow>
          <TableCell padding='none' colSpan={12}>
            <Collapse in={isExplanationVisible} timeout='auto' unmountOnExit>
              <QuestionExplanation questionMeta={testQuestionInfo.data?.data[0]} question={question} />
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  )
}

export const QuestionExplanation = ({
  question,
  questionMeta,
  isAWA,
}: {
  question: SummarySectionNameWithQuestion['questions'][number]
  questionMeta: TestQuestionSummaryMetaResponse['data'][0]
  isAWA?: boolean
}) => {
  const questionsOptionsToRender = (template: string) => {
    switch (template) {
      case 'mcq':
        return <></>
      /* {options.map((option, i) => {
                              const qNo = i + 1
                              return (
                                <CustomRadioBasic
                                  key={qNo}
                                  selected={userSelectedOptionValue}
                                  color={isSelectedAnswerIsCorrect ? 'primary' : 'error'}
                                  setSelected={() => {}}
                                  data={{
                                    title: <MathJaxComponent option={option} />,
                                    value: option,
                                  }}
                                  name={option}
                                  gridProps={{ xs: 12 }}
                                  quizRadioLabel={getAlphabetAtIndex(qNo)}
                                />
                              )
                            })} */

      default:
        return <></>
    }
  }
  const flexDirection = isAWA ? 'row' : 'column'
  const width = isAWA ? '50%' : '100%'

  return (
    <Box display='flex' flexDirection={'column'} gap={2} paddingY={6}>
      <Box
        sx={{
          flexDirection: {
            xs: 'column',
            lg: flexDirection,
          },
        }}
        display='flex'
        width={'100%'}
        alignItems={'start'}
        gap={6}
      >
        <Box
          sx={{
            width: {
              xs: '100%',
              lg: width,
            },
          }}
        >
          <QuizQuestionSection
            setUserResponse={() => {}}
            // @ts-ignore No need to remove this line.
            question={questionMeta}
          />
        </Box>
        <Box
          sx={{
            width: {
              xs: '100%',
              lg: width,
            },
          }}
          display='flex'
          flexDirection={'column'}
          gap={2}
        >
          {/* TODO: Need to handle report for differnet type of questions. */}
          <QuizAnswerSection
            // @ts-ignore No need to remove this line.
            question={questionMeta}
            setUserResponse={() => {}}
            questionType={questionMeta.questionType}
            questionOptions={questionMeta.optionText}
            userResponse={question.optionSelected}
            isIncorrect={question.result === 0}
          />
        </Box>
      </Box>

      {questionsOptionsToRender(question.template)}
      <>
        <Box marginY={4}>
          <CustomQuizAnswerComparisonBox
            isSelectedAnswerIsCorrect={question.result === 1}
            correctAnswer={question.correctAnswers}
            userSelectedOption={question.optionSelected}
          />
        </Box>
        {/* TODO:  add video explanation here... */}
        {question.videoExplanation && (
          <Box display='flex' flexDirection='column' gap={2}>
            <Typography variant='h5' border={border} padding={4} borderRadius={1}>
              Video Explanation:
            </Typography>

            <Typography color='red' variant='paragraphMedium'>
              {question.videoExplanation}
            </Typography>
          </Box>
        )}

        <Box display='flex' flexDirection='column' gap={2}>
          <Typography variant='h5' border={border} padding={4} borderRadius={1}>
            Explanation:
          </Typography>
          <MathJax>
            <Typography dangerouslySetInnerHTML={{ __html: question.explanation }} />
          </MathJax>
        </Box>
      </>
    </Box>
  )
}

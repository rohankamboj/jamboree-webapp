import { Box, Grid, Typography } from '@mui/material'
import { UseQueryResult } from 'react-query'
import { calcSectionStats } from '..'
import AccuracySection from './AccuracySection'
import CardsWithChart from './CardsWithChart'
import DifficultySection from './DifficultySection'
// import TimeAnalysis from './time-analysis'
import { filterTestDetailSection, transformCustomTestSummaryDataIntoNormalTestSummary } from '../helpers'
import TimeAnalysis from './time-analysis'
// import { getSum } from 'src/@core/utils/helpers'
// const InfoData = [
//   {
//     id: 1,
//     text: 'This is a primary alert — check it out!',
//     icon: <TickIcon />,
//     color: 'success.main',
//     bgcolor: 'rgba(40, 199, 111, 0.16)',
//   },
//   {
//     id: 2,
//     text: 'This is a primary alert — check it out!',
//     icon: (
//       <Box borderRadius={1} display='flex' justifyContent='center' alignItems='center' padding={1} bgcolor='white'>
//         <IconifyIcon icon='tabler:bell' color='#FF9F43' />
//       </Box>
//     ),
//     color: '#FF9F43',
//     bgcolor: '#FFF0E1',
//   },
// ]

// const StyledBox = styled(Box)<BoxProps>(() => ({
//   display: 'flex',
//   padding: 16,
//   alignItems: 'center',
//   gap: 8,
//   borderRadius: 6,
// }))

export type SummarySectionNameWithQuestion = {
  questions: Array<GetDataRecordsFromJAMAPIQuestions | CustomTestSummaryQuestionResponseSummary>
  section: string
}

const AnalysisAndSolution = ({
  // attemptId,
  getTestSummaryQuery,
}: {
  attemptId: string
  getTestSummaryQuery: UseQueryResult<TestSummaryAPIResponse | CustomTestSummaryAPIResponse, any>
}) => {
  const testSections = transformCustomTestSummaryDataIntoNormalTestSummary(
    getTestSummaryQuery.data || ([] as any),
  ).filter(filterTestDetailSection)

  const allTestQuestions = testSections?.reduce(
    (acc, curr) => [...acc, ...curr.questions],
    [] as SummarySectionNameWithQuestion['questions'],
  )

  const sectionStatsN = calcSectionStats(allTestQuestions ?? [])

  if (sectionStatsN?.stats['all']['acc'].length !== allTestQuestions?.length) {
    alert('Unaccounted questions in report.')
  }

  // https://localhost:5173/pages/quiz-summary/?attemptId=61d0b407db55f1a876964c9edf884ccd_p

  const combinedStats = allTestQuestions.reduce(
    (acc, question) => {
      const isCorrect = Number(question.result) === 1
      const timeTakenForQuestion = isNaN(Number(question.timeTaken)) ? 0 : Number(question.timeTaken)

      if (isCorrect) {
        acc.timeForCorrectAnswer += timeTakenForQuestion
        acc.correctCount += 1
      } else {
        acc.timeForIncorrectAnswer += timeTakenForQuestion
        acc.incorrectCount += 1
      }

      return acc
    },
    {
      questionStatsChartData: {},
      timeForCorrectAnswer: 0,
      timeForIncorrectAnswer: 0,
      correctCount: 0,
      incorrectCount: 0,
    },
  )

  const avgTimeForCorrectAnswer = Math.round(
    combinedStats.timeForCorrectAnswer / 1000 / combinedStats.correctCount || 0,
  )

  const avgTimeForIncorrectAnswer = Math.round(
    combinedStats.timeForIncorrectAnswer / 1000 / combinedStats.incorrectCount || 0,
  )
  const avgTimePerQuestion = Math.round(
    (combinedStats.timeForIncorrectAnswer + combinedStats.timeForCorrectAnswer) /
      sectionStatsN?.stats['all']['acc'].length /
      1000 || 0,
  )

  // TODO: Need to fix this chart data
  const questionStatsChartData = allTestQuestions?.reduce(
    (acc, curr, idx) => {
      if (Number(curr.result) === 1) {
        acc.correctQuestionData.push({ x: idx + 1, y: Number((Number(curr.timeTaken) / 1000).toFixed(2)) })
      } else {
        acc.incorrectQuestionData.push({ x: idx + 1, y: Number((Number(curr.timeTaken) / 1000).toFixed(2)) })
      }
      return acc
    },
    {
      correctQuestionData: [] as { x: number; y: number }[],
      incorrectQuestionData: [] as { x: number; y: number }[],
    },
  )

  const transformedQuestionStatsChartData = [
    {
      name: 'Correct',
      data: questionStatsChartData?.correctQuestionData ?? [],
    },
    {
      name: 'Incorrect',
      data: questionStatsChartData?.incorrectQuestionData ?? [],
    },
  ]

  // console.log(transformedQuestionStatsChartData)

  return (
    <Box>
      <Typography variant='h4'>Introduction</Typography>
      <Box display='flex' flexDirection='column' gap={6} mt={4}>
        <CardsWithChart
          avgTimePerQuestion={avgTimePerQuestion}
          avgIncorrectAnswerTiming={avgTimeForIncorrectAnswer}
          avgCorrectAnswerTiming={avgTimeForCorrectAnswer}
          chartData={transformedQuestionStatsChartData}
        />

        {/* InfoData.map(info => (
          <StyledBox key={info.id} bgcolor={info.bgcolor}>
            {info.icon}
            <Typography color={info.color} variant='paragraphMedium'>
              {info.text}
            </Typography>
          </StyledBox>
        )) */}

        <Grid container spacing={6}>
          {/* @ts-ignore */}
          {testSections?.map(section => <TestSectionSummary key={section.section} sectionWithStats={section} />)}
        </Grid>

        <TimeAnalysis testSections={testSections ?? []} />
      </Box>
    </Box>
  )
}

export default AnalysisAndSolution

function TestSectionSummary({ sectionWithStats }: { sectionWithStats: TestRecord }) {
  const { stats, qTypes } = calcSectionStats(sectionWithStats?.questions ?? [])

  const sections = Object.keys(stats)
    .filter(key => qTypes.includes(key))
    .map(sectionKey => ({ name: sectionKey, ...stats[sectionKey] }))

  // Object with only easy, medium, hard keys
  const difficultyWiseSectionStats = Object.keys(stats).reduce((acc, curr) => {
    if (['easy', 'medium', 'hard'].includes(curr.toLowerCase())) {
      // @ts-ignore
      acc[curr] = stats[curr]
    }
    return acc
  }, {})

  return (
    <>
      <Grid item xs={12} sm={6}>
        <AccuracySection sectionStats={stats.all} sectionName={sectionWithStats.section} subSectionStats={sections} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <DifficultySection
          sectionName={sectionWithStats.section}
          difficultyWiseSectionStats={difficultyWiseSectionStats}
        />
      </Grid>
    </>
  )
}

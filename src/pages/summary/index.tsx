// ** MUI Imports
import TabPanel from '@mui/lab/TabPanel'
import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'

import { useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  StyledBreadcrumbLink,
  CustomizedBreadcrumb,
  StyledLastBreadcrumb,
  StyledTitle,
} from 'src/@core/components/common/Breadcrumb'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import IconifyIcon from 'src/@core/components/icon'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'
import { formatSecondsToDateString } from 'src/@core/utils/helpers'
import CustomizedTab from 'src/components/common/CustomizedTab'
import Error500 from '../500'
import AnalysisAndSolution from './components/AnalysisAndSolution'
import OverviewAndInsight from './components/OverviewAndInsight'
import useGetTestSummary from './hooks/useGetTestSummary'

export const difficultyToLabelMap: Record<number, string> = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard',
} as const

export function calculateQuestionDifficulty(
  question: GetDataRecordsFromJAMAPIQuestions | CustomTestSummaryQuestionResponseSummary,
) {
  let diff = 2

  /* find the difficulty (1: easy, 2: medium, 3: hard) and set the keys to be updated in sectionStats object */
  if (question?.responsesTotal && Number(question.responsesTotal) > 0) {
    diff = Number(question.responsesCorrect)
      ? 4 - Math.ceil((3 * Number(question.responsesCorrect)) / Number(question.responsesTotal))
      : 3
  }
  return diff
}

// function countInstanceOfEachDifficulty(questions: GetDataRecordsFromJAMAPIQuestions[]) {
//   questions.forEach(({ difficulty }) => {
//     if (!difficulty) difficultyCountSet.set('NA', (difficultyCountSet.get('NA') || 0) + 1)
//     if (difficultyCountSet.has(difficulty)) {
//       difficultyCountSet.set(difficulty, (difficultyCountSet.get(difficulty) || 0) + 1)
//     } else {
//       difficultyCountSet.set(difficulty, 1)
//     }
//   })
// }

export function formatTime(timeInMs: number) {
  {
    /* 00:21 */
  }
  const timeInSec = timeInMs / 1000
  const minutes = Math.floor(timeInSec / 60)
  const seconds = Math.floor(timeInSec % 60)
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

function pushSectionStats(
  obj: any,
  keys: string[],
  val: GetDataRecordsFromJAMAPIQuestions | CustomTestSummaryQuestionResponseSummary,
) {
  /* Calculating average time taken by users */
  let tAllAvg: number = val?.responsesTotal ? Number(val.totalTime) / Number(val.responsesTotal) : 0

  for (var i in keys) {
    if (obj[keys[i]] != undefined) {
      obj[keys[i]].acc.push(val.result)
      obj[keys[i]].tUser.push(val.timeTaken)
      obj[keys[i]].tAll.push(tAllAvg)
    }
  }
  return obj
}

export function calcSectionStats(qs: (GetDataRecordsFromJAMAPIQuestions | CustomTestSummaryQuestionResponseSummary)[]) {
  let sectionStats: Record<
      string,
      {
        acc: Array<string>
        tUser: Array<number>
        tAll: Array<number>
      }
    > = {},
    qTypes: string[] = [],
    keys: string[] = ['all', 'easy', 'medium', 'hard'],
    diff: number = 2

  // for (let i:number = 0; i < keys.length; i++) {
  for (var i in keys) {
    sectionStats[keys[i]] = { acc: [], tUser: [], tAll: [] }
  }

  for (let i = 0; i < qs.length; i++) {
    /* if sectionStats does not have 'question type' offset defined, then assign acc, tUser & tAll in sub-sections */
    if (sectionStats[qs[i].type] == undefined) {
      sectionStats[qs[i].type] = { acc: [], tUser: [], tAll: [] }
      qTypes.push(qs[i].type)
    }
    /* find the difficulty (1: easy, 2: medium, 3: hard) and set the keys to be updated in sectionStats object */

    if (qs[i]?.responsesTotal) {
      diff = qs[i]?.responsesCorrect
        ? 4 - Math.ceil((3 * Number(qs[i].responsesCorrect)) / Number(qs[i].responsesTotal))
        : 3
    } else {
      diff = 3
    }
    /* update sectionStats object */
    sectionStats = pushSectionStats(sectionStats, ['all', qs[i].type, keys[diff]], qs[i])
  }
  return { stats: sectionStats, qTypes: qTypes }
}

const Summary = () => {
  const breadcrumbs = [
    <StyledBreadcrumbLink underline='hover' key='1' to='/'>
      Dashboard
    </StyledBreadcrumbLink>,
    <StyledLastBreadcrumb key='2'>Summary Page</StyledLastBreadcrumb>,
  ]

  const { attemptID: attemptIdFromTestOrPracticeSection } = useParams()
  const [searchParams] = useSearchParams()
  const attemptIdFromCustomQuiz = searchParams.get('attemptId')

  if (!attemptIdFromTestOrPracticeSection && !attemptIdFromCustomQuiz) {
  }
  const attemptId = (attemptIdFromTestOrPracticeSection || attemptIdFromCustomQuiz) ?? null

  const { getTestSummaryQuery, getCustomTestSummaryQuery, isPersonalizedTest, isCustomTest } =
    useGetTestSummary(attemptId)

  const {
    test: { testName, completedOn },
    dataQuery,
  } = useMemo(() => {
    if (isPersonalizedTest || isCustomTest) {
      return {
        test: {
          testName: getCustomTestSummaryQuery?.data?.summary?.testDetail?.quizname || 'QUIZ NAME => NA',
          completedOn: getCustomTestSummaryQuery.data?.summary?.testDetail?.addedOn || new Date().getTime() / 1000,
        },
        dataQuery: getCustomTestSummaryQuery,
      }
    }

    return {
      test: {
        testName: getTestSummaryQuery.data?.test?.testName || 'QUIZ NAME => NA',
        completedOn: getTestSummaryQuery.data?.test?.completedOn || new Date().getTime() / 1000,
      },
      dataQuery: getTestSummaryQuery,
    }
  }, [getTestSummaryQuery.data, getCustomTestSummaryQuery.data])

  if (
    getTestSummaryQuery.isLoading ||
    ((isPersonalizedTest || getCustomTestSummaryQuery) && getCustomTestSummaryQuery.isLoading)
  )
    return <FallbackSpinner />
  if (!getTestSummaryQuery.data && !isPersonalizedTest && !isCustomTest) return <Error500 />

  if (isPersonalizedTest && !getCustomTestSummaryQuery.data) return <Error500 />
  if (!attemptId && !attemptIdFromCustomQuiz) return <Error500 />

  const summaryTabs = [
    {
      value: 'overview',
      label: 'Overview & Insight',
      icon: 'tabler:layout-grid-add',
      component: <OverviewAndInsight getTestSummaryQuery={dataQuery} attemptId={attemptId as string} />,
    },
    {
      value: 'analysis',
      label: 'Analysis & Solution',
      icon: 'tabler:history',
      component: <AnalysisAndSolution getTestSummaryQuery={dataQuery} attemptId={attemptId as string} />,
    },
  ]

  return (
    <Grid>
      <CustomHelmet title='Summary' />
      <Box display='flex' alignItems='center' gap={4} paddingBottom={4}>
        <StyledTitle variant='h5'>Summary Page</StyledTitle>
        <CustomizedBreadcrumb>{breadcrumbs}</CustomizedBreadcrumb>
      </Box>

      <StyledBorderedBox borderRadius={1} padding={4} mb={6} display='flex' justifyContent='space-between'>
        <Box display='flex' gap={2} alignContent='center'>
          <IconifyIcon icon='ph:clipboard' />
          <Typography variant='h6'>{testName}</Typography>
        </Box>
        <Box display='flex' gap={2} alignContent='center'>
          <IconifyIcon icon='mdi:clock-outline' />
          <Typography variant='h6'>
            Taken on{' '}
            {formatSecondsToDateString(completedOn.toString(), {
              showTime: false,
            })}
          </Typography>
        </Box>
      </StyledBorderedBox>
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            '& .css-il18an-MuiTabPanel-root': {
              paddingRight: '0px !important',
            },
          }}
        >
          <CustomizedTab defaultActiveTab='overview' tabs={summaryTabs}>
            {summaryTabs.map(item => (
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

export default Summary

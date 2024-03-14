import { Box, Button, Grid, Theme, Typography, useMediaQuery } from '@mui/material'
import AreaChart from 'src/@core/components/charts/AreaChart'
import RadialBarChart from 'src/@core/components/charts/RadialBar'

import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'
import { BoltIcon, ChartIcon } from 'src/assets/Icons/Icons'

import { UseQueryResult } from 'react-query'
import useUserScores from 'src/apis/useUserScore'
import useGetTestSummary from '../hooks/useGetTestSummary'
import OverviewSectionTable, { StyledTruncatedTypography } from './OverviewSectionTable'

const OverviewAndInsight = ({
  attemptId,
  getTestSummaryQuery,
}: {
  attemptId: string
  getTestSummaryQuery: UseQueryResult<TestSummaryAPIResponse | CustomTestSummaryAPIResponse, any>
}) => {
  const { getCustomTestStudentScoreQuery, isCustomTestStudentScoreQueryEnabled } = useGetTestSummary(attemptId)

  const lineChartData = {
    y: getCustomTestStudentScoreQuery?.data?.data?.map(({ countStudent }) => countStudent) ?? [],
    x: getCustomTestStudentScoreQuery?.data?.data?.map(({ gmatscore }) => gmatscore) ?? [],
  }

  const { getUserTargetScoreQuery } = useUserScores()

  return (
    <Grid>
      <Typography variant='h4'>Overview Section</Typography>
      {/* Score with charts section */}
      {isCustomTestStudentScoreQueryEnabled && (
        <StudentsScoreWithCharts
          targetScore={getUserTargetScoreQuery.data?.targetScore ?? 0}
          lineChartData={lineChartData}
          // @ts-ignore
          testScore={Number(getTestSummaryQuery.data?.test?.score ?? 0)}
        />
      )}
      <OverviewSectionTable getTestSummaryQuery={getTestSummaryQuery} />
      <QuickActions />
    </Grid>
  )
}

const StudentsScoreWithCharts = ({
  lineChartData,
  targetScore,
  testScore,
}: {
  lineChartData: { x: string[]; y: string[] }
  targetScore: number
  testScore: number
}) => {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const radialChartData = [Number(testScore) / 8, targetScore / 8]
  return (
    <Box display='flex' gap={4} flexDirection={isSm ? 'column' : 'row'} mt={6}>
      <StyledBorderedBox width={isSm ? '100%' : '40%'} padding={2} borderRadius={1}>
        <Typography variant='h5' paddingX={4}>
          Score out of 800
        </Typography>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <RadialBarChart series={radialChartData} fltScore={testScore} />
          <Box display='flex' flexDirection='column' gap={2} mr={2}>
            <StyledBorderedBox display='flex' gap={4} alignItems='center' padding={2}>
              <Box padding={2} bgcolor='#62d6c524' display='flex' alignItems='center' justifyContent='center'>
                <ChartIcon />
              </Box>
              <Box>
                <Typography variant='h6'>{testScore}</Typography>
                <StyledTruncatedTypography
                  sx={{
                    width: '100px',
                  }}
                >
                  FLT Score
                </StyledTruncatedTypography>
              </Box>
            </StyledBorderedBox>
            <StyledBorderedBox display='flex' gap={4} alignItems='center' padding={2}>
              <Box padding={2} bgcolor='#fd935124' display='flex' alignItems='center' justifyContent='center'>
                <BoltIcon />
              </Box>
              <Box>
                <Typography variant='h6'>{targetScore ? targetScore : 'NA'}</Typography>
                <StyledTruncatedTypography
                  sx={{
                    width: '80px',
                  }}
                >
                  Target Score
                </StyledTruncatedTypography>
              </Box>
            </StyledBorderedBox>
          </Box>
        </Box>
      </StyledBorderedBox>
      {/* </Grid> 
       <Grid item xs={12} md={7} xl={8}> */}
      <StyledBorderedBox width={isSm ? '100%' : '60%'} padding={2} borderRadius={1}>
        <Typography variant='h5' paddingX={4}>
          Score v/s Number of Students
        </Typography>
        <AreaChart
          option={{
            colors: ['#E8C8E8'],
            fill: {
              opacity: 0.5,
              type: 'solid',
            },
          }}
          series={[{ name: 'Number of students', data: lineChartData.y.map(score => Number(score)) }]}
          categories={lineChartData.x}
        />
      </StyledBorderedBox>
      {/* </Grid>
    </Grid> */}
    </Box>
  )
}

const QuickActions = () => {
  return (
    <>
      <Typography variant='h4' mt={4}>
        Quick Actions
      </Typography>
      <Grid container mt={1} spacing={4}>
        <Grid item xs={12} sm={6} lg={4}>
          <StyledBorderedBox padding={4} display='flex' flexDirection='column' gap={4} borderRadius={1}>
            <Typography variant='h6'>Book a session with faculty</Typography>
            <Box display='flex' justifyContent='center' alignItems='center'>
              <img src='/images/bookSessionFaculty.png' alt='bookSessionFaculty' />
            </Box>
            <Button variant='contained'>Book Now</Button>
          </StyledBorderedBox>
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <StyledBorderedBox padding={4} display='flex' flexDirection='column' gap={4} borderRadius={1}>
            <Typography variant='h6'>Based on weakness on the test</Typography>
            <Box display='flex' justifyContent='center' alignItems='center'>
              <img src='/images/PersonalisedQuiz.png' alt='PersonalisedQuiz' />
            </Box>
            <Button variant='contained'>Create Quiz</Button>
          </StyledBorderedBox>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <StyledBorderedBox padding={4} display='flex' flexDirection='column' gap={4} borderRadius={1}>
            {/* <Typography>Book a session with faculty</Typography> */}
            <Box display='flex' justifyContent='center' alignItems='center' mt={11}>
              <img src='/images/customeQuiz.png' alt='customeQuiz' />
            </Box>
            <Button variant='contained'>Create a custom quiz</Button>
          </StyledBorderedBox>
        </Grid>
      </Grid>
    </>
  )
}

export default OverviewAndInsight

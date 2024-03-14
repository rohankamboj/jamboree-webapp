import { Box, Grid, Theme, useMediaQuery, useTheme } from '@mui/material'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import Typography from 'src/@core/components/common/Typography'
import IconifyIcon from 'src/@core/components/icon'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'
// import { useUserContext } from 'src/@core/context/UserContext'
import { get } from 'src/@core/utils/request'
import useUserScores from 'src/apis/useUserScore'
import { USER_PLANNER, getAnalyticsFLTPercentile, getAnalyticsSummary } from 'src/apis/user'

import ApexLineChart, { ApexLineChartProps } from '../chart/LineChart'
import RadialBarProgress from '../chart/RadialBarChart'
import ApexRadialBarChart from '../chart/RoundRadialBarChart'
import ActivityTimeline from './ActivityTimeline'
import StrengthWeaknessCarousel from './StrengthWeaknessCarousel'
import StudentScoreStatsCard from './StudentScoreStatsCard'
import TopWiseOverview from './TopicwiseOverview'
import Badge from '/images/Badge.svg'

const Analytics = () => {
  const theme = useTheme()
  // const { kakshaUserId } = useUserContext()

  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const fltPercentileQuery = useQuery({
    queryKey: ['fltPercentile'],
    queryFn: () => get(getAnalyticsFLTPercentile) as Promise<FLTPercentileDataResponse>,
  })
  const analyticsSummaryQuery = useQuery({
    queryKey: ['analyticsSummary'],
    queryFn: () => get(getAnalyticsSummary) as Promise<AnalyticsSummaryResponse>,
  })

  const userPlannerQuery = useQuery({
    queryKey: ['userPlanner'],
    queryFn: () => get(USER_PLANNER) as Promise<UserPlannerQueryResponse>,
  })
  // const userTestVisualizationDataQuery = useQuery({
  //   queryKey: ['userTestVisualizationData', kakshaUserId],
  //   queryFn: () =>
  //     get(getTestVisualizationDataForStudent, {
  //       queryParams: {
  //         sid: (kakshaUserId || '').toString(),
  //       },
  //     }) as Promise<StudentTestVisualizationResponse>,
  //   enabled: !!kakshaUserId,
  // })
  // const topicVisualisationDataQuery = useQuery({
  //   queryKey: ['getTopicVisualizationDataForStudent', kakshaUserId],
  //   queryFn: () =>
  //     get(getTopicVisualizationDataForStudent, {
  //       queryParams: {
  //         sid: (kakshaUserId || '').toString(),
  //       },
  //     }) as Promise<StudentTopicVizResponse>,
  //   enabled: !!kakshaUserId,
  // })
  const { getUserTargetScoreQuery, getUserBatchAndFltScoreQuery } = useUserScores()

  // const topicWiseOverviewData = useMemo(() => {
  //   // [
  //   //   {
  //   //     label: "Guesswork, Won't Work",
  //   //     data: [],
  //   //     borderColor: "transparent",
  //   //     pointBorderWidth: 2,
  //   //     pointHoverBorderWidth: 2,
  //   //     pointRadius: 5,
  //   //     pointBackgroundColor: colors.solid.primary,
  //   //     pointHoverBackgroundColor: colors.solid.primary,
  //   //     pointHoverBorderColor: colors.solid.primary,
  //   //   },
  //   //   {
  //   //     label: "Need Practice & Revision",
  //   //     data: [],
  //   //     pointBackgroundColor: this.fourthColorShade,
  //   //     borderColor: "transparent",
  //   //     pointRadius: 5,
  //   //     pointHoverBackgroundColor: this.fourthColorShade,
  //   //     pointHoverBorderColor: this.fourthColorShade,
  //   //   },
  //   //   {
  //   //     label: "Doing good!",
  //   //     data: [],
  //   //     pointBackgroundColor: this.successColorShade,
  //   //     borderColor: "transparent",
  //   //     pointBorderWidth: 2,
  //   //     pointHoverBorderWidth: 2,
  //   //     pointRadius: 5,
  //   //     pointHoverBackgroundColor: this.successColorShade,
  //   //     pointHoverBorderColor: this.successColorShade,
  //   //   },
  //   //   {
  //   //     label: "Needs More Practice",
  //   //     data: [],
  //   //     pointBackgroundColor: this.yellowColor,
  //   //     borderColor: "transparent",
  //   //     pointBorderWidth: 2,
  //   //     pointHoverBorderWidth: 2,
  //   //     pointRadius: 5,
  //   //     pointHoverBackgroundColor: this.yellowColor,
  //   //     pointHoverBorderColor: this.yellowColor,
  //   //   },
  //   // ],
  //   // for (let i = 0; i < numberOfTotalData; i++) {
  //   //   let temD: { x: number; y: number; topicId: number; topicName: string } = {
  //   //     x: 0,
  //   //     y: 0,
  //   //     topicId: 0,
  //   //     topicName: '',
  //   //   };
  //   //   temD.x = this.contentDataSelected[i].pace;
  //   //   temD.y = this.contentDataSelected[i].accuracy;
  //   //   temD.topicId = this.contentDataSelected[i].topicid;
  //   //   temD.topicName = this.contentDataSelected[i].topic;
  //   //   if (
  //   //     this.contentDataSelected[i].accuracy < 0.75 &&
  //   //     this.contentDataSelected[i].pace < 2 * 60
  //   //   ) {
  //   //     // purple (low accuracy, low time)  = 1
  //   //     data1.push(temD);
  //   //   }
  //   //   if (
  //   //     this.contentDataSelected[i].accuracy < 0.75 &&
  //   //     this.contentDataSelected[i].pace >= 2 * 60
  //   //   ) {
  //   //     // Orange (low accuracy, high time) = 2
  //   //     data2.push(temD);
  //   //   }
  //   //   if (
  //   //     this.contentDataSelected[i].accuracy >= 0.75 &&
  //   //     this.contentDataSelected[i].pace < 2 * 60
  //   //   ) {
  //   //     // Green (high accuracy, low time) = 3
  //   //     data3.push(temD);
  //   //   }
  //   //   if (
  //   //     this.contentDataSelected[i].accuracy >= 0.75 &&
  //   //     this.contentDataSelected[i].pace >= 2 * 60
  //   //   ) {
  //   //     // Yellow (high time, high accuracy) = 4
  //   //     data4.push(temD);
  //   //   }
  //   // }
  // }, [userTestVisualizationDataQuery.data])

  const radialChartData = useMemo(() => {
    const { data: analyticsSummary } = analyticsSummaryQuery

    if (!analyticsSummary)
      return {
        learn: [0],
        practice: [0],
        test: [0],
      }

    // Anulgar code
    // this.analyticsSummary = res;
    // const learnQuantative = Number(this.analyticsSummary.learnQuantative);
    // const learnVerbal = Number(this.analyticsSummary.learnVerbal);

    // const learnO = (learnQuantative + learnVerbal) / 2;
    // this.learnChartoptions.Overview.series = [isNaN(learnO) || !isFinite(learnO) ? 0 : learnO.toFixed(1)];

    // this.practiceChartoptions.Overview.series = [Number(this.analyticsSummary.learnPractice)];
    // this.testChartoptions.Overview.series = [Number(this.analyticsSummary.learnTest)];

    // React code

    const learnOverall = Number(analyticsSummary.learnQuantative + Number(analyticsSummary.learnVerbal)) / 2

    return {
      learn: [learnOverall],
      practice: [Number(analyticsSummary.learnPractice)],
      test: [Number(analyticsSummary.learnTest)],
    }
  }, [analyticsSummaryQuery.data])

  const lineChartData: Record<
    'accuracyLineChartData' | 'timeTakenVsTestData',
    ApexLineChartProps
    // accuracyLineChartData:
    // timeTakenVsTestData: {
    //   xAxis: ApexXAxis
    //   yAxisData: ApexAxisChartSeries
    // }
  > = useMemo(() => {
    if (!fltPercentileQuery.data?.data) {
      return {
        accuracyLineChartData: {
          xAxisOptions: [] as ApexXAxis,
          yAxisData: [] as ApexAxisChartSeries,
        },
        timeTakenVsTestData: {
          xAxisOptions: [] as ApexXAxis,
          yAxisData: [] as ApexAxisChartSeries,
        },
      }
    }

    const accuracyLineChartData: ApexLineChartProps = {
      xAxisOptions: {
        type: 'datetime',
        categories: fltPercentileQuery.data.data.map(({ lastUpdatedOn }) => lastUpdatedOn),
        title: {
          text: 'Test Name',
        },
        tooltip: {
          formatter(value, opts) {
            return `${value} - ${opts}`
          },
        },
      },
      yAxisData: [{ data: fltPercentileQuery.data.data.map(({ accuracy }) => Math.round(accuracy * 100)) }],
    }

    // TODO: NEed to figure out tooltip for this.
    const timeTakenVsTestData: ApexLineChartProps = {
      yAxisData: [{ data: fltPercentileQuery.data.data.map(({ avg_test_time }) => avg_test_time) }],
      xAxisOptions: {
        categories: fltPercentileQuery.data.data.map(({ testName }) => testName),
      },
    }

    return {
      // TODO:: Add this.
      accuracyLineChartData,
      timeTakenVsTestData,
    }
  }, [fltPercentileQuery.data])

  if (fltPercentileQuery.isLoading || analyticsSummaryQuery.isLoading) return <FallbackSpinner />

  return (
    <Grid container spacing={10}>
      <Grid item xs={12} md={7} lg={9}>
        <Box display='flex' flexDirection='column' gap={4}>
          <Box
            borderRadius={1}
            display='flex'
            width='100%'
            gap={2}
            alignItems='center'
            sx={{
              ...(isMd ? { flexDirection: 'column' } : { justifyContent: 'space-between' }),
            }}
          >
            <StyledBorderedBox
              display='flex'
              flexDirection='column'
              gap={2}
              borderRadius={1}
              width={isMd ? '100%' : '40%'}
            >
              {/* TODO: use Overview insight radialbar over here */}
              <ApexRadialBarChart />
            </StyledBorderedBox>

            <StudentScoreStatsCard
              icon='tabler:broadcast'
              iconColor='#FF5F1F'
              iconBgColor='#fd93512b'
              statName='Target Score'
              statValue={getUserTargetScoreQuery.data?.targetScore ?? 'NA'}
            />

            <StudentScoreStatsCard
              icon='tabler:align-left'
              iconColor={theme.palette.primary.main}
              iconBgColor='#62d6c533'
              statName='Avg FLT Score'
              statValue={Math.round(getUserBatchAndFltScoreQuery.data?.fltyscrore?.avgscore ?? 0)}
            />

            <StudentScoreStatsCard
              icon='tabler:broadcast'
              iconColor={'#51a8f4'}
              iconBgColor='#51a8f426'
              statName='Last FLT Score'
              statValue={getUserBatchAndFltScoreQuery.data?.fltyscrore?.lasttest.score ?? 'NA'}
            />
          </Box>

          <Box>
            <Typography variant='h4'>Course Progress</Typography>
            <Box display='flex' mt={2} justifyContent='space-between' flexDirection={isSm ? 'column' : 'row'} gap={2}>
              <StyledBorderedBox borderRadius={1} flex={1}>
                <Typography variant='h5' paddingLeft={4} paddingTop={4}>
                  Learn
                </Typography>
                <RadialBarProgress series={radialChartData.learn} color='#7367F0' />
              </StyledBorderedBox>

              <StyledBorderedBox borderRadius={1} flex={1}>
                <Typography variant='h5' paddingLeft={4} paddingTop={4}>
                  Practice
                </Typography>
                <RadialBarProgress series={radialChartData.practice} color='#00CFE8' />
              </StyledBorderedBox>

              <StyledBorderedBox borderRadius={1} flex={1}>
                <Typography variant='h5' paddingLeft={4} paddingTop={4}>
                  Test
                </Typography>
                <RadialBarProgress series={radialChartData.test} color='#FD9351' />
              </StyledBorderedBox>

              <StyledBorderedBox
                borderRadius={1}
                display='flex'
                justifyContent='space-between'
                alignItems='start'
                flex={1}
              >
                <Box display='flex' flexDirection='column' gap={2} padding={6}>
                  <Box
                    bgcolor='#CCE7DE'
                    display='flex'
                    padding={2}
                    justifyContent='center'
                    alignItems='center'
                    borderRadius={1}
                    width={50}
                  >
                    <IconifyIcon icon='mdi:clock-outline' color={theme.palette.primary.main} />
                  </Box>
                  <Typography variant='h5'>
                    {((userPlannerQuery.data?.totaltimespent ?? 0) / 1000 / 60 / 60).toFixed(2)}
                  </Typography>
                  <Typography variant='paragraphSemiBold'>Hours Spent</Typography>
                </Box>
                <img src={Badge} alt='Badge' />
              </StyledBorderedBox>
            </Box>
          </Box>

          {/* Chart */}
          <TopWiseOverview />

          <Box>
            <Typography variant='h4'>Performance Trends</Typography>
            <StyledBorderedBox padding={isSm ? 1 : 8} mt={6} borderRadius={1}>
              <Typography variant='paragraphSemiBold'>Accuracy</Typography>
              {/* // TODO: NEed to figure out tooltip for this. */}
              <ApexLineChart {...lineChartData.accuracyLineChartData} />
            </StyledBorderedBox>

            <StyledBorderedBox padding={isSm ? 1 : 8} mt={6} borderRadius={1}>
              <Typography variant='paragraphSemiBold'>Average Time</Typography>
              <ApexLineChart
                // TODO: NEed to figure out tooltip for this.
                // tooltip={() => }
                {...lineChartData.timeTakenVsTestData}
              />
            </StyledBorderedBox>
          </Box>

          <Box>
            <Typography variant='h4' my={4}>
              FLT performance (Percentile, Time,Accuracy)
            </Typography>

            <StrengthWeaknessCarousel />

            {/* <Box display='flex' justifyContent='space-between' flexDirection={isSm ? 'column' : 'row'} gap={4} mt={3}>
              <StyledBox borderLeft={`4px solid ${theme.palette.primary.main}`}>
                <Typography variant='h6'>Strength</Typography>
                {Array.from({ length: 5 }).map((_, i) => (
                  <FltPerformanceCard key={i} />
                ))}
              </StyledBox>

              <StyledBox borderLeft={`4px solid ${theme.palette.warning.main}`}>
                <Typography variant='h6'>Weakness</Typography>
                {Array.from({ length: 5 }).map((_, i) => (
                  <FltPerformanceCard key={i} />
                ))}
              </StyledBox>

              <StyledBox borderLeft={`4px solid ${theme.palette.secondary.main}`}>
                <Typography variant='h6'>Undefined</Typography>
                {Array.from({ length: 5 }).map((_, i) => (
                  <FltPerformanceCard key={i} />
                ))}
              </StyledBox>
            </Box> */}
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={5} lg={3}>
        <ActivityTimeline fltPercentileData={fltPercentileQuery.data?.data || []} />
      </Grid>
    </Grid>
  )
}

export default Analytics

// const FltPerformanceCard = () => {
//   const theme = useTheme()

//   return (
//     <Box
//       display='flex'
//       alignItems='center'
//       justifyContent='space-between'
//       sx={{
//         cursor: 'pointer',
//       }}
//     >
//       <Box display='flex' gap={4} alignItems='center'>
//         <StyledBorderedBox
//           height={15}
//           width={15}
//           borderRadius='100%'
//           sx={{
//             '&:hover': {
//               borderColor: theme.palette.primary.main,
//             },
//           }}
//         ></StyledBorderedBox>
//         <Typography
//           variant='paragraphSemiBold'
//           sx={{
//             '&:hover': {
//               color: 'primary.main',
//             },
//           }}
//         >
//           Sequence
//         </Typography>
//       </Box>
//       <IconifyIcon icon='ri:arrow-drop-right-line' />
//     </Box>
//   )
// }

// const StyledBox = styled(Box)<BoxProps>({
//   flex: 1,
//   padding: 10,
//   borderRadius: 6,
//   gap: 10,
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'space-between',
//   borderRight: '1px solid rgba(219, 218, 222, 1)',
//   borderTop: '1px solid rgba(219, 218, 222, 1)',
//   borderBottom: '1px solid rgba(219, 218, 222, 1)',
// })

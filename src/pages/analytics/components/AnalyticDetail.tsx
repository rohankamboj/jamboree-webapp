import { Grid } from '@mui/material'
import { useMemo } from 'react'
import GroupedChart from 'src/@core/components/charts/GroupedChart'
import Typography from 'src/@core/components/common/Typography'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'
import OverviewSectionTable from 'src/pages/summary/components/OverviewSectionTable'
import useGetTestSummary from 'src/pages/summary/hooks/useGetTestSummary'

import {
  GridProps,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
} from '@mui/material'
import themeConfig from 'src/configs/themeConfig'

const tableHeaderRows = [
  {
    label: 'TOPIC',
  },
  {
    label: 'Time Taken for correct answers',
  },
  {
    label: 'Time Taken for Incorrect answers',
  },
  {
    label: 'Avg time taken for all Question',
  },
]

const { border } = themeConfig

const StyledGrid = styled(Grid)<GridProps>(() => ({
  border,
  borderRadius: 2,
}))

const AnalyticDetail = () => {
  // TODO: below code is only for showing data
  const attemptID = 'a3475aaaa42b14ebde8f02f25795994d'

  const { getTestSummaryQuery, getCustomTestSummaryQuery, isPersonalizedTest, isCustomTest } =
    useGetTestSummary(attemptID)

  const { dataQuery } = useMemo(() => {
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

  return (
    <Grid container spacing={10}>
      <Grid item xs={12} md={7} lg={9}>
        <OverviewSectionTable getTestSummaryQuery={dataQuery} />
        <StyledBorderedBox borderRadius={1} padding={4} mt={4}>
          <GroupedChart />
        </StyledBorderedBox>
        <StyledBorderedBox borderRadius={1} padding={4} mt={4}>
          <GroupedChart />
        </StyledBorderedBox>

        <TableComponent />
      </Grid>

      {/* TODO: This need to be exracted out of the tab. */}
      {/* <Grid item xs={12} md={5} lg={3}>
        <ActivityTimeline />
      </Grid> */}
    </Grid>
  )
}

const TableComponent = () => {
  return (
    <StyledGrid mt={4}>
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              {tableHeaderRows.map(({ label }, idx) => (
                <TableCell key={idx} align='center'>
                  <Typography variant='h6' sx={{ ...(idx === 0 && { width: '250px' }) }}>
                    {label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 10 }).map((_, idx) => (
              <TableRow
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: '#E6EAE7',
                  },
                }}
              >
                <TableCell align='center'>
                  <Typography>Numbers & Alphabets</Typography>
                </TableCell>
                <TableCell sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Typography color={idx % 2 === 0 ? 'primary' : 'error'}>3.35s</Typography>
                  <Typography>/ 4.46s</Typography>
                </TableCell>

                <TableCell align='center'>
                  <Typography color='primary'>3.35s / 4.46s</Typography>
                </TableCell>

                <TableCell sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Typography color={idx % 2 !== 0 ? 'primary' : 'error'}>3.35s</Typography>
                  <Typography>/ 4.46s</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledGrid>
  )
}

export default AnalyticDetail

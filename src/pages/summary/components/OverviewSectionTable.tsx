import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableHead,
  TableRow,
  Theme,
  Typography,
  styled,
  useMediaQuery,
  TypographyProps,
} from '@mui/material'
import { UseQueryResult } from 'react-query'
import { calcSectionStats } from '..'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import { formatSecondsToFriendlyFormat, getSum } from 'src/@core/utils/helpers'
import IconifyIcon from 'src/@core/components/icon'
import { filterTestDetailSection, transformCustomTestSummaryDataIntoNormalTestSummary } from '../helpers'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig

const OverviewSectionTable = ({
  getTestSummaryQuery,
}: {
  getTestSummaryQuery: UseQueryResult<TestSummaryAPIResponse | CustomTestSummaryAPIResponse, any>
}) => {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  if (!getTestSummaryQuery?.data) return null

  const consolidatedData = transformCustomTestSummaryDataIntoNormalTestSummary(getTestSummaryQuery?.data)
    // Remove "testDetail" section.
    .filter(filterTestDetailSection)

  const testSectionsWithData = consolidatedData
    .filter(({ section }) => ['quant', 'verbal'].includes(section.toLowerCase()))
    .map(section => ({
      ...section,
      data: calcSectionStats(section.questions),
    }))

  const StyledTableCell = styled(TableCell)<TableCellProps>(() => ({
    border,
    width: isSm ? '100%' : '25%',
  }))

  if (getTestSummaryQuery.isLoading) return <FallbackSpinner />

  const difficultyLevelsToRender = ['easy', 'medium', 'hard']

  return (
    <Box mt={6}>
      <Table style={{ borderCollapse: 'collapse', width: '100%', height: 'fit-content' }}>
        <TableHead style={{ border }}>
          <TableRow sx={{ ...(isSm && { display: 'none' }) }}>
            <StyledTableCell align='center'>
              <HeaderWithIcon icon='mingcute:grid-line' title='Subject' />
            </StyledTableCell>
            <StyledTableCell align='center' sx={{ bgcolor: '#fff0e95c' }}>
              <HeaderWithIcon icon='entypo:bar-graph' title='Score' />
            </StyledTableCell>
            <StyledTableCell align='center' sx={{ bgcolor: '#edf5ff66' }}>
              <HeaderWithIcon icon='mdi:clock-outline' title='Pace' />
            </StyledTableCell>
            <StyledTableCell align='center' sx={{ bgcolor: '#eaffe766' }}>
              <HeaderWithIcon icon='mdi:clock-outline' title='Accuracy' />
            </StyledTableCell>
          </TableRow>
        </TableHead>
        {/* @ts-ignore */}
        {testSectionsWithData?.map(({ section: sectionName, data: { stats }, testSectionID, score, percentile }) => (
          <TableBody style={{ height: 'fit-content' }}>
            <TableRow key={testSectionID} sx={{ border, ...(isSm && { display: 'flex', flexDirection: 'column' }) }}>
              <StyledTableCell rowSpan={3} align='center' sx={{ border, textTransform: 'capitalize' }}>
                <Typography variant='h6'>{sectionName}</Typography>
              </StyledTableCell>
              <StyledTableCell sx={{ bgcolor: '#fff0e95c' }} padding='none'>
                <Box display='flex' justifyContent='space-between'>
                  <Box display='flex' flexDirection='column' flex={1} alignItems='center' justifyContent='center'>
                    <Typography variant='h5'>
                      {Math.round(Number(score ?? 0)) - 2}-{Math.round(Number(score ?? 0))}
                    </Typography>
                    <Typography variant='h6'>
                      {percentile ? `${Math.round(Number(percentile ?? 0))} %ile` : 'NA'}
                    </Typography>
                  </Box>
                  <Box display='flex' flexDirection='column' flex={1}>
                    {difficultyLevelsToRender.map(difficulty => {
                      return (
                        <Box display='flex' justifyContent='space-between' p={2} border='1px solid #ccc'>
                          <Typography>{difficulty}</Typography>
                          <Typography>
                            {getSum(stats[difficulty].acc).toString() + '/' + stats[difficulty].acc.length.toString()}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              </StyledTableCell>
              {/* Pace */}
              <StyledTableCell sx={{ bgcolor: '#edf5ff66' }} padding='none'>
                <Box display='flex' justifyContent='space-between'>
                  <Box display='flex' flexDirection='column' flex={1} alignItems='center' justifyContent='center'>
                    <Typography variant='h5'>
                      {`${formatSecondsToFriendlyFormat(
                        Number(getSum(stats.all.tUser)) / stats.all.tUser.length / 1000 || 0,
                        false,
                      )}
                      (${formatSecondsToFriendlyFormat(
                        (Number(getSum(stats.all.tUser)) / stats.all.tUser.length -
                          (Number(getSum(stats.all.tAll)) * 10) / stats.all.tAll.length) /
                          1000 || 0,
                        false,
                      )})`}
                    </Typography>
                  </Box>
                  <Box display='flex' flexDirection='column' flex={1}>
                    {difficultyLevelsToRender.map(difficulty => {
                      return (
                        <Box display='flex' justifyContent='space-between' p={2} border='1px solid #ccc'>
                          <Typography textTransform={'capitalize'}>{difficulty} </Typography>
                          <Typography>
                            {`  ${formatSecondsToFriendlyFormat(
                              Number(getSum(stats[difficulty].tUser)) / stats[difficulty].tUser.length / 1000 || 0,
                              false,
                            )}`}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              </StyledTableCell>
              <StyledTableCell
                sx={{ bgcolor: '#eaffe766' }}
                style={{
                  paddingRight: 0,
                }}
                padding='none'
              >
                <Box display='flex' justifyContent='space-between'>
                  <Box display='flex' flexDirection='column' flex={1} alignItems='center' justifyContent='center'>
                    <Typography variant='h5'>
                      {/* Full length test. */}
                      {`${getSum(stats.all.acc)} / ${stats.all.acc.length}`}
                      {/* Custom Or Personal Test */}
                      {/* {`${(getSum(stats['all'].acc) / stats['all'].acc.length || 0) * 100}%`} */}
                    </Typography>
                  </Box>
                  <Box display='flex' flexDirection='column' flex={1}>
                    {difficultyLevelsToRender.map(difficulty => {
                      return (
                        <Box display='flex' justifyContent='space-between' p={2} border='1px solid #ccc'>
                          <Typography>{difficulty}</Typography>
                          <StyledTruncatedTypography
                            sx={{
                              width: '50px',
                            }}
                          >
                            {`${(getSum(stats[difficulty].acc) / stats[difficulty].acc.length || 0) * 100}%`}
                          </StyledTruncatedTypography>
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              </StyledTableCell>
            </TableRow>
          </TableBody>
        ))}
      </Table>
    </Box>
  )
}
export default OverviewSectionTable

const HeaderWithIcon = ({ icon, title }: { icon: string; title: string }) => {
  return (
    <Box display='flex' justifyContent='center' alignItems='center' gap={2}>
      <IconifyIcon icon={icon} />
      <Typography variant='h6'>{title}</Typography>
    </Box>
  )
}

export const StyledTruncatedTypography = styled(Typography)<TypographyProps>(() => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}))

import { TimelineConnector, TimelineContent, TimelineItem, TimelineSeparator } from '@mui/lab'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import { Box, styled, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'
import Typography from 'src/@core/components/common/Typography'
import IconifyIcon from 'src/@core/components/icon'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'
import { getDayMonthAndYearFromTimestamp } from 'src/utils'

type Props = {
  fltPercentileData: FLTPercentileDataResponse['data']
}

const ActivityTimeline = ({ fltPercentileData }: Props) => {
  const theme = useTheme()

  const Timeline = styled(MuiTimeline)<TimelineProps>({
    '& .MuiTimelineItem-root': {
      width: '100%',
      '&:before': {
        display: 'none',
      },
    },
    maxHeight: '70vh',
    overflow: 'scroll',
  })

  return (
    <Box>
      <Typography variant='h4' mb={2}>
        Activity Timeline
      </Typography>
      <StyledBorderedBox padding={4} borderRadius={1}>
        <Box display='flex' justifyContent='space-between'>
          <Box display='flex' gap={2}>
            <IconifyIcon icon='tabler:layout-grid' />
            <Typography variant='h6'>Activity Timeline</Typography>
          </Box>
          <IconifyIcon icon='tabler:dots-vertical' />
        </Box>

        <Timeline
          sx={{
            my: 2,
          }}
        >
          {fltPercentileData.map(({ attemptID, testName, gmatScore, testType, accuracy, lastUpdatedOn }) => (
            <Link style={{ textDecoration: 'none' }} to={`/app/test/summary/${attemptID}`}>
              <TimelineItem key={attemptID}>
                <TimelineSeparator>
                  <Box
                    display='flex'
                    justifyContent='center'
                    padding='2px'
                    border='2px solid #839588'
                    borderRadius='100%'
                  >
                    <IconifyIcon icon='tabler:check' color={theme.palette.secondary.main} />
                  </Box>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Box display='flex' flexDirection='column'>
                    <Typography
                      sx={{
                        cursor: 'pointer',
                      }}
                      variant='h6'
                    >
                      {testName}
                    </Typography>
                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                      <Typography color={theme.palette.secondary.main}>
                        {!lastUpdatedOn ? 'lastUpdatedOnEmpty' : getDayMonthAndYearFromTimestamp(lastUpdatedOn)}
                      </Typography>
                      <Typography color={theme.palette.secondary.main}>
                        {testType === 'flt' && gmatScore
                          ? `Score ${gmatScore}`
                          : `Accuracy ${((accuracy || 0) * 100).toFixed(2)}%`}
                      </Typography>
                    </Box>
                  </Box>
                </TimelineContent>
              </TimelineItem>
            </Link>
          ))}
        </Timeline>
      </StyledBorderedBox>
    </Box>
  )
}

export default ActivityTimeline

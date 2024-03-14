import { Box, BoxProps, Button, Tooltip } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import {
  extractAllHrefAndTextFromAnchorTag,
  extractHrefFromAnchorTag,
  getDayMonthAndYearFromTimestampWithFullMonth,
} from 'src/@core/utils/helpers'
import { FilterType, getAdjustedDate, getFormattedTimeString } from '..'
import Boy from '/images/boy.png'
import Pencil from '/images/pencil.png'
import { parseSubjectCategory } from 'src/pages/planner/helpers'
import Typography from 'src/@core/components/common/Typography'
import { Link } from 'react-router-dom'

function findNUpcomingEvents(events: Batch[]) {
  if (events.length === 0) {
    return []
  }

  // Get the current time in seconds since epoch
  const currentTime = new Date().getTime() / 1000

  // Filter out events that have already passed
  const futureEvents = events.filter(event => Number(event.start) > currentTime)
  // Sort the events based on the time difference from the current time
  // Sort the remaining events based on the time difference from the current time
  futureEvents.sort((a, b) => Math.abs(Number(a.start) - currentTime) - Math.abs(Number(b.start) - currentTime))

  // Pick the first two events (the nearest ones)
  const nearestEvents = futureEvents.slice(0, 2)

  return nearestEvents
}

const Timeline = ({
  data,
  setActiveFilter,
  activeFilter,
}: {
  data: Batch[] | undefined
  setActiveFilter: (activeFilter: FilterType) => void
  activeFilter: FilterType
}) => {
  const [selectedBatchIdx, setSelectedBatchIdx] = useState<number>(-1)

  const handleSetSelectedBatchIdx = (idx: number) => setSelectedBatchIdx(idx)

  const theme = useTheme()

  const StyledBox = styled(Box)<BoxProps>({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  })

  const upcommingEvents = findNUpcomingEvents(data ?? [])

  const selectedBatch = data?.[selectedBatchIdx]

  return (
    <Box position={'relative'}>
      {!!upcommingEvents?.length && <Typography variant='h5'>Your upcoming classes</Typography>}
      {upcommingEvents?.map((ev, idx) => (
        <Box
          bgcolor={'#CCE7DE'}
          key={idx + ev.title}
          borderRadius={1}
          my={4}
          display='flex'
          justifyContent='space-between'
        >
          <Box p={6}>
            <Typography
              bgcolor={theme => theme.palette.primary.light}
              color={theme => theme.palette.primary.main}
              borderRadius={1}
              p={2}
              variant='paragraphSmall'
            >
              {parseSubjectCategory(ev.meta.summary)}
            </Typography>
            <Tooltip title={`${ev.meta.summary} ${ev.batchname}`}>
              <Typography
                variant='h3'
                my={4}
                sx={{
                  '@media (max-width:910px)': { width: '100%', display: 'flex' },
                  '@media (min-width:910px)': {
                    width: '440px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                  '@media (min-width:1660px)': {
                    width: '100%',
                  },
                }}
              >
                {ev.meta.summary} {ev.batchname}
              </Typography>
            </Tooltip>
            <Box display={'flex'} gap={10}>
              <Box>
                <Typography>Faculty</Typography>
                <Typography>Anudeep k.(Dummy)</Typography>
              </Box>
              <Box>
                <Typography>Date & Time</Typography>
                <Typography>
                  {getFormattedTimeString(ev.start)} - {getFormattedTimeString(ev.end)}{' '}
                  {getDayMonthAndYearFromTimestampWithFullMonth(getAdjustedDate(ev.start))}
                </Typography>
              </Box>
            </Box>
            <a href={extractHrefFromAnchorTag(ev.meta.description)} target='_blank'>
              <Button variant='contained' color='primary' sx={{ mt: 4 }}>
                Join Class
              </Button>
            </a>
          </Box>
          <Box
            sx={{
              '@media (max-width:910px)': { display: 'none' },
            }}
          >
            <img src={Boy} alt='boy' />
            <img src={Pencil} alt='pencil' width={200} height={'100%'} />
          </Box>
        </Box>
      ))}

      <Box
        display='flex'
        justifyContent='space-between'
        //   @ts-ignore
        border={theme => theme.border}
        p={4}
        borderRadius={1}
        sx={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }}
      >
        <Typography variant='h5'>Classes Schedule</Typography>
        <Box display='flex' gap={2} alignItems='center'>
          <Box width={10} height={10} borderRadius='100%' bgcolor='primary.main'></Box>
          <Typography
            variant={activeFilter === 'Verbal' ? 'h5' : 'h6'}
            sx={{ cursor: 'pointer' }}
            onClick={() => setActiveFilter('Verbal')}
          >
            Verbal
          </Typography>
          <Box width={10} height={10} borderRadius='100%' bgcolor='#FF9F43'></Box>
          <Typography
            variant={activeFilter === 'Quant' ? 'h5' : 'h6'}
            sx={{ cursor: 'pointer' }}
            onClick={() => setActiveFilter('Quant')}
          >
            Quant
          </Typography>
        </Box>
      </Box>
      {data && data.length > 0 && (
        <Box display='flex' justifyContent='space-between' width='100%'>
          <Box
            // @ts-ignore
            border={theme => theme.border}
            borderRadius={1}
            sx={{
              borderTopLeftRadius: '0px',
              borderTopRightRadius: '0px',
              '@media (max-width:910px)': { width: '100%' },
              '@media (min-width:910px)': { width: selectedBatch ? '65%' : '100%' },
              '@media (min-width:1500px)': { width: selectedBatch ? '75%' : '100%' },
              overflow: 'scroll',
              height: '70vh',
            }}
          >
            {data?.map((item, idx) => (
              <Box
                key={idx + 1}
                padding={4}
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                // @ts-ignore
                borderBottom={theme => theme.border}
                bgcolor={selectedBatchIdx === idx ? '#F8F7FA' : 'white'}
                sx={{
                  cursor: 'pointer',
                  '& .hidden-button': {
                    display: 'none',
                  },
                  '&:hover .hidden-button ': { display: 'flex', gap: 2 },
                }}
              >
                <Box gap={2} display='flex' alignItems='center'>
                  <Typography width={20}>{idx + 1}</Typography>
                  <Box
                    bgcolor={theme => theme.palette.grey[300]}
                    borderRadius='100%'
                    border={`1px solid ${theme.palette.grey[50]}`}
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    sx={{
                      '@media (max-width:410px)': { width: '25px', height: '25px', padding: '2px' },
                      '@media (min-width:410px)': { width: '35px', height: '35px' },
                    }}
                  >
                    <Icon icon='tabler:calendar-event' color={theme.palette.grey[50]} />
                  </Box>
                  <Typography variant='paragraphLead'>
                    {getDayMonthAndYearFromTimestampWithFullMonth(getAdjustedDate(item.start))}
                  </Typography>

                  <Typography
                    bgcolor={theme => theme.palette.primary.light}
                    color={theme => theme.palette.primary.main}
                    p={2}
                    borderRadius={1}
                    variant='paragraphSmall'
                  >
                    {parseSubjectCategory(item.meta.summary)}
                  </Typography>
                </Box>
                <Box gap={2} display='flex' alignItems='center'>
                  <Typography color={'#A5A3AE'}>
                    {getFormattedTimeString(item.start)} - {getFormattedTimeString(item.end)}
                  </Typography>

                  <Button
                    variant='contained'
                    color='primary'
                    className='hidden-button'
                    onClick={() => handleSetSelectedBatchIdx(idx)}
                  >
                    <Typography color='white'>View</Typography>
                    <Icon icon={'mingcute:unlink-line'} rotate={1} />
                  </Button>
                </Box>
              </Box>
            ))}
            {/* <StyledBox>
            <Typography sx={{ pl: 4 }}>Showing 1 to 7 out of 100 entries</Typography>
            <Pagination
              count={6}
              variant='text'
              shape='rounded'
              color='primary'
              // onClick={onClickPaginationBar}
              page={1}
              sx={{ p: 2 }}
            />
          </StyledBox> */}
          </Box>
          {selectedBatch && (
            <Box
              // @ts-ignore
              border={theme => theme.border}
              bgcolor='#F8F7FA'
              height={260}
              p={4}
              sx={{
                '@media (max-width:910px)': {
                  position: 'fixed',
                  bottom: 0,
                  width: 'calc(100% - 33px)',
                },
                '@media (min-width:910px)': { width: '35%' },
                '@media (min-width:1500px)': { width: '25%' },
              }}
            >
              {/* @ts-ignore */}
              <Typography variant='h5' paddingBottom={2} borderBottom={theme => theme.border}>
                Class Information
              </Typography>
              <StyledBox>
                <Typography variant='h6'>Batch Name</Typography>
                <Typography title={`${selectedBatch.title}, ${selectedBatch.batchname}`} className='truncate'>
                  {selectedBatch.title}, {selectedBatch.batchname}
                </Typography>
              </StyledBox>
              <StyledBox>
                <Typography variant='h6'>Date</Typography>
                <Typography>
                  {getDayMonthAndYearFromTimestampWithFullMonth(getAdjustedDate(selectedBatch.start))}
                </Typography>
              </StyledBox>
              <StyledBox>
                <Typography variant='h6'>Subject</Typography>
                <Typography
                  bgcolor={'#EBEBEE'}
                  color={theme.palette.secondary.main}
                  paddingY={1}
                  paddingX={2}
                  borderRadius={1}
                >
                  {parseSubjectCategory(selectedBatch.title)}
                </Typography>
              </StyledBox>
              <StyledBox>
                <Typography variant='h6'>Duration</Typography>
                <Typography>{`${getFormattedTimeString(selectedBatch.start)} - ${getFormattedTimeString(
                  selectedBatch.end,
                )}`}</Typography>
              </StyledBox>
              <StyledBox sx={{ marginTop: 6 }} gap={4}>
                {selectedBatch.meta.description ? (
                  extractAllHrefAndTextFromAnchorTag(selectedBatch.meta.description).map(({ href, text }) => (
                    <>
                      {/* @ts-ignore */}
                      <Button
                        fullWidth
                        endIcon={<Icon icon={'mingcute:unlink-line'} rotate={1} />}
                        to={href}
                        LinkComponent={Link}
                      >
                        {text}
                      </Button>
                    </>
                  ))
                ) : (
                  <Box textAlign={'center'} width={'100%'}>
                    No Class Link
                  </Box>
                )}
              </StyledBox>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default Timeline

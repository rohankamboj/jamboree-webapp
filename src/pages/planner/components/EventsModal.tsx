import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'

import { Button, Theme } from '@mui/material'
import Icon from 'src/@core/components/icon'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'
import CustomTextField from 'src/@core/components/mui/text-field'
import { PlannerCalendarEventType } from '../tabs/UpcomingClasses'
import { getInAppLinkForTask } from 'src/pages/structure/helpers'
import { Link, useNavigate } from 'react-router-dom'
import { extractAllHrefAndTextFromAnchorTag, extractHrefFromAnchorTag } from 'src/@core/utils/helpers'

type AddEventSidebarType = {
  events: PlannerCalendarEventType[]
  clearSelectedEvent: (event?: any) => void
}

const EventsModal = (props: AddEventSidebarType) => {
  const { events, clearSelectedEvent } = props

  return (
    <Drawer
      anchor='right'
      open
      onClose={clearSelectedEvent}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: ['100%', 400] } }}
    >
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#f5f7f2',
        }}
      >
        <Typography variant='h6'>Event</Typography>
        <Box
          sx={{
            cursor: 'pointer',
          }}
          onClick={clearSelectedEvent}
        >
          <Icon icon='system-uicons:cross' />
        </Box>
      </Box>
      <EventsList events={events} />
    </Drawer>
  )
}

export default EventsModal

const EventsList = ({ events }: { events: PlannerCalendarEventType[] }) => {
  function getTimeRange(startDateString: Date | number, endDateString: Date | number) {
    const startDate = new Date(startDateString)
    const endDate = new Date(endDateString)

    const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })

    return `${startTime} - ${endTime}`
  }

  const handleDateType = (date: Date | number) => {
    if (typeof date === 'number') {
      return new Date(date)
    }
    return date
  }

  const navigate = useNavigate()
  const navigateToTask = (task: UserPlannerQueryResponse['data'][number]) => {
    navigate(getInAppLinkForTask(task))
  }

  const eventActionCTA = (meta: PlannerCalendarEventType['meta']) => {
    switch (meta.taskType) {
      case 'task':
        return <Button onClick={() => navigateToTask(meta)}>Begin</Button>
      case 'class':
        const linksWithHref = extractAllHrefAndTextFromAnchorTag(meta.meta.description ?? '')

        return linksWithHref.map(({ href, text }) => {
          return (
            // @ts-ignore
            <Button target='_blank' LinkComponent={Link} to={href}>
              {text}
            </Button>
          )
        })
      case 'webinars':
        return (
          // @ts-ignore
          <Button target='_blank' LinkComponent={Link} to={extractHrefFromAnchorTag(meta.description ?? '')}>
            Join
          </Button>
        )
      default:
        return `Undefined task type: ${JSON.stringify(meta)}`
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {events.map((event, i: number) => (
        <Box key={i} padding={5} display='flex' flexDirection='column' gap={4}>
          <Box display='flex' gap={4} alignItems='center'>
            <Box display='flex' justifyContent='center' bgcolor={event.color} padding={2} borderRadius={1}>
              <Icon icon='uil:calender' color='white' />
            </Box>
            <Typography variant='h6'>{event.title}</Typography>
          </Box>
          <Box display='flex' justifyContent='space-between' gap={4}>
            <CustomTextField label='Date' disabled value={handleDateType(event.start)} />
            <CustomTextField label='Timing' disabled value={getTimeRange(event.end, event.start)} />
          </Box>

          <StyledBorderedBox
            padding={2}
            height={40}
            bgcolor={(theme: Theme) => theme.palette.action.selected}
            borderRadius={1}
          >
            {eventActionCTA(event.meta)}
          </StyledBorderedBox>
        </Box>
      ))}
    </Box>
  )
}

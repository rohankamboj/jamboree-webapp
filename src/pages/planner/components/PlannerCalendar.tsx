import Box from '@mui/material/Box'
import { useMemo, useState } from 'react'
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'
import { plannerEventTypesToColorMap } from '..'
import Calendar from './Calendar'
import EventsModal from './EventsModal'
import FilterSidebar from './FilterSidebar'
import { PlannerCalendarEventType } from '../tabs/UpcomingClasses'
import { EventImpl } from '@fullcalendar/core/internal'

type Props = {
  events: Array<PlannerCalendarEventType>
}

type SelectedEvent = EventImpl &
  Omit<PlannerCalendarEventType, 'meta'> & {
    extendedProps: PlannerCalendarEventType['meta']
  }

const PlannerCalendar = ({ events }: Props) => {
  const [calendarApi, setCalendarApi] = useState<null | any>(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>(Object.keys(plannerEventTypesToColorMap))

  const eventsAfterFilter = useMemo(() => {
    if (!selectedFilters.length) return []

    if (selectedFilters.includes('all')) return events

    return events.filter(event => selectedFilters.includes(event.meta.taskType))
  }, [selectedFilters, events])

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent>()

  const handleAddEventSidebarToggle = (event: SelectedEvent) => {
    // Extract clicked date from event
    // get start from the event and set it to 00:00:00 of the day
    if (!event.start) {
      alert('No start date for event.')
      return
    }

    setSelectedEvent(event)
  }

  const eventsOnDateOfCurrentlySelectedEvent = useMemo(() => {
    if (!selectedEvent) return []

    if (!selectedEvent.start) return []

    const date = new Date(selectedEvent.start).setHours(0, 0, 0, 0)

    return events.filter(({ start }) => {
      // Compare the date part of the start date with the date part of the selected event
      return new Date(start).setHours(0, 0, 0, 0) === date
    })
  }, [selectedEvent, events])

  return (
    <CalendarWrapper
      className='app-calendar'
      sx={{
        boxShadow: 0,
        border: theme => `1px solid ${theme.palette.divider}`,
      }}
    >
      <FilterSidebar
        filtersWithColors={plannerEventTypesToColorMap}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        isFilterSidebarOpen={leftSidebarOpen}
        handleFilterSidebarToggle={handleLeftSidebarToggle}
      />
      <Box
        sx={{
          p: 6,
          pb: 0,
          flexGrow: 1,
          borderRadius: 1,
          boxShadow: 'none',
          backgroundColor: 'background.paper',
          borderLeft: theme => `1px solid ${theme.palette.divider}`,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
      >
        <Calendar
          store={{ events: eventsAfterFilter }}
          // direction={direction}
          // updateEvent={updateEvent}
          calendarApi={calendarApi}
          calendarsColor={plannerEventTypesToColorMap}
          setCalendarApi={setCalendarApi}
          // handleSelectEvent={handleSelectEvent}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          handleAddEventSidebarToggle={handleAddEventSidebarToggle}
        />
      </Box>
      {!!selectedEvent && (
        <EventsModal
          events={eventsOnDateOfCurrentlySelectedEvent}
          clearSelectedEvent={() => setSelectedEvent(undefined)}
        />
      )}
    </CalendarWrapper>
  )
}

export default PlannerCalendar

// Mock data
const date = new Date()
const nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)

const nextMonth =
  date.getMonth() === 11 ? new Date(date.getFullYear() + 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() + 1, 1)

const prevMonth =
  date.getMonth() === 11 ? new Date(date.getFullYear() - 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() - 1, 1)

console.log({ nextMonth, prevMonth })

export type EventType = {
  id: number
  url: string
  title: string
  allDay: boolean
  end: Date | string
  start: Date | string
  extendedProps: {
    location?: string
    calendar?: string
    description?: string
    guests?: string[] | string | undefined
  }
}
export const data: { events: EventType[] } = {
  events: [
    {
      id: 1,
      url: '',
      title: 'Design Review',
      start: date,
      end: nextDay,
      allDay: false,
      extendedProps: {
        calendar: 'Business',
      },
    },
  ],
}

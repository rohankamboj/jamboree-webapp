// ** React Import
import { useEffect, useRef, useState } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import interactionPlugin from '@fullcalendar/interaction'

// ** Types
// import { CalendarType } from 'src/types/apps/calendarTypes'

// ** Third Party Style Import
import 'bootstrap-icons/font/bootstrap-icons.css'
import { CalendarOptions, ViewMountArg } from '@fullcalendar/core/index.js'
import { PlannerCalendarEventType } from '../tabs/UpcomingClasses'

const blankEvent = {
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    calendar: '',
    guests: [],
    location: '',
    description: '',
  },
}

const Calendar = (props: any) => {
  // ** Props
  const {
    store,
    dispatch,
    direction,
    calendarApi,
    calendarsColor,
    setCalendarApi,
    handleSelectEvent,
    handleLeftSidebarToggle,
    handleAddEventSidebarToggle,
  } = props

  // ** Refs
  const calendarRef = useRef()

  const [currentView, setCurrentView] = useState('dayGridMonth')

  useEffect(() => {
    if (calendarApi === null) {
      // @ts-ignore
      setCalendarApi(calendarRef.current?.getApi())
    }
  }, [calendarApi, setCalendarApi])

  if (store) {
    // ** calendarOptions(Props)
    const calendarOptions = {
      events: store.events.length ? store.events : [],
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        start: 'sidebarToggle, prev, next, title',
        end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
      },
      views: {
        week: {
          titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
        },
      },

      /*
        Automatically scroll the scroll-containers during event drag-and-drop and date selecting
        ? Docs: https://fullcalendar.io/docs/dragScroll
      */
      dragScroll: true,

      /*
        Max number of events within a given day
        ? Docs: https://fullcalendar.io/docs/dayMaxEvents
      */
      dayMaxEvents: 1,

      /*
        Determines if day names and week names are clickable
        ? Docs: https://fullcalendar.io/docs/navLinks
      */
      navLinks: true,

      eventClassNames({ event: calendarEvent }: any) {
        // @ts-ignore
        const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

        return [
          // Background Color
          `bg-${colorName}`,
        ]
      },

      eventClick(info) {
        // @ts-ignore
        const { event }: { event: (typeof info)['event'] & { extendedProps: PlannerCalendarEventType['meta'] } } = info
        handleAddEventSidebarToggle(event)
        dispatch(handleSelectEvent(event))

        // * Only grab required field otherwise it goes in infinity loop
        // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
        // event.value = grabEventDataFromEventApi(clickedEvent)

        // isAddNewEventSidebarActive.value = true
      },

      customButtons: {
        sidebarToggle: {
          icon: 'bi bi-list',
          click() {
            handleLeftSidebarToggle()
          },
        },
      },

      dateClick(info: any) {
        const ev = { ...blankEvent }
        ev.start = info.date
        ev.end = info.date
        ev.allDay = true

        // @ts-ignore
        dispatch(handleSelectEvent(ev))
        // handleAddEventSidebarToggle()
      },

      ref: calendarRef,
      // Get direction from app state (store)
      direction,
      displayEventTime: currentView !== 'dayGridMonth',
    } as CalendarOptions

    const handleOnViewChange = (view: ViewMountArg) => {
      setCurrentView(view.view.type)
    }

    return <FullCalendar viewDidMount={handleOnViewChange} {...calendarOptions} />
  } else {
    return null
  }
}

export default Calendar

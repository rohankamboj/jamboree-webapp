import Grid from '@mui/material/Grid'

import TabPanel from '@mui/lab/TabPanel'

import { useNavigate, useParams } from 'react-router-dom'
import CustomizedTab from 'src/components/common/CustomizedTab'
import Recordings from './components/Recordings'
import Timeline from './components/Timeline'

import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { CustomBreadcrumbs } from 'src/@core/components/common/Breadcrumb'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import { get12HrFormatTime } from 'src/@core/utils/helpers'
import { get } from 'src/@core/utils/request'
import { GET_CALENDAR_DATA } from 'src/apis/user'
import { parseSubjectCategory } from '../planner/helpers'

type classesTab = any
type ActiveTabValue = classesTab['value']
export type FilterType = 'Verbal' | 'Quant' | null

const ClassPage = () => {
  const { tabId: activeTab = 'timeline' } = useParams<{ tabId: ActiveTabValue }>()
  const [activeFilter, setActiveFilter] = useState<FilterType>(null)
  const [activeFilteredData, setActiveFilteredData] = useState<Batch[] | undefined>(undefined)

  const navigate = useNavigate()

  function setActiveTab(tab: string) {
    navigate(`/app/class/${tab}`, {
      replace: true,
    })
  }

  const userCalendarDataQuery = useQuery({
    queryKey: ['userCalendarData'],
    queryFn: () => get(GET_CALENDAR_DATA) as Promise<{ data: Batch[] }>,
  })

  const data = userCalendarDataQuery.data?.data

  useEffect(() => {
    if (data && activeFilter) {
      const res = handleSummaryFilteredData(activeFilter!, data)
      res && setActiveFilteredData([...res])
    }
  }, [data, activeFilter])

  const classesTab = [
    {
      value: 'timeline',
      label: 'Timeline',
      icon: '',
      component: (
        <Timeline data={activeFilteredData ?? data} setActiveFilter={setActiveFilter} activeFilter={activeFilter} />
      ),
    },
    {
      value: 'recordings',
      label: 'Recordings',
      icon: '',
      component: (
        // <Recordings data={activeFilteredData ?? data} setActiveFilter={setActiveFilter} activeFilter={activeFilter} />
        <Recordings />
      ),
    },
  ]

  if (userCalendarDataQuery.isLoading) return <FallbackSpinner />

  return (
    <Grid>
      <CustomHelmet title='Classes' />
      <CustomBreadcrumbs />
      <Grid container spacing={6}>
        <Grid item xs={12} position={'relative'}>
          <CustomizedTab tabs={classesTab} defaultActiveTab={activeTab} handleActiveTabChange={setActiveTab}>
            {classesTab.map(item => (
              <TabPanel key={item.value} value={item.value} sx={{ pl: 0, pr: 0 }}>
                {item.component}
              </TabPanel>
            ))}
          </CustomizedTab>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ClassPage

export function getAdjustedDate(dateInSeconds: string) {
  // Angular app logic
  let startDate = new Date(0) // The 0 there is the key, which sets the date to the epoch
  startDate.setUTCSeconds(parseInt(dateInSeconds) - 330 * 60) // remove ist time zone
  return startDate
}

export const handleSummaryFilteredData = (val: string, data: Batch[]) => {
  const res = data?.reduce((accumulator, currentItem) => {
    if (parseSubjectCategory(currentItem.meta.summary) === val) {
      accumulator.push(currentItem)
    }
    return accumulator
  }, [] as Batch[])

  return res
}

export const getFormattedTimeString = (dateTimeInSecs: string) =>
  get12HrFormatTime(getAdjustedDate(dateTimeInSecs)).toUpperCase()

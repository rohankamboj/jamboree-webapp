import { TabPanel } from '@mui/lab'
import { Grid } from '@mui/material'
import { useMemo, useState } from 'react'
import { type UseQueryResult } from 'react-query'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import CustomizedTab from 'src/components/common/CustomizedTab'
import TableView from '../TableView'
import { sortByLatestLastUpdatedOnTimestamp } from 'src/pages/helpers'

const forYouTableHeaderRows = [
  {
    label: 'SR. NO',
  },
  {
    label: 'QUIZ NAME',
  },
  {
    label: 'PRESCRIBE DATE',
  },
  {
    label: 'ATTEMPTED DATE',
  },
  {
    label: 'SUBJECT',
  },
  {
    label: 'ACTION',
  },
]

const OnDemandTableHeaderRows = [
  {
    label: 'SR. NO',
  },
  {
    label: 'QUIZ NAME',
  },
  {
    label: 'PRESCRIBE DATE',
  },
  {
    label: 'ATTEMPTED DATE',
  },
  {
    label: 'SUBJECT',
  },
  {
    label: 'ACTION',
  },
]

const PastAttempts = ({
  customizedTestPastAttemptsQuery,
  personalizedTestPastAttemptsQuery,
}: {
  customizedTestPastAttemptsQuery: UseQueryResult<GetCustomTestPastAttemptsAPIResponse, any>
  personalizedTestPastAttemptsQuery: UseQueryResult<GetCustomTestPastAttemptsAPIResponse, any>
}) => {
  const [activeTab, setActiveTab] = useState<string>('on-demand-and-build-your-quiz')

  const sortedPastAttempts = useMemo(() => {
    if (!personalizedTestPastAttemptsQuery.data?.data) return []

    return personalizedTestPastAttemptsQuery.data?.data.sort(sortByLatestLastUpdatedOnTimestamp)
  }, [personalizedTestPastAttemptsQuery.data?.data])

  const customisedTestSortedPastAttempts = useMemo(() => {
    if (!customizedTestPastAttemptsQuery.data?.data) return []

    return customizedTestPastAttemptsQuery.data?.data.sort(sortByLatestLastUpdatedOnTimestamp)
  }, [customizedTestPastAttemptsQuery.data?.data])

  const pastAttemptTabs = [
    {
      value: 'on-demand-and-build-your-quiz',
      label: 'On-demand and Build your custom quiz',
      component: (
        <TableView pastAttemptsQuery={customisedTestSortedPastAttempts} tableHeaderRows={OnDemandTableHeaderRows} />
      ),
    },
    {
      value: 'for-you',
      label: 'For You',
      component: <TableView pastAttemptsQuery={sortedPastAttempts} tableHeaderRows={forYouTableHeaderRows} />,
    },
  ]

  if (personalizedTestPastAttemptsQuery.isLoading) return <FallbackSpinner />

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CustomizedTab tabs={pastAttemptTabs} defaultActiveTab={activeTab} handleActiveTabChange={setActiveTab}>
          {pastAttemptTabs.map(item => (
            <TabPanel key={item.value} value={item.value} sx={{ pl: 0 }}>
              {item.component}
            </TabPanel>
          ))}
        </CustomizedTab>
      </Grid>
    </Grid>
  )
}

export default PastAttempts

import { TabPanel } from '@mui/lab'
import { Grid } from '@mui/material'
import { useState } from 'react'
import { CustomBreadcrumbs } from 'src/@core/components/common/Breadcrumb'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import CustomizedTab from 'src/components/common/CustomizedTab'
import OnDemandQuiz from './components/tabs/OnDemandQuiz'
import PastAttempts from './components/tabs/PastAttempts'
import useCustomTest from './hooks/useTests'

const Quiz = () => {
  const [activeTab, setActiveTab] = useState<string>('on-demand')

  const { getCustomQuizPastAttemptsQuery, getPersonalizedTestPastAttemptsQuery } = useCustomTest()

  const quizBankTabs = [
    {
      value: 'on-demand',
      label: 'On-demand Quiz',
      icon: 'tabler:layout-grid-add',
      component: (
        <OnDemandQuiz
          handleMoveToPastAttemptsTab={() => setActiveTab('past')}
          pastAttemptsQuery={getCustomQuizPastAttemptsQuery}
        />
      ),
    },
    {
      value: 'past',
      label: 'Past Attempts',
      icon: 'tabler:history',
      component: (
        <PastAttempts
          customizedTestPastAttemptsQuery={getCustomQuizPastAttemptsQuery}
          personalizedTestPastAttemptsQuery={getPersonalizedTestPastAttemptsQuery}
        />
      ),
    },
  ]

  return (
    <Grid>
      <CustomHelmet title='Quiz' />
      <CustomBreadcrumbs />
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <CustomizedTab
            tabs={quizBankTabs}
            defaultActiveTab={activeTab}
            handleActiveTabChange={setActiveTab}
            manageTabChangeExternally
            activeTab={activeTab}
          >
            {quizBankTabs.map(item => (
              <TabPanel key={item.value} value={item.value} sx={{ pl: 0 }}>
                {item.component}
              </TabPanel>
            ))}
          </CustomizedTab>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Quiz

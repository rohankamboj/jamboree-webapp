import Grid from '@mui/material/Grid'

import TabPanel from '@mui/lab/TabPanel'

import { useNavigate, useParams } from 'react-router-dom'
import { CustomBreadcrumbs } from 'src/@core/components/common/Breadcrumb'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import CustomizedTab from 'src/components/common/CustomizedTab'
import AnalyticDetail from './components/AnalyticDetail'
import Analytics from './components/Analytics'

const AnalyticsPage = () => {
  const { tabId: activeTab = 'analytic' } = useParams<{ tabId: string }>()

  const navigate = useNavigate()
  function setActiveTab(tab: string) {
    navigate(`/app/analytics/${tab}`, {
      replace: true,
    })
  }

  const analyticsTabs = [
    {
      value: 'analytic',
      label: 'Analytics',
      component: <Analytics />,
    },
    {
      value: 'detail',
      label: 'Analytics Detail',
      component: <AnalyticDetail />,
    },
  ]

  return (
    <Grid>
      <CustomHelmet title='Analytics' />
      <CustomBreadcrumbs />
      <Grid container spacing={6}>
        <Grid
          item
          xs={12}
          sx={{
            '& .css-il18an-MuiTabPanel-root': {
              paddingRight: '0px !important',
            },
          }}
        >
          <CustomizedTab tabs={analyticsTabs} defaultActiveTab={activeTab} handleActiveTabChange={setActiveTab}>
            {analyticsTabs.map(item => (
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

export default AnalyticsPage

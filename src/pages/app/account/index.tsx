// ** MUI Imports
import Grid from '@mui/material/Grid'

import { TabContext } from '@mui/lab'
import { Theme, useMediaQuery } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { CustomBreadcrumbs } from 'src/@core/components/common/Breadcrumb'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import AccountsTab from 'src/components/AccountsTab'
import AccountsProfileCardSection from './components/AccountsProfileCardSection'
import AccountsTabContent from './components/AccountsTabContent'

const Account = () => {
  const { tabId: activeTab = 'account' } = useParams()

  const navigate = useNavigate()

  function setActiveTab(tab: string) {
    navigate(`/app/account/${tab}`, {
      replace: true,
    })
  }

  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Grid>
      <CustomHelmet title='Profile' />
      <CustomBreadcrumbs />

      <TabContext value={activeTab}>
        <Grid item xs={12} sx={{ ...(!isSm && { display: 'none' }) }}>
          <AccountsTab setActiveTab={setActiveTab} />
        </Grid>
        <Grid container spacing={6}>
          <Grid item xs={12} md={4} xl={3}>
            <AccountsProfileCardSection />
          </Grid>

          <Grid item xs={12} md={8} xl={9}>
            <AccountsTabContent activeTab={activeTab} setActiveTab={setActiveTab} />
          </Grid>
        </Grid>
      </TabContext>
    </Grid>
  )
}

export default Account

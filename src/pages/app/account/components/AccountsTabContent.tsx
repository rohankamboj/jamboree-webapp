// ** React Imports
import { useMemo } from 'react'

// ** MUI Imports
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icon Imports
import AccountsTab from 'src/components/AccountsTab'
import TabAccount from './TabAccount'
import TabNotifications from './TabNotifications'
import TabSecurity from './TabSecurity'
import themeConfig from 'src/configs/themeConfig'

const { border } = themeConfig

const AccountsTabContent = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string
  setActiveTab: (activeTab: string) => void
}) => {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const renderActiveTab = useMemo(() => {
    switch (activeTab) {
      case 'account':
        return <TabAccount />
      case 'security':
        return <TabSecurity />
      case 'notifications':
        return <TabNotifications />
      default:
        null
    }
  }, [activeTab])
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TabContext value={activeTab}>
          <Grid container spacing={6}>
            <Grid item xs={12} sx={{ ...(isSm && { display: 'none' }) }}>
              <AccountsTab setActiveTab={setActiveTab} />
            </Grid>
            <Grid item xs={12}>
              <TabPanel sx={{ p: 0, border, borderRadius: 1 }} value={activeTab}>
                {renderActiveTab}
              </TabPanel>
            </Grid>
          </Grid>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default AccountsTabContent

// ** React Imports
import { SyntheticEvent } from 'react'

// ** MUI Imports
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import Box from '@mui/material/Box'
import { styled, Theme } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Tab component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1.5),
  },
}))

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    // flexWrap: 'wrap',
  },
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`,
  },
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}))

const AccountsTab = ({ setActiveTab }: { setActiveTab: (activeTab: string) => void }) => {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const handleChange = (_: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }
  return (
    // TODO: on mobile make dull width of tabs and wrap them
    <TabList variant='scrollable' scrollButtons='auto' onChange={handleChange} aria-label='customized tabs example'>
      <Tab
        value='account'
        label={
          <Box display={'flex'} alignItems={'center'} sx={{ ...(!isSm && { '& svg': { mr: 2 } }) }}>
            <Icon fontSize='1.25rem' icon='tabler:users' />
            {'Account'}
          </Box>
        }
      />
      <Tab
        value='security'
        label={
          <Box display={'flex'} alignItems={'center'} sx={{ ...(!isSm && { '& svg': { mr: 2 } }) }}>
            <Icon fontSize='1.25rem' icon='tabler:lock' />
            {'Security'}
          </Box>
        }
      />

      <Tab
        value='notifications'
        label={
          <Box display={'flex'} alignItems={'center'} sx={{ ...{ '& svg': { mr: 2 } } }}>
            <Icon fontSize='1.25rem' icon='tabler:bell' />
            {'Notifications'}
          </Box>
        }
      />
    </TabList>
  )
}

export default AccountsTab

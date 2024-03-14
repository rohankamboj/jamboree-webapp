import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'

import MuiTabList, { TabListProps } from '@mui/lab/TabList'

// Styled TabList component
const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    // margin: {theme.spacing(-1.25, -1.25, -2)} !important,
  },
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    // color: {theme.palette.common.white} !important
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}))

type TabItem = {
  label: string
  value: string
  icon: JSX.Element
}
const TabsCustomized = ({ children, tabs }: { children: React.ReactNode; tabs: Array<TabItem> }) => {
  const [value, setValue] = useState<string>(tabs[0].value)

  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <TabList onChange={handleChange} aria-label='quiz section headers'>
        {tabs.map(tab => (
          <Tab key={tab.value} value={tab.value} iconPosition='start' icon={tab.icon} label={tab.label} />
        ))}
      </TabList>
      {children}
    </TabContext>
  )
}

export default TabsCustomized

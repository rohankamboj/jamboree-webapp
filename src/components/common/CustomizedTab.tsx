import React, { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'

import MuiTabList, { TabListProps } from '@mui/lab/TabList'
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

type TabItem = {
  label: string
  value: string
  icon?: string
}

type Props = {
  children: React.ReactNode
  tabs: Array<TabItem>
  defaultActiveTab?: string | undefined
}

type InternallyManagedTabProps = {
  handleActiveTabChange?: (tab: string) => void
  manageTabChangeExternally?: never
} & Props

type ExternallyManagedTabProps = {
  manageTabChangeExternally: boolean
  handleActiveTabChange: (tab: string) => void
  activeTab: string
} & Props
const CustomizedTab = (props: InternallyManagedTabProps | ExternallyManagedTabProps) => {
  const [activeTab, setActiveTab] = useState(props.defaultActiveTab || props.tabs?.[0]?.value)
  const { children, tabs, handleActiveTabChange } = props

  const handleChange = (_: SyntheticEvent, tabValue: string) => {
    if (!props.manageTabChangeExternally) setActiveTab(tabValue)

    handleActiveTabChange?.(tabValue)
  }

  return (
    <TabContext value={props.manageTabChangeExternally ? props.activeTab : activeTab}>
      <TabList variant='scrollable' scrollButtons='auto' onChange={handleChange}>
        {tabs.map((tab: TabItem) => (
          <Tab
            key={tab.value}
            value={tab.value}
            iconPosition='start'
            icon={tab.icon ? <Icon fontSize='1.25rem' icon={tab.icon} /> : undefined}
            label={tab.label}
          />
        ))}
      </TabList>
      {children}
    </TabContext>
  )
}

export default CustomizedTab

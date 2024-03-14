// ** React Imports
import { Fragment, useEffect } from 'react'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Third Party Imports
import clsx from 'clsx'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs Import
import themeConfig from 'src/configs/themeConfig'

// ** Utils
import { hasActiveChild, removeChildren } from 'src/@core/layouts/utils'

// ** Type Import
import { LayoutProps, NavGroup } from 'src/@core/layouts/types'

// ** Custom Components Imports
import { useLocation } from 'react-router-dom'
import UserIcon from 'src/layouts/components/UserIcon'
import VerticalNavItems from './VerticalNavItems'
// import CanViewNavGroup from 'src/layouts/components/acl/CanViewNavGroup'

interface Props {
  item: NavGroup
  navHover: boolean
  parent?: NavGroup
  navVisible?: boolean
  groupActive: string[]
  collapsedNavWidth: number
  currentActiveGroup: string[]
  navigationBorderWidth: number
  settings: LayoutProps['settings']
  isSubToSub?: NavGroup | undefined
  saveSettings: LayoutProps['saveSettings']
  setGroupActive: (values: string[]) => void
  setCurrentActiveGroup: (items: string[]) => void
}

const MenuItemTextWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' }),
}))

const VerticalNavGroup = (props: Props) => {
  // ** Props
  const {
    item,
    parent,
    settings,
    navHover,
    navVisible,
    isSubToSub,
    groupActive,
    setGroupActive,
    collapsedNavWidth,
    currentActiveGroup,
    navigationBorderWidth,
    setCurrentActiveGroup,
  } = props

  // ** Hooks & Vars
  const { pathname } = useLocation()
  const { navCollapsed, verticalNavToggleType } = settings
  const verticalNavItemId = item.id!

  // ** Accordion menu group open toggle
  const toggleActiveGroup = (item: NavGroup, parent: NavGroup | undefined) => {
    let openGroup = groupActive

    const itemId = item.id!

    // ** If Group is already open and clicked, close the group
    if (openGroup.includes(itemId)) {
      openGroup.splice(openGroup.indexOf(itemId), 1)

      // If clicked Group has open group children, Also remove those children to close those groups
      if (item.children) {
        removeChildren(item.children, openGroup, currentActiveGroup)
      }
    } else if (parent) {
      // ** If Group clicked is the child of an open group, first remove all the open groups under that parent
      if (parent.children) {
        removeChildren(parent.children, openGroup, currentActiveGroup)
      }

      // ** After removing all the open groups under that parent, add the clicked group to open group array
      if (!openGroup.includes(itemId)) {
        openGroup.push(itemId)
      }
    } else {
      // ** If clicked on another group that is not active or open, create openGroup array from scratch

      // ** Empty Open Group array
      openGroup = []

      // ** push Current Active Group To Open Group array
      if (currentActiveGroup.every(elem => groupActive.includes(elem))) {
        openGroup.push(...currentActiveGroup)
      }

      // ** Push current clicked group item to Open Group array
      if (!openGroup.includes(itemId)) {
        openGroup.push(itemId)
      }
    }
    setGroupActive([...openGroup])
  }

  // ** Menu Group Click
  const handleGroupClick = () => {
    const openGroup = groupActive
    if (verticalNavToggleType === 'collapse') {
      if (openGroup.includes(verticalNavItemId)) {
        openGroup.splice(openGroup.indexOf(verticalNavItemId), 1)
      } else {
        openGroup.push(verticalNavItemId)
      }
      setGroupActive([...openGroup])
    } else {
      toggleActiveGroup(item, parent)
    }
  }

  useEffect(() => {
    if (hasActiveChild(item, pathname)) {
      if (!groupActive.includes(verticalNavItemId)) groupActive.push(verticalNavItemId)
    } else {
      const index = groupActive.indexOf(verticalNavItemId)
      if (index > -1) groupActive.splice(index, 1)
    }
    setGroupActive([...groupActive])
    setCurrentActiveGroup([...groupActive])

    // Empty Active Group When Menu is collapsed and not hovered, to fix issue route change
    if (navCollapsed && !navHover) {
      setGroupActive([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (navCollapsed && !navHover) {
      setGroupActive([])
    }

    if ((navCollapsed && navHover) || (groupActive.length === 0 && !navCollapsed)) {
      setGroupActive([...currentActiveGroup])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navCollapsed, navHover])

  useEffect(() => {
    if (groupActive.length === 0 && !navCollapsed) {
      setGroupActive([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navHover])

  const icon = parent && !item.icon ? themeConfig.navSubItemIcon : item.icon

  const menuGroupCollapsedStyles = navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }

  return (
    // <CanViewNavGroup navGroup={item}>
    <Fragment>
      <ListItem
        disablePadding
        className='nav-group'
        onClick={handleGroupClick}
        sx={{ mt: 1, px: '0 !important', flexDirection: 'column' }}
      >
        <ListItemButton
          className={clsx({
            'Mui-selected': groupActive.includes(verticalNavItemId) || currentActiveGroup.includes(verticalNavItemId),
          })}
          sx={{
            py: 2,
            mx: 3.5,
            borderRadius: 1,
            width: theme => `calc(100% - ${theme.spacing(3.5 * 2)})`,
            transition: 'padding-left .25s ease-in-out, padding-right .25s ease-in-out',
            px: navCollapsed && !navHover ? (collapsedNavWidth - navigationBorderWidth - 22 - 28) / 8 : 4,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            '& .MuiTypography-root, & :not(.menu-item-meta) > svg': {
              color: 'text.secondary',
            },
            '&.Mui-selected': {
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: 'action.selected',
              },
              '& .MuiTypography-root, & :not(.menu-item-meta) > svg': {
                color: 'text.primary',
              },
              '& .menu-item-meta > svg': {
                color: 'text.secondary',
              },
              '&.Mui-focusVisible': {
                backgroundColor: 'action.focus',
                '&:hover': {
                  backgroundColor: 'action.focus',
                },
              },
            },
          }}
        >
          <ListItemIcon
            sx={{
              transition: 'margin .25s ease-in-out',
              ...(parent && navCollapsed && !navHover ? {} : { mr: 2 }),
              ...(navCollapsed && !navHover ? { mr: 0 } : {}), // this condition should come after (parent && navCollapsed && !navHover) condition for proper styling
              ...(parent && item.children ? { ml: 1.5, mr: 3.5 } : {}),
            }}
          >
            <UserIcon icon={icon as string} {...(parent && { fontSize: '0.625rem' })} />
          </ListItemIcon>
          <MenuItemTextWrapper sx={{ ...menuGroupCollapsedStyles, ...(isSubToSub ? { ml: 2 } : {}) }}>
            <Typography
              {...((themeConfig.menuTextTruncate || (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && {
                noWrap: true,
              })}
            >
              {item.title}
            </Typography>
            <Box
              className='menu-item-meta'
              sx={{
                display: 'flex',
                alignItems: 'center',
                '& svg': {
                  color: 'text.disabled',
                  transition: 'transform .25s ease-in-out',
                  ...(groupActive.includes(verticalNavItemId) && {
                    transform: 'rotate(-180deg)',
                  }),
                },
              }}
            >
              {item.badgeContent ? (
                <Chip
                  size='small'
                  label={item.badgeContent}
                  color={item.badgeColor || 'primary'}
                  sx={{
                    mr: 2,
                    height: 22,
                    minWidth: 22,
                    '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' },
                  }}
                />
              ) : null}
              <Icon fontSize='1.125rem' icon={'tabler:chevron-down'} />
            </Box>
          </MenuItemTextWrapper>
        </ListItemButton>
        <Collapse
          component='ul'
          onClick={e => e.stopPropagation()}
          in={groupActive.includes(verticalNavItemId)}
          sx={{
            pl: 0,
            width: '100%',
            ...menuGroupCollapsedStyles,
            transition: 'all 0.25s ease-in-out',
          }}
        >
          <VerticalNavItems
            {...props}
            parent={item}
            navVisible={navVisible}
            verticalNavItems={item.children}
            isSubToSub={parent && item.children ? item : undefined}
          />
        </Collapse>
      </ListItem>
    </Fragment>
    // </CanViewNavGroup>
  )
}

export default VerticalNavGroup
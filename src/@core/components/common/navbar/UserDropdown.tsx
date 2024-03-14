// ** React Imports
import { useState, SyntheticEvent, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import ProfilePic from 'src/assets/Images/Avatar2.png'
import { useNavigate } from 'react-router'
import { useUserContext } from 'src/@core/context/UserContext'
import { getUrlPath } from 'src/utils'

interface Props {
  logout: () => void
  username: string
  email: string
}

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}))

const MenuItemStyled = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  '&:hover .MuiBox-root, &:hover .MuiBox-root svg': {
    color: theme.palette.primary.main,
  },
}))

const UserDropdown = (props: Props) => {
  const { email, username, logout } = props

  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  const navigate = useNavigate()

  const { userDetailsWithBio } = useUserContext()

  const imgToRender = userDetailsWithBio?.meta.avatar ? getUrlPath(userDetailsWithBio?.meta?.avatar!) : ProfilePic

  const direction = 'ltr'

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const closeDropdown = () => setAnchorEl(null)
  const handleNavigateToUrlAndCloseDropdown = (url?: string, onClick?: () => void) => {
    if (onClick) onClick()
    if (url) {
      navigate(url)
    }
    closeDropdown()
  }

  const onClickLogout = () => {
    logout()
    closeDropdown()
  }

  const dropdownOptions = [
    {
      icon: 'gg:profile',
      label: 'Explore',
      url: '/course',
    },
    {
      icon: 'gg:profile',
      label: 'Profile',
      url: '/app/account/account',
    },
    {
      icon: 'uil:calender',
      label: 'Appointment',
      url: '/app/account/appointment/create',
    },
    {
      icon: 'tabler:notes',
      label: 'Notes',
      url: '/app/notes',
    },
    {
      icon: 'material-symbols:school-outline',
      label: 'Admission Service',
      url: '/app/admission-services',
    },
    {
      icon: 'mdi:contact-outline',
      label: 'Contact Admin',
      url: '/app/contact-admin',
    },
    {
      icon: 'tabler:notes',
      label: 'AWA',
      url: '/app/awa/submit',
    },

    {
      icon: 'tabler:logout',
      label: 'Sign Out',
      hasLineSeparator: true,
      onClick: onClickLogout,
    },
  ]

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Avatar alt={username} src={imgToRender} onClick={handleDropdownOpen} sx={{ width: 38, height: 38 }} />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleNavigateToUrlAndCloseDropdown()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4.75 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box>
          <Box sx={{ py: 1.75, px: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Badge
                overlap='circular'
                badgeContent={<BadgeContentSpan />}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
              >
                <Avatar alt={username} src={imgToRender} sx={{ width: '2.5rem', height: '2.5rem' }} />
              </Badge>
              <Box sx={{ display: 'flex', ml: 2.5, alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 500 }}>{username}</Typography>
                <Typography variant='body2'>{email}</Typography>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />

          {dropdownOptions.map((option, index) => {
            return (
              <Fragment key={option.label}>
                {option.hasLineSeparator && <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />}
                <DropdownItem
                  key={index}
                  icon={option.icon}
                  label={option.label}
                  onClick={() => handleNavigateToUrlAndCloseDropdown(option.url, option.onClick)}
                />
              </Fragment>
            )
          })}
        </Box>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown

const styles = {
  px: 4,
  py: 1.75,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  color: 'text.primary',
  textDecoration: 'none',
  '& svg': {
    mr: 2.5,
    fontSize: '1.5rem',
    color: 'text.secondary',
  },
}

const DropdownItem = ({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) => {
  return (
    <MenuItemStyled sx={{ p: 0 }} onClick={onClick}>
      <Box sx={styles}>
        <Icon icon={icon} />
        {label}
      </Box>
    </MenuItemStyled>
  )
}

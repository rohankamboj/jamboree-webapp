// ** React Imports
import { ChangeEvent, useState } from 'react'

// ** MUI Components
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Logo from '/logo.svg'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import { Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'

interface State {
  newPassword: string
  showNewPassword: boolean
  confirmNewPassword: string
  showConfirmNewPassword: boolean
}

// ** Styled Components
const ResetPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550,
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500,
  },
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450,
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600,
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750,
  },
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: `${theme.palette.primary.main} !important`,
}))

const ResetPassword = () => {
  // ** States
  const [values, setValues] = useState<State>({
    newPassword: '',
    showNewPassword: false,
    confirmNewPassword: '',
    showConfirmNewPassword: false,
  })

  // ** Hooks
  const theme = useTheme()
  const navigate = useNavigate()

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // Handle New Password
  const handleNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  // Handle Confirm New Password
  const handleConfirmNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  const handleResetPassword = () => {
    navigate('/auth/verify')
  }

  return (
    <>
      <CustomHelmet title='Reset Password' />
      <Box
        sx={{
          backgroundColor: 'background.paper',
          display: 'flex',
          minHeight: '100vh',
          overflowX: 'hidden',
          position: 'relative',
        }}
      >
        {!hidden ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              position: 'relative',
              alignItems: 'center',
              borderRadius: '20px',
              justifyContent: 'center',
              backgroundColor: 'customColors.bodyBg',
              margin: theme => theme.spacing(8, 0, 8, 8),
            }}
          >
            <ResetPasswordIllustration
              alt='reset-password-illustration'
              src='/images/pages/auth-reset-password-illustration-light.png'
            />
          </Box>
        ) : null}
        <RightWrapper>
          <Box
            sx={{
              p: [6, 12],
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <img width={'60%'} src={Logo} alt='jamboree_logo' />
              <Box sx={{ my: 6 }}>
                <Typography variant='h3' sx={{ mb: 1.5 }}>
                  Reset Password 🔒
                </Typography>
                <Typography sx={{ display: 'flex' }}>
                  for{' '}
                  <Typography component='span' sx={{ ml: 1, fontWeight: 500 }}>
                    john.doe@email.com
                  </Typography>
                </Typography>
              </Box>
              <form noValidate autoComplete='off' onSubmit={handleResetPassword}>
                <CustomTextField
                  fullWidth
                  autoFocus
                  label='New Password'
                  value={values.newPassword}
                  placeholder='············'
                  sx={{ display: 'flex', mb: 4 }}
                  id='auth-reset-password-v2-new-password'
                  onChange={handleNewPasswordChange('newPassword')}
                  type={values.showNewPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowNewPassword}
                          onMouseDown={e => e.preventDefault()}
                          aria-label='toggle password visibility'
                        >
                          <Icon fontSize='1.25rem' icon={values.showNewPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <CustomTextField
                  fullWidth
                  label='Confirm Password'
                  placeholder='············'
                  sx={{ display: 'flex', mb: 4 }}
                  value={values.confirmNewPassword}
                  id='auth-reset-password-v2-confirm-password'
                  type={values.showConfirmNewPassword ? 'text' : 'password'}
                  onChange={handleConfirmNewPasswordChange('confirmNewPassword')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onMouseDown={e => e.preventDefault()}
                          aria-label='toggle password visibility'
                          onClick={handleClickShowConfirmNewPassword}
                        >
                          <Icon
                            fontSize='1.25rem'
                            icon={values.showConfirmNewPassword ? 'tabler:eye' : 'tabler:eye-off'}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                  Set New Password
                </Button>
                <Typography
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}
                >
                  <Typography component={LinkStyled} href='/auth/login'>
                    <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                    <span>Back to login</span>
                  </Typography>
                </Typography>
              </form>
            </Box>
          </Box>
        </RightWrapper>
      </Box>
    </>
  )
}

export default ResetPassword

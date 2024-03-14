// ** React Imports
import { useState, ChangeEvent } from 'react'
import Logo from '/logo.svg'

// ** MUI Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from './components/FooterIllustrationsV2'
import { Link } from 'react-router-dom'
import { useUserContext } from 'src/@core/context/UserContext'
import PhoneInputModal from 'src/components/modal/PhoneInput'
import toast from 'react-hot-toast'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'

interface State {
  password: string
  showPassword: boolean
  isChecked: boolean
}

// ** Styled Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 680,
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
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`,
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary,
  },
}))

const LoginV2 = () => {
  const [openLoginWithOTPModel, setOpenLoginWithOTPModel] = useState<boolean>(false)
  const [values, setValues] = useState<State>({
    password: 'TopSecretPassword123#$',
    showPassword: false,
    isChecked: false,
  })

  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, isChecked: e.target.checked })
  }

  // const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

  const { handleUserLogin } = useUserContext()

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!values.isChecked) {
      toast.error('Please check Terms and Conditions')
      return
    }
    // TODO: Add validation for email and password fields
    // Get email and password values from form
    // @ts-ignore TODO: Remove ts-ignore once this is refactored.
    handleUserLogin({ user: e.target.email.value, password: e.target.password.value })
  }

  return (
    <BlankLayout>
      <CustomHelmet title='Login' />
      <PhoneInputModal open={openLoginWithOTPModel} setOpen={setOpenLoginWithOTPModel} />
      <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
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
            <LoginIllustration alt='login-illustration' src={`/images/pages/auth-v2-login-illustration-light.png`} />
            <FooterIllustrationsV2 />
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
                  {`Welcome to ${themeConfig.templateName}! 👋🏻`}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Please sign-in to your account and start the adventure
                </Typography>
              </Box>
              <form noValidate autoComplete='off' onSubmit={handleFormSubmit}>
                <CustomTextField
                  autoFocus
                  fullWidth
                  id='email'
                  label='Email'
                  sx={{ display: 'flex', mb: 4 }}
                  placeholder='pranav.suri@plaksha.org'
                  autoComplete='email'
                />
                <CustomTextField
                  fullWidth
                  sx={{ mb: 1.5 }}
                  label='Password'
                  placeholder='············'
                  value={values.password}
                  id='password'
                  onChange={handleChange('password')}
                  type={values.showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowPassword}
                          onMouseDown={e => e.preventDefault()}
                          aria-label='toggle password visibility'
                        >
                          <Icon fontSize='1.25rem' icon={values.showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <FormControlLabel control={<Checkbox />} label='Remember Me' />
                  <Typography component={LinkStyled} to='/auth/forgot'>
                    Forgot Password?
                  </Typography>
                </Box>

                <Box display='flex' alignItems='center'>
                  <Checkbox sx={{ left: '-10px' }} onChange={handleCheckbox} />
                  <Box display='flex' sx={{ ml: '-10px' }} gap={1}>
                    <Typography>I agree to the</Typography>
                    <Link to='/pages/terms'>Terms and Conditions</Link>
                  </Box>
                </Box>

                <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                  Login
                </Button>
                <Button
                  fullWidth
                  variant='outlined'
                  color='secondary'
                  sx={{ mb: 4 }}
                  onClick={() => setOpenLoginWithOTPModel(true)}
                >
                  Login with OTP
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Typography sx={{ color: 'text.secondary', mr: 2 }}>New on our platform?</Typography>
                  <Typography component={LinkStyled} to='/pages/auth/register-v2'>
                    Create an account
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    color: 'text.disabled',
                    '& .MuiDivider-wrapper': { px: 6 },
                    fontSize: theme.typography.body2.fontSize,
                    my: theme => `${theme.spacing(6)} !important`,
                  }}
                >
                  or
                </Divider>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconButton to='/' component={Link} sx={{ color: '#497ce2' }} onClick={e => e.preventDefault()}>
                    <Icon icon='mdi:facebook' />
                  </IconButton>
                  <IconButton to='/' component={Link} sx={{ color: '#1da1f2' }} onClick={e => e.preventDefault()}>
                    <Icon icon='mdi:twitter' />
                  </IconButton>
                  <IconButton
                    to='/'
                    component={Link}
                    onClick={e => e.preventDefault()}
                    sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : 'grey.300') }}
                  >
                    <Icon icon='mdi:github' />
                  </IconButton>
                  <IconButton to='/' component={Link} sx={{ color: '#db4437' }} onClick={e => e.preventDefault()}>
                    <Icon icon='mdi:google' />
                  </IconButton>
                </Box>
              </form>
            </Box>
          </Box>
        </RightWrapper>
      </Box>
    </BlankLayout>
  )
}

export default LoginV2

// ** MUI Components
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
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
import { Controller, useForm } from 'react-hook-form'
import { useUserContext } from 'src/@core/context/UserContext'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'

// Styled Components
const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
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
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize,
}))

const ForgotPassword = () => {
  // ** Hooks
  const theme = useTheme()

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const { recoverPassword } = useUserContext()

  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<{
    email: string
  }>({
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (formData: { email: string }) => {
    recoverPassword.mutate({
      data: {
        user: formData.email,
      },
    })
  }

  return (
    <>
      <CustomHelmet title='Forgot Password' />
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
            <ForgotPasswordIllustration
              alt='forgot-password-illustration'
              src='/images/pages/auth-forgot-password-illustration-light.png'
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
                  Forgot Password? 🔒
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Enter your email and we&prime;ll send you instructions to reset your password
                </Typography>
              </Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      type='email'
                      label='Email'
                      sx={{ display: 'flex', mb: 4 }}
                      placeholder='ritikshrivastav2207@gmail.com'
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      {...(errors.email && { helperText: 'This field is required' })}
                    />
                  )}
                />

                <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }} disabled={!isDirty}>
                  Send reset link
                </Button>
              </form>
              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}>
                <LinkStyled href='/auth/login'>
                  <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                  <span>Back to login</span>
                </LinkStyled>
              </Typography>
            </Box>
          </Box>
        </RightWrapper>
      </Box>
    </>
  )
}

export default ForgotPassword

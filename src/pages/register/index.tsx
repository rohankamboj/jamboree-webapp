// ** React Imports
import { ReactNode } from 'react'

// ** MUI Components
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import Logo from '/logo.svg'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { Grid, Link, MenuItem } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import PhoneInput from 'src/components/common/reactPhoneInput'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'

export interface RegisterForm {
  fullName: string
  email: string
  phoneNumber: string
  city: string
  nearestCenter: string
  course: string
  score: string
}

// ** Styled Components
const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 600,
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
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.75),
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary,
  },
}))

const Cities = [
  {
    label: 'Delhi',
    value: 'delhi',
  },
  {
    label: 'Mumbai',
    value: 'mumbai',
  },
]

const nearestCenter = [
  {
    label: 'Delhi',
    value: 'delhi',
  },
  {
    label: 'Mumbai',
    value: 'mumbai',
  },
]

const courses = [
  {
    label: 'GMAT',
    value: 'gmat',
  },
  {
    label: 'Mumbai',
    value: 'mumbai',
  },
]

const RegisterV2 = () => {
  // ** Hooks
  const theme = useTheme()

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      city: '',
      nearestCenter: '',
      course: '',
      score: '',
    },
  })

  const onSubmit = (formData: RegisterForm) => {
    console.log('formData', formData)
  }

  return (
    <>
      <CustomHelmet title='Register' />
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
            <RegisterIllustration
              alt='register-illustration'
              src={`/images/pages/auth-v2-login-illustration-light.png`}
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
              <img src={Logo} width={200} alt='Jamboree' />

              <Box sx={{ my: 6 }}>
                <Typography variant='h3' sx={{ mb: 1.5 }}>
                  KICKSTART your preparation NOW!
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Please sign in to your account and start the adventure
                </Typography>
              </Box>
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name='fullName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      autoFocus
                      id='fullName'
                      label='Full Name'
                      placeholder='Ritik Shrivastav'
                      value={value}
                      onChange={onChange}
                      sx={{ display: 'flex', mb: 4 }}
                      error={Boolean(errors.fullName)}
                      {...(errors.fullName && { helperText: 'This field is required' })}
                    />
                  )}
                />

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
                <Grid xs={12} md={4}>
                  <Controller
                    name='phoneNumber'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { ref, value, onChange } }) => (
                      <PhoneInput
                        setValue={setValue}
                        errors={errors.phoneNumber}
                        ref={ref}
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </Grid>

                <Grid container spacing={5} sx={{ pt: '1rem !important' }}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='city'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          sx={{ display: 'flex', mb: 4 }}
                          label='City'
                          select
                          value={value || 'delhi'}
                          onChange={onChange}
                          error={Boolean(errors.city)}
                          {...(errors.city && { helperText: 'This field is required' })}
                        >
                          {Cities.map(item => (
                            <MenuItem key={item.value} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='nearestCenter'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          sx={{ display: 'flex', mb: 4 }}
                          label='Nearest Center'
                          select
                          value={value || 'delhi'}
                          onChange={onChange}
                          error={Boolean(errors.nearestCenter)}
                          {...(errors.nearestCenter && { helperText: 'This field is required' })}
                        >
                          {nearestCenter.map(item => (
                            <MenuItem key={item.value} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      )}
                    />
                  </Grid>
                </Grid>
                <Controller
                  name='course'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      sx={{ display: 'flex', mb: 4 }}
                      label='Select a Course'
                      select
                      value={value || 'gmat'}
                      onChange={onChange}
                      error={Boolean(errors.course)}
                      {...(errors.course && { helperText: 'This field is required' })}
                    >
                      {courses.map(item => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />

                <Controller
                  name='score'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      autoFocus
                      id='score'
                      label='What is your Target Score?'
                      placeholder='Out of 800'
                      sx={{ display: 'flex', mb: 4 }}
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.score)}
                      {...(errors.score && { helperText: 'This field is required' })}
                    />
                  )}
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label={
                    <Box display='flex' alignItems='center' justifyContent='center' flexWrap='wrap'>
                      <Typography sx={{ color: 'text.secondary' }}>I agree to the </Typography>
                      <Typography component={LinkStyled} href='/' onClick={e => e.preventDefault()} sx={{ ml: 1 }}>
                        Terms & Conditions
                      </Typography>
                    </Box>
                  }
                />
                <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                  Create Account
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Typography sx={{ color: 'text.secondary', mr: 2 }}>Already registered?</Typography>
                  <Typography
                    component={LinkStyled}
                    href='/auth/login'
                    sx={{ fontSize: theme.typography.body1.fontSize }}
                  >
                    Log In
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    color: 'text.disabled',
                    '& .MuiDivider-wrapper': { px: 6 },
                    fontSize: theme.typography.body2.fontSize,
                    my: theme => `${theme.spacing(2)} !important`,
                  }}
                >
                  or
                </Divider>
                <Box display='flex' alignItems='center' justifyContent='center'>
                  <IconButton href='/' component={Link} sx={{ color: '#497ce2' }} onClick={e => e.preventDefault()}>
                    <Icon icon='mdi:facebook' />
                  </IconButton>
                  <IconButton href='/' component={Link} sx={{ color: '#1da1f2' }} onClick={e => e.preventDefault()}>
                    <Icon icon='mdi:twitter' />
                  </IconButton>
                  <IconButton
                    href='/'
                    component={Link}
                    onClick={e => e.preventDefault()}
                    sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : 'grey.300') }}
                  >
                    <Icon icon='mdi:github' />
                  </IconButton>
                  <IconButton href='/' component={Link} sx={{ color: '#db4437' }} onClick={e => e.preventDefault()}>
                    <Icon icon='mdi:google' />
                  </IconButton>
                </Box>
              </form>
            </Box>
          </Box>
        </RightWrapper>
      </Box>
    </>
  )
}

RegisterV2.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default RegisterV2

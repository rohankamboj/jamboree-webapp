// ** React Imports
import { useState } from 'react'
import Toast from 'react-hot-toast'
// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useUserContext } from 'src/@core/context/UserContext'

interface State {
  showNewPassword: boolean
  showCurrentPassword: boolean
  showConfirmNewPassword: boolean
}

const defaultValues = {
  newPassword: '',
  currentPassword: '',
  confirmNewPassword: '',
}

const schema = yup.object().shape({
  currentPassword: yup.string().min(8).required(),
  newPassword: yup
    .string()
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      'Must contain minimum 8 characters, 1 lowercase, 1 number, and 1 special character',
    )
    // .matches(
    //      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    //   /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,40}$/,
    //   'Must contain 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special case character',
    // )
    .required(),
  confirmNewPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
})

const TabSecurity = () => {
  const [values, setValues] = useState<State>({
    showNewPassword: false,
    showCurrentPassword: false,
    showConfirmNewPassword: false,
  })

  const { resetPassword, userDetails } = useUserContext()
  //   const [isPwdChangeInProgress, setIsPwdChangeInProgress] = useState(false)

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<typeof defaultValues>({ defaultValues, resolver: yupResolver(schema) })

  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword })
  }

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  const onPasswordFormSubmit = (data: typeof defaultValues) => {
    // setIsPwdChangeInProgress(true)
    resetPassword.mutate({
      data: {
        otp: data.currentPassword,
        password: data.newPassword,
        user: userDetails?.data.email || '',
      },
      handleSuccess: () => {
        Toast.success('Password Changed Successfully')
        reset(defaultValues)
      },
      handleError: Toast.error,
    })
  }

  return (
    <Card sx={{ boxShadow: 0 }}>
      <CardHeader title='Security' />
      <CardContent>
        <form onSubmit={handleSubmit(onPasswordFormSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Controller
                name='currentPassword'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='Current Password'
                    placeholder='············'
                    id='input-current-password'
                    error={Boolean(errors.currentPassword)}
                    type={values.showCurrentPassword ? 'text' : 'password'}
                    {...(errors.currentPassword && { helperText: errors.currentPassword.message })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={handleClickShowCurrentPassword}
                          >
                            <Icon
                              fontSize='1.25rem'
                              icon={values.showCurrentPassword ? 'tabler:eye' : 'tabler:eye-off'}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={5} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <Controller
                name='newPassword'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='New Password'
                    id='input-new-password'
                    placeholder='············'
                    error={Boolean(errors.newPassword)}
                    type={values.showNewPassword ? 'text' : 'password'}
                    {...(errors.newPassword && { helperText: errors.newPassword.message })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowNewPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <Icon fontSize='1.25rem' icon={values.showNewPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='confirmNewPassword'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder='············'
                    label='Confirm New Password'
                    id='input-confirm-new-password'
                    error={Boolean(errors.confirmNewPassword)}
                    type={values.showConfirmNewPassword ? 'text' : 'password'}
                    {...(errors.confirmNewPassword && { helperText: errors.confirmNewPassword.message })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
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
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6'>Password Requirements:</Typography>
              <Box component='ul' sx={{ pl: 6, mb: 0, '& li': { mb: 1.5, color: 'text.secondary' } }}>
                <li>Minimum 8 characters long - the more, the better</li>
                <li>At least one lowercase character</li>
                <li>At least one number, symbol, or whitespace character</li>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button
                //   TODO: Replace this icon with loading
                endIcon={resetPassword.isLoading && <Icon fontSize='1.25rem' icon={'tabler:eye'} />}
                variant='contained'
                type='submit'
                sx={{ mr: 4 }}
                disabled={!isDirty || resetPassword.isLoading}
              >
                Change Password
              </Button>
              <Button type='reset' variant='tonal' color='secondary' onClick={() => reset()}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default TabSecurity

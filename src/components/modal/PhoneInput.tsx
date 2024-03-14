import { Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { Controller, useForm } from 'react-hook-form'
import Toast from 'react-hot-toast'
import { useUserContext } from 'src/@core/context/UserContext'
import { IPhoneForm } from 'src/pages/app/account/components/TabNotifications'
import PhoneInput from '../common/reactPhoneInput'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const PhoneInputModal = (props: Props) => {
  const { open, setOpen } = props
  const { loginWithOTPMutation } = useUserContext()
  const handleClose = () => setOpen(false)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty, errors },
  } = useForm<IPhoneForm>({
    defaultValues: {
      phoneNo: '',
      countryCode: '+91',
    },
  })

  const handleFormSubmit = (formData: IPhoneForm) => {
    const { phoneNo, countryCode } = formData
    loginWithOTPMutation.mutate({
      data: {
        countryCode: `+${countryCode}`,
        mode: 'sms',
        name: '',
        otp: '',
        phoneNo: phoneNo.split(countryCode)[1],
      },
      handleError: Toast.error,
      handleSuccess: () => {
        //  Show OTP MOdel
      },
    })
  }

  const handleOnChangeCountryCode = (countryCode: string) => {
    console.log('countryCode', countryCode)
    setValue('countryCode', countryCode)
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiPaper-root': {
          maxWidth: 512,
          height: 350,
        },
        backdropFilter: 'blur(6px)',
      }}
    >
      <form
        style={
          {
            // width: '100%',
            // height: '100%',
            // display: 'flex',
            // flexDirection: 'column',
            // justifyContent: 'space-between',
          }
        }
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyItems: 'center',
            alignItems: 'center',
            gap: 1,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(8)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(8)} !important`],
          }}
        >
          <Typography color={'primary'} id='keep-mounted-modal-title' variant='h4' component='h2' mb={15}>
            Login With OTP
          </Typography>

          <Controller
            name='phoneNo'
            control={control}
            rules={{ required: true }}
            render={({ field: { ref, value, onChange } }) => (
              <PhoneInput
                setValue={setValue}
                errors={errors.phoneNo}
                ref={ref}
                value={value}
                onChange={onChange}
                handleOnChangeCountryCode={handleOnChangeCountryCode}
              />
            )}
          />
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(10)} !important`],
          }}
        >
          <Button fullWidth type='submit' variant='contained' color='primary' disabled={!isDirty}>
            Continue
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default PhoneInputModal

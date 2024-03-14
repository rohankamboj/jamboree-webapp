import { Box, BoxProps, CardContent, CardHeader, Grid, GridProps, Switch, Typography } from '@mui/material'
import Button, { ButtonProps } from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Toast from 'react-hot-toast'
import TranslucentLoader from 'src/@core/components/common/TranslucentLoader'
import { useUserContext } from 'src/@core/context/UserContext'
import { TickIcon } from 'src/assets/Icons/Icons'
import Whatsapp from 'src/assets/Icons/whatsapp.svg'
import PhoneInput from 'src/components/common/reactPhoneInput'
import OTPModal from 'src/components/modal/OTPModal'
import SuccessModel from 'src/components/modal/Success'

export type IPhoneForm = {
  phoneNo: string
  countryCode: string
}

const GridContainer = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'end',
  },
}))

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
  color: theme.palette.customColors.lightPaperBg,
}))

const ImgStyled = styled('img')(() => ({
  width: 40,
  height: 40,
}))

const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  color: theme.palette.success.main,
  borderColor: theme.palette.success.main,
}))

const TabNotifications = () => {
  const {
    userMobileDetails,
    getUserVerifyStatus,
    updatePhoneMutation,
    verifyMobileOtpMutation,
    changeWhatsAppNotificationPreference,
  } = useUserContext()

  //   TODO: This has to be made dynamic
  const isNumberVerified = !!getUserVerifyStatus?.data?.find(
    ({ key, value }) => key === 'verifiedStatus' && value === '1',
  )
  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
    setValue,
    getValues,
    // @ts-ignore
  } = useForm<IPhoneForm>({ defaultValues: { phoneNo: userMobileDetails?.data[0]?.value, countryCode: '+91' } })

  const [otp, setOtp] = useState<string | null>(null)
  const [isVerificationModalVisible, setIsVerificationModalVisible] = useState(false)

  const handleClose = () => setIsVerificationModalVisible(false)

  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const handleConfirmation = () => {
    handleClose()
    setSecondDialogOpen(true)
  }

  const isWhatsAppNotificationsEnabled = !!getUserVerifyStatus?.res?.find(
    ({ key, value }) => key === 'whatsappEnable' && value === 'true',
  )

  const onSubmit = (formData: IPhoneForm) => {
    console.log('formData', formData)
    // remove country code from phone number
    formData.phoneNo = formData.phoneNo.replace(formData.countryCode, '')

    updatePhoneMutation.mutate({
      data: formData,
      handleError: Toast.error,
      handleSuccess: () => {
        setIsVerificationModalVisible(true)
      },
    })
  }

  useEffect(() => {
    if (otp) {
      const phoneNo = getValues('phoneNo')
      handleSubmitOTP({ otp, phoneNo })
    }
  }, [otp])

  const handleSubmitOTP = (otpWithPhone: { otp: string; phoneNo: string }) => {
    verifyMobileOtpMutation.mutate({
      data: otpWithPhone,
      handleError: Toast.error,
      handleSuccess: () => {
        Toast.success('OTP verified successfully')
        handleConfirmation()
      },
    })
  }

  const handleUpdateWhatsAppNotificationPreference = () =>
    changeWhatsAppNotificationPreference.mutate({
      enable: !isWhatsAppNotificationsEnabled,
      handleError: Toast.error,
      handleSuccess: () => Toast.success('Notification preference updated successfully'),
    })

  const handleOnChangeCountryCode = (countryCode: string) => {
    setValue('countryCode', countryCode)
  }

  const handleSuccessModalClose = () => setSecondDialogOpen(false)

  //   TODO: Fill in default values from API.
  return (
    <>
      {updatePhoneMutation.isLoading && <TranslucentLoader />}
      <OTPModal
        phoneNumber={getValues('phoneNo')}
        open={isVerificationModalVisible}
        setOtp={setOtp}
        handleClose={handleClose}
      />
      <Grid>
        <CardHeader title='Notification' />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <GridContainer container marginBottom={4}>
              <Grid xs={12} md={4}>
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
                      onChange={(...args) => {
                        console.log('args', args)
                        onChange(...args)
                      }}
                      handleOnChangeCountryCode={handleOnChangeCountryCode}
                    />
                  )}
                />
              </Grid>

              <StyledButton variant='outlined' type='submit' disabled={!isDirty}>
                Update Number
              </StyledButton>
            </GridContainer>
          </form>
          {isNumberVerified && (
            <Box
              display='flex'
              padding={4}
              alignItems='center'
              gap={2}
              borderRadius={2}
              marginBottom={4}
              bgcolor='rgba(40, 199, 111, 0.16)'
            >
              <TickIcon />
              <Typography color={'success.main'}>Your Number is verified successfully</Typography>
            </Box>
          )}

          <StyledBox
            padding={6}
            borderRadius={2}
            sx={{
              backgroundColor: 'rgba(131, 149, 136, 0.1)',
            }}
          >
            <Typography variant='h5'>Connected Accounts</Typography>
            <Typography>Do you wish to receive important Whatsapp Notifications ?</Typography>
            <Box display='flex' alignItems='center' justifyContent='space-between' marginTop={4}>
              <Box display='flex' alignItems='center' gap={4}>
                <ImgStyled src={Whatsapp} alt='Whatsapp' />
                <div>
                  <Typography>Whatsapp</Typography>
                  <Typography color='text.secondary'>Class Schedule & Webinars Notification</Typography>
                </div>
              </Box>
              <Switch
                onChange={handleUpdateWhatsAppNotificationPreference}
                disabled={changeWhatsAppNotificationPreference.isLoading}
                checked={isWhatsAppNotificationsEnabled}
              />
            </Box>
          </StyledBox>
        </CardContent>
      </Grid>

      <SuccessModel
        open={secondDialogOpen}
        handleClose={handleSuccessModalClose}
        description={'Your phone number has been updated successfully.'}
        onClick={handleSecondDialogClose}
      />
    </>
  )
}

export default TabNotifications

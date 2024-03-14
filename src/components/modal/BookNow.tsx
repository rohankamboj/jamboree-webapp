// ** MUI Imports
import { Button, Dialog, DialogActions, DialogContent, Grid, Typography } from '@mui/material'

import { styled } from '@mui/material/styles'

import IconButton, { IconButtonProps } from '@mui/material/IconButton'

import { Controller, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useUserContext } from 'src/@core/context/UserContext'
import { showAPIErrorAsToast } from 'src/@core/utils/ApiHelpers'
import { put } from 'src/@core/utils/request'
import { reserveAppointment } from 'src/apis/type'
import { USER_APPOINTMENTS } from 'src/apis/user'
import toast, { LoaderIcon } from 'react-hot-toast'
import { convertDateToSeconds } from 'src/utils'

type Data = {
  preference1: string
  preference2: string
  preference3: string
}

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
}

export const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)',
  },
}))

const BookNowModel = (props: Props) => {
  const { open, setOpen } = props

  const { userDetails } = useUserContext()

  const handleClose = () => setOpen(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<Data>({
    defaultValues: {
      preference1: '',
      preference2: '',
      preference3: '',
    },
  })

  const reserveUserAppointmentMutation = useMutation({
    mutationFn: (variables: { data: reserveAppointment; handleSuccess: () => void }) =>
      put(USER_APPOINTMENTS, variables.data),
    onError: showAPIErrorAsToast,
    onSuccess: (_, { handleSuccess }) => {
      handleSuccess()
    },
  })

  const OnSubmit = (data: Data) => {
    const formData = {
      ...data,
      contact: userDetails?.data.email!,
      duration: 30,
      faculty: 'Counseling',
    }

    formData.preference1 = convertDateToSeconds(formData.preference1)
    formData.preference2 = convertDateToSeconds(formData.preference2)
    formData.preference3 = convertDateToSeconds(formData.preference3)

    reserveUserAppointmentMutation.mutate({
      data: formData,
      handleSuccess: () => {
        reset()
        setOpen(false)
        toast.success('Appointment Request has been sent.')
      },
    })
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiPaper-root': { width: '100%', maxWidth: 512 },
        backdropFilter: 'blur(6px)',
        '& .MuiDialog-paper': { overflow: 'visible' },
      }}
    >
      <form onSubmit={handleSubmit(OnSubmit)}>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(8)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(8)} !important`],
          }}
        >
          <CustomCloseButton onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Typography variant='h5'>Tell us some time slots that suits you the best.</Typography>
          <Grid container spacing={5} marginTop={2}>
            <Grid item xs={12}>
              <Controller
                name='preference1'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    label='Date 1'
                    value={value}
                    error={Boolean(errors.preference1)}
                    {...(errors.preference1 && { helperText: 'This field is required' })}
                    onChange={onChange}
                    type='date'
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name='preference2'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    label='Date 2'
                    value={value}
                    onChange={onChange}
                    type='date'
                    error={Boolean(errors.preference2)}
                    {...(errors.preference2 && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name='preference3'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    label='Date 3'
                    value={value}
                    onChange={onChange}
                    type='date'
                    error={Boolean(errors.preference3)}
                    {...(errors.preference3 && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'end',
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(10)} !important`],
          }}
        >
          {reserveUserAppointmentMutation.isLoading ? (
            <Button variant='contained' color='primary' sx={{ minWidth: '130px', padding: '13px' }}>
              <LoaderIcon />
            </Button>
          ) : (
            <Button variant='contained' color='primary' type='submit' disabled={!isDirty}>
              Reserve Now
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default BookNowModel

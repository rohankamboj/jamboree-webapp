import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import OTPTextField from '../common/OTPTextInput'

type Props = {
  phoneNumber: string
  open: boolean
  setOtp: (val: string | null) => void
  handleClose: () => void
}

const OTPModal = (props: Props) => {
  const { open, setOtp, handleClose, phoneNumber } = props

  const onSubmit = (formData: any) => {
    const otp = Object.values(formData).join('')
    setOtp(otp)
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 }, backdropFilter: 'blur(6px)' }}
    >
      <DialogContent
        sx={{
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(10)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(10)} !important`],
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <OTPTextField phoneNumber={phoneNumber} onSubmit={onSubmit} handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
}

export default OTPModal

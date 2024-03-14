// ** MUI Imports
import { Dialog, DialogActions, DialogContent, Typography } from '@mui/material'

import { styled } from '@mui/material/styles'

import IconButton, { IconButtonProps } from '@mui/material/IconButton'

import { ReactNode } from 'react'
import Icon from 'src/@core/components/icon'

type Props = {
  open: boolean
  setOpen: (val: boolean) => void
  description: string
  title: string
  PrimaryButton: ReactNode
  SecondaryButton?: ReactNode
}

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
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

const ConfirmModel = (props: Props) => {
  const { open, setOpen, description, title, PrimaryButton, SecondaryButton } = props

  const handleClose = () => setOpen(false)
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
        <Typography id='keep-mounted-modal-title' variant='h5' sx={{ mt: 2 }}>
          {title}
        </Typography>
        {/* @ts-ignore */}
        <Typography id='keep-mounted-modal-description' variant='paragraphMedium' sx={{ mt: 2 }}>
          {description}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'end',
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(10)} !important`],
        }}
      >
        {/* <Button variant='outlined' color='secondary' onClick={onClick}>
          Go back to edit
        </Button>
        <Button variant='contained' color='primary' onClick={onClick}>
          Yes Confirm
        </Button> */}
        {SecondaryButton}
        {PrimaryButton}
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmModel

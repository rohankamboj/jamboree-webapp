// ** MUI Imports
import Button from '@mui/material/Button'

// ** Third Party Imports
import { Box, Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import Icon from '../../@core/components/icon'

type Props = {
  open: boolean
  handleClose: () => void
  description: string
  subDescription?: string
  onClick: () => void
}

const SuccessModel = (props: Props) => {
  const { open, handleClose, description, subDescription, onClick } = props

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 }, backdropFilter: 'blur(6px)' }}
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
        <Box
          borderRadius={'100%'}
          bgcolor={'rgba(40, 199, 111, 0.3)'}
          width={55}
          height={55}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          border={'1px solid rgba(40, 199, 111, 1)'}
        >
          <Icon icon={'tabler:check'} color='rgba(40, 199, 111, 1)' />
        </Box>
        <Typography color={'primary'} id='keep-mounted-modal-title' variant='h4' component='h2'>
          Success
        </Typography>
        {/* @ts-ignore */}
        <Typography id='keep-mounted-modal-description' variant='paragraphMedium' sx={{ mt: 2, textAlign: 'center' }}>
          {description} <br />
          {subDescription}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(10)} !important`],
        }}
      >
        <Button variant='contained' color='primary' onClick={onClick}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SuccessModel

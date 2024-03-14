// ** MUI Imports
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'
import { CustomCloseButton } from 'src/components/modal/BookNow'

type Props = {
  isOpen: boolean
  handleCloseModal: () => void
}

const QuestionsTabChangeModal = (props: Props) => {
  const { handleCloseModal, isOpen } = props
  return (
    <div>
      <Dialog open={isOpen} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogTitle sx={{ p: 4 }}>
          <Typography variant='h6' component='span'>
            Confirm Tab Change
          </Typography>
          <CustomCloseButton aria-label='close' onClick={handleCloseModal}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          <Typography sx={{ mb: 4 }}>
            Changing tabs will reset all selected filters. If you want to save your current filters, please cancel and
            apply them before switching tabs.
          </Typography>
          <Typography sx={{ mb: 4 }}>Click OK to confirm you want to change tabs and reset filters.</Typography>
          <Typography>Click Cancel to go back and save filters before changing tabs.</Typography>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', gap: 4, p: 4 }}>
          {/* TODO: on click of cancel, user must be on same tab, tab should not be changed */}
          <Button variant='outlined' onClick={handleCloseModal}>
            Cancel
          </Button>

          <Button variant='tonal' color='error' onClick={handleCloseModal}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default QuestionsTabChangeModal

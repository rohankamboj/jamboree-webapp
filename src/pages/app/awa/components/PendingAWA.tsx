import { Card, CardHeader, Dialog, DialogContent, Grid, Typography, Box, BoxProps } from '@mui/material'
import { useState } from 'react'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import TableCollapsible from 'src/@core/components/table/CollapsibleTable'
import { userData } from 'src/apis/type'

import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import { formatSecondsToDateString } from 'src/@core/utils/helpers'
import themeConfig from 'src/configs/themeConfig'

const tableHeaderRows = [
  {
    icon: 'tabler:user-circle',
    label: 'Review ID',
  },
  {
    icon: 'tabler:calendar-stats',
    label: 'Essay Prompt',
  },
  {
    icon: 'tabler:clock',
    label: 'Date & Time',
  },
  {
    icon: 'tabler:clock',
    label: 'Source',
  },
  {
    label: 'Action',
  },
]

type IPendingPropsTab = {
  data: userData.awaList[] | undefined
  isLoading: boolean
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

const { border } = themeConfig

const StyledBox = styled(Box)<BoxProps>({
  display: 'flex',
  justifyContent: 'space-between',
  border,
  padding: '1.25rem',
  borderRadius: '6px',
  marginBottom: '1rem',
})

const PendingAWA = ({ data, isLoading }: IPendingPropsTab) => {
  const [showPromptModal, setShowPromptModal] = useState<boolean>(false)
  const [particularRowData, setParticularRowData] = useState<userData.awaList | any>({})

  const handleActionButton = (row: userData.awaList) => {
    setShowPromptModal(true)
    setParticularRowData(row)
  }

  if (isLoading || !data) return <FallbackSpinner />

  return (
    <>
      <Dialog
        fullWidth
        scroll='body'
        maxWidth='lg'
        open={showPromptModal}
        onClose={() => setShowPromptModal(false)}
        onBackdropClick={() => setShowPromptModal(false)}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            py: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
          }}
        >
          <CustomCloseButton onClick={() => setShowPromptModal(false)}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <StyledBox alignItems={'center'}>
            <Typography variant='h4'>Dummy</Typography>
            <Box display={'flex'} alignItems={'center'} gap={4}>
              <Box display={'flex'} alignItems={'center'} gap={2}>
                <Icon icon={'tabler:calendar-event'} />
                <Typography variant='h6'>{formatSecondsToDateString(particularRowData.addedOn)}</Typography>
              </Box>
              <Box display={'flex'} alignItems={'center'} gap={2}>
                <Icon icon={'tabler:license'} />
                <Typography variant='h6'>Review ID</Typography>
                <Typography variant='h6' color={'primary'}>
                  {particularRowData.id}
                </Typography>
              </Box>
              <Box display={'flex'} alignItems={'center'} gap={2}>
                <Icon icon={'tabler:checkup-list'} />
                <Typography variant='h6'>Score</Typography>
                <Typography variant='h6' color={'primary'}>
                  Dummy
                </Typography>
              </Box>
            </Box>
          </StyledBox>

          <StyledBox flexDirection={'column'} sx={{ pb: '3rem !important' }}>
            <Typography variant='h5'>Essay Prompt</Typography>
            {/* @ts-ignore */}
            <Typography variant='paragraphMain'>{particularRowData.awaPrompt}</Typography>
          </StyledBox>

          <StyledBox flexDirection={'column'} bgcolor={'#83958880'} sx={{ pb: '3rem !important' }}>
            <Typography variant='h5'>Response</Typography>
            {/* @ts-ignore */}
            <Typography variant='paragraphMain'>{particularRowData.userResponse}</Typography>
          </StyledBox>
        </DialogContent>
      </Dialog>
      <Grid item xs={12}>
        <Card sx={{ boxShadow: 0, border, borderRadius: 1 }}>
          <CardHeader sx={{ pb: 0 }} title='Pending AWAs' onClick={() => setShowPromptModal(true)} />
          {data?.length === 0 ? (
            // Margin needs to be added due to usage of the card.
            <Typography margin={'24px'}>No Pending AWA's Found</Typography>
          ) : (
            <Grid margin={4} sx={{ border, borderRadius: 1 }}>
              <TableCollapsible
                headerRow={tableHeaderRows}
                data={data}
                isAWARow
                handleActionButton={handleActionButton}
              />
            </Grid>
          )}
        </Card>
      </Grid>
    </>
  )
}

export default PendingAWA

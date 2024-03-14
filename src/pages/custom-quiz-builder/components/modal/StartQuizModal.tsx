// ** MUI Imports
import { Box, Button, Dialog, DialogActions, DialogContent, Grid, Typography } from '@mui/material'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

import { useMemo } from 'react'
import { UseFormGetValues } from 'react-hook-form'
import { LoaderIcon } from 'react-hot-toast'
import IconifyIcon from 'src/@core/components/icon'
import { sectionPtIdToSubjectShortCode } from 'src/pages/quiz/constants'
import { CreateCustomizedOnDemandQuizShortForm } from '../../../quiz/components/customisedQuizModal'

type Props = {
  getValues: UseFormGetValues<CreateCustomizedOnDemandQuizShortForm>
  handleClose: () => void
  handleStartQuiz: () => void
  isLoading: boolean
  questionsCount: number
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

const StartQuizModel = (props: Props) => {
  const { handleClose, getValues, handleStartQuiz, isLoading } = props

  const { ptids, question_count, subjects } = getValues()

  const sectionNames = useMemo(() => {
    return ptids.map(ptid => sectionPtIdToSubjectShortCode[ptid])
  }, [ptids])

  return (
    <Dialog
      fullWidth
      open={true}
      onClose={handleClose}
      sx={{
        '& .MuiPaper-root': { width: '100%', maxWidth: 780 },
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
          <IconifyIcon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
        <Box
          sx={{
            bgcolor: '#F6F6F7',
            padding: 5,
          }}
        >
          <Typography variant='h5'>Your quiz is ready 🚀</Typography>
          <Typography>Confirm your deal details information and submit to create it.</Typography>
          <Grid container spacing={5} my={1}>
            <Grid item xs={6}>
              <SectionsWithIconAndMappedItem icon='lucide:file-text' itemsArray={subjects} title='Subject' />
            </Grid>

            <Grid item xs={6}>
              <SectionsWithIconAndMappedItem icon='tabler:box' itemsArray={sectionNames} title='Sections' />
            </Grid>

            <Grid item xs={6}>
              <Box display='flex' alignItems='center' gap={2}>
                <StyledIconWithBackgroundAndBorder icon='material-symbols:database-outline' />
                <Box display='flex' flexDirection='column' gap={1}>
                  <Typography variant='h6'>Quiz Duration</Typography>
                  <Typography>NA</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box display='flex' alignItems='center' gap={2}>
                <StyledIconWithBackgroundAndBorder icon='material-symbols-light:check' />
                <Box display='flex' flexDirection='column' gap={1}>
                  <Typography variant='h6'>Number Of Question</Typography>
                  <Typography>{question_count}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box display='flex' flexDirection='column' gap={2} my={2}>
          <Typography variant='h5'>Quiz Instructions</Typography>
          <Typography variant='h6'>1. Ensure stable internet 📶, do not refresh 🔄. </Typography>
          <Typography variant='h6'>2. You can pause ⏸️ the test for 2 mins</Typography>
          <Typography variant='h6'>
            3. Answer carefully 🎯 - your performance will further tailor future quizzes 🧩
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'space-between',
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(10)} !important`],
        }}
      >
        <Button variant='tonal' color='secondary' type='button' onClick={handleClose}>
          Discard
        </Button>
        {isLoading ? (
          <Button variant='contained' color='primary' sx={{ minWidth: '130px', padding: '13px' }}>
            <LoaderIcon />
          </Button>
        ) : (
          <Button variant='contained' color='primary' type='button' onClick={handleStartQuiz}>
            Start Quiz
            <IconifyIcon icon='tabler:arrow-right' />
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

const StyledIconWithBackgroundAndBorder = ({ icon }: { icon: string }) => {
  return (
    <Box display='flex' justifyContent='center' alignItems='center' p={4} borderRadius={2} bgcolor='#E8E8E8'>
      <IconifyIcon icon={icon} />
    </Box>
  )
}

const SectionsWithIconAndMappedItem = ({
  icon,
  itemsArray,
  title,
}: {
  icon: string
  itemsArray: string[]
  title: string
}) => {
  return (
    <Box display='flex' alignItems='center' gap={2}>
      <StyledIconWithBackgroundAndBorder icon={icon} />
      <Box display='flex' flexDirection='column' gap={1}>
        <Typography variant='h6'>{title}</Typography>
        <Box display='flex' flexWrap='wrap' gap={2}>
          {itemsArray?.map((item: string, index: number) => (
            <Box key={item} display='flex'>
              <Typography>{item}</Typography>
              {index < itemsArray.length - 1 && <Typography>,</Typography>}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default StartQuizModel

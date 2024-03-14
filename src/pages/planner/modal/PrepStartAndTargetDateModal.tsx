import { Box, Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { UseMutationResult } from 'react-query'
import CustomDatePicker from 'src/@core/styles/libs/react-datepicker/DatePicker'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig
type Props = {
  isOpen: boolean
  handleClose: () => void
  isTargetDate: boolean
  date: string
  updateTargetScoreAndDateMutation: UseMutationResult<
    any,
    any,
    {
      data: {
        examDate?: number
        prepDate?: number
        targetScore?: number
      }
      onSuccess?: (() => void) | undefined
      onError?: (() => void) | undefined
    },
    unknown
  >
}

type FormDataTypes = {
  date: Date
}

const PrepStartAndTargetDateModal = (props: Props) => {
  const { isOpen, handleClose, isTargetDate = false, date, updateTargetScoreAndDateMutation } = props

  const {
    control,
    getValues,
    formState: { errors },
  } = useForm<FormDataTypes>({
    defaultValues: {
      date: new Date(date),
    },
  })

  const handleDateChange = () => {
    const selectedDate = new Date(getValues('date')).getTime() / 1000
    let data = {}

    if (isTargetDate) {
      data = { examDate: selectedDate }
    } else {
      data = { prepDate: selectedDate }
    }

    updateTargetScoreAndDateMutation.mutate({
      data,
      onSuccess: () => {
        handleClose()
      },
    })
  }

  return (
    <Dialog
      fullWidth
      open={isOpen}
      onClose={handleClose}
      sx={{
        '& .MuiPaper-root': { width: '100%', maxWidth: 550, height: '100%', maxHeight: 500 },
        backdropFilter: 'blur(1px)',
        '& .MuiDialogContent-root': {
          padding: '0px !important',
        },
        borderRadius: 5,
      }}
    >
      <DialogContent
        sx={{
          marginX: 5,
          marginTop: 5,
        }}
      >
        <Controller
          name='date'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <CustomDatePicker
              label={isTargetDate ? 'Target Date' : 'Prep Start Date'}
              popperClassName='full-width'
              calendarClassName='calender-date-picker '
              wrapperClassName='full-width'
              disabled
              open
              error={Boolean(errors.date)}
              value={value}
              onChange={onChange}
            />
          )}
        />
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'end',
          borderTop: border,
          pt: 4,
          pb: 8,
        }}
      >
        <Box display='flex' gap={4} alignItems='center'>
          <Button onClick={handleDateChange} variant='contained' color='primary'>
            Change
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose}>
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default PrepStartAndTargetDateModal

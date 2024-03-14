import { Box } from '@mui/material'
import Typography from 'src/@core/components/common/Typography'

// ** Third Party Imports
import { Control, Controller, FieldErrors } from 'react-hook-form'
import CustomDatePicker from 'src/@core/styles/libs/react-datepicker/DatePicker'
import { FormDataTypes } from './AskQuestionModal'

const Slide2 = ({ control, errors }: { control: Control<FormDataTypes, any>; errors: FieldErrors<FormDataTypes> }) => {
  return (
    <>
      <Box bgcolor='#F6F6F7' padding={4}>
        <Typography variant='h5'>When do you plan to take ?</Typography>
      </Box>
      <Box display='flex' flexDirection='column' gap={4} padding={4}>
        <Typography variant='paragraphMedium'>
          It will help us prepare a study plan customized for you. You'll get the dates by which you need to complete
          each resource.
        </Typography>
        <Controller
          name='date'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <CustomDatePicker
              popperClassName='full-width'
              calendarClassName='calender-date-picker '
              wrapperClassName='full-width'
              error={Boolean(errors.date)}
              value={value}
              onChange={onChange}
            />
          )}
        />

        <Typography variant='paragraphMedium' padding={4} bgcolor={'#F6F6F7'}>
          Note: The tentative exam date should atleast be 30 days from the current date.
        </Typography>
      </Box>
    </>
  )
}

export default Slide2

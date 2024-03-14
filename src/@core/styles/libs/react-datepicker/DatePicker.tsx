// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomTextField from 'src/@core/components/mui/text-field'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

type Props = {
  value: Date
  onChange: (value: any) => void
  error: boolean
  label?: string
} & Omit<ReactDatePickerProps, 'value'>

const CustomDatePicker = (props: Props) => {
  const { error, onChange, value, label = '', ...reactDatePickerProps } = props
  return (
    <DatePickerWrapper>
      <DatePicker
        {...reactDatePickerProps}
        selected={value}
        popperPlacement={'bottom-start'}
        onChange={onChange}
        placeholderText='Click to select a date'
        customInput={
          <CustomTextField
            fullWidth
            label={label}
            error={error}
            {...(error && { helperText: 'This field is required' })}
          />
        }
      />
    </DatePickerWrapper>
  )
}

export default CustomDatePicker

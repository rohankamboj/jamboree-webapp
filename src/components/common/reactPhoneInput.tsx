import { Typography, useTheme } from '@mui/material'
import { FieldError, RefCallBack, UseFormSetValue } from 'react-hook-form'
import ReactPhoneInput, { type PhoneInputProps } from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
type IPhoneInputProps = {
  value: string
  ref: RefCallBack
  errors: FieldError | undefined
  onChange: (...event: any[]) => void
  setValue: UseFormSetValue<any>
  handleOnChangeCountryCode?: (val: string) => void
} & PhoneInputProps

// const StyledReactPhoneInput = styled(ReactPhoneInput)<PhoneInputProps>(() => ({
//   '@media only screen and (min-width: 900px)': {
//     '& .css-1wd110o-MuiGrid-root .react-tel-input .form-control': {
//       borderTopRightRadius: ' 0px !important',
//       borderBottomRightRadius: '0px !important',
//     },
//   },
// }))

const PhoneInput = (props: IPhoneInputProps) => {
  const theme = useTheme()
  const { errors, ref, value, onChange, handleOnChangeCountryCode, setValue, ...phoneInputProps } = props
  return (
    <>
      <ReactPhoneInput
        {...phoneInputProps}
        inputStyle={{
          display: 'flex',
          width: '100%',
          height: '38px',
          ...(Boolean(errors) && { border: `1px solid ${theme.palette.error.main}` }),
        }}
        value={value}
        inputProps={{
          ref,
          required: true,
          autoFocus: true,
        }}
        country={'in'}
        onChange={(...rest) => {
          // @ts-ignore
          handleOnChangeCountryCode?.(rest[1].dialCode)
          onChange(...rest)
        }}
      />
      {errors && (
        <Typography
          lineHeight={1.154}
          margin={theme.spacing(1, 0, 0)}
          fontSize={theme.typography.body2.fontSize}
          color={theme.palette.error.main}
        >
          This field is required{' '}
        </Typography>
      )}
    </>
  )
}

export default PhoneInput

import CustomTextField from 'src/@core/components/mui/text-field'

type Props = {
  value: string
  onChange: (val: string) => void
}

const QuestionWithDescriptionTextField = (props: Props) => {
  const { value, onChange } = props
  return (
    <CustomTextField
      fullWidth
      multiline
      minRows={14}
      value={value}
      placeholder='Write your answer here'
      onChange={e => onChange(e.target.value)}
    />
  )
}

export default QuestionWithDescriptionTextField

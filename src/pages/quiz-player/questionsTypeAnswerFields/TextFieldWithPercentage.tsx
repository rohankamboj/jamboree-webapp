import { Box, Typography } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import reactStringReplace from 'react-string-replace'
import MathJaxComponent from 'src/components/common/MathJaxComponent'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig
const neqQuestionRegex = /\<\&\&(\d)\>/g

const TextFieldWithPercentage = ({
  currentValue,
  questionText,
  setValue,
}: {
  currentValue: Array<string> | undefined
  questionText: string
  setValue: React.Dispatch<any>
}) => {
  let fieldIdx = -1

  const handleSetValue = (valueToSet: string, idx: number) => {
    setValue((prevValue: any) => {
      const updatedValue = [...(prevValue || [])]
      updatedValue[idx] = valueToSet
      return updatedValue
    })
  }
  const PercentageTextField = ({ fieldIdx }: { fieldIdx: number }) => (
    <Box display='flex' alignItems='center' height='38.5px'>
      <CustomTextField
        placeholder='Type value here'
        InputProps={{
          sx: {
            borderTopRightRadius: '0px!important',
            borderBottomRightRadius: '0px!important',
          },
          type: 'number',
        }}
        value={currentValue?.[fieldIdx]}
        onChange={e => handleSetValue(e.target.value, fieldIdx)}
      />
      <Box
        border={border}
        borderLeft='0px'
        display='flex'
        height='100%'
        alignItems='center'
        px={3}
        sx={{
          borderTopRightRadius: 6,
          borderBottomRightRadius: 6,
        }}
      >
        <Typography>%</Typography>
      </Box>
    </Box>
  )

  const neqQuestionText = reactStringReplace(questionText, neqQuestionRegex, (_: string) => {
    fieldIdx++
    return <PercentageTextField key={_ + 1} fieldIdx={fieldIdx} />
  })

  return neqQuestionText.map(el => (typeof el === 'string' ? <MathJaxComponent key={el} option={el} /> : el))
}

export default TextFieldWithPercentage

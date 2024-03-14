import { Box, Checkbox, Typography } from '@mui/material'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig
function MultiSelectCheckbox({
  options,
  selectedOptionNumbers,
  onChange,
}: {
  options: string[]
  selectedOptionNumbers: Array<number> | null | undefined
  onChange: (optionNumber: number, isChecked: boolean) => void
}) {
  return options?.map((option, idx) => (
    <Box paddingX={2} key={option} display='flex' alignItems='center' gap={2} border={border}>
      <Checkbox
        checked={
          selectedOptionNumbers && Array.isArray(selectedOptionNumbers)
            ? selectedOptionNumbers?.includes(idx + 1)
            : false
        }
        onChange={e => onChange(idx + 1, e.target.checked)}
        name={option}
      />
      <Typography>{option}</Typography>
    </Box>
  ))
}

export default MultiSelectCheckbox

import { Box, Checkbox, Typography } from '@mui/material'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig
type Props = {
  data: Array<{
    options: Array<string>
    title: string
  }>
}

const dummyData = [
  { options: ['Option 1', 'Option 2', 'Option 3'], title: 'Column 1' },
  { options: ['Option 1', 'Option 2', 'Option 3'], title: 'Column 1' },
]

const ColumnsOfChoices = (props: Props) => {
  const { data = dummyData } = props
  return (
    <Box display='flex' justifyContent='space-between' flexWrap='wrap' rowGap={4}>
      {data.map(item => (
        <Box border={border} borderRadius={1} width={'32%'}>
          <Typography padding={2}>{item.title}</Typography>
          {item.options.map(option => (
            <Box padding={2} key={option} display='flex' alignItems='center' gap={2} borderTop={border}>
              <Checkbox name={option} />
              <Typography>{option}</Typography>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}

export default ColumnsOfChoices

import { Box, Radio, Typography } from '@mui/material'
type Props = {
  options: Array<string>
}
const TextWithRadio = (props: Props) => {
  const { options } = props
  return (
    <>
      {options.map(option => (
        <Box key={option} display='flex' alignItems='center' gap={2}>
          <Radio name={option} />
          <Typography>{option}</Typography>
        </Box>
      ))}
    </>
  )
}

export default TextWithRadio

import { Box, Typography } from '@mui/material'
import { getAlphabetAtIndex } from 'src/utils'

const CustomQuizAnswerComparisonBox = ({
  isSelectedAnswerIsCorrect,
  correctAnswer,
  userSelectedOption,
}: {
  isSelectedAnswerIsCorrect: boolean
  correctAnswer: string
  userSelectedOption: string
}) => {
  return (
    <Box
      display='flex'
      gap={4}
      borderRadius={1}
      padding={4}
      bgcolor={isSelectedAnswerIsCorrect ? 'rgba(0,135,90,.12)' : '#fbdddd'}
    >
      <Typography
        variant='h6'
        color={theme => (isSelectedAnswerIsCorrect ? theme.palette.primary.main : theme.palette.error.main)}
      >
        Correct Answer: {getAlphabetAtIndex(Number(correctAnswer))}
      </Typography>
      <Typography
        variant='h6'
        color={theme => (isSelectedAnswerIsCorrect ? theme.palette.primary.main : theme.palette.error.main)}
      >
        Your Answer: {getAlphabetAtIndex(Number(userSelectedOption)) || 'NA'}
      </Typography>
    </Box>
  )
}

export default CustomQuizAnswerComparisonBox

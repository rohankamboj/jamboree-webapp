import { Box, BoxProps, Theme, styled, useMediaQuery } from '@mui/material'
import { MathJax } from 'better-react-mathjax'
import Typography from 'src/@core/components/common/Typography'
import CustomRadioBasic from 'src/@core/components/custom-radio/basic'
import IconifyIcon from 'src/@core/components/icon'
import MathJaxComponent from 'src/components/common/MathJaxComponent'
import themeConfig from 'src/configs/themeConfig'
import CustomQuizAnswerComparisonBox from 'src/pages/quiz/components/CustomQuizAnswerComparisonBox'
import { getAlphabetAtIndex } from 'src/utils'

const { border } = themeConfig

const StyledIconBox = styled(Box)<BoxProps>(() => ({
  backgroundColor: '#E6EAE7',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 6,
  borderRadius: '100%',
  border: '2px solid #A5A3AE',
}))

const QuestionWithOptions = ({
  correctAnswer,
  userSelectedOption,
  question,
}: {
  correctAnswer: string
  userSelectedOption: string
  question: {
    itemText: string
    itemOptions: string[] | null
    passage: string | null
    qType: string
    itemAnswer: string
    explanation: string
  }
}) => {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const isSelectedAnswerIsCorrect = correctAnswer == userSelectedOption

  const userSelectedOptionValue = question?.itemOptions?.[Number(userSelectedOption) - 1]

  return (
    <Box border={border} borderRadius={1} paddingX={2} paddingTop={2} overflow='scroll' height={isSm ? '50vh' : '70vh'}>
      <CustomQuizAnswerComparisonBox
        isSelectedAnswerIsCorrect={isSelectedAnswerIsCorrect}
        correctAnswer={correctAnswer}
        userSelectedOption={userSelectedOption}
      />
      <Box
        display='flex'
        width='100%'
        height='100%'
        sx={{ ...(isSm ? { flexDirection: 'column' } : { justifyContent: 'space-between' }) }}
      >
        <Box padding={4} sx={{ ...(isSm ? { width: '100%' } : { width: '50%' }) }}>
          <Box display='flex' alignItems='center' gap={2} marginBottom={3}>
            <StyledIconBox>
              <IconifyIcon icon='tabler:clipboard-list' color='#A5A3AE' />
            </StyledIconBox>
            <Typography variant='h5'>Question</Typography>
          </Box>
          <MathJax>
            <Typography variant='paragraphSmall' dangerouslySetInnerHTML={{ __html: question.itemText }}></Typography>
          </MathJax>
        </Box>
        <Box
          padding={4}
          sx={{
            ...(isSm
              ? { width: '100%', borderTop: '1px solid #A5A3AE' }
              : { width: '50%', borderLeft: '1px solid #A5A3AE' }),
          }}
        >
          <Box display='flex' alignItems='center' gap={2} marginBottom={3}>
            <StyledIconBox>
              <IconifyIcon icon='tabler:clipboard-check' color='#A5A3AE' />
            </StyledIconBox>
            <Typography variant='h5'>Answer</Typography>
          </Box>
          {/* @ts-ignore */}
          {/* <Typography variant='paragraphMedium'>
            The passage suggests that combing and carding differ from weaving in that combing and carding are
          </Typography> */}

          <Box width={isMd ? '100%' : '75%'} display='flex' flexDirection='column' gap={4} marginTop={4}>
            {question.itemOptions?.map((option, i) => {
              const qNo = i + 1
              return (
                <CustomRadioBasic
                  key={qNo}
                  // @ts-ignore
                  selected={userSelectedOptionValue}
                  isIncorrect={!isSelectedAnswerIsCorrect}
                  setSelected={() => {}}
                  data={{
                    title: <MathJaxComponent option={option} />,
                    value: option,
                  }}
                  name={option}
                  gridProps={{ xs: 12 }}
                  quizRadioLabel={getAlphabetAtIndex(qNo)}
                />
              )
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default QuestionWithOptions

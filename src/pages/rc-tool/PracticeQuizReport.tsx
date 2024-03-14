import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { useState } from 'react'

import { useNavigate } from 'react-router-dom'
import {
  ButtonBox,
  HeadingBox,
  ResponsiveContainer,
  StyledBox,
  StyledBox2,
  StyledButton,
} from 'src/@core/styles/QuizReportsStyles'
import { splitPassageIntoArrayAndRemoveP } from './RCTestPlayer'
import themeConfig from 'src/configs/themeConfig'

type IPracticQuizReport = { userSubmissionResult: UserQuizSubmissionResult }

const PracticeQuizReport = ({ userSubmissionResult }: IPracticQuizReport) => {
  const { border } = themeConfig
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState(0)
  const navigate = useNavigate()

  const handleOnClickContinue = (e: any) => {
    e.preventDefault()
    if (expandedQuestionIdx < userSubmissionResult.items.length - 1)
      setExpandedQuestionIdx(expandedQuestionIdx => expandedQuestionIdx + 1)
    else
      navigate('/app/rctool', {
        replace: true,
      })
  }

  return (
    <Box border={border} padding={5} borderRadius={1}>
      <HeadingBox>
        <Typography variant='h4'>Practice Quiz Report</Typography>
        <Typography variant='h6'>{`Score: 0/${userSubmissionResult.items.length}`}</Typography>
      </HeadingBox>
      {userSubmissionResult.items.map((item, idx) => (
        <Accordion
          style={{ boxShadow: 'none' }}
          expanded={expandedQuestionIdx === idx}
          key={'accordian' + idx}
          sx={{ boxShadow: 0, border }}
        >
          <AccordionSummary
            // sx={{ bgcolor: item.status === 'correct' ? '#DDF6E8' : '#FFF0E1' }}
            aria-controls={`notes-${idx}a-content`}
            id={`notes-${idx}a-header`}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant='h5' color={'primary'}>
                Question {idx + 1}/{userSubmissionResult.items.length}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ boxShadow: 0, my: 2 }}>
            <Box>
              <ResponsiveContainer display='flex' mt={4}>
                <StyledBox>
                  <QuizPassageResultViewer
                    // @ts-ignore
                    passage={item.passage}
                    userSelectedAnswersIdx={userSubmissionResult.optionSelected[idx]}
                    answerIdxString={item.itemAnswer}
                  />
                </StyledBox>
                <StyledBox2>
                  {/* @ts-ignore */}
                  <Typography variant='paragraphMain'>{item.itemText}</Typography>
                </StyledBox2>
              </ResponsiveContainer>
              <Box my={10}>
                <Typography variant='h5' mb={2}>
                  Explanation:
                </Typography>
                <Typography dangerouslySetInnerHTML={{ __html: item.explanation }} color='#041F48'></Typography>
              </Box>
              <ButtonBox>
                <StyledButton onClick={handleOnClickContinue} variant='contained' color='primary'>
                  Continue
                </StyledButton>
              </ButtonBox>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

export default PracticeQuizReport

type IPropsQuizPassageViewer = {
  passage: string
  answerIdxString: string
  userSelectedAnswersIdx: Array<string>
}

const QuizPassageResultViewer = ({ passage, answerIdxString, userSelectedAnswersIdx }: IPropsQuizPassageViewer) => {
  const answersArray: Array<string> = JSON.parse(answerIdxString)

  const passageToResult = splitPassageIntoArrayAndRemoveP(passage).map((word, idx) => (
    <Typography
      sx={{
        marginInline: 0.5,
        backgroundColor: userSelectedAnswersIdx.includes(idx.toString())
          ? answersArray.includes(idx.toString())
            ? // TODO: Colors from theme
              'lightgreen'
            : 'red'
          : undefined,
      }}
    >
      {word}
      <sup>{answersArray.includes(idx.toString()) ? idx + 1 : ''}</sup>
    </Typography>
  ))

  return (
    <Box display='flex' flexWrap='wrap'>
      {passageToResult}
    </Box>
  )
}

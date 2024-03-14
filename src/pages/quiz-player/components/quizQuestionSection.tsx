import { TabPanel } from '@mui/lab'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import React, { useMemo } from 'react'
import { safeJsonParse } from 'src/@core/utils/helpers'
import CustomizedTab from 'src/components/common/CustomizedTab'
import MathJaxComponent from 'src/components/common/MathJaxComponent'
import { splitPassageIntoArrayAndRemoveP } from 'src/pages/rc-tool/RCTestPlayer'
import { getQuestionTextByQType } from '../helpers'
import TextFieldWithPercentage from '../questionsTypeAnswerFields/TextFieldWithPercentage'
import { PrePostWithTable } from '../quizQuestionTemplate/prePostWithTable'
import { replaceImageIDOccurrenceWithBaseUrl } from 'src/utils'

type Props = {
  question: QuizQuestionType1 | QuizQuestionType | CustomQuizQuestionType
  setUserResponse: React.Dispatch<any>
  userResponse: any
  questionType: AllowedQuestionType
}

const QuizQuestionSection = ({ question, questionType, userResponse, setUserResponse }: Props) => {
  const renderCurrentQuestion = useMemo(() => {
    const questionText = getQuestionTextByQType(question)
    switch (questionType) {
      case 'neq':
        return (
          <TextFieldWithPercentage
            currentValue={userResponse}
            setValue={setUserResponse}
            questionText={
              typeof questionText === 'string' && questionText ? questionText ?? 'NA' : JSON.stringify(questionText)
            }
          />
        )
      case 'ir_2pa':
        return (
          <MathJaxComponent
            option={
              typeof questionText === 'string' && questionText ? questionText ?? 'NA' : JSON.stringify(questionText)
            }
          />
        )
      case 'ir_ta':
        if (!questionText || typeof questionText === 'string') {
          return 'String text'
        }

        return <PrePostWithTable question={questionText} />
      case 'ir_msr_mdcq':
      case 'ir_msr_mcq':
        console.log({ questionText })
        if (typeof questionText === 'string') {
          const tabsWithContent = safeJsonParse<Array<{ label: string; content: string }>>(questionText)
          if (!tabsWithContent) {
            return 'No tabs with content found.'
          }

          const tabs = tabsWithContent.map(({ label, content }) => ({ label, value: label, content }))

          return (
            <CustomizedTab tabs={tabs}>
              {tabs.map(item => (
                <TabPanel key={item.value} value={item.value} sx={{ pl: 0, pr: 0 }}>
                  <MathJaxComponent option={replaceImageIDOccurrenceWithBaseUrl(item.content)} />
                </TabPanel>
              ))}
            </CustomizedTab>
          )
        } else {
          return 'No tabs with content found.'
        }

      case 'rc_ts':
      case 'rc_tool': {
        if (typeof questionText !== 'string') {
          return JSON.stringify(questionText)
        }
        return (
          <RCToolQuestionSection
            passageText={questionText}
            userResponse={userResponse}
            setUserResponse={setUserResponse}
          />
        )
      }

      default:
        return (
          <MathJaxComponent
            option={
              typeof questionText === 'string' && questionText
                ? replaceImageIDOccurrenceWithBaseUrl(questionText) ?? 'NA'
                : JSON.stringify(questionText)
            }
          />
        )
    }
  }, [question, userResponse])

  return renderCurrentQuestion
}

export default QuizQuestionSection

export const RCToolQuestionSection = ({
  passageText,
  userResponse,
  setUserResponse,
}: {
  passageText: string | undefined
  userResponse: undefined | Array<string> | string
  setUserResponse: React.Dispatch<any>
}) => {
  const arrayPassage = useMemo(() => splitPassageIntoArrayAndRemoveP(passageText || ''), [passageText])

  const currentQuestionPassageElement = arrayPassage.map((word, idx) => {
    // const isElementSelected = false
    const isElementSelected = (userResponse || [])?.includes(idx.toString())

    const handleOnClickElement = () => {
      setUserResponse((currentUserResponse: any) => {
        if (Array.isArray(currentUserResponse)) {
          return currentUserResponse.includes(idx.toString())
            ? currentUserResponse.filter(item => item !== idx.toString())
            : [...currentUserResponse, idx.toString()]
        } else {
          return [idx.toString()]
        }
      })
    }

    return (
      <Typography
        key={word + idx}
        onClick={handleOnClickElement}
        sx={{
          background: isElementSelected ? 'black' : undefined,
          color: isElementSelected ? 'white' : undefined,
          marginInline: 0.5,
          cursor: 'pointer',
          '&:hover': { background: isElementSelected ? undefined : 'lightgreen', color: 'white' },
        }}
      >
        {word}
      </Typography>
    )
  })
  return (
    <Box display='flex' flexWrap='wrap'>
      {currentQuestionPassageElement}
    </Box>
  )
}

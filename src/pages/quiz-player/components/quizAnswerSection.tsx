import React, { useMemo } from 'react'
import { convertStringOptionsToArray, extractI2PQuestionTextAndOptions } from '../helpers'
import { getAlphabetAtIndex } from 'src/utils'
import MathJaxComponent from 'src/components/common/MathJaxComponent'
import CustomRadioBasic from 'src/@core/components/custom-radio/basic'
import { Box, Typography } from '@mui/material'
import { MathJax } from 'better-react-mathjax'
import MultiSelectCheckbox from '../questionsTypeAnswerFields/MultiSelectCheckbox'
import GenericTableWithCheckboxes from '../questionsTypeAnswerFields/GenericTableForCheckboxes'
import QuestionWithDescriptionTextField from '../questionsTypeAnswerFields/DescriptionTextField'
import { safeJsonParse } from 'src/@core/utils/helpers'
import { QuestionsWithDropdownTypeInputOptions } from '../questionsTypeAnswerFields/TextWithDropdown'
import FallbackSpinner from 'src/@core/components/common/Spinner'

type Props = {
  questionType: AllowedQuestionType
  questionOptions: string | string[]
  setUserResponse: React.Dispatch<any>
  // userResponse: string | number
  // userResponse: unknown
  userResponse: any
  question: QuizQuestionType | QuizQuestionType1 | CustomQuizQuestionType
  isIncorrect?: boolean
  isLoadingQuestion?: boolean
}

const QuizAnswerSection = ({
  questionType,
  question,
  questionOptions,
  setUserResponse,
  userResponse,
  isIncorrect,
  isLoadingQuestion,
}: Props) => {
  const quizAnswerSection = useMemo(() => {
    function getAnswerOptionsToRender() {
      switch (questionType) {
        case 'mcq':
        case 'rc_mcq':
        case 'sc_1b':
        case 'ir_msr_mcq':
          return convertStringOptionsToArray(questionOptions).map((option, idx) => {
            return (
              <CustomRadioBasic
                key={option}
                isIncorrect={isIncorrect}
                selected={userResponse == idx + 1 ? option : ''}
                setSelected={() => setUserResponse(idx + 1)}
                data={{
                  title: <MathJaxComponent option={option} />,
                  value: option,
                }}
                radioButtonCustomStyles={{ alignItems: 'center' }}
                name={option}
                gridProps={{ xs: 12 }}
                quizRadioLabel={getAlphabetAtIndex(idx + 1)}
              />
            )
          })

        // TODO: HANDLE CORRECT AND INCORRECT CHOICES FOR Other quiz types.
        case 'sc_2b':
        case 'sc_3b': {
          // Sample for sc_xx Qtype options => "[[\"tempting\",\"colluding\",\"implausible\"],[\"give credence to\",\"appropriately discredit\",\"uncritically laud\"]]")
          const parsedArrayOfArrayOptions: Array<Array<string>> = convertStringOptionsToArray(questionOptions) as any

          const handleSetResponseForSCQuestions = (
            valueToSet: number,
            optionsNumberIdx: number,
            userResponseSetter: React.Dispatch<any>,
          ) => {
            userResponseSetter((userResponse: Array<number>) => {
              const updatedUserResponse = [...(userResponse ?? [])]
              updatedUserResponse[optionsNumberIdx] = valueToSet
              return updatedUserResponse
            })
          }
          const getSelectedValueForSCQuestions = ({
            currentUserResponse,
            optionValue,
            parentOptionIdx,
            optionNumber,
          }: {
            currentUserResponse: Array<number> | undefined
            optionValue: string
            optionNumber: number
            parentOptionIdx: number
          }) => {
            if (currentUserResponse && currentUserResponse[parentOptionIdx] === optionNumber) {
              return optionValue
            }
            return ''
          }

          return parsedArrayOfArrayOptions.map((optionsItem, parsedItemIdx) => {
            return (
              <>
                <Typography variant='h5'>Blank ({parsedItemIdx + 1})</Typography>
                {optionsItem.map((option, idx) => (
                  <CustomRadioBasic
                    key={option}
                    selected={getSelectedValueForSCQuestions({
                      currentUserResponse: userResponse,
                      optionValue: option,
                      optionNumber: idx + 1,
                      parentOptionIdx: parsedItemIdx,
                    })}
                    setSelected={() => handleSetResponseForSCQuestions(idx + 1, parsedItemIdx, setUserResponse)}
                    data={{
                      title: <MathJaxComponent option={option} />,
                      value: option,
                    }}
                    radioButtonCustomStyles={{ alignItems: 'center' }}
                    name={option}
                    gridProps={{ xs: 12 }}
                    quizRadioLabel={getAlphabetAtIndex(idx + 1)}
                  />
                ))}
              </>
            )
          })
        }
        case 'rc_mmcq':
        case 'mmcq': {
          // isChecked: boolean
          const handleCheckboxChange = (opNum: number) => {
            setUserResponse((userResponse: any) => {
              if (!userResponse || !Array.isArray(userResponse)) return [opNum]
              if (userResponse.includes(opNum)) return userResponse.filter(op => op !== opNum)
              else return [...userResponse, opNum]
            })
          }
          return (
            <MathJax>
              <MultiSelectCheckbox
                selectedOptionNumbers={userResponse}
                onChange={handleCheckboxChange}
                options={convertStringOptionsToArray(questionOptions)}
              />
            </MathJax>
          )
        }

        case 'awa':
          return <QuestionWithDescriptionTextField value={userResponse} onChange={setUserResponse} />
        case 'neq':
          return <Typography>Enter your response in the input field(s).</Typography>

        case 'ir_ta':
        case 'ir_msr_mdcq':
        case 'ir_2pa': {
          const optionsToShow = convertStringOptionsToArray(questionOptions)
          const checkboxTitle = extractI2PQuestionTextAndOptions(question)

          return (
            <MathJax>
              <GenericTableWithCheckboxes
                recordResponseRowWise={['ir_ta'].includes(questionType)}
                // @ts-ignore
                onChange={setUserResponse}
                currentValue={userResponse}
                rows={optionsToShow}
                columns={
                  checkboxTitle?.label?.map((label, idx) => ({ id: idx + 1, label })) ?? [
                    { id: 1, label: 'NA' },
                    { id: 2, label: 'NA' },
                  ]
                }
                numberOfCheckBoxToRender={checkboxTitle?.label?.length || 0}
              />
            </MathJax>
          )
        }
        // Text with dropdown.
        case 'ir_gi':
          if (!('questionText' in question)) {
            alert('No question text was found for current question.' + JSON.stringify(question, null, 2))
            return
          }
          const optionsToShow: string[][] = convertStringOptionsToArray(questionOptions) as any
          const questionsPrePostData = safeJsonParse<Array<{ pre: string; post: string }>>(question.questionText) ?? []

          const questionWithPrePostAndOptions = questionsPrePostData?.map((prePostData, idx) => ({
            ...prePostData,
            options: optionsToShow[idx],
          }))

          return (
            <QuestionsWithDropdownTypeInputOptions
              currentValue={userResponse}
              setValue={setUserResponse}
              questionWithPrePostAndOptions={questionWithPrePostAndOptions}
            />
          )
        case 'rc_tool':
          if ('itemText' in question)
            return (
              <Box>
                <Typography variant='h6'>{question.itemText}</Typography>
              </Box>
            )
          return 'itemTextField missing' + '\n' + JSON.stringify(question, null, 2)
        default:
          return (
            <p style={{ whiteSpace: 'pre', overflow: 'hidden' }}>
              {'Unsupported Question Type ' + questionType + '\n' + JSON.stringify(question, null, 2)}
            </p>
          )
      }
    }

    function getAnswerHelpText() {
      switch (questionType) {
        case 'awa':
          return 'Enter your answer here'

        case 'rc_mcq':
        case 'rc_mmcq':
        case 'ir_msr_mcq':
          return 'questionText' in question ? (
            <Typography dangerouslySetInnerHTML={{ __html: question?.questionText || '' }} color='#041F48' />
          ) : (
            <Typography color='red'>{`questionText not found in question object. ${JSON.stringify(
              question,
              null,
              2,
            )}`}</Typography>
          )
        case 'ir_msr_mdcq':
        case 'ir_ta': {
          return <MathJaxComponent option={extractI2PQuestionTextAndOptions(question)?.pre || 'NA'} />
        }
        default:
          return ''
      }
    }

    return (
      <>
        {getAnswerHelpText()}
        {getAnswerOptionsToRender()}
      </>
    )
  }, [questionOptions, questionType, userResponse, question])

  if (isLoadingQuestion) {
    return (
      <Box
        sx={{
          height: 500,
          width: 600,
        }}
        position='relative'
      >
        <FallbackSpinner height='100%' />
      </Box>
    )
  }

  return quizAnswerSection
}

export default QuizAnswerSection

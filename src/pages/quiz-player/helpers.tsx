import { replaceImageIDOccurrenceWithBaseUrl } from 'src/utils'

export function extractI2PQuestionTextAndOptions(
  question: CustomQuizQuestionType | QuizQuestionType | QuizQuestionType1,
) {
  let questionTextWithLabels: { pre?: string; label?: string[] } | null | undefined = {
    pre:
      'questionText' in question
        ? 'Default Question Text \n\n\n' + question.questionText
        : 'No field with questionText found in question' + JSON.stringify(question, null, 2),
  }
  try {
    // @ts-ignore
    questionTextWithLabels = JSON.parse(question.questionText)
  } catch (err) {
    questionTextWithLabels = null
  }

  return questionTextWithLabels
}
export function extractQuestionPrePostAndOptions(
  question: CustomQuizQuestionType | QuizQuestionType | QuizQuestionType1,
) {
  let questionData: {
    pre: string
    post?: string
    sort?: string[]
    table?: {
      head: {
        span: number
        label: string
      }[][]
      body: string[][]
    }
  } | null = {
    pre:
      'passage' in question
        ? 'Default Question Text \n\n\n' + question.passage
        : 'No field with passage found in question' + JSON.stringify(question, null, 2),
  }
  try {
    // @ts-ignore
    questionData = JSON.parse(replaceImageIDOccurrenceWithBaseUrl(question.passage))
  } catch (err) {
    questionData = null
  }

  return questionData
}

export function getQuestionIdBasedOnType(
  currentQuestion: QuizQuestionType | QuizQuestionType1 | KakshaQuestionBankQuestionMeta | CustomQuizQuestionType,
) {
  if (!currentQuestion) return null
  if ('questionid' in currentQuestion) return currentQuestion.questionid
  return Number('testQuestionID' in currentQuestion ? currentQuestion.testQuestionID : currentQuestion.id)
}

export const convertStringOptionsToArray = (options: string | string[]) =>
  typeof options === 'string' ? (JSON.parse(options) as Array<string>) : options

export function getQuestionTextByQType(currentQuestion: QuizQuestionType | QuizQuestionType1 | CustomQuizQuestionType) {
  if ('itemText' in currentQuestion) {
    if (['rc_tool', 'rc_ts'].includes(currentQuestion?.qType)) return currentQuestion.passage || ''
    return currentQuestion.itemText
  }

  if (['rc_mmcq', 'rc_mcq', 'ir_msr_mdcq', 'ir_gi', 'ir_msr_mcq'].includes(currentQuestion.questionType))
    return currentQuestion.passage

  if (['ir_2pa'].includes(currentQuestion.questionType)) return extractI2PQuestionTextAndOptions(currentQuestion)?.pre

  if (['ir_ta'].includes(currentQuestion.questionType)) return extractQuestionPrePostAndOptions(currentQuestion)

  return currentQuestion.questionText
}

export type extractQuestionPrePostAndOptionsType = ReturnType<typeof extractQuestionPrePostAndOptions>

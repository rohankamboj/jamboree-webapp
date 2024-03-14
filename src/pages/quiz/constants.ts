import { convertToLabelValueObject } from '../custom-quiz-builder/helpers'
import AccuracyImprover from '/images/card/accuracy-improver.png'
import ConceptBuilder from '/images/card/concept-builder.png'
import TimeImprover from '/images/card/time-improver.png'

export const PtIdWithLabel: { [key: number]: string } = {
  316: 'RC',
  325: 'CR',
  319: 'SC',
  340: 'PS',
  351: 'DS',
  601: 'MSR',
  602: '2PA',
  603: 'GT',
}

export const quizSubjectAndSectionMap = [
  {
    id: 'rc',
    itemName: 'Reading Comprehension',
    category: 'Verbal',
    sectionid: 4,
    ptid: 316,
    quizTime: 'untimed',
    quizMode: 'Practice',
  },
  {
    id: 'cr',
    itemName: 'Critical Reasoning',
    category: 'Verbal',
    sectionid: 4,
    ptid: 325,
  },
  {
    id: 'ps',
    itemName: 'Problem Solving',
    category: 'Quant',
    sectionid: 3,
    ptid: 340,
  },
  {
    id: 'ds',
    itemName: 'Data Sufficiency',
    category: 'Data Insights',
    sectionid: 5,
    ptid: 351,
  },
  {
    id: 'msr',
    itemName: 'Multi Source Reasoning',
    category: 'Data Insights',
    sectionid: 5,
    ptid: 601,
  },
  {
    id: '2pa',
    itemName: 'Two Part Analysis',
    category: 'Data Insights',
    sectionid: 5,
    ptid: 602,
  },
  {
    id: 'gt',
    itemName: 'Graphs and Tables',
    category: 'Data Insights',
    sectionid: 5,
    ptid: 603,
  },
] as const

export type quizSubjectAndSectionMap = (typeof quizSubjectAndSectionMap)[number]

type QuizCategoryId = quizSubjectAndSectionMap['id']
type QuizCategoryPtid = quizSubjectAndSectionMap['ptid']

type PtIdToSubjectShortCodeType = {
  [K in QuizCategoryPtid]: QuizCategoryId
}

export const sectionPtIdToSubjectShortCode: PtIdToSubjectShortCodeType = quizSubjectAndSectionMap.reduce(
  (acc, item) => {
    acc[item.ptid] = item.id
    return acc
  },
  {} as PtIdToSubjectShortCodeType,
)

export const quizzesForYouCategories = [
  {
    quizName: 'Reading comprehension',
    quizID: 'master_topic',
    quizSubject: 'Verbal',
    quizMode: 'Practice',
    quizTime: 'untimed',
    sectionid: 4,
    ptid: 316,
  },
  {
    quizName: 'Critical Reasoning',
    quizID: 'master_topic',
    quizSubject: 'Verbal',
    quizMode: 'Practice',
    quizTime: 'untimed',
    sectionid: 4,
    ptid: 325,
  },
  {
    quizName: 'Problem Solving',
    quizID: 'master_topic',
    quizSubject: 'Quant',
    quizMode: 'Practice',
    quizTime: 'untimed',
    sectionid: 3,
    ptid: 340,
  },
  {
    quizName: 'Data Sufficiency',
    quizID: 'master_topic',
    quizSubject: 'Quant',
    quizMode: 'Practice',
    quizTime: 'untimed',
    sectionid: 3,
    ptid: 351,
  },
] as const

export type QuizzesForYouType = (typeof quizzesForYouCategories)[number]

export type PtIDType = (typeof quizSubjectAndSectionMap)[number]['ptid']

export const durationOptions = [
  'Untimed! I am Learning',
  'Timed! Practice Mode',
  'Ninja Challenging the odds',
  'Custom Time (Counter)',
] as const

export const quizDurationOptions = durationOptions.map(convertToLabelValueObject)

const questionAttemptOptions = ['Attempted', 'Unattempted', 'Mixed', 'Incorrect', 'Unanswered'] as const

export const questionAttemptType = questionAttemptOptions.map(convertToLabelValueObject)

export const rcOptions = [
  { label: 'One', value: 1 },
  { label: 'Two', value: 2 },
  { label: 'Three', value: 3 },
  { label: 'Four', value: 4 },
  { label: 'Five', value: 5 },
]

export const quizDifficultyOptions = ['easy', 'medium', 'hard'] as const
export type allowedQuestionAttemptsType = (typeof questionAttemptOptions)[number]

export const personalizedQuizzes = [
  {
    quizName: 'Accuracy Improver',
    quizID: 'improve_accuracy',
    qizDetail:
      'Tests your grasp of key concepts with 5-12 medium or time-easy questions to help sharpen your skills without time pressure.',
    quizTime: 'untimed',
    image: AccuracyImprover,
  },
  {
    quizName: 'Time Improving',
    quizID: 'improve_time',
    qizDetail:
      'Builds speed with 5-12 easy but time-challenging questions to help you get faster at answering without tricky concepts.',
    quizTime: 'timed',
    image: TimeImprover,
  },
  {
    quizName: 'Concept Improving',
    quizID: 'concept_building',
    qizDetail: 'Expand your knowledge by targeting weak areas to strengthen your foundations for better retention.',
    quizTime: 'untimed',
    image: ConceptBuilder,
  },
] as const

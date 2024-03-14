import { quizSubjectAndSectionMap } from '../quiz/constants'

export const extractPtIdsFromCategoriesAndSectionsMeta = (selections: quizSubjectAndSectionMap[]) => {
  return selections.reduce((acc, curr) => {
    acc.push(curr.ptid)
    return acc
  }, [] as Array<number>)
}

export const extractQuestionIdsBySectionsFromSectionsAndCategoriesMeta = (
  sections: KakshaQuizWithSectionsAndQuestionsMetaFromQuestionBank,
) =>
  sections.reduce(
    (acc, curr) => {
      acc[curr.section] = curr.questions.map(question => question.questionid)
      return acc
    },
    {} as Record<string, number[]>,
  )

export function generateQuizName(quizName: string): string {
  // custome quiz [date] time[hr min]
  // const key: string = this.customQuizClicked.quizName ? this.customQuizClicked.quizName : 'Personal Quiz';
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const now: Date = new Date()
  const name: string =
    quizName +
    ' ' +
    now.getDate() +
    ' ' +
    monthNames[now.getMonth()] +
    ' ' +
    now.getFullYear() +
    ' ' +
    now.getHours() +
    ':' +
    now.getMinutes()
  return name
}

export const convertToLabelValueObject = <T>(val: T): { label: T; value: T } => ({ label: val, value: val })

export const getSectionsIdsForSectionNames = (sectionNames: string[]) => {
  const transformedToLowerCase = sectionNames.map(sectionName => sectionName.toLowerCase())

  return quizSubjectAndSectionMap
    .filter(({ category }) => transformedToLowerCase.includes(category.toLowerCase()))
    .map(({ sectionid }) => sectionid)
}

export const hasRCIdExistsInSelectedSubjectsTopics = (selectedTopics: number[]): boolean => {
  return selectedTopics.includes(158)
}

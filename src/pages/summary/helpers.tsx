export function transformCustomTestSummaryDataIntoNormalTestSummary(
  testSummary: TestSummaryAPIResponse | CustomTestSummaryAPIResponse,
) {
  return 'records' in testSummary
    ? testSummary?.records
    : // Add section to each section questions and remove ts
      Object.entries(testSummary?.summary).map(([section, sectionQuestions]) => {
        return {
          section,
          questions: (Array.from(sectionQuestions || []) as CustomTestSummaryQuestionResponseSummary[])?.map(
            question => ({
              ...question,
              section: section.toLowerCase() as keyof customtestSummarySummary,
            }),
          ),
        }
      })
}

export const filterTestDetailSection = (section: { section: string }) => section.section !== 'testDetail'

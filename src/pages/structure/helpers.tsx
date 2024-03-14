import { TaskStructureWithDetail, TestAndPracticeAPIResponse } from '.'

export const getInAppLinkForTask = (
  task: Pick<TaskStructureWithDetail['data'][number]['tasks'][number], 'type'> & { taskID: string | number },
) => {
  if (task.type === 'test') {
    return `/app/test/view/${task.taskID}`
  }
  if (task.type === 'practice') {
    return `/app/practice/view/${task.taskID}`
  }
  return `/app/learn/view/${task.taskID}`
}

export function getPastAttemptsTestAttemptsForTaskId(
  taskId: string,
  testResultsApiResponse: TestAndPracticeAPIResponse,
) {
  if (testResultsApiResponse) {
    const { testID } = testResultsApiResponse.tests.find(({ taskID }) => taskID === taskId) || {}
    if (testID) {
      return testResultsApiResponse.records.filter(record => record.testID === testID)
    }
  }
  return []
}

export function getNavigationLinkForSummaryPastAttempt(attemptId: string, type: 'practice' | 'test') {
  return `/app/${type}/summary/${attemptId}`
}

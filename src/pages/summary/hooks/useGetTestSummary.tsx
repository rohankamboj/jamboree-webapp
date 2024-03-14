import { useQuery } from 'react-query'
import { showAPIErrorAsToast } from 'src/@core/utils/ApiHelpers'
import { get } from 'src/@core/utils/request'
import { getCustomTestScoreForAttempt, getCustomTestSummaryForId, getTestSummaryForId } from 'src/apis/user'

function useGetTestSummary(attemptId: string | null) {
  //   const { kakshaUserId } = useUserContext()

  //   const attemptId =

  const isCustomTest = attemptId?.includes('_c')
  const isPersonalizedTest = attemptId?.includes('_p')
  const isCustomTestQueryEnabled = (isCustomTest || isPersonalizedTest) ?? null

  const summaryType = isCustomTest ? 'customized' : isPersonalizedTest ? 'personalised' : ('flt' as const)

  const getTestSummaryQuery = useQuery({
    queryKey: ['test_summary', attemptId],
    queryFn: (): Promise<TestSummaryAPIResponse> => get(getTestSummaryForId(attemptId as string)),
    onError: showAPIErrorAsToast,
    enabled: !!attemptId && !isCustomTestQueryEnabled,
  })
  const getCustomTestSummaryQuery = useQuery({
    queryKey: ['custom_test_summary', attemptId],
    queryFn: (): Promise<CustomTestSummaryAPIResponse> => get(getCustomTestSummaryForId(attemptId as string)),
    onError: showAPIErrorAsToast,
    enabled: !!attemptId && !!isCustomTestQueryEnabled,
  })

  const isCustomTestStudentScoreQueryEnabled =
    attemptId && getTestSummaryQuery.data?.test?.type?.toLowerCase() === 'flt'
  const getCustomTestStudentScoreQuery = useQuery({
    queryKey: ['custom_test_score', attemptId],
    queryFn: (): Promise<CustomTestScoreAPIResponse> => get(getCustomTestScoreForAttempt(attemptId as string)),
    onError: showAPIErrorAsToast,
    enabled: !!isCustomTestStudentScoreQueryEnabled,
  })

  return {
    getTestSummaryQuery,
    getCustomTestSummaryQuery,
    getCustomTestStudentScoreQuery,
    isCustomTestStudentScoreQueryEnabled,
    summaryType,
    isCustomTest,
    isPersonalizedTest,
  }
}

export default useGetTestSummary

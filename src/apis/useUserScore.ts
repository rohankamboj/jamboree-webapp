import { useQuery } from 'react-query'
import { getUserBatchAndFltScore, getUserTargetScore } from './user'
import { get } from 'src/@core/utils/request'
import { useUserContext } from 'src/@core/context/UserContext'

const useUserScores = () => {
  const { userActiveProduct } = useUserContext()

  const getUserTargetScoreQuery = useQuery({
    queryKey: ['userTargetScore'],
    queryFn: () => get(getUserTargetScore) as Promise<{ targetScore: number }>,
    enabled: !!userActiveProduct,
  })

  const getUserBatchAndFltScoreQuery = useQuery({
    queryKey: ['userBatchAndFltScore'],
    queryFn: () =>
      get(getUserBatchAndFltScore) as Promise<{
        batch: Array<any>
        fltyscrore: {
          avgscore: number
          lasttest: {
            score: string
            testName: string
            testType: string
          }
        }
      }>,
    enabled: !!userActiveProduct,
  })

  return {
    getUserTargetScoreQuery,
    getUserBatchAndFltScoreQuery,
  }
}

export default useUserScores

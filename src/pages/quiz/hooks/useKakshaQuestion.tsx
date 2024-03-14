import { useMutation, useQuery } from 'react-query'
import { useUserContext } from 'src/@core/context/UserContext'
import { showAPIErrorAsToast } from 'src/@core/utils/ApiHelpers'
import { get, post } from 'src/@core/utils/request'
import { KAKSHA_QUESTION_BANK, GET_PERSONALIZED_QUESTION_BANK } from 'src/apis/user'

type CreatePersonalizedQuizMutationVariables = {
  handleSuccess?: (data: KakshaQuizWithSectionsAndQuestionsMetaFromQuestionBank) => void
  data: CreatePersonalizedQuizRequest
}

export type KakshaQuestionBankMutationTypes = ReturnType<typeof useKakshaQuestionBank>

export function useKakshaQuestionBank() {
  const { kakshaUserId } = useUserContext()

  const getKakshaQuestionBankQuery = useQuery({
    queryKey: ['kaksha_question_bank', kakshaUserId],
    queryFn: (): Promise<Array<KakshaQuestionBankQuestionMeta>> =>
      get(KAKSHA_QUESTION_BANK, {
        queryParams: {
          sid: (kakshaUserId as number)?.toString(),
        },
      }),
    onError: showAPIErrorAsToast,
    enabled: !!kakshaUserId,
  })
  const generateQuizWithSectionsFromKakshaQuestionBankMutation = useMutation({
    mutationFn: async (variables: {
      data: GetKakshaQuestionsFromQBWithSectionsRequest
      onSuccess?: (data: KakshaQuizWithSectionsAndQuestionsMetaFromQuestionBank) => void
    }) => post(KAKSHA_QUESTION_BANK, variables.data) as Promise<KakshaQuizWithSectionsAndQuestionsMetaFromQuestionBank>,
    onSuccess: async (data, variables) => {
      variables.onSuccess?.(data)
    },
  })

  // const createKakshaCustomQuizAndGetSectionsMutation = ({
  //   onSuccess,
  // }: {
  //   onSuccess?: (data: KakshaQuizWithSectionsAndQuestionsMetaFromQuestionBank) => void
  //   onError?: any
  // }) =>
  //   useMutation({
  //     onSuccess,
  //     mutationFn: async (_data: CreateKakshaCustomQuiz) => {
  //       // TODO: Remove this mock data
  //       const data = {
  //         sid: 56090,
  //         quizname: 'Custom Quiz 12 January 2024 2:28k',
  //         sectionids: [4],
  //         ptids: [316, 325, 319],
  //         difficulty: ['medium', 'hard'],
  //         topicids: [156],
  //         is_attempted: 1,
  //         is_correct: 1,
  //         question_count: 10,
  //         quiztime: 17,
  //         quizmode: 'Practice',
  //       }
  //       return post(GET_KAKSHA_QUESTION_BANK, data) as Promise<KakshaQuizWithSectionsAndQuestionsMetaFromQuestionBank>
  //     },
  //     onError: showAPIErrorAsToast,
  //   })
  const createPersonalizedKakshaQuizAndGetSectionsMutation = useMutation({
    onSuccess: async (data, variables) => {
      variables.handleSuccess?.(data)
    },
    mutationFn: async (variables: CreatePersonalizedQuizMutationVariables) => {
      return post(
        GET_PERSONALIZED_QUESTION_BANK,
        variables.data,
      ) as Promise<KakshaQuizWithSectionsAndQuestionsMetaFromQuestionBank>
    },
  })

  return {
    getKakshaQuestionBankQuery,
    // generateKakshaQuestionBankMutation,
    createPersonalizedKakshaQuizAndGetSectionsMutation,
    generateQuizWithSectionsFromKakshaQuestionBankMutation,
    // createKakshaCustomQuizAndGetSectionsMutation,
  }
}

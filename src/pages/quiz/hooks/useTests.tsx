import { useMutation, useQuery } from 'react-query'
import { showAPIErrorAsToast } from 'src/@core/utils/ApiHelpers'
import { get, patch, post, put } from 'src/@core/utils/request'
import {
  GET_CUSTOM_TEST_PERSONALIZED,
  GET_TESTS,
  QUIZ_SUMMARY,
  customTestAPI,
  getCustomQuizQuestionWithId,
} from 'src/apis/user'

type GenerateAttemptIdForPersonalisedQuizMutationVariables = {
  handleSuccess?: (data: CreateCustomQuizAndGetAttemptIdResponse) => void
  data: CreatePersonalizedQuizAndGetAttemptIdRequest
}
type GenerateAttemptIdForCustomQuizMutationVariables = {
  handleSuccess?: (data: CreateCustomQuizAndGetAttemptIdResponse) => void
  data: CreatePersonalizedQuizAndGetAttemptIdRequest
}

export default function useTests() {
  const getCustomQuizPastAttemptsQuery = useQuery({
    queryKey: ['user_custom_test_past_attempts'],
    queryFn: (): Promise<GetCustomTestPastAttemptsAPIResponse> => get(customTestAPI),
    onError: showAPIErrorAsToast,
    refetchOnMount: 'always',
  })

  const getQuizQuestionWithQuestionIdQuery = (questionId?: string) =>
    useQuery({
      queryKey: ['quizQuestionDetails', questionId],
      queryFn: async () =>
        get(getCustomQuizQuestionWithId(questionId as string)) as Promise<{ data: GetCustomQuizQuestionAPIResponse }>,
      onError: showAPIErrorAsToast,
      enabled: !!questionId,
      staleTime: 60 * 1000,
    })

  const getPersonalizedTestPastAttemptsQuery = useQuery({
    queryKey: ['custom_test_past_attempts'],
    queryFn: (): Promise<GetCustomTestPastAttemptsAPIResponse> => get(GET_CUSTOM_TEST_PERSONALIZED),
    onError: showAPIErrorAsToast,
  })

  const submitQuizMutation = useMutation({
    onSuccess: async (data, variables) => {
      variables.onSuccess?.(data)
    },
    mutationFn: async (variables: {
      data: LearnViewQuizSubmission
      onError?: () => any
      onSuccess?: (data: UserQuizSubmissionResult) => any
    }) => {
      console.log('Api callled', variables.data)
      return put(QUIZ_SUMMARY, variables.data) as Promise<UserQuizSubmissionResult>
    },

    // useMutation({
    //   onSuccess: async (data, variables) => {
    //     variables.onSuccess?.(data)
    //   },
    //   mutationFn: async (_data: LearnViewQuizSubmission) => {
    //     console.log('Api callled', _data)
    //     return put(QUIZ_SUMMARY, _data) as Promise<UserQuizSubmissionResult>
    //   },
    //   onError: (...args) => {
    //     showAPIErrorAsToast(args)
    //     onError(args)
    //   },
  })
  const submitTestPlayerQuiz = ({
    onSuccess,
    onError,
  }: {
    onSuccess: (data: { message: string }) => void
    onError: any
  }) =>
    useMutation({
      onSuccess: onSuccess,
      mutationFn: async (_data: TestPlayerQuizSubmission) => put(GET_TESTS, _data) as Promise<{ message: string }>,
      onError: onError,
    })
  const updateTestPlayerQuiz = ({
    onSuccess,
    onError,
  }: {
    onSuccess: (data: { message?: string; attemptID?: string }) => void
    onError: any
  }) =>
    useMutation({
      onSuccess: onSuccess,
      mutationFn: async (_data: TestPlayerQuizSubmission) => patch(GET_TESTS, _data) as Promise<{ message: string }>,
      onError: (...args) => {
        showAPIErrorAsToast(args)
        onError(args)
      },
    })
  const submitCustomQuizMutation = ({
    onSuccess,
    onError,
  }: Partial<{
    onSuccess: (data: void, variables: TestPlayerQuizSubmission, context: unknown) => void | Promise<unknown>
    onError: any
  }>) =>
    useMutation({
      onSuccess: onSuccess,
      mutationFn: async (_data: TestPlayerQuizSubmission) => patch(customTestAPI, _data) as Promise<void>,
      onError: (...args) => {
        showAPIErrorAsToast(args)
        onError(args)
      },
    })
  const createPersonalizedQuizMutationAndGetAttemptId = useMutation({
    onSuccess: async (data, variables) => {
      variables.handleSuccess?.(data)
    },
    mutationFn: async (variables: GenerateAttemptIdForPersonalisedQuizMutationVariables) => {
      return post(GET_CUSTOM_TEST_PERSONALIZED, variables.data) as Promise<CreateCustomQuizAndGetAttemptIdResponse>
    },
  })

  const generateAttemptIdForCustomQuizMutation = useMutation({
    onSuccess: async (data, variables) => {
      variables.handleSuccess?.(data)
    },
    mutationFn: async (variables: GenerateAttemptIdForCustomQuizMutationVariables) => {
      return post(customTestAPI, variables.data) as Promise<CreateCustomQuizAndGetAttemptIdResponse>
    },
  })

  return {
    getCustomQuizPastAttemptsQuery,
    getPersonalizedTestPastAttemptsQuery,
    getQuizQuestionWithQuestionIdQuery,
    updateTestPlayerQuiz,
    submitTestPlayerQuiz,
    submitQuizMutation,
    submitCustomQuizMutation,
    createPersonalizedQuizMutationAndGetAttemptId,
    generateAttemptIdForCustomQuizMutation,
  }
}

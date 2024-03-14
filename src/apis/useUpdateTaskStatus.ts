import { useMutation, useQueryClient } from 'react-query'
import { patch } from 'src/@core/utils/request'
import { UPDATE_TASK } from './user'
import { showAPIErrorAsToast } from 'src/@core/utils/ApiHelpers'

function useUpdateTaskStatus() {
  const queryClient = useQueryClient()

  const markTaskAsStarted = useMutation({
    mutationFn: ({ taskID }: { taskID: string }) =>
      patch(UPDATE_TASK, {
        taskID,
        status: 0,
      }),
    onError: showAPIErrorAsToast,
    onSuccess: () => {
      queryClient.invalidateQueries('userTasksWithGroupAndSections')
    },
  })

  const markTaskAsEnded = useMutation({
    mutationFn: ({ taskID }: { taskID: string }) =>
      patch(UPDATE_TASK, {
        taskID,
        status: 1,
      }),
    onError: showAPIErrorAsToast,
    onSuccess: () => {
      queryClient.invalidateQueries('userTasksWithGroupAndSections')
    },
  })

  return { markTaskAsStarted, markTaskAsEnded }
}

export default useUpdateTaskStatus

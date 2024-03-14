import { Box, Button, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import Toast, { LoaderIcon } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import CustomTextField from 'src/@core/components/mui/text-field'

import { useState } from 'react'
import { put } from 'src/@core/utils/request'
import { GET_USER_AWA } from 'src/apis/user'
import ConfirmModel from 'src/components/modal/Confirm'
import { getErrorMessageFromType } from 'src/utils'
import { userAWACountResponse } from 'src/apis/type'
import themeConfig from 'src/configs/themeConfig'

const { border } = themeConfig

type CreateAWAReview = {
  awaPrompt: string
  userResponse: string
}

const CreateAWA = ({ userAWACountQuery }: { userAWACountQuery: userAWACountResponse }) => {
  const queryClient = useQueryClient()

  const [showSuccessFullSubmissionModal, setShowSuccessFullSubmissionModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
    getValues,
  } = useForm<CreateAWAReview>({
    defaultValues: {
      awaPrompt: '',
      userResponse: '',
    },
  })

  const createAWAReview = useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries('userAWACount')
      queryClient.invalidateQueries('getUserAWA')
      setShowConfirmModal(false)
      setShowSuccessFullSubmissionModal(true)
    },
    mutationFn: (variables: CreateAWAReview) =>
      put(GET_USER_AWA, {
        awaPrompt: variables.awaPrompt,
        userResponse: variables.userResponse,
      }),

    onError: (error: any) => {
      Toast.error(error.errorMessage)
    },
  })

  const handleFormSubmit = () => {
    setShowConfirmModal(true)
  }

  const handleSubmissionAWAForm = () => {
    const { awaPrompt, userResponse } = getValues()
    createAWAReview.mutate({ awaPrompt, userResponse })
  }

  return (
    <>
      {/* Show Confirm Model */}
      <ConfirmModel
        open={showConfirmModal}
        setOpen={() => setShowConfirmModal(false)}
        description='Are you sure you want to send this review to the student? You cannot change your review once sent.'
        title='Confirm your review is good to go'
        SecondaryButton={
          <Button variant='outlined' color='secondary' onClick={() => setShowConfirmModal(false)}>
            Go back to edit
          </Button>
        }
        PrimaryButton={
          createAWAReview.isLoading ? (
            <Button variant='contained' color='primary' sx={{ minWidth: '100px', padding: '13px' }}>
              <LoaderIcon />
            </Button>
          ) : (
            <Button variant='contained' color='primary' onClick={handleSubmissionAWAForm}>
              Yes Confirm
            </Button>
          )
        }
      />

      {/* Show Successful submission model */}
      <ConfirmModel
        open={showSuccessFullSubmissionModal}
        setOpen={() => setShowSuccessFullSubmissionModal(false)}
        description={`You have ${userAWACountQuery.totalCount} AWA reviews left out of ${
          userAWACountQuery.totalusedCount + 1
        }.`}
        title='Your response has been submitted for faculty review. You will receive your review within 3 business days.'
        SecondaryButton={
          <Button variant='outlined' color='secondary' onClick={() => setShowSuccessFullSubmissionModal(false)}>
            Go back to edit
          </Button>
        }
        PrimaryButton={
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              setShowSuccessFullSubmissionModal(false)
            }}
          >
            Yes Confirm
          </Button>
        }
      />

      {/* Component jsx */}
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 0, border, borderRadius: 1 }}>
            <CardHeader
              title='Contact Admin'
              subheader='Reach our admin department to address your queries and receive timely support.'
            />
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 4, pt: 0 }}>
                <Grid item xs={12}>
                  <Controller
                    name='awaPrompt'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label='AWA Prompt'
                        value={value}
                        onChange={onChange}
                        placeholder='Write something here'
                        error={Boolean(errors.awaPrompt)}
                        {...(errors.awaPrompt && { helperText: getErrorMessageFromType(errors.awaPrompt.type) })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name='userResponse'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        multiline
                        minRows={8}
                        label='AWA Prompt'
                        value={value}
                        onChange={onChange}
                        placeholder='Write something here'
                        error={Boolean(errors.userResponse)}
                        {...(errors.userResponse && { helperText: getErrorMessageFromType(errors.userResponse.type) })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='h6'>Please Note</Typography>
                  <Box component='ul' sx={{ pl: 6, mb: 0, '& li': { mb: 1.5, color: 'text.secondary' } }}>
                    <li>
                      Please note that you can send only one AWA evaluation request in one day, as we encourage you to
                      incorporate the feedback you receive from the faculty.
                    </li>
                    <li>
                      You may expect to receive the evaluation within 72 hours of sending the request, barring unusual
                      circumstances.
                    </li>
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6.5)} !important` }}>
                  <Button variant='contained' sx={{ mr: 4 }} type='submit' disabled={!isDirty}>
                    Submit for Review
                  </Button>
                  <Button type='reset' variant='tonal' color='secondary' onClick={() => reset()}>
                    Cancel
                  </Button>
                </Grid>
              </CardContent>
            </form>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default CreateAWA

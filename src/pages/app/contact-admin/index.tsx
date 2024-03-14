import { Box, Button, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { CustomBreadcrumbs } from 'src/@core/components/common/Breadcrumb'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useUserContext } from 'src/@core/context/UserContext'
import { post } from 'src/@core/utils/request'
import { CREATE_ZENDESK_TICKET } from 'src/apis/user'
import SuccessModel from 'src/components/modal/Success'
import themeConfig from 'src/configs/themeConfig'

const { border } = themeConfig

type Data = {
  subject: string
  message: string
}

type CreateZendeskTicketFormType = { subject: string; comment: string }

function ContactAdminPage() {
  const [showModal, setShowModal] = useState(false)
  const { userInit } = useUserContext()

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<Data>({
    defaultValues: {
      subject: '',
      message: '',
    },
  })

  const createZenDeskTicketMutation = useMutation({
    onSuccess: () => {
      Toast.success('Your request has been received')
      setShowModal(true)
    },
    mutationFn: (variables: CreateZendeskTicketFormType) =>
      post(CREATE_ZENDESK_TICKET, {
        name: userInit?.data.name,
        email: userInit?.data.email,
        subject: variables.subject,
        comment: variables.comment,
        course: userInit?.data.course,
        ticketType: 'problem',
        tags: 'contact admin',
        // TODO: This logic needs to be handled dyanmically.
        contactURL: null,
      }),
    onError: (error: any) => {
      Toast.error(error.errorMessage)
    },
  })

  const handleFormSubmit = (formData: Data) =>
    createZenDeskTicketMutation.mutate({ subject: formData.subject, comment: formData.message })

  const handleClose = () => setShowModal(false)

  return (
    <>
      <CustomHelmet title='Contact Admin' />
      <SuccessModel
        open={showModal}
        handleClose={handleClose}
        description='Thank you'
        subDescription='Your Request has been submitted successfully'
        onClick={handleClose}
      />
      <Grid>
        <CustomBreadcrumbs />
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
                      name='subject'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Subject'
                          value={value}
                          onChange={onChange}
                          placeholder='Report a Bug'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name='message'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          multiline
                          minRows={8}
                          label='Message'
                          value={value}
                          onChange={onChange}
                          placeholder='Describe your issue'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h6'>Please Note</Typography>
                    <Box component='ul' sx={{ pl: 6, mb: 0, '& li': { mb: 1.5, color: 'text.secondary' } }}>
                      <li>In case of email, Course Administrator will revert within 1 business day.</li>
                      <li>Always quote your email id or phone number in every communication with us.</li>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6.5)} !important` }}>
                    <Button variant='contained' sx={{ mr: 4 }} type='submit' disabled={!isDirty}>
                      Create Ticket
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
      </Grid>
    </>
  )
}

export default ContactAdminPage

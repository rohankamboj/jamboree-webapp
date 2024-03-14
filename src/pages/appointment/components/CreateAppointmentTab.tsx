// ** MUI Imports
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CustomRadioBasicData } from 'src/@core/components/custom-radio/types'

import { UseMutationResult } from 'react-query/types/react/types'
import Typography from 'src/@core/components/common/Typography'
import CustomRadioBasic from 'src/@core/components/custom-radio/basic'
import CustomDatePicker from 'src/@core/styles/libs/react-datepicker/DatePicker'
import { userData } from 'src/apis/type'
import SuccessModel from 'src/components/modal/Success'
import toast from 'react-hot-toast'
import TranslucentLoader from 'src/@core/components/common/TranslucentLoader'
import themeConfig from 'src/configs/themeConfig'

const { border } = themeConfig

const faculty: CustomRadioBasicData[] = [
  {
    title: 'Quantitative Faculty',
    value: 'quantitative',
  },
  {
    title: 'Verbal Faculty',
    value: 'verbal',
  },
]

const duration: CustomRadioBasicData[] = [
  {
    title: '30 Minutes',
    value: '30',
  },
  {
    title: '60 Minutes',
    value: '60',
  },
  {
    title: '90 Minutes',
    value: '90',
  },
]

type Props = {
  createUserAppointmentMutation: UseMutationResult<
    unknown,
    any,
    {
      data: userData.appointmentList
      handleSuccess: () => void
    },
    unknown
  >
}

const CreateTab = ({ createUserAppointmentMutation }: Props) => {
  const [showModal, setShowModal] = useState(false)

  const {
    setValue,
    watch,
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<userData.appointmentList & { preference1: Date; preference2: Date; preference3: Date }>({
    defaultValues: {
      preference1: undefined,
      preference2: undefined,
      preference3: undefined,
      faculty: '',
      duration: '',
      message: '',
      contact: 'not defined',
    },
  })

  const onSubmit = (formData: userData.appointmentList) => {
    // Expected Format 2023-10-19

    const convertDateToSeconds = (dateFromDatePicker: string) =>
      ((dateFromDatePicker as unknown as Date).getTime() / 1000).toString()
    formData.preference1 = convertDateToSeconds(formData.preference1)
    formData.preference2 = convertDateToSeconds(formData.preference2)
    formData.preference3 = convertDateToSeconds(formData.preference3)

    const preferences = new Set([formData.preference1, formData.preference2, formData.preference3])

    if (preferences.size < 3) {
      toast.error('Dates cannot be the same')
      return
    }

    createUserAppointmentMutation.mutate({
      data: formData,
      handleSuccess: () => {
        reset()
        setShowModal(true)
      },
    })
  }

  const handleSuccessModelClick = () => {
    window.location.replace('/app/account/appointment/pending')
  }

  const facultyFieldValue = watch('faculty')
  const durationFieldValue = watch('duration')

  const handleFacultyChange = useCallback((value: string) => setValue('faculty', value), [])
  const handleDurationChange = useCallback((value: string) => setValue('duration', value), [])

  const handleClose = () => setShowModal(false)

  return (
    <>
      {createUserAppointmentMutation.isLoading && <TranslucentLoader />}
      <SuccessModel
        open={showModal}
        handleClose={handleClose}
        description='Thank you for your request'
        subDescription='Your Appointment request has been submitted'
        onClick={handleSuccessModelClick}
      />

      <Card sx={{ boxShadow: 0, border, borderRadius: 1 }}>
        <CardHeader
          title='Create Appointment'
          subheader='Book Your Next Appointment: Seamlessly Schedule Your Desired Services'
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 4, pt: 0 }}>
            <Box>
              <Typography variant='paragraphSmall'>Select Faculty</Typography>
              <Grid container spacing={4}>
                {faculty.map(item => (
                  <CustomRadioBasic
                    key={item.value}
                    data={item}
                    selected={facultyFieldValue}
                    setSelected={handleFacultyChange}
                    name='faculty'
                    gridProps={{ ...(faculty.length < 3 ? { sm: 6 } : { sm: 4 }), xs: 12 }}
                  />
                ))}
              </Grid>
            </Box>

            <Box>
              <Typography variant='paragraphSmall'>Select Duration</Typography>
              <Grid container spacing={4}>
                {duration.map(item => (
                  <CustomRadioBasic
                    key={item.value}
                    data={item}
                    selected={durationFieldValue}
                    setSelected={handleDurationChange}
                    name='duration'
                    gridProps={{ ...(duration.length < 3 ? { sm: 6 } : { sm: 4 }), xs: 12 }}
                  />
                ))}
              </Grid>
            </Box>

            <Typography variant='h6'>Create 3 preferences</Typography>

            <Grid container spacing={5}>
              <Grid item xs={12} sm={4}>
                <Controller
                  name='preference1'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomDatePicker
                      label='Date 1'
                      error={Boolean(errors.preference1)}
                      value={value}
                      onChange={onChange}
                      minDate={new Date()}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name='preference2'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomDatePicker
                      label='Date 2'
                      error={Boolean(errors.preference2)}
                      value={value}
                      onChange={onChange}
                      minDate={new Date()}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name='preference3'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomDatePicker
                      label='Date 3'
                      error={Boolean(errors.preference3)}
                      value={value}
                      onChange={onChange}
                      minDate={new Date()}
                    />
                  )}
                />
              </Grid>
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
                    placeholder='Write something about yourself'
                    error={Boolean(errors.message)}
                    {...(errors.message && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6.5)} !important` }}>
              <Button
                sx={{ cursor: createUserAppointmentMutation.isLoading ? 'progress' : undefined, mr: 4 }}
                variant='contained'
                type='submit'
                disabled={!isDirty}
              >
                Create Appointment
              </Button>
              <Button type='reset' variant='tonal' color='secondary' onClick={() => reset()}>
                Cancel
              </Button>
            </Grid>
          </CardContent>
        </form>
      </Card>
    </>
  )
}

export default CreateTab

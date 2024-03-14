import {
  Box,
  BoxProps,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  InputLabel,
  MenuItem,
  Typography as MuiTypography,
  TypographyProps,
  styled,
} from '@mui/material'
import Toast from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import { patch, post, put } from 'src/@core/utils/request'
import { UPLOAD_CV_API, USER_API, USER_PM_FORM } from 'src/apis/user'

import { ChangeEvent, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CustomBreadcrumbs } from 'src/@core/components/common/Breadcrumb'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import Typography from 'src/@core/components/common/Typography'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import SuccessModel from 'src/components/modal/Success'
import themeConfig from 'src/configs/themeConfig'

type UserFormData = {
  degree: string
  discipline: string
  university: string
  company: string
  years: string
  biodata: string
}

type UserWithAcademicBioResponse = {
  data?: Object
  meta: {
    academic: string
    biodata: string
    workex: string
  }
}

type ParsedUserMetaAcademicsData = {
  meta: {
    academic: {
      degree: string
      discipline: string
      university: string
    }
    biodata: string
    workex: {
      company: string
      years: string
      cv: string
    }
  }
}

type UpdateUserAcademicBioMutationType = {
  data: ParsedUserMetaAcademicsData
  handleSuccess?: any
  handleError?: any
}

// const parseJSONFromStringfiedData = <T extends Record<string, string>>(data: T, keysToParse: (keyof T)[]) => {
//   const parsedObj = {}
//   keysToParse.forEach(key => {
//     Object.assign(parsedObj, { [key]: JSON.parse(data[key]) as Object })
//   })
//   return parsedObj
// }

const formFields = {
  degree: [
    {
      label: 'Undergrad (Bachelors)',
      value: 'ug',
    },
    {
      label: 'Graduate (Masters)',
      value: 'pg',
    },
    {
      label: 'Research Doctorate (PhD)',
      value: 'phd',
    },
    {
      label: 'Professional Degree (MD, JD, LLB, etc.)',
      value: 'pro',
    },
  ],
  discipline: [
    {
      label: 'Humanities',
      value: 'humanities',
    },
    {
      label: 'Social Sciences',
      value: 'sci-social',
    },
    {
      label: 'Natural Sciences',
      value: 'sci-natural',
    },
    {
      label: 'Formal Sciences',
      value: 'sci-formal',
    },
    {
      label: 'Applied Sciences',
      value: 'sci-applied',
    },
    {
      label: 'Others',
      value: 'others',
    },
  ],
  years: [
    {
      label: '1 Year',
      value: '1',
    },
    {
      label: '2 Years',
      value: '2',
    },
    {
      label: '3 Years',
      value: '3',
    },
    {
      label: '4 Years',
      value: '4',
    },
    {
      label: '5 Years',
      value: '5',
    },
    {
      label: '6 Years',
      value: '6',
    },
  ],
  company: [
    {
      label: 'One',
      value: '1',
    },
    {
      label: 'Two',
      value: '2',
    },
    {
      label: 'Three',
      value: '3',
    },
  ],
  bioData: '',
  attachCV: '',
}

const { border } = themeConfig

const StyledTypography = styled(MuiTypography)<TypographyProps>(({ theme }) => ({
  alignItems: 'flex-start',
  transform: 'none',
  lineHeight: 1.154,
  position: 'relative',
  marginBottom: theme.spacing(1),
  fontSize: theme.typography.body2.fontSize,
  color: `${theme.palette.text.primary} !important`,
}))

const StyledUploadBox = styled(Box)<BoxProps>({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  border,
  padding: 1,
  paddingLeft: '10px',
  minHeight: '2.5em',
  height: 'auto',
  borderRadius: '6px',
})

const StyledIconBox = styled(Box)<BoxProps>({
  backgroundColor: '#4B465C14',
  borderRadius: '6px',
  alignItems: 'center',
  display: 'flex',
  border,
  paddingLeft: '10px',
  paddingRight: '10px',
})

const StyledBox = styled(Box)<BoxProps>({
  backgroundColor: '#E9F4F0',
  width: '100%',
  height: '20vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '1rem',
  borderRadius: '4px',
})

function AdmissionPage() {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [cvFile, setCvFile] = useState<any>()

  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<UserFormData>({
    defaultValues: {
      degree: '',
      discipline: '',
      university: '',
      company: '',
      years: '',
      biodata: '',
    },
  })

  const queryClient = useQueryClient()

  const submitPMFormMutation = useMutation({
    onSuccess: () => {
      Toast.success('Our admissions team will contact you shortly.')
      setShowModal(true)
    },
    mutationFn: (variables: { transformedData: ParsedUserMetaAcademicsData; cvPath: string }) =>
      put(USER_PM_FORM, {
        subject: 'Admissions Enquiry',
        message: `I wish to contact the admission team. 
                <a 
                  style="
                  background-color: green;
                  color: white;
                  padding: 0.5em 1em;
                  text-decoration: none;
                  text-transform: uppercase;
                  border-radius:5px;
                  "
                  href="${variables.cvPath}" download>Download CV</a>`,
        meta: variables.transformedData.meta,
      }),
  })

  const updateUserAcademicBio = useMutation({
    mutationFn: (variables: UpdateUserAcademicBioMutationType) =>
      patch(USER_API, {
        meta: {
          academic: JSON.stringify(variables.data.meta.academic),
          biodata: variables.data.meta.biodata,
          workex: JSON.stringify(variables.data.meta.workex),
        },
      } as Pick<UserWithAcademicBioResponse, 'meta'>),
    onSuccess: (_, variables) => {
      submitPMFormMutation.mutate({ transformedData: variables.data, cvPath: variables.data.meta.workex.cv })
      queryClient.invalidateQueries('userWithAcademicBio')
      return
    },

    onError: (errorMessage: string) => {
      Toast.error(errorMessage)
    },
  })

  const uploadCv = useMutation({
    onSuccess: () => {
      Toast.success('Cv file uploaded successfully')
    },
    mutationFn: (variables: { data: FormData }) =>
      post(UPLOAD_CV_API, variables.data, {
        headers: {
          enctype: 'multipart/form-data',
          'content-type': 'multipart/form-data',
        },
      }),
    onError: (error: any) => {
      Toast.error(error.errorMessage)
    },
  })

  const handleInputFormData = async (e: ChangeEvent<any>) => {
    if (e.target.files) {
      const cvData = e.target.files[0]
      const formBodyData = new FormData()
      formBodyData.append('cv', cvData)
      setCvFile(formBodyData)
    }
  }

  const handleFormSubmit = async (formData: UserFormData) => {
    const { degree, discipline, university, company, years, biodata } = formData
    const res = await uploadCv.mutateAsync({ data: cvFile })

    const formDataToSubmit: ParsedUserMetaAcademicsData = {
      meta: {
        academic: {
          degree,
          discipline,
          university,
        },
        workex: {
          company,
          years,
          // @ts-ignore
          cv: res.path,
        },
        biodata,
      },
    }
    updateUserAcademicBio.mutateAsync({ data: formDataToSubmit })
  }

  const handleClose = () => setShowModal(false)
  if (updateUserAcademicBio.isLoading || submitPMFormMutation.isLoading) return <FallbackSpinner />

  return (
    <>
      <CustomHelmet title='Admission Services' />
      <SuccessModel
        open={showModal}
        handleClose={handleClose}
        description='Thank you for your request'
        subDescription='Your request has been submitted successfully'
        onClick={() => setShowModal(false)}
      />
      <Grid>
        <CustomBreadcrumbs />

        <StyledBox>
          <Typography variant='h3'>Admission Services</Typography>
          <Typography variant='paragraphMain' textAlign='center'>
            Achieve your dreams with our expert admission services designed for your success.
          </Typography>
        </StyledBox>
        <Card sx={{ boxShadow: 0, border, borderRadius: 1 }}>
          <CardHeader title='Fill the form below to get in touch with our Admissions Cell.' />

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 4, pt: 0 }}>
              <>
                <Typography variant='h6'>Academic Details</Typography>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='degree'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Highest Academic Degree'
                          value={value}
                          onChange={onChange}
                          select
                          error={Boolean(errors.degree)}
                          {...(errors.degree && { helperText: 'This field is required' })}
                        >
                          {formFields.degree.map(item => (
                            <MenuItem key={item.value} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='discipline'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Discipline'
                          value={value}
                          onChange={onChange}
                          select
                          error={Boolean(errors.discipline)}
                          {...(errors.discipline && { helperText: 'This field is required' })}
                        >
                          {formFields.discipline.map(item => (
                            <MenuItem key={item.value} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='university'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='University Name'
                          value={value}
                          placeholder='Enter university'
                          onChange={onChange}
                          error={Boolean(errors.university)}
                          {...(errors.university && { helperText: 'This field is required' })}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </>

              <>
                <Typography variant='h6'>Work Experience</Typography>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='company'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Company Name'
                          value={value}
                          onChange={onChange}
                          select
                          error={Boolean(errors.company)}
                          {...(errors.company && { helperText: 'This field is required' })}
                        >
                          {formFields.company.map(item => (
                            <MenuItem key={item.value} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='years'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Years of Exp'
                          value={value}
                          onChange={onChange}
                          select
                          error={Boolean(errors.years)}
                          {...(errors.years && { helperText: 'This field is required' })}
                        >
                          {formFields.years.map(item => (
                            <MenuItem key={item.value} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <InputLabel htmlFor='cv'>
                      <StyledTypography>Upload file</StyledTypography>
                      <Box display='flex' width='100%' sx={{ cursor: 'pointer' }}>
                        <StyledUploadBox sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
                          Upload file
                          <input
                            hidden
                            type='file'
                            accept='.txt,.text,.doc,.docx,.odt,.pdf,.ppt,.pptx,.rtf,text/plain,text/rtf,application/rtf,application/msword'
                            onChange={e => handleInputFormData(e)}
                            id='cv'
                          />
                        </StyledUploadBox>
                        <StyledIconBox sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                          <Icon icon={'material-symbols:upload'} color='#4B465C' />
                        </StyledIconBox>
                      </Box>
                      {!!cvFile && cvFile.get('cv').name}
                    </InputLabel>
                  </Grid>
                </Grid>
              </>

              <Grid item xs={12}>
                <Controller
                  name='biodata'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      multiline
                      minRows={8}
                      label='Career Summary'
                      value={value}
                      placeholder='Write something about yourself'
                      onChange={onChange}
                      error={Boolean(errors.biodata)}
                      {...(errors.biodata && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6.5)} !important` }}>
                <Button sx={{ cursor: 'pointer', mr: 4 }} variant='contained' type='submit' disabled={!isDirty}>
                  Create Appointment
                </Button>
                <Button type='reset' variant='tonal' color='secondary'>
                  Cancel
                </Button>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>
    </>
  )
}

export default AdmissionPage

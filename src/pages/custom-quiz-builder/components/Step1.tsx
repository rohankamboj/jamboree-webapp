import { Box, Button, Grid, Typography as MUITypography, TypographyProps, styled } from '@mui/material'
import { Controller, UseFormGetValues, UseFormReturn, UseFormSetValue } from 'react-hook-form'
import toast from 'react-hot-toast'
import Typography from 'src/@core/components/common/Typography'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'
import CustomTextField from 'src/@core/components/mui/text-field'
import { PtIDType, quizSubjectAndSectionMap, quizDifficultyOptions } from 'src/pages/quiz/constants'

import { capitalizeFirstLetter } from 'src/utils'
import { CustomQuizBuilderFormFieldsType } from '..'
import CheckBoxWithTitle from './CheckBoxWithTitle'
import { CreateCustomizedOnDemandQuizShortForm } from 'src/pages/quiz/components/customisedQuizModal'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig
export const uniqueSubjectsFromQuizCategories = Array.from(
  new Set(quizSubjectAndSectionMap.map(({ category }) => category)),
)

export const StyledTypography = styled(MUITypography)<TypographyProps>(({ theme }) => ({
  lineHeight: 1.154,
  fontSize: theme.typography.body2.fontSize,
  position: 'relative',
  marginBottom: theme.spacing(1),
  color: `${theme.palette.text.primary} !important`,
}))

const getPtIdsForCurrentSection = (section: (typeof quizSubjectAndSectionMap)[number]['category']) => {
  return quizSubjectAndSectionMap?.filter(item => item.category === section)?.map(item => item.ptid)
}
const getSectionForPtid = (ptid: PtIDType) => {
  return quizSubjectAndSectionMap.find(item => item.ptid === ptid)?.category
}

export const handleSelectField = (
  value: (typeof quizSubjectAndSectionMap)[number]['category'] | PtIDType | (typeof quizDifficultyOptions)[number],
  currentValue: Array<string | number> | undefined,
  getValues: UseFormGetValues<CreateCustomizedOnDemandQuizShortForm | CustomQuizBuilderFormFieldsType>,
  setValue: UseFormSetValue<CreateCustomizedOnDemandQuizShortForm | CustomQuizBuilderFormFieldsType>,
  name?: keyof CustomQuizBuilderFormFieldsType,
  replace?: boolean,
) => {
  const isAlreadySelected = currentValue?.includes(value)

  // When selected new subject automatically set
  if (name === 'subjects') {
    const currentPtIds = getValues('ptids')
    const ptIdsToAutoSelect = getPtIdsForCurrentSection(value as (typeof quizSubjectAndSectionMap)[number]['category'])

    if (isAlreadySelected) {
      setValue('ptids', currentPtIds?.filter(ptid => !ptIdsToAutoSelect?.includes(ptid as PtIDType)))
    } else {
      if (replace) {
        setValue('ptids', ptIdsToAutoSelect)
      } else {
        setValue('ptids', [...(currentPtIds || []), ...ptIdsToAutoSelect])
      }
    }
  }

  if (name === 'ptids') {
    const alreadySelectedSubjects = getValues('subjects') || []

    const subjectForCurrentPtId = getSectionForPtid(value as PtIDType)

    console.log('alreadySelectedSubjects', alreadySelectedSubjects, 'subjectForCurrentPtId', alreadySelectedSubjects)

    if (subjectForCurrentPtId) {
      if (!alreadySelectedSubjects.includes(subjectForCurrentPtId)) {
        // Automatically add the section if not already added
        // if (replace) {
        //   setValue('subjects', [subjectForCurrentPtId])
        // } else {
        setValue('subjects', [...alreadySelectedSubjects, subjectForCurrentPtId])
        // }
      } else {
        // Check to see if its current section is getting removed from the ptids
        // If so, remove it from the associated subjects as well
        if (isAlreadySelected) {
          const ptIdsCorrespondingToSubjects = getPtIdsForCurrentSection(subjectForCurrentPtId)
          // @ts-ignore
          const intersection = currentValue?.filter(ptid => ptIdsCorrespondingToSubjects?.includes(ptid))
          if (intersection?.length === 1) {
            // Remove the subject if it was the only ptid from the subject
            setValue(
              'subjects',
              alreadySelectedSubjects.filter(section => section !== subjectForCurrentPtId),
            )
          }
        }
      }
    }
  }

  // Add remove logic.
  const newNames = isAlreadySelected ? currentValue?.filter(name => name !== value) : [...(currentValue || []), value]

  return replace ? (isAlreadySelected ? [] : [value]) : newNames
}

const Step1Component = ({
  hookForm: {
    control,
    setValue,
    formState: { errors },
    getValues,
  },
  filteredQuestionCount,
  totalQuestions,
  setFormStep,
}: {
  filteredQuestionCount: number
  totalQuestions: number
  hookForm: UseFormReturn<CustomQuizBuilderFormFieldsType, any, undefined>
  setFormStep: (formStep: number) => void
}) => {
  const handleCheckValues = () => {
    console.log(getValues('subjects'))
    if (getValues('subjects')?.length === 0) {
      toast.error('Subject should not be empty')
      return
    }
    if (getValues('ptids')?.length === 0) {
      toast.error('Ptids should not be empty')
      return
    }

    if (getValues('difficulty').length === 0) {
      toast.error('Difficulty should not be empty')
      return
    }
    setFormStep(2)
  }

  return (
    <StyledBorderedBox borderRadius={1}>
      <Box
        paddingY={3}
        paddingX={6}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        borderBottom={border}
      >
        <Typography variant='h5'>Step 1/2</Typography>

        <Box display='flex' gap={2} alignItems='center'>
          <Typography variant='paragraphMedium'>
            Filtered Question {filteredQuestionCount} / {totalQuestions}
          </Typography>
        </Box>
      </Box>

      <Box padding={4} display='flex' flexDirection='column' gap={4}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <Controller
              name='quizname'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  type='text'
                  label='Quiz name'
                  value={value || ''}
                  onChange={onChange}
                  error={Boolean(errors.quizname)}
                  {...(errors.quizname && { helperText: 'This field is required' })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTypography>Select Subject</StyledTypography>
            <Grid container spacing={4}>
              {uniqueSubjectsFromQuizCategories.map(subject => (
                <Controller
                  key={subject}
                  name='subjects'
                  render={({ field: { onChange, value: currentValues, name } }) => {
                    return (
                      <CheckBoxWithTitle
                        checkedValues={currentValues || []}
                        // @ts-ignore
                        onChange={() => onChange(handleSelectField(subject, currentValues, getValues, setValue, name))}
                        data={{ title: capitalizeFirstLetter(subject), value: subject }}
                        name={name}
                        gridProps={{ sm: 6, xs: 6 }}
                      />
                    )
                  }}
                  control={control}
                />
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Box>
          <StyledTypography>Select Section</StyledTypography>
          <Grid container spacing={4} columns={10}>
            {quizSubjectAndSectionMap.map(item => (
              <Controller
                key={item.id}
                name='ptids'
                render={({ field: { onChange, value, name } }) => {
                  return (
                    <CheckBoxWithTitle
                      checkedValues={value || []}
                      // @ts-ignore
                      onChange={() => onChange(handleSelectField(item.ptid, value, getValues, setValue, 'ptids'))}
                      data={{ title: item.id.toUpperCase(), value: item.ptid }}
                      name={name}
                      gridProps={{ xs: 5, sm: 2 }}
                    />
                  )
                }}
                control={control}
              />
            ))}
          </Grid>
        </Box>
        <Box>
          <StyledTypography>Difficulty</StyledTypography>
          <Grid container spacing={4}>
            {quizDifficultyOptions.map(item => (
              <Controller
                key={item}
                name='difficulty'
                render={({ field: { onChange, value, name } }) => {
                  return (
                    <CheckBoxWithTitle
                      checkedValues={value}
                      // @ts-ignore
                      onChange={() => onChange(handleSelectField(item, value, getValues, setValue))}
                      data={{ title: capitalizeFirstLetter(item), value: item }}
                      name={name}
                      gridProps={{ xs: 6, sm: 3 }}
                    />
                  )
                }}
                control={control}
              />
            ))}
          </Grid>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <Button variant='outlined' type='button' onClick={handleCheckValues}>
            Next
          </Button>
        </Box>
      </Box>
    </StyledBorderedBox>
  )
}

export default Step1Component

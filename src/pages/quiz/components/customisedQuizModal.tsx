import { Box, Button, Dialog, DialogActions, DialogContent, Grid, Typography } from '@mui/material'

import { Controller, UseFormReturn } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import { capitalizeFirstLetter } from 'src/utils'
import CheckBoxWithTitle from '../../custom-quiz-builder/components/CheckBoxWithTitle'
import {
  StyledTypography,
  handleSelectField,
  uniqueSubjectsFromQuizCategories,
} from '../../custom-quiz-builder/components/Step1'
import { quizSubjectAndSectionMap } from '../constants'

// One of the items in the array of personalizedQuizzes
type quizCategoryType = {
  handleModalClose: () => void
  handleCreateQuiz: (formData: CreateCustomizedOnDemandQuizShortForm) => void
  hookForm: UseFormReturn<CreateCustomizedOnDemandQuizShortForm, any, undefined>
  filteredQuestionCountAfterUserSelection: number
}

export type CreateCustomizedOnDemandQuizShortForm = {
  subjects: Array<quizSubjectAndSectionMap['category']>
  ptids: Array<quizSubjectAndSectionMap['ptid']>
  question_count: number
}

function CustomizedQuizModal(props: quizCategoryType) {
  const {
    handleModalClose,
    handleCreateQuiz,
    hookForm: {
      handleSubmit,
      getValues,
      setValue,
      control,
      formState: { isDirty },
    },
    filteredQuestionCountAfterUserSelection,
  } = props

  const handleCreateCustomQuiz = (formData: CreateCustomizedOnDemandQuizShortForm) => {
    handleModalClose()
    handleCreateQuiz(formData)
  }

  return (
    <Dialog
      fullWidth
      open={true}
      onClose={handleModalClose}
      sx={{
        '& .MuiPaper-root': { width: '100%', maxWidth: 780 },
        backdropFilter: 'blur(6px)',
        '& .MuiDialog-paper': { overflow: 'visible' },
      }}
    >
      <form onSubmit={handleSubmit(handleCreateCustomQuiz)}>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(8)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(8)} !important`],
          }}
        >
          <Typography variant='h5'>Create Quiz</Typography>
          <Box>
            <StyledTypography>Subject</StyledTypography>
            <Grid container spacing={4}>
              {uniqueSubjectsFromQuizCategories.map(subject => (
                <Controller
                  key={subject}
                  name='subjects'
                  render={({ field: { onChange, value: currentValues, name } }) => {
                    return (
                      <CheckBoxWithTitle
                        checkedValues={currentValues || []}
                        onChange={() =>
                          // @ts-ignore
                          onChange(handleSelectField(subject, currentValues, getValues, setValue, name, true))
                        }
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
          </Box>
          <Box>
            <StyledTypography>Select Subject</StyledTypography>
            <Grid container spacing={4} columns={10}>
              {quizSubjectAndSectionMap.map(item => (
                <Controller
                  key={item.id}
                  name='ptids'
                  render={({ field: { onChange, value, name } }) => {
                    return (
                      <CheckBoxWithTitle
                        checkedValues={value || []}
                        onChange={() =>
                          // @ts-ignore
                          onChange(handleSelectField(item.ptid, value, getValues, setValue, 'ptids'))
                        }
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
            {/* TODO: add filtered value instead of 0 */}
            <StyledTypography>Number of questions (out of {filteredQuestionCountAfterUserSelection})</StyledTypography>
            <Grid container>
              <Controller
                name='question_count'
                render={({ field: { onChange, value } }) => {
                  return (
                    <CustomTextField placeholder='Number of Questions' fullWidth onChange={onChange} value={value} />
                  )
                }}
                control={control}
              />
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'end',
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(10)} !important`],
          }}
        >
          <Button variant='contained' color='primary' type='submit' disabled={!isDirty}>
            Create Quiz
          </Button>

          <Button variant='outlined' color='primary' type='button' onClick={handleModalClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CustomizedQuizModal

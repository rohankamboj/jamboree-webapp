import { Box, Button, Grid, Typography as MUITypography, MenuItem, TypographyProps, styled } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Controller, UseFormReturn, useWatch } from 'react-hook-form'
import Typography from 'src/@core/components/common/Typography'
import CustomTextField from 'src/@core/components/mui/text-field'
import { CustomQuizBuilderFormFieldsType } from '..'
import { questionAttemptType, quizDurationOptions, rcOptions } from '../../quiz/constants'
import { hasRCIdExistsInSelectedSubjectsTopics } from '../helpers'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig

const StyledTypography = styled(MUITypography)<TypographyProps>(({ theme }) => ({
  lineHeight: 1.154,
  fontSize: theme.typography.body2.fontSize,
  position: 'relative',
  marginBottom: theme.spacing(1),
  color: `${theme.palette.text.primary} !important`,
}))

const Step2Component = ({
  hookForm: {
    control,
    setValue,
    resetField,
    formState: { errors },
  },
  topics,
  filteredQuestionCount,
  totalQuestions,
}: {
  hookForm: UseFormReturn<CustomQuizBuilderFormFieldsType, any, undefined>
  topics: {
    label: string
    value: number
    is_strength: number
  }[]
  filteredQuestionCount: number
  totalQuestions: number
}) => {
  const [selectedTopics, setSelectedTopics] = useState<Array<number>>([])

  const [questionCount, rc_count, duration] = useWatch({
    control,
    name: ['question_count', 'rc_count', 'duration'],
  })

  const handleTopics = (value: number) => {
    if (selectedTopics?.includes(value)) {
      const data = [...selectedTopics].filter(t => t !== value)
      setSelectedTopics([...data])
    } else setSelectedTopics([...selectedTopics, value])
  }

  const handleSelectAllTopics = () => {
    const allTopics = topics.map(topic => topic.value)
    setSelectedTopics(allTopics)
  }

  const handleSelectValues = (value: number) => {
    const strength = topics.flatMap(topic => (topic.is_strength === value ? [topic.value] : []))
    setSelectedTopics(strength)
  }

  const isRCExists = useMemo(() => {
    return hasRCIdExistsInSelectedSubjectsTopics(selectedTopics)
  }, [selectedTopics])

  useEffect(() => {
    selectedTopics.length > 0 && setValue('topics', selectedTopics)
    !isRCExists && resetField('rc_count')
  }, [selectedTopics])

  return (
    <Box border={border} borderRadius={1} mt={6}>
      <Box
        paddingY={3}
        paddingX={6}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        borderBottom={border}
      >
        <Typography variant='h5'>Step 2/2</Typography>
        <Box display='flex' gap={2} alignItems='center'>
          <Typography variant='paragraphMedium'>
            Selected Question {filteredQuestionCount} / {totalQuestions}
          </Typography>
        </Box>
      </Box>
      <Box padding={4} display='flex' flexDirection='column' gap={4}>
        <Box>
          <Box display='flex' justifyContent='space-between'>
            <div>
              <StyledTypography>Select Topics</StyledTypography>
              <Typography
                color={theme => theme.palette.primary.main}
                sx={{
                  textDecoration: 'underline',
                  lineHeight: 1.154,
                  fontSize: theme => theme.typography.body2.fontSize,
                  cursor: 'pointer',
                }}
                onClick={handleSelectAllTopics}
              >
                Select All
              </Typography>
            </div>
            <Box display='flex' gap={6} alignItems='center'>
              <Typography sx={{ cursor: 'pointer' }} onClick={handleSelectAllTopics}>
                All
              </Typography>
              <Box
                display='flex'
                gap={2}
                alignItems='center'
                sx={{ cursor: 'pointer' }}
                onClick={() => handleSelectValues(1)}
              >
                <Typography>Strength</Typography>
                <StatusOfTopic />
              </Box>
              <Box
                display='flex'
                gap={2}
                alignItems='center'
                sx={{ cursor: 'pointer' }}
                onClick={() => handleSelectValues(-1)}
              >
                <Typography>Weakness</Typography>
                <StatusOfTopic isWeak />
              </Box>
            </Box>
          </Box>

          <Box display='flex' flexWrap='wrap' gap={2} my={4}>
            {topics.map((topic, i) => (
              <Button
                key={i + topic.label}
                sx={{ cursor: 'pointer' }}
                onClick={() => handleTopics(topic.value)}
                variant='tonal'
                color={selectedTopics.includes(topic.value) ? 'primary' : 'secondary'}
              >
                <Typography mr={2}>
                  {' '}
                  {topic.label} {topic.value}
                </Typography>
                {topic.is_strength === 1 && <StatusOfTopic />}
                {topic.is_strength === -1 && <StatusOfTopic isWeak />}
              </Button>
            ))}
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Controller
              name='questionType'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField fullWidth label='Question Type' value={value} onChange={onChange} select>
                  {questionAttemptType.map(item => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display='flex' gap={1} flexDirection='column' width='100%'>
              <Controller
                name='question_count'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <Box
                          sx={{
                            borderRight: border,
                            paddingRight: 2,
                            marginRight: 2,
                            width: '140px',
                          }}
                        >
                          <Typography>Available {filteredQuestionCount}</Typography>
                        </Box>
                      ),
                    }}
                    label='Number of Questions'
                    value={value}
                    type='number'
                    onChange={onChange}
                    error={Boolean(errors.question_count)}
                    {...(errors.question_count && { helperText: 'This field is required' })}
                  />
                )}
              />
              {isRCExists && (
                <>
                  <Typography textAlign='center'>+</Typography>
                  <Controller
                    name='rc_count'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField fullWidth value={value} onChange={onChange} select>
                        {rcOptions.map(item => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                </>
              )}
              <Typography>
                {questionCount &&
                  `Total Questions = ${questionCount}` + (rc_count ? ` + ${rc_count} reading comprehension` : '')}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Controller
              name='duration'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <>
                  <CustomTextField
                    fullWidth
                    label='Duration'
                    sx={{
                      mb: 2,
                    }}
                    // defaultValue={1}
                    value={value}
                    onChange={onChange}
                    select
                  >
                    {quizDurationOptions.map(item => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </>
              )}
            />
            {duration === 'Custom Time (Counter)' && (
              <Controller
                name='customQuizTime'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    label='Number of Questions'
                    value={value || ''}
                    type='number'
                    onChange={onChange}
                    placeholder='Time in minutes'
                    error={Boolean(errors.question_count)}
                    {...(errors.question_count && { helperText: 'This field is required' })}
                  />
                )}
              />
            )}
            <Typography>{duration && `Total Duration ${duration}`}</Typography>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          {/*TODO: when to call this setShowStartQuizModal function -> onClick={() => setShowStartQuizModal(true)} */}
          <Button variant='contained' type='submit'>
            Start Quiz
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

const StatusOfTopic = ({ isWeak = false }: { isWeak?: boolean }) => {
  return (
    <Box
      sx={{
        height: '10px',
        width: '10px',
        borderRadius: '100%',
        bgcolor: theme => (!isWeak ? theme.palette.primary.main : theme.palette.error.main),
      }}
    ></Box>
  )
}

export default Step2Component

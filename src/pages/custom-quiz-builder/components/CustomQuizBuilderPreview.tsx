import { Box } from '@mui/material'
import { useMemo } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'

import { Control, useWatch } from 'react-hook-form'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'
import { capitalizeFirstLetter } from 'src/utils'
import { CustomQuizBuilderFormFieldsType } from '..'
import { PtIdWithLabel, quizDurationOptions } from '../../quiz/constants'

export type watchFields = [
  string,
  string[],
  number[],
  string | undefined,
  number | undefined,
  (string | undefined)[],
  number[],
]

export const getUniquePtidsNameFromId = (ptids: number[] | undefined) => {
  const uniqueSubjectsSet = new Set<string>()
  if (ptids) {
    ptids.forEach(ptid => {
      const label = PtIdWithLabel[ptid]
      if (label) {
        uniqueSubjectsSet.add(label)
      }
    })
  }

  return Array.from(uniqueSubjectsSet)
}

const CustomQuizBuilderPreview = ({ control }: { control: Control<CustomQuizBuilderFormFieldsType, any> }) => {
  const [quizname, subjects, ptids, duration, difficulty] = useWatch({
    control,
    name: ['quizname', 'subjects', 'ptids', 'duration', 'difficulty'],
  })
  const difficultyArrayWithValues = difficulty?.map(capitalizeFirstLetter)

  const getDurationLabelByValue = useMemo(() => {
    // @ts-ignore
    const matchingItem = quizDurationOptions.find(item => item.value === duration)
    return matchingItem ? matchingItem.label : undefined
  }, [duration])

  const getSubjectIdsByPtids = useMemo(() => {
    return getUniquePtidsNameFromId(ptids)
  }, [ptids])

  return (
    <StyledBorderedBox borderRadius={1}>
      <img src='/images/Test.png' width={'100%'} height={200} />
      <Box
        padding={4}
        sx={{
          borderBottomLeftRadius: 1,
          borderBottomRightRadius: 1,
        }}
        display='flex'
        flexDirection='column'
        gap={2}
      >
        <CustomTextField
          fullWidth
          type='text'
          label='Quiz name'
          placeholder='Verbal Quiz Title Goes Here'
          disabled
          value={quizname || ''}
        />
        <CustomTextField fullWidth type='text' label='Subject' placeholder='Verbal ' disabled value={subjects} />
        <CustomTextField
          fullWidth
          type='text'
          label='Subjects'
          placeholder='Select subject'
          disabled
          value={getSubjectIdsByPtids}
        />
        <CustomTextField
          fullWidth
          type='text'
          label='Difficulty'
          placeholder='Select difficulty'
          disabled
          value={difficultyArrayWithValues}
        />
        <CustomTextField
          fullWidth
          type='text'
          label='Duration'
          placeholder='Select duration'
          disabled
          value={getDurationLabelByValue}
        />

        <CustomTextField
          fullWidth
          type='text'
          label='Quiz mode'
          placeholder='Practice mode'
          disabled
          value='Practice'
        />
      </Box>
    </StyledBorderedBox>
  )
}

export default CustomQuizBuilderPreview

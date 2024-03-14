import { Box, MenuItem } from '@mui/material'
import Typography from 'src/@core/components/common/Typography'
import CustomTextField from 'src/@core/components/mui/text-field'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig
type Props = {
  options: Array<string>
  quizOptionLabel: string
  preTitle?: string
  postTitle?: string
  currentValue?: string
  setValue: (value: string) => void
}

export default function TextWithDropdown(props: Props) {
  const { options, quizOptionLabel, preTitle, postTitle, setValue, currentValue } = props

  return (
    <Box
      onClick={() => {}}
      sx={{
        height: '100%',
        display: 'flex',
        borderRadius: 1,
        cursor: 'pointer',
        position: 'relative',
        alignItems: 'center',
        border: theme => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography
        variant='paragraphBold'
        sx={{ mx: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        {quizOptionLabel}
      </Typography>
      <Box display='flex' alignItems='center' columnGap={2} flexWrap='wrap' pl={2} borderLeft={border}>
        <Typography variant='paragraphMedium' my={2}>
          {preTitle}
        </Typography>
        <CustomTextField
          size='small'
          select
          defaultValue={currentValue ?? ''}
          sx={{ my: 2 }}
          id='form-layouts-separator-multiple-select'
          SelectProps={{
            value: currentValue ?? '',
            // @ts-ignore
            onChange: e => setValue(e.target.value),
          }}
        >
          {options.map((option, i) => (
            <MenuItem value={i + 1}>{option.toString()}</MenuItem>
          ))}
        </CustomTextField>
        {/* @ts-ignore */}
        <Typography variant='paragraphMedium' my={2}>
          {postTitle}
        </Typography>
      </Box>
    </Box>
  )
}

type IQuestionWithDropdownTypeInputOptions = {
  questionWithPrePostAndOptions: {
    options: string[]
    pre: string
    post: string
  }[]
  currentValue: string[] | undefined
  setValue: (value: string[]) => void
}

export const QuestionsWithDropdownTypeInputOptions = ({
  questionWithPrePostAndOptions,
  currentValue,
  setValue,
}: IQuestionWithDropdownTypeInputOptions) => {
  const handleSetValueWithIdx = (idx: number) => (value: string) => {
    if (Array.isArray(currentValue)) {
      const newValue = [...currentValue]
      newValue[idx] = value
      setValue(newValue)
    } else {
      const arrayWithValue = new Array(questionWithPrePostAndOptions.length).fill('')
      arrayWithValue[idx] = value
      setValue(arrayWithValue)
    }
  }

  return questionWithPrePostAndOptions.map((question, idx) => (
    <TextWithDropdown
      key={question.pre + question.post + idx}
      currentValue={currentValue?.[idx]}
      setValue={handleSetValueWithIdx(idx)}
      options={question.options}
      quizOptionLabel='Q'
      preTitle={question.pre}
      postTitle={question.post}
    />
  ))
}

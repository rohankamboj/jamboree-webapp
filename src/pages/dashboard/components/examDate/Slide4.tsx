import { Box, Theme, useMediaQuery } from '@mui/material'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import Typography from 'src/@core/components/common/Typography'
import CustomTextField from 'src/@core/components/mui/text-field'
import { FormDataTypes } from './AskQuestionModal'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'

const Slide4 = ({
  control,
  errors,
  maxScore,
}: {
  control: Control<FormDataTypes, any>
  errors: FieldErrors<FormDataTypes>
  maxScore: number
}) => {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  return (
    <>
      <Box bgcolor='#F6F6F7' padding={4}>
        <Typography variant='h5'>What is your Target Score?</Typography>
      </Box>
      <Box display='flex' flexDirection='column' gap={4} padding={4}>
        <Typography variant='paragraphMedium'>
          The score will help us to provide relevant recommendations. You can modify the score in future.
        </Typography>
        <Box display='flex'>
          <Controller
            name='score'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                placeholder='Enter your score'
                sx={{
                  '& .MuiInputBase-root': {
                    borderTopRightRadius: '0px !important',
                    borderBottomRightRadius: '0px !important',
                  },
                }}
                type='number'
                value={value}
                onChange={onChange}
                error={Boolean(errors.score)}
                {...(errors.score && { helperText: 'This field is required' })}
              />
            )}
          />

          <StyledBorderedBox
            width={isSm ? '50%' : '30%'}
            display='flex'
            justifyContent='center'
            alignItems='center'
            sx={{
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
            }}
          >
            <Typography>Out of {maxScore}</Typography>
          </StyledBorderedBox>
        </Box>
      </Box>
    </>
  )
}

export default Slide4

import { Box, Button, Dialog, DialogActions, DialogContent, Theme, Typography, useMediaQuery } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { UseMutationResult } from 'react-query'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useUserContext } from 'src/@core/context/UserContext'
import {
  courseToMaxMinAndIncrementsType,
  courseToScoreMap,
  checkTargetScoreAndReturnError,
  noDataMinMaxAndIncrements,
} from 'src/pages/dashboard/helpers'
import { getProductCodeForProductName } from '../helpers'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig
type Props = {
  isOpen: boolean
  handleClose: () => void
  score: number
  updateTargetScoreAndDateMutation: UseMutationResult<
    any,
    any,
    {
      data: {
        examDate?: number
        prepDate?: number
        targetScore?: number
      }
      onSuccess?: (() => void) | undefined
      onError?: (() => void) | undefined
    },
    unknown
  >
}

type FormDataTypes = {
  score: number
}

const AverageFLTScoreModal = (props: Props) => {
  const { isOpen, handleClose, score, updateTargetScoreAndDateMutation } = props
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const {
    control,
    getValues,
    formState: { errors },
  } = useForm<FormDataTypes>({
    defaultValues: {
      score,
    },
  })

  const { userActiveProduct } = useUserContext()

  const activeProductCode = userActiveProduct
    ? (getProductCodeForProductName(userActiveProduct) as keyof courseToMaxMinAndIncrementsType)
    : 'NO_PRODUCT'
  const activeProductMixMaxAndIntervalScore =
    activeProductCode in courseToScoreMap ? courseToScoreMap[activeProductCode] : noDataMinMaxAndIncrements

  const handleScoreChange = () => {
    const targetScore = getValues('score')

    const { error, message } = checkTargetScoreAndReturnError(targetScore, activeProductMixMaxAndIntervalScore)

    if (error) {
      toast.error(message)
      return
    }
    updateTargetScoreAndDateMutation.mutate({
      data: {
        targetScore,
      },
      onSuccess: () => {
        handleClose()
      },
    })
  }

  return (
    <Dialog
      fullWidth
      open={isOpen}
      onClose={handleClose}
      sx={{
        '& .MuiPaper-root': { width: '100%', maxWidth: 550, height: '100%', maxHeight: 500 },
        backdropFilter: 'blur(1px)',
        '& .MuiDialog-paper': { overflow: 'visible' },
        '& .MuiDialogContent-root': {
          padding: '0px !important',
        },
        borderRadius: 5,
      }}
    >
      <DialogContent
        sx={{
          margin: 10,
        }}
      >
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
                value={value || ''}
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
            <Typography>Out of 800</Typography>
          </StyledBorderedBox>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'end',
          borderTop: border,
          pt: 4,
          pb: 8,
        }}
      >
        <Box display='flex' gap={4} alignItems='center'>
          <Button onClick={handleScoreChange} variant='contained' color='primary'>
            Change
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose}>
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default AverageFLTScoreModal

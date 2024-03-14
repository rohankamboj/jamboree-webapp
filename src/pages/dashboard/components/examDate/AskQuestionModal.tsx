import { Box, Button, Dialog, DialogActions, DialogContent, useTheme } from '@mui/material'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast, { LoaderIcon } from 'react-hot-toast'
import { UseMutationResult } from 'react-query'
import { useUserContext } from 'src/@core/context/UserContext'
import { checkTargetScoreAndReturnError, selectedCourseMinMaxAndIntervalType } from '../../helpers'
import Slide1 from './Slide1'
import Slide2 from './Slide2'
import Slide3 from './Slide3'
import Slide4 from './Slide4'
import themeConfig from 'src/configs/themeConfig'

const { border } = themeConfig

type Props = {
  currentSlide: number | null
  setModalVisibility: (value: number | null) => void
  updateTargetScoreAndExamDateMutation: UseMutationResult<
    any,
    any,
    {
      data: {
        hasAttempted: number
        examDate: number
        targetScore: number
      }
      onSuccess?: (() => void) | undefined
      onError?: (() => void) | undefined
    },
    unknown
  >
  data: {
    date: number
    targetScore: number
    hasAttempted: 0 | 1
    selectedCourseMinMaxAndIncrements: selectedCourseMinMaxAndIntervalType
  }
}

export type FormDataTypes = {
  date: Date
  score: number
  hasAttempted: 0 | 1
}

const AskQuestionModal = (props: Props) => {
  const {
    currentSlide,
    setModalVisibility,
    updateTargetScoreAndExamDateMutation,
    data: { targetScore, hasAttempted, date, selectedCourseMinMaxAndIncrements },
  } = props
  const [selectedSlide, setSelectedSlide] = useState(currentSlide || 1)

  const { userInit } = useUserContext()

  const handleClose = () => setModalVisibility(null)

  const handleNextSlide = () => setSelectedSlide(selectedSlide => selectedSlide + 1)

  const handlePreciousSlide = () => setSelectedSlide(selectedSlide => selectedSlide - 1)

  const {
    control,
    getValues,
    formState: { errors },
  } = useForm<FormDataTypes>({
    defaultValues: {
      date: new Date(new Date(date).getTime() * 1000),
      hasAttempted: hasAttempted,
      score: targetScore,
    },
  })

  const componentsOnSlides = useMemo(
    () => ({
      1: <Slide1 />,
      2: <Slide2 control={control} errors={errors} />,
      3: <Slide3 hasAttempted={hasAttempted} courseName={userInit?.data.course.toUpperCase() || 'NA'} />,
      4: <Slide4 control={control} errors={errors} maxScore={selectedCourseMinMaxAndIncrements.max} />,
    }),
    [],
  )

  const currentSlideComponent = componentsOnSlides[selectedSlide as keyof typeof componentsOnSlides]

  const handleUpdateTargetScoreAndExamDate = () => {
    const targetScore = getValues('score')
    console.log({ targetScore, selectedCourseMinMaxAndIncrements })

    const { error, message } = checkTargetScoreAndReturnError(targetScore, selectedCourseMinMaxAndIncrements)
    console.log({ error, message })
    if (error) {
      toast.error(message)
      return
    }

    updateTargetScoreAndExamDateMutation.mutate({
      data: {
        hasAttempted: getValues('hasAttempted'),
        examDate: new Date(getValues('date')).getTime() / 1000,
        targetScore,
      },
      onSuccess: () => {
        setModalVisibility(null)
      },
    })
  }

  return (
    <Dialog
      fullWidth
      open={!!currentSlide}
      onClose={handleClose}
      sx={{
        '& .MuiPaper-root': { width: '100%', maxWidth: 550, height: '100%', maxHeight: 700 },
        backdropFilter: 'blur(1px)',
        // '& .MuiDialog-paper': { overflow: 'visible' },
        '& .MuiDialogContent-root': {
          padding: '0px !important',
        },
        borderRadius: 5,
      }}
    >
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          borderRadius: 5,
        }}
      >
        {currentSlideComponent}
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'space-between',
          borderTop: border,
          pt: 4,
          pb: 8,
        }}
      >
        <SlidesComponent currentSlide={selectedSlide} />
        <Box display='flex' gap={4} alignItems='center'>
          {selectedSlide > 1 && (
            <Button variant='tonal' color='secondary' disabled={selectedSlide === 1} onClick={handlePreciousSlide}>
              Back
            </Button>
          )}
          <Button
            variant='contained'
            color='primary'
            onClick={selectedSlide === 4 ? handleUpdateTargetScoreAndExamDate : handleNextSlide}
          >
            {selectedSlide === 1 ? (
              `Let's Get Started`
            ) : selectedSlide === 4 ? (
              // TODO: Make this button disabled when mutation is loading
              // Show loading indicator here as well .
              updateTargetScoreAndExamDateMutation.isLoading ? (
                <Box
                  sx={{
                    px: 5,
                    py: 0.5,
                  }}
                >
                  <LoaderIcon />
                </Box>
              ) : (
                'Submit'
              )
            ) : (
              'Next'
            )}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

const SlidesComponent = ({ currentSlide }: { currentSlide: number }) => {
  const theme = useTheme()
  return (
    <Box display='flex' alignItems='center' gap={2}>
      {Array.from({
        length: 4,
      }).map((_, i) => (
        <Box
          width='25px'
          height='4px'
          bgcolor={currentSlide === i + 1 ? theme.palette.primary.main : theme.palette.primary.light}
        ></Box>
      ))}
    </Box>
  )
}

export default AskQuestionModal

import { Box, Button } from '@mui/material'
import { useMemo, useState } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'
import Typography from 'src/@core/components/common/Typography'
import { useUserContext } from 'src/@core/context/UserContext'
import { CustomQuizBuilderFormFieldsType } from '..'
import { allowedQuestionAttemptsType, quizDurationOptions } from '../../quiz/constants'

import { getSectionsIdsForSectionNames } from '../helpers'
import Step1Component from './Step1'
import Step2Component from './Step2'
import themeConfig from 'src/configs/themeConfig'

const { border } = themeConfig

const getQuizTimeFromSelectedDurationFormField = (
  selectedDurationOption: (typeof quizDurationOptions)[number]['value'],
  customTime: number,
  numberOfQuestionSelectedByUser: number,
) => {
  if (selectedDurationOption === 'Untimed! I am Learning') {
    return 0
  }
  if (selectedDurationOption === 'Timed! Practice Mode') {
    return numberOfQuestionSelectedByUser * 2
  }
  if (selectedDurationOption === 'Ninja Challenging the odds') {
    return numberOfQuestionSelectedByUser * 2 - 2
  }
  if (selectedDurationOption === 'Custom Time (Counter)') {
    return customTime
  }
  return 0
}

const CustomQuizBuilderForm = ({
  hookForm,
  handleGenerateCustomQuizAndAttemptIdAndNavigateToQuiz,
  kakshaQuestionBankQuestionsMeta,
  isOgQuestionsEnabled = false,
}: {
  hookForm: UseFormReturn<CustomQuizBuilderFormFieldsType, any, undefined>
  isOgQuestionsEnabled?: boolean

  kakshaQuestionBankQuestionsMeta: KakshaQuestionBankQuestionMeta[] | undefined
  handleGenerateCustomQuizAndAttemptIdAndNavigateToQuiz: (
    createQuizPayload: GetKakshaQuestionsFromQBWithSectionsRequest,
    formData: CustomQuizBuilderFormFieldsType,
  ) => void
}) => {
  const { control, handleSubmit } = hookForm

  const [formStep, setFormStep] = useState(1)

  const { kakshaUserId } = useUserContext()

  const [subjects, ptids, questionType, difficulty, topicids] = useWatch({
    control,
    name: ['subjects', 'ptids', 'questionType', 'difficulty', 'topics'],
  })

  // const [iQuestionsTabChangeModalOpen, setIsQuestionsTabChangeModalOpen] = useState(false)

  // FIXME: modal should only visible when tab will be switch, not when page render.
  // useEffect(() => {
  //   return () => {
  //     setIsQuestionsTabChangeModalOpen(true)
  //   }
  // }, [])

  const onsubmit = (formData: CustomQuizBuilderFormFieldsType) => {
    const rc_count = formData.rc_count ?? 0
    const selectedDurationOption = formData.duration

    const numberOfQuestionSelectedByUser = formData.question_count
    const userEnteredCustomTime = formData.customQuizTime
    const selectedQuestionAttemptType = formData.questionType
    const quiztime = getQuizTimeFromSelectedDurationFormField(
      // @ts-ignore
      selectedDurationOption,
      userEnteredCustomTime,
      numberOfQuestionSelectedByUser,
    )

    if (!selectedQuestionAttemptType) {
      alert('Please select question type')
      return
    }
    const payload: GetKakshaQuestionsFromQBWithSectionsRequest = {
      quizname: formData.quizname,
      test_types: isOgQuestionsEnabled ? [1] : [0],
      rc_count: rc_count,
      quiztime,
      question_count: Number(formData.question_count),
      is_attempted: (['Attempted', 'Mixed'] as allowedQuestionAttemptsType[]).includes(selectedQuestionAttemptType)
        ? 1
        : 0,

      is_correct: (['Incorrect', 'Mixed'] as allowedQuestionAttemptsType[]).includes(selectedQuestionAttemptType)
        ? 1
        : 0,
      ptids: formData.ptids ?? [],
      sectionids: Array.from(new Set(getSectionsIdsForSectionNames(formData.subjects ?? []))),
      topicids: formData.topics ?? [],
      difficulty: formData.difficulty,
      sid: kakshaUserId as number,
      // Static values.
      quizmode: 'Practice',
    }

    handleGenerateCustomQuizAndAttemptIdAndNavigateToQuiz(payload, formData)
  }

  const { questions, filteredQuestionsAfterStep1Filter, topicsAfterFilter, filteredQuestionsAfterStep2Filter } =
    useMemo(() => {
      const selectedTabQuestion = kakshaQuestionBankQuestionsMeta?.filter(ques =>
        isOgQuestionsEnabled ? ques.is_og : !ques.is_og,
      )

      const filteredQuestionsAfterStep1Filter: KakshaQuestionBankQuestionMeta[] =
        selectedTabQuestion?.filter(ques => {
          let isMatch = true

          if (!subjects?.length || !ptids?.length || !difficulty?.length) return false

          if (ptids && !ptids.includes(ques.ptid)) isMatch = false
          if (subjects && !subjects.map(sb => sb.toLowerCase()).includes(ques.section.toLowerCase())) isMatch = false
          // @ts-ignore
          if (difficulty.length && !difficulty.includes(ques.difficulty.toLowerCase())) isMatch = false // if (questionType) {

          return isMatch
        }) || []

      const topicsAfterFilter: { label: string; value: number; is_strength: number }[] = []
      const topicIdSet = new Set()
      filteredQuestionsAfterStep1Filter.forEach(ques => {
        if (topicIdSet.has(ques.topicid)) return
        topicIdSet.add(ques.topicid)
        topicsAfterFilter.push({ label: ques.topic, value: ques.topicid, is_strength: ques.is_strength })
      })

      const filteredQuestionsAfterStep2Filter = filteredQuestionsAfterStep1Filter.filter(ques => {
        let isMatch = true
        if (questionType) {
          switch (questionType) {
            case 'Attempted':
              if (!ques.attempted) isMatch = false
              break
            case 'Unattempted':
              if (ques.attempted) isMatch = false
              break
            case 'Incorrect':
              if (ques.is_correct) isMatch = false
              break
            case 'Unanswered':
              if (ques.is_correct !== -1) isMatch = false
              break
            case 'Mixed':
              break
            default:
              isMatch = false
          }
        }

        if (!topicids.includes(ques.topicid)) isMatch = false

        return isMatch
      })

      return {
        questions: selectedTabQuestion ?? [],
        filteredQuestionsAfterStep1Filter,
        topicsAfterFilter,
        filteredQuestionsAfterStep2Filter,
      }
    }, [questionType, subjects, ptids, difficulty, topicids, kakshaQuestionBankQuestionsMeta, isOgQuestionsEnabled])

  return (
    <>
      {/* TODO: Integrate this later on. */}
      {/* {iQuestionsTabChangeModalOpen && (
        <QuestionsTabChangeModal
          isOpen={iQuestionsTabChangeModalOpen}
          handleCloseModal={handleQuestionsTabChangeModalClose}
        />
      )} */}

      <form onSubmit={handleSubmit(onsubmit)}>
        {formStep === 1 ? (
          <Step1Component
            setFormStep={setFormStep}
            hookForm={hookForm}
            filteredQuestionCount={filteredQuestionsAfterStep1Filter?.length}
            totalQuestions={questions?.length}
          />
        ) : (
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            border={border}
            padding={4}
            borderRadius={1}
          >
            <Typography>Step 1/2</Typography>
            <Box display='flex' gap={2} alignItems='center'>
              <Typography>
                Filtered Question {filteredQuestionsAfterStep1Filter?.length} / {questions.length}
              </Typography>
              <Button variant='outlined' color='secondary' onClick={() => setFormStep(1)}>
                Edit
              </Button>
            </Box>
          </Box>
        )}
        {formStep === 2 && (
          <Step2Component
            hookForm={hookForm}
            topics={topicsAfterFilter}
            filteredQuestionCount={filteredQuestionsAfterStep2Filter?.length}
            totalQuestions={filteredQuestionsAfterStep1Filter?.length}
          />
        )}
      </form>
    </>
  )
}

export default CustomQuizBuilderForm

import { Grid, Theme, useMediaQuery } from '@mui/material'
import { useForm } from 'react-hook-form'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import { allowedQuestionAttemptsType, durationOptions, quizSubjectAndSectionMap } from '../quiz/constants'
import { useKakshaQuestionBank } from '../quiz/hooks/useKakshaQuestion'
import CustomQuizBuilderForm from './components/CustomQuizBuilderForm'
import CustomQuizBuilderPreview from './components/CustomQuizBuilderPreview'
import { extractQuestionIdsBySectionsFromSectionsAndCategoriesMeta, generateQuizName } from './helpers'

import { TabPanel } from '@mui/lab'
import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomBreadcrumbs } from 'src/@core/components/common/Breadcrumb'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import { LOCAL_STORAGE_KEYS } from 'src/@core/constants'
import useLocalStorage from 'src/@core/hooks/useLocalStorage'
import CustomizedTab from 'src/components/common/CustomizedTab'
import useTests from '../quiz/hooks/useTests'
import TranslucentLoader from 'src/@core/components/common/TranslucentLoader'

export type CustomQuizBuilderFormFieldsType = {
  quizname: string
  subjects?: (typeof quizSubjectAndSectionMap)[number]['category'][]
  ptids?: number[]
  question_count: number
  difficulty: QuizFilterDifficulties[]
  questionType?: allowedQuestionAttemptsType
  duration?: (typeof durationOptions)[number]
  topics: number[]
  questions: number[]
  customQuizTime?: number
  rc_count?: number
}
function CreateCustomQuizBuilder() {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const {
    generateQuizWithSectionsFromKakshaQuestionBankMutation: { isLoading: isQuizQuestionsGenerationInProgress },
  } = useKakshaQuestionBank()

  const {
    generateQuizWithSectionsFromKakshaQuestionBankMutation,
    getKakshaQuestionBankQuery: { data: kakshaQuestionBankQuestionsMeta, isLoading: isQuestionBankLoading },
  } = useKakshaQuestionBank()

  const customQuizBuilderHookForm = useForm<CustomQuizBuilderFormFieldsType>({
    defaultValues: {
      quizname: generateQuizName('Custom Quiz'),
      subjects: [],
      ptids: [],
      question_count: undefined,
      difficulty: [],
      questionType: undefined,
      duration: undefined,
      topics: [],
      questions: [],
      customQuizTime: undefined,
      rc_count: undefined,
    },
  })

  const { generateAttemptIdForCustomQuizMutation } = useTests()

  const [, setAttemptIdInLocalStorage] = useLocalStorage(LOCAL_STORAGE_KEYS.ATTEMPT_ID)
  const [, setQuizDataInLocalStorage] = useLocalStorage<KakshaQuizWithSectionsAndQuestionsMetaFromQuestionBank>(
    LOCAL_STORAGE_KEYS.CURRENT_CUSTOM_QUIZ_META,
  )
  const [, setCustomQuizCreateMeta] = useLocalStorage(LOCAL_STORAGE_KEYS.CREATE_QUIZ_META)

  const navigate = useNavigate()

  // handle auto select values
  // useEffect(() => {}, [])

  const handleGenerateCustomQuizAndAttemptIdAndNavigateToQuiz = (
    createQuizPayload: GetKakshaQuestionsFromQBWithSectionsRequest,
    formData: CustomQuizBuilderFormFieldsType,
  ) => {
    function generateAttemptId(data: KakshaQuizWithSectionsAndQuestionsMetaFromQuestionBank) {
      const sections = quizSubjectAndSectionMap
        .filter(({ ptid }) => createQuizPayload.ptids?.includes(ptid))
        .map(({ id }) => id)

      generateAttemptIdForCustomQuizMutation.mutate({
        data: {
          filter: {
            quizname: createQuizPayload.quizname,
            generatedOn: new Date().getTime(),
            // @ts-ignore
            timeSelected: formData.duration || 'NA',
            rc_count: createQuizPayload.rc_count,
            question_count: createQuizPayload.question_count,
            quiztime: createQuizPayload.quiztime,
            quizDifficulty: createQuizPayload.difficulty,
            quizType: 'Customized',
            quizSubject: formData.subjects || [],
            questions: extractQuestionIdsBySectionsFromSectionsAndCategoriesMeta(data),
            quizSection: sections,
            section: sections.join(','),
            quizmode: 'Practice',
            quizTopic: createQuizPayload.topicids,
            quizSW: 'All',
            quizQuestionType: 'Mixed',
          },
        },
        handleSuccess: ({ attemptID }) => {
          setQuizDataInLocalStorage(data)
          setAttemptIdInLocalStorage(attemptID)
          setCustomQuizCreateMeta(createQuizPayload)
          navigate('/app/custom-test-player')
        },
      })
    }

    generateQuizWithSectionsFromKakshaQuestionBankMutation.mutate({
      data: createQuizPayload,
      onSuccess: data => {
        if (!data.length) {
          alert('No questions found for the selected filters')
          return
        }
        generateAttemptId(data)
      },
    })
  }

  const questionsBuilderTabs = [
    {
      value: 'portal-questions',
      label: 'Portal Questions',
      component: (
        <CustomQuizBuilderForm
          hookForm={customQuizBuilderHookForm}
          kakshaQuestionBankQuestionsMeta={kakshaQuestionBankQuestionsMeta}
          handleGenerateCustomQuizAndAttemptIdAndNavigateToQuiz={handleGenerateCustomQuizAndAttemptIdAndNavigateToQuiz}
        />
      ),
    },
    {
      value: 'og-questions',
      label: 'OG Questions',
      component: (
        <CustomQuizBuilderForm
          isOgQuestionsEnabled
          hookForm={customQuizBuilderHookForm}
          kakshaQuestionBankQuestionsMeta={kakshaQuestionBankQuestionsMeta}
          handleGenerateCustomQuizAndAttemptIdAndNavigateToQuiz={handleGenerateCustomQuizAndAttemptIdAndNavigateToQuiz}
        />
      ),
    },
  ]

  if (
    isQuizQuestionsGenerationInProgress ||
    isQuestionBankLoading ||
    generateAttemptIdForCustomQuizMutation.isLoading
  ) {
    return <FallbackSpinner />
  }

  return (
    <Fragment>
      {generateAttemptIdForCustomQuizMutation.isLoading || isQuizQuestionsGenerationInProgress ? (
        <TranslucentLoader />
      ) : null}
      <CustomHelmet title='Jamboree Online PQB' />
      <Grid>
        <CustomBreadcrumbs title='Quiz' />
        <Grid container spacing={6}>
          {!isSm && (
            <Grid item md={4} xl={3}>
              <CustomQuizBuilderPreview control={customQuizBuilderHookForm.control} />
            </Grid>
          )}

          <Grid item xs={12} md={8} xl={9}>
            <CustomizedTab tabs={questionsBuilderTabs}>
              {questionsBuilderTabs.map(item => {
                return (
                  <TabPanel key={item.value} value={item.value} sx={{ pl: 0 }}>
                    {item.component}
                  </TabPanel>
                )
              })}
            </CustomizedTab>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default CreateCustomQuizBuilder

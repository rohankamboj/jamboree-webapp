import { Box, Button, Card, Divider, Fade, Theme, useMediaQuery, useTheme } from '@mui/material'
import { useMemo, useRef, useState } from 'react'
import Icon from 'src/@core/components/icon'

import { useForm, useWatch } from 'react-hook-form'
import { type UseQueryResult } from 'react-query'
import { useNavigate } from 'react-router-dom'
import Typography from 'src/@core/components/common/Typography'
import { LOCAL_STORAGE_KEYS } from 'src/@core/constants'
import { useUserContext } from 'src/@core/context/UserContext'
import useLocalStorage from 'src/@core/hooks/useLocalStorage'
import { formatSecondsToDateString } from 'src/@core/utils/helpers'
import StartQuizModel from 'src/pages/custom-quiz-builder/components/modal/StartQuizModal'
import {
  extractQuestionIdsBySectionsFromSectionsAndCategoriesMeta,
  generateQuizName,
  getSectionsIdsForSectionNames,
} from '../../../custom-quiz-builder/helpers'
import {
  QuizzesForYouType,
  personalizedQuizzes,
  quizSubjectAndSectionMap,
  quizzesForYouCategories,
  sectionPtIdToSubjectShortCode,
} from '../../constants'
import { useKakshaQuestionBank } from '../../hooks/useKakshaQuestion'
import useTests from '../../hooks/useTests'
import CustomizedQuizModal, { CreateCustomizedOnDemandQuizShortForm } from '../customisedQuizModal'
import TranslucentLoader from 'src/@core/components/common/TranslucentLoader'
import { sortByLatestLastUpdatedOnTimestamp } from 'src/pages/helpers'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig
const data = [
  {
    id: 1,
    title: 'Pick your desired topics, difficulty, question types.',
  },
  {
    id: 2,
    title: 'Select from strengths or target weaknesses.',
  },
  {
    id: 3,
    title: 'Set the number of questions and time limit.',
  },
]

const OnDemandQuiz = ({
  pastAttemptsQuery,
  handleMoveToPastAttemptsTab,
}: {
  pastAttemptsQuery: UseQueryResult<GetCustomTestPastAttemptsAPIResponse, any>
  handleMoveToPastAttemptsTab: () => void
}) => {
  const theme = useTheme()
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const navigate = useNavigate()

  const { kakshaUserId } = useUserContext()
  const { createPersonalizedKakshaQuizAndGetSectionsMutation } = useKakshaQuestionBank()
  const { createPersonalizedQuizMutationAndGetAttemptId } = useTests()

  const [showStartQuizConfirmationModal, setShowStartQuizConfirmationModal] = useState<
    CreateCustomizedOnDemandQuizShortForm | undefined
  >(undefined)
  const [, setAttemptIdInLocalStorage] = useLocalStorage(LOCAL_STORAGE_KEYS.ATTEMPT_ID)
  const [, setQuizDataInLocalStorage] = useLocalStorage<KakshaQuizWithSectionsAndQuestionsMetaFromQuestionBank>(
    LOCAL_STORAGE_KEYS.CURRENT_CUSTOM_QUIZ_META,
  )
  const [, setCustomQuizCreateMeta] = useLocalStorage(LOCAL_STORAGE_KEYS.CREATE_QUIZ_META)

  const [isCreateCustomQuizModalVisible, setIsCreateCustomQuizModalVisible] = useState(false)

  const pressedCustomQuizType = useRef<(typeof personalizedQuizzes)[number] | undefined>()

  const { generateAttemptIdForCustomQuizMutation } = useTests()

  const [, setCustomQuizMetaInLocalStorage] = useLocalStorage<KakshaQuizWithSectionsAndQuestionsMetaFromQuestionBank>(
    LOCAL_STORAGE_KEYS.CURRENT_CUSTOM_QUIZ_META,
  )

  const {
    getKakshaQuestionBankQuery: { data: kakshaQuestionBankQuestionsMeta },
  } = useKakshaQuestionBank()

  const filteredTestedRecordsWithCompletedStatus = useMemo(() => {
    if (!pastAttemptsQuery.data?.data) return []

    return pastAttemptsQuery.data?.data
      .filter(attempt => attempt.status === '3')
      .sort(sortByLatestLastUpdatedOnTimestamp)
  }, [pastAttemptsQuery.data?.data])

  const handleNavigateToCustomQuizBuilder = () => {
    navigate(`/pages/quiz/customised-quiz`)
  }

  const handleCreateAttemptIdAndNavigateToCustomQuiz = (
    kakshaSectionwiseQuestions: KakshaQuizWithSectionsAndQuestionsMetaFromQuestionBank,
    selectedQuiz: QuizzesForYouType,
  ) => {
    const quizSections = quizSubjectAndSectionMap
      .filter(({ sectionid }) => selectedQuiz.sectionid === sectionid)
      .map(({ id }) => id)
    const payload: CustomAndPersonalizedQuizFilters = {
      generatedOn: new Date().getTime() / 1000,
      questions: extractQuestionIdsBySectionsFromSectionsAndCategoriesMeta(kakshaSectionwiseQuestions),
      quizname: generateQuizName(selectedQuiz.quizName),
      quizSubject: [selectedQuiz.quizSubject.toLowerCase()],
      quizSection: quizSections,
      section: quizSections.join(','),
      // Static fields for quizzes for you.
      question_count: 15,
      quizDifficulty: ['easy', 'medium', 'hard'],
      quizType: 'Personalized',
      quizmode: 'Practice',
      timeSelected: 'Timed! Practice Mode.',
      // Unused Fields
      quizQuestionType: '',
      quizSW: '',
      quiztime: 0,
      rc_count: 0,
      quizTopic: [],
    }

    createPersonalizedQuizMutationAndGetAttemptId.mutate({
      data: { filter: payload },
      handleSuccess: data => {
        setAttemptIdInLocalStorage(data.attemptID)
        setQuizDataInLocalStorage(kakshaSectionwiseQuestions)
        setCustomQuizCreateMeta(payload)
        navigate('/app/custom-test-player')
      },
    })
  }

  const handleOnClickQuizzesForYouBegin = (quiz: QuizzesForYouType) => {
    createPersonalizedKakshaQuizAndGetSectionsMutation.mutate({
      data: {
        sid: kakshaUserId as number,
        sectionid: quiz.sectionid,
        question_count: 15,
        ptids: [quiz.ptid],
        pqb_testtype: quiz.quizID,
        quizMode: 'Practice',
      },
      handleSuccess: data => handleCreateAttemptIdAndNavigateToCustomQuiz(data, quiz),
    })

    // const handleNavigateToCustomQuiz = () => navigate('/app/custom-test-player')
  }

  const handleShowCreateCustomQuizModalAndSetCustomQuizType = (quiz: (typeof personalizedQuizzes)[number]) => {
    pressedCustomQuizType.current = quiz
    setIsCreateCustomQuizModalVisible(true)
  }

  const createQuizHookForm = useForm<CreateCustomizedOnDemandQuizShortForm>()

  const handleCloseStartQuizModal = () => {
    createQuizHookForm.reset()
    setShowStartQuizConfirmationModal(undefined)
  }

  const handleCreateQuiz = (formData: CreateCustomizedOnDemandQuizShortForm) => {
    setShowStartQuizConfirmationModal(formData)
  }

  const handleStartOnDemandQuiz = () => {
    if (!pressedCustomQuizType.current) {
      alert('No quiz selected was found.')
      return
    }
    const { ptids, question_count, subjects } = createQuizHookForm.getValues()

    const { quizID } = pressedCustomQuizType.current

    const payload: CreatePersonalizedQuizRequest = {
      sid: kakshaUserId as number,
      sectionid: getSectionsIdsForSectionNames(subjects ?? [])[0],
      question_count,
      ptids,
      pqb_testtype: quizID,
      quizMode: 'Practice',
    }

    // Testing code ends
    createPersonalizedKakshaQuizAndGetSectionsMutation.mutate({
      data: payload,
      handleSuccess: data => handleGenerateAttemptIdFromOnDemandCustomizedQuizResponse(data, payload),
    })
  }

  const handleGenerateAttemptIdFromOnDemandCustomizedQuizResponse = (
    responseFromKakshaAPI: KakshaQuizWithSectionsAndQuestionsMetaFromQuestionBank,
    _createQuizPayload: CreatePersonalizedQuizRequest,
  ) => {
    if (!pressedCustomQuizType.current) {
      alert('No quiz selected was found.')
      return
    }

    const { quizName, quizTime } = pressedCustomQuizType.current

    const fromData = createQuizHookForm.getValues()

    const selectedSectionShortCodes = fromData.ptids.map(ptid => sectionPtIdToSubjectShortCode[ptid])

    const payload: CustomAndPersonalizedQuizFilters = {
      quizname: generateQuizName(quizName),
      generatedOn: Date.now() / 1000, // add epoch date
      question_count: _createQuizPayload.question_count,
      quizDifficulty: ['easy', 'medium', 'hard'],
      // [rc,cr]
      section: selectedSectionShortCodes.join(','),
      quizSection: selectedSectionShortCodes,
      timeSelected: quizTime,
      quizSubject: fromData.subjects,
      questions: extractQuestionIdsBySectionsFromSectionsAndCategoriesMeta(responseFromKakshaAPI),

      // Unset values
      quizmode: 'Practice',
      quizType: 'Customized',
      quizTopic: [], // distinct topics
      quizSW: '',
      rc_count: 0,
      quizQuestionType: '',
      quiztime: 0,
    }
    generateAttemptIdForCustomQuizMutation.mutate({
      data: { filter: payload },
      handleSuccess: ({ attemptID }) => {
        setAttemptIdInLocalStorage(attemptID)
        setCustomQuizMetaInLocalStorage(responseFromKakshaAPI)
        setCustomQuizCreateMeta(payload)
        navigate('/app/custom-test-player')
      },
    })
  }

  const formFilterToUserForFilteringQuestions = useWatch({
    control: createQuizHookForm.control,
    name: ['subjects', 'ptids'],
  })

  const filteredQuestions = useMemo(() => {
    if (!kakshaQuestionBankQuestionsMeta) return []

    const [subjects, ptids] = formFilterToUserForFilteringQuestions

    return kakshaQuestionBankQuestionsMeta.filter(ques => {
      let doesQuestionSatisfyFilter = true

      if (!subjects) doesQuestionSatisfyFilter = false
      if (!ptids) doesQuestionSatisfyFilter = false

      if (subjects?.map(sb => sb.toLowerCase())?.includes(ques.section.toLowerCase())) doesQuestionSatisfyFilter = false
      if (ptids?.includes(ques.ptid as any)) doesQuestionSatisfyFilter = false

      return doesQuestionSatisfyFilter
    })
  }, [formFilterToUserForFilteringQuestions])

  const isLoaderVisible =
    createPersonalizedKakshaQuizAndGetSectionsMutation.isLoading ||
    createPersonalizedQuizMutationAndGetAttemptId.isLoading

  return (
    <>
      {isLoaderVisible && <TranslucentLoader />}

      {isCreateCustomQuizModalVisible && (
        <CustomizedQuizModal
          hookForm={createQuizHookForm}
          handleModalClose={() => setIsCreateCustomQuizModalVisible(false)}
          handleCreateQuiz={handleCreateQuiz}
          filteredQuestionCountAfterUserSelection={filteredQuestions.length}
        />
      )}

      {showStartQuizConfirmationModal && (
        <StartQuizModel
          getValues={createQuizHookForm.getValues}
          handleClose={handleCloseStartQuizModal}
          handleStartQuiz={handleStartOnDemandQuiz}
          isLoading={createPersonalizedKakshaQuizAndGetSectionsMutation.isLoading}
          questionsCount={filteredQuestions.length}
        />
      )}

      <Box display='flex' flexDirection='column' gap={8}>
        <Box display='flex' sx={{ ...(isSm && { flexDirection: 'column' }) }}>
          <Box
            padding={isSm ? 'auto' : 10}
            py={isSm ? 10 : 'auto'}
            display='flex'
            bgcolor='#FFFEF7'
            flexDirection='column'
            gap={2}
            width={isSm ? '100%' : '50%'}
          >
            <Typography variant='h1'>Build your custom quiz</Typography>
            <Typography variant='h6'>
              Take charge of your prep with a customized quiz catered to your needs. Options to:
            </Typography>
            <Box display='flex' flexDirection='column' gap={2}>
              {data.map(item => (
                <Box key={item.id} display='flex' gap={2} alignItems='center'>
                  <Box
                    borderRadius='100%'
                    bgcolor='rgba(40, 199, 111, 0.3)'
                    width={25}
                    height={25}
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    border='1px solid rgba(40, 199, 111, 1)'
                  >
                    <Icon icon='tabler:check' color='rgba(40, 199, 111, 1)' />
                  </Box>
                  <Typography color='primary'>{item.title}</Typography>
                </Box>
              ))}
            </Box>
            <Box display='flex' alignItems='center' gap={2} mt={4}>
              <Button variant='contained' color='primary' onClick={handleNavigateToCustomQuizBuilder}>
                Start Building
                <Icon icon='ph:arrow-up-right' />
              </Button>
              <Box
                borderRadius={1}
                bgcolor='#F1F1F0'
                display='flex'
                height='45px'
                width={40}
                justifyContent='center'
                alignItems='center'
                sx={{ cursor: 'pointer' }}
              >
                <Icon icon='ph:info-light' color={theme.palette.grey[50]} />
              </Box>
            </Box>
          </Box>
          <Box display='flex' flexDirection='column' gap={2} width={isSm ? '100%' : '50%'}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant='h4'>Quizzes For You</Typography>
              {/* <Button variant='outlined' color='primary'>
                Past Attempts
              </Button> */}
            </Box>
            <Card
              sx={{
                display: 'flex',
                border: `1px solid rgba(219, 218, 222, 1)`,
                flexDirection: 'column',
                width: '100%',
                boxShadow: 'none',
              }}
            >
              <Box paddingX={4} paddingY={2}>
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                  <Box
                    display='flex'
                    sx={{
                      flexDirection: isSm ? 'column' : 'row',
                      alignItems: isSm ? 'start' : 'center',
                    }}
                    gap={2}
                  >
                    <Typography variant='h5'>
                      Week 7{/* Week in above format */}
                      {/* Generate week from current date */}
                    </Typography>

                    {/* 12 Aug */}
                    {/* Date in above format */}
                    <Typography variant='paragraphSmall'>
                      {new Date().toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>

                  <Box display='flex' gap={2} alignItems='center'>
                    <CustomPaginationIcon icon='ep:arrow-left' />
                    <CustomPaginationIcon icon='ep:arrow-right' />
                  </Box>
                </Box>
              </Box>
              {quizzesForYouCategories.map((quiz, idx) => {
                return (
                  <div key={idx}>
                    <Divider />
                    <QuizzesForYouListItem
                      handleOnClickBeginQuiz={handleOnClickQuizzesForYouBegin}
                      quiz={quiz}
                      idx={idx}
                    />
                  </div>
                )
              })}
            </Card>
          </Box>
        </Box>
        <Box>
          <Typography variant='h4'>On-demand Quiz</Typography>
          <Box display='flex' gap={8} mt={8} sx={{ ...(isSm && { flexDirection: 'column' }) }}>
            {personalizedQuizzes.map(quiz => (
              <Box
                key={quiz.quizID}
                border={border}
                padding={8}
                display='flex'
                flexDirection='column'
                gap={4}
                width={isSm ? '100%' : '25%'}
                borderRadius={1}
              >
                <Typography variant='h5'>{quiz.quizName}</Typography>
                <img src={quiz.image} alt={quiz.quizName} width={70} height={70} />
                <Box display='flex' gap={2}>
                  <Button variant='tonal' color='secondary' size='small'>
                    {quiz.quizTime}
                  </Button>
                </Box>
                <Typography variant='paragraphSmall' minHeight={isSm ? 'auto' : 80}>
                  {quiz.qizDetail}
                </Typography>
                <Box>
                  <Button
                    onClick={() => handleShowCreateCustomQuizModalAndSetCustomQuizType(quiz)}
                    variant='outlined'
                    color='primary'
                    size='small'
                  >
                    Begin
                    <Icon icon='ep:arrow-right' width={16} />
                  </Button>
                </Box>
              </Box>
            ))}
            <Card
              sx={{
                display: 'flex',
                border: `1px solid rgba(219, 218, 222, 1)`,
                flexDirection: 'column',
                width: isSm ? '100%' : '25%',
                boxShadow: 'none',
              }}
            >
              <Box paddingX={4} paddingY={2} display='flex' gap={2} alignItems='center'>
                <Typography variant='h5'>Past Attempts</Typography>
              </Box>

              {filteredTestedRecordsWithCompletedStatus.map((attemptInfo, idx) => {
                return (
                  idx < 5 && (
                    <div key={attemptInfo.cRecordID}>
                      <Divider />
                      <PastAttempts attemptInfo={attemptInfo} />
                    </div>
                  )
                )
              })}
              <Divider />
              <Box
                display='flex'
                alignItems='center'
                justifyContent='center'
                my={2}
                sx={{
                  cursor: 'pointer',
                }}
                onClick={handleMoveToPastAttemptsTab}
              >
                <Typography color='primary'> View All</Typography>
                <Icon icon='ep:arrow-right' color='#00875A' width={15} />
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </>
  )
}
const QuizzesForYouListItem = ({
  quiz,
  idx,
  handleOnClickBeginQuiz,
}: {
  quiz: QuizzesForYouType
  idx: number
  handleOnClickBeginQuiz: (quiz: QuizzesForYouType) => void
}) => {
  const theme = useTheme()
  const [showBeginButton, setShowBeginButton] = useState<number | null>(null)
  const handleShowBeginButton = (idx: number) => setShowBeginButton(idx)
  const handleHideBeginButton = () => setShowBeginButton(null)

  return (
    <Box
      component='div'
      paddingX={4}
      paddingY={2}
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      onMouseEnter={() => handleShowBeginButton(idx)}
      onMouseLeave={handleHideBeginButton}
      sx={{ ...(showBeginButton === idx && { bgcolor: '#F6F6F7', cursor: 'pointer' }) }}
    >
      <Box display={'flex'} alignItems='center' gap={2}>
        <Typography variant='paragraphMedium' color={theme.palette.secondary.main}>{`${idx + 1}.`}</Typography>
        <Box
          borderRadius='100%'
          width={32}
          height={32}
          display='flex'
          justifyContent='center'
          alignItems='center'
          border={`2px solid ${theme.palette.primary.main}`}
        >
          <Icon icon='tabler:clipboard' color={theme.palette.primary.main} />
        </Box>
        <Typography variant='h6' color='grey.600'>
          {quiz.quizName}
        </Typography>
      </Box>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Button style={{ margin: 0 }} size='small' variant='tonal' color='secondary'>
          {quiz.quizSubject}
        </Button>
        {showBeginButton === idx && (
          <Fade in timeout={800}>
            <Box display='flex' gap={2}>
              <Button
                onClick={() => handleOnClickBeginQuiz(quiz)}
                style={{ margin: 0 }}
                size='small'
                variant='contained'
              >
                Start Quiz
                <Icon icon='ep:arrow-right' width={16} />
              </Button>
            </Box>
          </Fade>
        )}
      </div>
    </Box>
  )
}

const PastAttempts = ({ attemptInfo }: { attemptInfo: GetCustomTestPastAttemptsAPIResponse['data'][number] }) => {
  const navigate = useNavigate()

  const handleRedirectToSummaryPage = () => {
    navigate(`/pages/quiz-summary?attemptId=${attemptInfo.attemptID}`)
  }

  return (
    <Box
      onClick={handleRedirectToSummaryPage}
      component='div'
      paddingX={4}
      paddingY={2}
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      sx={{
        '&:hover': {
          bgcolor: '#F6F6F7',
          cursor: 'pointer',
        },
        '& .hidden-icon': {
          display: 'none',
        },
        '&:hover .hidden-icon ': { display: 'block' },
      }}
    >
      <Box display='flex' flexDirection='column' gap={2}>
        <Typography
          variant='h6'
          color='grey.600'
          sx={{
            width: '160px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {attemptInfo.quizname}
        </Typography>
        <Typography variant='paragraphSmall' color='grey.600'>
          {formatSecondsToDateString(attemptInfo.addedOn)}
        </Typography>
      </Box>
      <Fade in timeout={800} className='hidden-icon'>
        <Box>
          <Icon icon='mdi:arrow-right' color='#4C90F6' />
        </Box>
      </Fade>
    </Box>
  )
}

const CustomPaginationIcon = ({ icon }: { icon: string }) => {
  return (
    <Box
      borderRadius={1}
      bgcolor='#F1F0F2'
      width={25}
      height={25}
      display='flex'
      justifyContent='center'
      alignItems='center'
      sx={{
        cursor: 'pointer',
      }}
    >
      <Icon icon={icon} />
    </Box>
  )
}

export default OnDemandQuiz

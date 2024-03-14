declare namespace tasks {
  interface minimal {
    taskID: string
    type?: AllowedTaskTypes | 'quiz'
    resourceID?: string
  }
  interface summaryData {
    addedOn: string
    completedtime: string
    duration: string
    lastUpdatedOn: string
    status: string
    taskID: string
    type: string
  }
  interface summary extends minimal {
    taskName: string
    taskgroupName?: string
    taskgroupDescription?: string
    data?: summaryData
    duration?: number
  }
  interface detailed extends summary {
    duration?: number
    resource:
      | video
      | QuizDetails
      | { quizDetails: QuizDetails }
      | {
          children?: Array<{
            dashid: null
            duration: string
            qid: null
            src: string
            title: string
          }>
        }

    status?: number
    isTest?: boolean
  }
  interface taskslist {
    taskgroupID: number
    tasks: detailed[]
    message?: string
    testStatus?: string
  }
  interface notes {
    note: string
    lastUpdatedOn: number
  }
  interface group {
    taskgroupID: string
    taskgroupName: string
    taskgroupAlias: string
    taskgroupDescription?: string
    relatedTo?: number
    active?: number
    status?: number
    overallCompleted?: number
  }
  interface NextTgroup {
    tGroup?: group
    tasks?: detailed[]
  }

  interface header {
    data?: detailed[]
    tGroup?: group
    activeTask: detailed
    nextTgroup?: NextTgroup
    notes?: notes[]
  }
  interface video {
    src: string
    dashid: string
    url: string
    title?: string
    description?: string
    quality: string
    duration?: number
    message?: string
    children?: { title: string; src: string; qid?: number; duration: number; dashid: string }[]
    quizDetails?: QuizDetails
  }
  interface SectionTabs {
    tagID: number
    tagName: string
    taskgroupIDs: string[]
    id: string
    description: string
  }
  interface UserRecommendedTaskData {
    taskID: number
    taskName: string
    type: AllowedTaskTypes
    resourceID: string
    taskgroupName: string
    taskgroupDescription: string | null
    tagName: string
    duration: string
    status: string
    addedOn: string
    lastUpdatedOn: string
    completedtime: string
  }

  interface UserRecommendedTask {
    meta: {
      totalTasks: number
      totalCompleted: number
    }
    data: {
      active: UserRecommendedTaskData
      last_completed: UserRecommendedTaskData
      recommended_1: UserRecommendedTaskData
      recommended_2: UserRecommendedTaskData
    }
  }
}

type AllowedTaskTypes = 'playlist' | 'video' | 'ebook' | 'link' | 'test' | 'practice'

interface QuizDetails {
  quizID?: string
  quiz: { quizID?: number; quizName: string; quizTime?: number }
  items: QuizQuestionType[]
  qKeys?: number[]
  description?: string
}

interface getPastQuizAttemptsItem {
  quizID: string
  questionIDs: string
  optionSelected: string
  result: string
  addedOn: string
  lastUpdatedOn: string
  quizName: string
}
interface PreTestQuizPastAttemptsAPIResponse {
  quiz: {
    quizName: string
    quizID: string
  }
  items: [
    {
      itemText: string
      itemOptions: Array<string>
      passage: string
      qType: string
      itemAnswer: string
      explanation: string
    },
  ]
  optionSelected: Array<number>
  result: Array<number>
  addedOn: string
  attempts: Array<getPastQuizAttemptsItem>
  message: string
  sessionID: string
}

type AllowedQuestionType =
  | 'mcq'
  | 'awa'
  | 'rc_mcq'
  | 'sc_1b'
  | 'sc_2b'
  | 'sc_3b'
  | 'mmcq'
  | 'rc_mmcq'
  | 'neq'
  | 'ir_2pa'
  | 'ir_ta'
  | 'ir_msr_mdcq'
  | 'ir_msr_mcq'
  | 'ir_gi'
  | 'rc_tool'
  | 'rc_ts'

interface QuizQuestionType {
  id: number
  type?: string
  itemText: string
  itemOptions: string[]
  itemAnswer?: number | number[] | string | string[]
  passage?: string
  explanation?: string
  qType: AllowedQuestionType
}

interface QuizQuestionType1 {
  testQuestionID: number
  testInstructionID: number
  questionType: AllowedQuestionType
  instructionText: string
  strTime: number

  questionText: string
  optionText: string
  passage: string
  explanation?: string
  correctAnswer?: number
}

interface CustomQuizQuestionType {
  id: string
  questionType: AllowedQuestionType
  section: string
  course: string
  primaryTopic: string
  questionText: string
  optionText: string
  passage: null | string
  explanation: string
  correctAnswers: string
  videoExplanation: null | string
  conceptual: string
}

interface GetCustomQuizQuestionAPIResponse extends Array<CustomQuizQuestionType> {}

// custom CustomQuizQuestionType
// {
//   "id": "6877",
//   "questionType": "mcq",
//   "section": "verbal",
//   "course": "gmat",
//   "primaryTopic": "Sentence Correction",
//   "questionText": "<p>In 2000, a mere two dozen products accounted\nfor half the increase in spending on prescription\ndrugs, <u>a phenomenon that is explained not just\nbecause of more expensive drugs but by the fact\nthat doctors are writing</u> many more prescriptions\nfor higher-cost drugs.</p>",
//   "optionText": "[\"a phenomenon that is explained not just because of more expensive drugs but by the fact that doctors are writing\",\"a phenomenon that is explained not just by the fact that drugs are becoming more expensive but also by the fact that doctors are writing\",\"a phenomenon occurring not just because of drugs that are becoming more expensive but because of doctors having also written\",\"which occurred not just because drugs are becoming more expensive but doctors are also writing\",\"which occurred not just because of more expensive drugs but because doctors have also written\"]",
//   "passage": null,
//   "explanation": "<p>D, E :- wrong usage of Which to refer to \"drugs\"</p><p>\nNot X But Y </p><p>\nX and Y need to be parallel.. </p><p>\n\nB is correct</p>",
//   "correctAnswers": "2",
//   "videoExplanation": null,
//   "conceptual": ""
// }

interface QuizSection {
  attemptID: string
  lastSeenQuestionID: number
  type: string
  time: number
  questionKeys: number[]
  currentNum: number
  totalNum: number
  timeTaken?: Array<number>
  questionIDs?: Array<string | number>
  optionSelected?: string[][] | number[]
}
interface BaseQuizSubmission {
  lastSeenQuestionID: number
  questionIDs: number[]
  optionSelected: string[][] | number[]
  timeTaken: number[]
}
interface LearnViewQuizSubmission extends BaseQuizSubmission {
  quizID: string
  status: number
}

interface TestPlayerQuizSubmission extends BaseQuizSubmission {
  attemptID: string
  status: number
}

interface UserQuizSubmissionResult {
  optionSelected: string[][]
  result: Array<number>
  items: Array<
    Omit<{}, 'id'> & {
      explanation: string
      itemAnswer: string
    }
  >
}

interface GetCustomTestPastAttemptsAPIResponse {
  data: Array<GetattemptRecordItem>
  message: string
  sessionID: string
}

interface GetattemptRecordItem {
  cRecordID: string
  attemptID: string
  sectionID: string
  userID: string
  status: '1' | '2' | '3'
  addedOn: string
  quizname: string
  section: string
  question_count: string
  quiztime: string
  quizmode: string
  // quizSubject: Array<string>
  quizSubject: string
  quizSection: Array<string>
  quizDifficulty: Array<string>
  quizSW: string
  quizQuestionType: string
  timeSelected: string
  lastUpdatedOn: string
  generatedOn: string
}

interface GetKakshaQuestionsFromQBWithSectionsRequest {
  sid: number
  quizname: string
  sectionids: number[]
  ptids: number[]
  difficulty: QuizFilterDifficulties[]
  topicids: number[]
  is_attempted: number
  is_correct: number
  question_count: number
  quiztime: number
  quizmode: 'Practice'
  // Used for questions with is_og
  test_types: number[] | [0] | [1]
  rc_count: number
}

interface CreatePersonalizedQuizAndGetAttemptIdRequest {
  filter: CustomAndPersonalizedQuizFilters
}
type QuizFilterDifficulties = 'easy' | 'medium' | 'hard'

interface CustomAndPersonalizedQuizFilters {
  quizname: string
  generatedOn: number
  quizType: 'Customized' | 'Personalized'
  section: string
  question_count: number
  quiztime: number
  quizmode: string
  quizSubject: Array<string>
  quizSection: Array<string>
  quizDifficulty: Array<QuizFilterDifficulties>
  quizTopic: Array<number>
  quizSW: string
  quizQuestionType: string
  timeSelected: string
  rc_count: number
  questions: {
    [key: string]: Array<number>
  }
}

interface CreateCustomQuizAndGetAttemptIdResponse {
  attemptID: string
}
// Should be an interface
type KakshaQuizWithSectionsAndQuestionsMetaFromQuestionBank = Array<CustomQuizSectionWithQuestionsMeta>

interface CreatePersonalizedQuizRequest {
  sid: number
  sectionid: number
  question_count: number
  ptids: Array<number>
  pqb_testtype: string
  quizMode: string
}

interface CustomQuizSectionWithQuestionsMeta {
  sectionid: number
  section: string
  section_time: number
  questions: Array<KakshaQuestionBankQuestionMeta>
}
interface KakshaQuestionBankQuestionMeta {
  sid: number
  questionid: number
  sectionid: number
  section: string
  ptid: number
  primarytopic: string
  difficulty: string
  topicid: number
  topic: string
  passageid: number
  is_strength: number
  attempted: number
  is_correct: number
  question_time: number
  is_og: number
  passageid: number
}

// Quiz/Test Summary Types
interface GetDataRecordsFromJAMAPIQuestions {
  id: string
  template: string
  type: string
  correctAnswers: string
  responsesTotal: string
  responsesCorrect: string
  totalTime: string
  videoExplanation: string
  explanation: string
  optionSelected: any
  timeTaken: number
  result: number
  tags: QuestionTagsType
  seq?: string
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

type QuestionTagsType = Record<number, { tagName: string; subTags: Array<string> }>

interface TestRecord {
  testSectionID: string
  section: string
  score: string | null
  percentile: string | null
  lastUpdatedOn: string
  addedOn: string
  questions: Array<GetDataRecordsFromJAMAPIQuestions>
}

interface GetRecordDataTest {
  addedOn: number
  completedOn: number
  course: string
  isPublic: string
  percentile: string
  score: string
  testID: number
  testName: string
  type: string
  recordID: string
  lastUpdatedOn: number
  quizname: string
}

interface TestSummaryAPIResponse {
  records: Array<TestRecord>
  test: GetRecordDataTest
  message: string
  sessionID: string
}

interface CustomTestSummaryQuestionResponseSummary {
  id: string
  template: string
  type: string
  correctAnswers: string
  responsesTotal: string
  responsesCorrect: string
  totalTime: string
  videoExplanation: string | null
  explanation: string
  result: string
  timeTaken: string
  diff?: string
  is_external: '0' | '1'
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'easy' | 'medium' | 'hard'
  videoExplanation: ''
  tags: QuestionTagsType
  optionSelected: string | null
}

interface customtestSummarySummaryTestDetail {
  cRecordID: string
  attemptID: string
  sectionID: string
  status: string
  questionsId: string
  optionSelected: string
  timeTaken: string
  result: string
  addedOn: string
  lastUpdatedOn: string | null
  quizname: string
}

interface customtestSummarySummary {
  quant?: Array<CustomTestSummaryQuestionResponseSummary>
  verbal?: Array<CustomTestSummaryQuestionResponseSummary>
  testDetail: customtestSummarySummaryTestDetail
}

interface CustomTestSummaryAPIResponse {
  summary: customtestSummarySummary
  message: string
}

interface TestScoreAndStudentCount {
  score: string
  gmatscore: string
  countStudent: string
}
interface CustomTestScoreAPIResponse {
  data: Array<TestScoreAndStudentCount>
}

interface TestQuestionSummaryMetaResponse {
  data: [
    {
      questionText: string
      optionText: string
      passage: string
      correctAnswers: string
      explanation: string
      videoExplanation: string
      questionType: AllowedQuestionType
    },
  ]
}

interface GetUserWebinarsForActiveProductResponse {
  kind: string
  etag: string
  summary: string
  description: string
  updated: string
  timeZone: string
  accessRole: string
  defaultReminders: string
  nextPageToken: string
  message: string
  items: Array<WebinarItem>
}
interface WebinarItem {
  kind: string
  etag: string
  id: string
  status: string
  htmlLink: string
  created: string
  updated: string
  summary: string
  description: string
  creator: {
    email: string
    displayName: string
  }
  organizer: {
    email: string
    displayName: string
    self: boolean
  }
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  iCalUID: string
  sequence: number
  eventType: string
}

interface UserPlannerQueryResponse {
  data: Array<{
    duration: string
    resourceID: string
    taskID: string
    taskName: string
    testStatus: string
    totalquestion: number
    type: AllowedTaskTypes
  }>
  records: Record<number, number>
  totaltimespent: number
}

type TaskStructureWithGroupAndSections = {
  data: tasks.group[]
  sections: tasks.SectionTabs[]
  tasks: Record<number, number>
  records: Record<number, 0 | 1>
  message: string
}

interface Batch {
  start: string
  meta: BatchMeta
  end: string
  batchname: string
  uID: any
  status: string
  title: string
  duration: string
  calendarStatus: string
  createDateTime: string
}

interface BatchMeta {
  start: DateTimeInSeconds
  end: DateTimeInSeconds
  summary: string
  mode: string
  description: string
}

interface DateTimeInSeconds {
  dateTime: string
}

type BatchCalendarDataResponse = {
  data: Batch[]
}

// Analytics Types
interface FLTAnalyticsPercentileInfo {
  accuracy: number
  attemptID: string
  avg_test_time: number
  gmatScore?: string
  lastUpdatedOn?: string
  quantpercentile?: string
  verbalpercentile?: string
  testID?: string
  testName?: string
  testType?: string
  percentile?: string
  score?: number
  quantscore?: string
  verbalscore?: string
  correct_answers?: number
  section?: {
    [key: string]: {
      score: string
      percentile: string
      total_questions: number
      correct_answers: number
      total_time_taken: number
      accuracy: number
      avg_test_time: number
    }
  }
  total_questions?: number
  total_time_taken?: number
}
interface FLTPercentileDataResponse {
  data: Array<FLTAnalyticsPercentileInfo>
}

interface AnalyticsSummaryResponse {
  userTaskCalculateID: string
  userID: string
  productID: string
  overAll: string
  learnQuantative: string
  learnVerbal: string
  learnPractice: string
  learnTest: string
  vocabulary: string
  alltask: string
  learnQuantativetask: string
  learnVerbaltask: string
  learnPracticetask: string
  learnTesttask: string
  vocabularyTask: string
  message: string
  sessionID: string
}

// Response forai/student-card/viz/test
interface StudentTestVisualizationResponse {
  testid: number | null
  testname: string | null
  attempted_question_count: number | null
  pace: number | null
  accuracy: number | null
  lastupdatedon: Date | string | null
  primarytopics: Array<StudentTestVisualizationPrimaryTopics> | null
}

interface StudentTestVisualizationPrimaryTopics {
  ptid: number | null
  primarytopic: string | null
  sectionid: number | null
  section: string | null
  attempted_question_count: number | null
  pace: number | null
  accuracy: number | null
  topics: Array<StudentTestVisualizationTopicWithConcepts> | null
}

interface StudentTestVisualizationTopicWithConcepts {
  topicid: number | null
  topic: string | null
  attempted_question_count: number | null
  pace: number | null
  accuracy: number | null
  platform_pace: number | null
  platform_accuracy: number | null
  concepts: Array<VizDataTestVsPaceAccuracyScoreConcepts> | null
}

interface VizDataTestVsPaceAccuracyScoreConcepts {
  accuracy: number | null
  concept: string | null
  conceptid: number | null
  pace: number | null
  attempted_question_count: number | null
  platform_pace: number | null
  platform_accuracy: number | null
}

interface StudentTopicVizResponse {
  ptid: number | null
  primarytopic: string | null
  sectionid: number | null
  section: string | null
  attempted_question_count: number | null
  pace: number | null
  accuracy: number | null
  topics: Array<VizDataTestVsPaceAccuracyScoreTopics> | null
}

interface VizDataTestVsPaceAccuracyScoreTopics {
  topicid: number | null
  topic: string | null
  attempted_question_count: number | null
  pace: number | null
  accuracy: number | null
  platform_pace: number | null
  platform_accuracy: number | null
  concepts: Array<VizDataTestVsPaceAccuracyScoreConcepts> | null
}

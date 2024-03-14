import { KAKSHA_BASE_API } from 'src/@core/utils/ApiHelpers'

export const getUserLoginAPI = `auth/validator`
export const getUserDetailsAPI = `config/users/me`
export const getUserTasksAndStructure = `jlms/tasks/structure`
export const getUserRecommendedTasks = `jlms/userrecommendedtask`
export const userProducts = `jlms/users/products`
export const getUserGroupInfoWithId = (productId: string) => `jlms/users/getUserGroup/${productId}`
export const getUserCalenderEventsForProduct = (productId: string) => `jlms/users/calendar/${productId}/events`
export const getUserTargetScore = `jlms/users/targetScore`
export const getUserBatchAndFltScore = `jlms/batchandfltscrore`
export const getResourceWithId = (resourceId: string) => `jlms/tasks/resource/${resourceId}`
export const getVideoResourceURL = `jlms/tasks/videos`
export const userNotes = `jlms/users/notes`
export const GET_TESTS = `jlms/tests`
export const resetPasswordAPI = `auth/reset`
export const USER_API = `config/users/me`
export const USER_INIT = `jlms/users/init`
export const GET_USER_AWA_ACCOUNTS = `jlms/users/awacounts`
export const GET_USER_AWA = `jlms/users/awa`
export const GET_USER_NOTES = `jlms/users/notes`
export const USER_APPOINTMENTS = `jlms/users/appointments`
export const GET_RESOURCE = 'jlms/tasks/resource'
export const UPDATE_TASK = 'jlms/users/taskrecords'
export const QUIZ_SUMMARY = 'jlms/quiz/summary'
export const getTestWithId = (testId: string) => `jlms/tests/${testId}`
export const USER_NOTIFICATION = `notification/UserNotification/`
export const GET_USER_VERIFY_STATUS = `notification/UserNotification/getVerifyStatus`
export const GET_SEND_SMS_API = `${USER_NOTIFICATION}sendSMS`
export const GET_VERIFY_OTP_API = `${USER_NOTIFICATION}verifyOtp`
export const GET_USER_MOBILE = `${USER_NOTIFICATION}Mobileno`
export const GET_USER_WHATSAPP_NOTIFICATION = `${USER_NOTIFICATION}whatsappNotification/`
export const USER_PM_FORM = `forum/pm`
export const CREATE_ZENDESK_TICKET = `zen/tickets/`
export const UPLOAD_CV_API = 'posts/uploader/cv'
export const GET_EBOOK_API = 'jlms/ebooks/content/'
export const GET_READING_MATERIAL = 'jlms/materiallinks/materiallinksinit/'
export const GET_CALENDAR_DATA = 'Mbatch/calendar/Calenderdata'
export const GET_WEBINAR_AND_BLOG_DATA = '/lp/city/lpdata'
export const GET_COURSE_RESOURCES_LIST = 'lp/city/resourcelist/'
export const UPLOAD_AVATAR_API = 'posts/uploader/avatar'
export const BASE_URL = 'https://jamboree.online/'
export const USER_REST_RECORDS = 'jlms/users/userestsrecords'
export const RECOVER_PASSWORD = 'auth/recover'
export const POSTS = 'posts'
export const CHECK_USER_BY_MOBILE_NUMBER = 'jlms/users/checkuserbymobilenumber'

export const customTestAPI = 'jlms/customtest'
export const GET_CUSTOM_TEST_PERSONALIZED = 'jlms/customtest/personalized'
export const GET_QUIZ_SUMMARY = `jlms/quiz/allsummary`
export const getCustomTestScoreForAttempt = (attemptId: string) => `jlms/customtest/studentscore/${attemptId}`

export const getCustomTestSummaryForId = (attemptId: string) => `jlms/customtest/summary/${attemptId}`
export const getTestSummaryForId = (attemptId: string) => `jlms/tests/summary/${attemptId}`
export const getCustomQuizQuestionWithId = (questionId: string) => `jlms/testsa/questions/${questionId}`
export const getTestQuestionMetaForSummary = (questionId: string) => `jlms/tests/questions/${questionId}`

export const KAKSHA_QUESTION_BANK = KAKSHA_BASE_API + 'ai/question-bank'
export const GET_PERSONALIZED_QUESTION_BANK = KAKSHA_BASE_API + 'ai/personalized-question-bank'
export const USER_PLANNER = 'jlms/users/planner'
export const USER_CALENDAR = 'jlms/users/calendar'

export const getUserCalendarEventsForActiveProduct = (activeProduct: string) =>
  USER_CALENDAR + '/' + activeProduct + '/' + 'events'

export const getAnalyticsFLTPercentile = 'analytics/fltpercentiledata'
export const getAnalyticsSummary = 'jlms/analyticssummary'
export const getTestVisualizationDataForStudent = KAKSHA_BASE_API + 'ai/student-card/viz/test'
export const getTopicVisualizationDataForStudent = KAKSHA_BASE_API + 'ai/student-card/viz/topic'

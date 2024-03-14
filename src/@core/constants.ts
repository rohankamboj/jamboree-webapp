export const LOCAL_STORAGE_KEYS = {
  LOGIN_RESPONSE: 'loginResponse',
  ACTIVE_PRODUCT: 'activeProduct',
  ATTEMPT_ID: 'activeProduct',
  CURRENT_CUSTOM_QUIZ_META: 'customQuizMeta',
  CREATE_QUIZ_META: 'customQuizCreateMeta',
}

export const verticalNavItemTitleIconMap: { [key: string]: string } = {
  Learn: 'gridicons:computer',
  Practice: 'tabler:puzzle',
  Test: 'tabler:device-desktop-analytics',
}

export const resourceTypeToIconifyIconMap: Record<string, string> = {
  playlist: 'ph:video',
  video: 'tabler:video',
  ebook: 'ion:book-outline',
  link: 'ion:link-sharp',
  test: 'carbon:test-tool',
  practice: 'solar:playlist-linear',
}

// Query Constants
export const MS_IN_SECOND = 1000
export const ONE_MINUTE = 60 * MS_IN_SECOND
export const FIVE_MINUTES = 5 * ONE_MINUTE
export const TEN_MINUTES = 10 * ONE_MINUTE

export const breadcrumbNameMap: { [key: string]: string } = {
  '/app': 'Dashboard',
  '/pages': 'Dashboard',
  '/app/account': 'Account',
  '/app/account/account': 'Account',
  '/app/account/notifications': 'Notifications',
  '/app/account/security': 'Security',
  '/app/account/appointment': 'Appointment',
  '/app/account/appointment/create': 'Create Appointment',
  '/app/account/appointment/pending': 'Pending Appointment',
  '/app/account/appointment/past': 'Past Appointment',
  '/app/notes': 'Notes',
  '/app/admission-services': 'Admission Services',
  '/app/contact-admin': 'Contact Admin',
  '/app/awa': 'AWA',
  '/app/awa/submit': 'Submit AWA',
  '/app/awa/pending': 'pending AWA',
  '/app/awa/reviewed': 'Reviewed AWA',
  '/app/planner': 'Planner',
  '/app/class': 'Classes',
  '/app/class/timeline': 'Timeline',
  '/app/class/recordings': 'Recordings',
  '/app/reading-material': 'Reading Material',
  '/app/ebook/5': 'Verbal Tips',
  '/app/ebook/8': 'Formula List',
  '/sampleessay': 'Sample AWA Essays',
  '/app/sampleessay': 'Sample AWA Essays',
  '/app/gmatawatip': 'AWA Tips',
  '/app/gmat-post-class-plan': 'GMAT Post Class Plan',
  '/app/rctool': 'RC Tool',
  '/app/practice': 'Practice',
  '/app/practice/past-attempt': 'Past Attempt',
  '/pages/quiz': 'Quiz',
  '/pages/quiz/customised-quiz': 'Customized Quiz',
  '/app/analytics': 'Analytics',
  '/app/analytics/analytic': 'Analytic',
  '/app/analytics/detail': 'Analytics Detail',
}

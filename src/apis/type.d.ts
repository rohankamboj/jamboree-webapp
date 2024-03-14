type UserLoginPayload = { user: string; password: string }

declare namespace auth {
  interface tokens {
    sessionID: string | null
    authToken: string | null
  }
  interface login {
    user: string
    password: string
    token?: string
    sso?: string
    remember?: string
  }
  interface loginResponse extends tokens {
    firstLogin?: string
    data: {
      addedOn: number
      avatar: string
      email: string
      name: string
      phone: string
      screenName: string
      userID: number
    }
    message: string
    model: string
  }

  // interface loginUserData

  interface reset {
    user: string
    otp: string
    password: string
    vcode?: string
    autologin?: boolean
  }
  interface register {
    name: string
    email: string
    login: string
    password?: string
    group: string | string[]
    meta?: {
      tocAgree: boolean
      phone: string
      prospectID?: string
      regData: any
    }
    sso?: string
    autologin?: boolean
    countryCode?: string
    leadsquredonly?: unc.generic
  }
}

export interface UserInitResponse {
  data: UserInitData
  message: string
  sessionID: string
}

export interface termsAndConditionsData {
  data: Array<{
    title: string
    content: string
    excerpt: string
    postID: string
  }>
  message: string
  sessionID: string
}

export interface UserInitData {
  hasAttempted: number
  examDate: number
  prepDate: number
  name: string
  phone: string
  avatar: string
  screenName: string
  email: string
  addedon: number
  emailVerified: boolean
  tasks: number[]
  isFull: number
  course: string
  group: Group
  products: Product[]
  satenable: string
  vendor: any
}

export interface Group {
  groupID: string
  code: string
  expiry: any
  meta: string
  permissions: string
  classTab: string
  awaCount: string
}

export interface Product {
  id: string
  name: string
  expiry: number
  isActive: boolean
}

declare namespace userData {
  interface taskrecords extends tasks.minimal {
    status: number
    addedOn?: number
    lastUpdatedOn?: number
    taskgroupID?: number
  }
  interface taskrecordsResponse extends unc.apiResponse {
    data: unc.numObject
    meta: unc.generic
    recommended: {
      [key: string]: tasks.summary
    }
  }
  interface product {
    code?: string
    hasAttempted?: number
    prepDate?: number
    examDate?: number
    status?: number
  }
  interface appointmentList {
    id: string
    faculty: string
    duration: string
    contact: string
    preference1: string
    preference2: string
    preference3: string
    message: string
    approved?: string
    isOpen?: boolean
    requestDate?: string
    currentPref?: number
  }
  interface awaList {
    id: string
    user: string
    awaPrompt: string
    userResponse: string
    addedOn: string
    evaluatedBy: string | null
    evaluatedOn: string | null
    facultyResponse?: string
  }
}
export interface userAWACountResponse {
  totalCount: number
  totalusedCount: number
  dailylimit: number
  message: string
  sessionID: string
}

export interface reserveAppointment {
  faculty: string
  duration: number
  contact: string
  preference1: string
  preference2: string
  preference3: string
}

interface pastAttemptsList {
  attemptID: string
  testID: number
  testName: string
  type: string
  score: number
  lastUpdatedOn: string
  accuracy: number
  avg_test_time: number
}

export type GetPastAttemptsForUserResponseType = { data: pastAttemptsList[] }

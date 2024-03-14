/* eslint-disable operator-linebreak */
import { auth } from 'src/apis/type'
import { LOCAL_STORAGE_KEYS } from '../constants'
import Toast from 'react-hot-toast'

// TODO: Move this to env file.
const API_BASE_URL = 'https://jamboree.online/api/'
export const ASSETS_BASE_URL = 'https://jamboree.online/'
export const EQUATIONS_ASSETS_BASE_URL = ASSETS_BASE_URL + 'app/assets/img/equations/'
export const KAKSHA_BASE_API = 'https://api.kaksha.services/'

// eslint-disable-next-line no-confusing-arrow
export const getUrl = (endpoint: string) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  endpoint.includes(API_BASE_URL as string) || endpoint.includes(KAKSHA_BASE_API) ? endpoint : API_BASE_URL + endpoint

export const stringifyParams = (queryParams?: Record<string, string>) => {
  if (!queryParams) return ''

  return `?${new URLSearchParams(queryParams).toString()}`
}
export const getEndpoint = (path: string, queryParams?: Record<string, string>) => {
  const parametrizedPath = `${path}${stringifyParams(queryParams)}`
  return getUrl(parametrizedPath)
}

export const getAuthHeaders = (customHeaders?: Record<string, string>) => {
  let parsedResponse: auth.loginResponse | undefined
  const loginResponse: string = localStorage.getItem(LOCAL_STORAGE_KEYS.LOGIN_RESPONSE) ?? ''
  if (loginResponse) parsedResponse = JSON.parse(loginResponse)

  const headers = {
    'Content-Type': 'application/json',
    ...(parsedResponse && { authToken: parsedResponse.authToken, sessionid: parsedResponse.sessionID }),
    ...(customHeaders || {}),
  }
  return headers
}

export const getRequestConfig = (options?: RequestOptions) => {
  const headers = getAuthHeaders(options?.headers)
  const body = options?.body ? { body: JSON.stringify(options.body) } : {}

  return {
    headers,
    ...(options?.requestConfig || {}),
    ...body,
  }
}

export const buildErrorMessage = (error: any): string => {
  // eslint-disable-next-line no-console
  console.log(error)
  if (typeof error === 'string') {
    return error
  }

  // Response from the endpoint in case of error.
  const { response } = error
  // Return the error based on the failing phase
  return (
    response?.data?.message ||
    // Error Format returned from backend
    response?.data?.error?.detail ||
    // Error from axios
    error?.message ||
    error?.request ||
    'Unexpected error'
  )
}

export function showAPIErrorAsToast({ errorMessage }: any) {
  Toast.error(errorMessage)
}

export function isNotFoundError(apiResponse: any) {
  if (apiResponse?.data?.length === 0 && apiResponse?.message === 'Not Found') {
    return true
  }
  return false
}

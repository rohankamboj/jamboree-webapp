import { AxiosError } from 'axios'
import React, { useContext, useMemo, useState } from 'react'
import Toast from 'react-hot-toast'
import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Product, UserInitResponse, auth, termsAndConditionsData } from 'src/apis/type'
import {
  CHECK_USER_BY_MOBILE_NUMBER,
  GET_SEND_SMS_API,
  GET_USER_MOBILE,
  GET_USER_VERIFY_STATUS,
  GET_USER_WHATSAPP_NOTIFICATION,
  GET_VERIFY_OTP_API,
  POSTS,
  RECOVER_PASSWORD,
  UPLOAD_AVATAR_API,
  USER_API,
  USER_INIT,
  getUserLoginAPI,
  getUserTasksAndStructure,
  resetPasswordAPI,
} from 'src/apis/user'
import navigationItems from 'src/navigation/vertical'
import { NavItem, VerticalNavItemsType } from 'src/types/type'
import { getNavItemPath, updateNavItems } from 'src/utils'
import { LOCAL_STORAGE_KEYS, verticalNavItemTitleIconMap } from '../constants'
import useLocalStorage from '../hooks/useLocalStorage'
import { showAPIErrorAsToast } from '../utils/ApiHelpers'
import { get, patch, post, put } from '../utils/request'

type ResetPasswordMutation = {
  data: Pick<auth.reset, 'otp' | 'password' | 'user'>
  handleSuccess?: any
  handleError?: any
}

type RecoverPasswordMutation = {
  data: {
    user: string
  }
  handleSuccess?: any
  handleError?: any
}

type UpdateUserPhoneMutation = {
  data: {
    phoneNo: string
    countryCode: string
  }
  handleSuccess?: any
  handleError?: any
}
type VerifyMobileOtpMutation = {
  data: {
    phoneNo: string
    otp: string
  }
  handleSuccess?: any
  handleError?: any
}

type UpdateUserInfoMutation = {
  data: Partial<{
    meta: {
      bio?: string
      avatar?: string
    }
    name: string
  }>
  handleSuccess?: any
  handleError?: any
}

type UpdateUserAvatarMutation = {
  data: FormData
  handleSuccess?: any
  handleError?: any
}

type UpdateActiveProductMutation = {
  data: { productId: string }
  handleSuccess?: (data: any) => void
  handleError?: any
}

type loginWithOTPType = {
  data: {
    countryCode: string
    mode: string
    name: string
    otp: string
    phoneNo: string
  }
  handleSuccess?: any
  handleError?: any
}

type UpdateWhatsAppNotificationPreferenceMutation = {
  enable: boolean
  handleSuccess?: (data: any) => void
  handleError?: any
}

type UserVerificationType = {
  data?: Array<{ key: 'verifiedStatus'; value: string }>
  res?: Array<{ key: 'whatsappEnable'; value: string }>
}
type UserMobileDetailsResponseType = { data?: Array<{ value: string }> }

// type errorMessage

export type AxiosErrorWithErrorMessage = AxiosError & { errorMessage: string }

export type UserContextType = {
  loading: boolean
  userDetails: Pick<auth.loginResponse, 'data'> | null
  kakshaUserId: number | null
  handleUserLogin: ({ user, password }: auth.login) => void
  handleUserLogout: any
  isUserLoggedIn: boolean
  // resetPassword: ({ data, handleSuccess, handleError }: ResetPasswordMutation) => void
  recoverPassword: UseMutationResult<any, unknown, RecoverPasswordMutation, unknown>
  resetPassword: UseMutationResult<any, unknown, ResetPasswordMutation, unknown>
  updateUserInfo: UseMutationResult<any, unknown, UpdateUserInfoMutation, unknown>
  updateUserAvatar: UseMutationResult<any, unknown, UpdateUserAvatarMutation, unknown>
  changeActiveProduct: UseMutationResult<any, unknown, UpdateActiveProductMutation, unknown>
  updatePhoneMutation: UseMutationResult<any, unknown, UpdateUserPhoneMutation, unknown>
  verifyMobileOtpMutation: UseMutationResult<any, unknown, VerifyMobileOtpMutation, unknown>
  loginWithOTPMutation: UseMutationResult<any, unknown, loginWithOTPType, unknown>
  changeWhatsAppNotificationPreference: UseMutationResult<
    any,
    unknown,
    UpdateWhatsAppNotificationPreferenceMutation,
    unknown
  >
  userMobileDetails: UserMobileDetailsResponseType | undefined
  getUserVerifyStatus: UserVerificationType | undefined
  userDetailsWithBio: any
  userInit: UserInitResponse | undefined
  termsAndConditions: termsAndConditionsData | undefined
  userTasksWithGroupAndSectionsQuery: UseQueryResult<TaskStructureWithGroupAndSections, unknown>
  navItems: NavItem[]
  userActiveProduct: string | undefined
  activeProductFromUserInit: Product | undefined
}

const notInitialised: any = () => {
  alert('Ctx not init')
}

export const UserContext = React.createContext<UserContextType>({
  loading: true,
  userDetails: null,
  getUserVerifyStatus: undefined,
  handleUserLogin: notInitialised,
  handleUserLogout: notInitialised,
  recoverPassword: notInitialised,
  resetPassword: notInitialised,
  updateUserInfo: notInitialised,
  updateUserAvatar: notInitialised,
  changeActiveProduct: notInitialised,
  updatePhoneMutation: notInitialised,
  verifyMobileOtpMutation: notInitialised,
  changeWhatsAppNotificationPreference: notInitialised,
  loginWithOTPMutation: notInitialised,
  isUserLoggedIn: false,
  userDetailsWithBio: undefined,
  userInit: undefined,
  termsAndConditions: undefined,
  userTasksWithGroupAndSectionsQuery: notInitialised,
  kakshaUserId: null,
  userMobileDetails: undefined,
  userActiveProduct: undefined,
  navItems: [] as any,
  activeProductFromUserInit: undefined,
})

const getActiveProductFromInit = (userInitData: UserInitResponse['data'] | undefined) =>
  userInitData?.products?.find(({ isActive }) => isActive)

export default function UserProvider({ children }: any): JSX.Element {
  const [loginResponse, setLoginResponse] = useLocalStorage<auth.loginResponse | null>(
    LOCAL_STORAGE_KEYS.LOGIN_RESPONSE,
  )

  const isUserLoggedIn = !!(loginResponse?.authToken && loginResponse?.sessionID)
  const navigate = useNavigate()

  const [navItems, setNavItems] = useState<NavItem[]>(navigationItems)
  const [activeProductFromLocalStorage, setActiveProductInLocalStorage] = useLocalStorage<Product | null>(
    LOCAL_STORAGE_KEYS.ACTIVE_PRODUCT,
  )

  const queryClient = useQueryClient()

  const handleUserInitError = (error: any) => {
    if (error.response.status === 401) {
      handleUserLogout()
    }
  }

  const { data: userInit } = useQuery({
    queryKey: ['user init'],
    queryFn: (): Promise<UserInitResponse> =>
      get(USER_INIT, {
        queryParams: {
          checkProduct: 'false',
        },
      }),
    enabled: isUserLoggedIn,
    onError: handleUserInitError,
    cacheTime: 60 * 30 * 1000, // 5 minutes
  })

  const activeProductFromUserInit: Product | undefined = useMemo(
    () => getActiveProductFromInit(userInit?.data),
    [userInit],
  )

  const { data: userDetailsWithBio, isLoading } = useQuery({
    queryKey: ['user', loginResponse?.sessionID, loginResponse?.authToken],
    queryFn: () =>
      get(USER_API, {
        queryParams: {
          fields: "{users:['login']}",
          meta: "['biodata']",
        },
      }),
    enabled: isUserLoggedIn,
  })

  // Phone Settings User Notifications Tab API
  const { data: userMobileDetails } = useQuery({
    queryKey: ['getUserMobile', loginResponse?.sessionID, loginResponse?.authToken],
    queryFn: () => get(GET_USER_MOBILE),
    enabled: isUserLoggedIn,
  })
  const { data: getUserVerifyStatus } = useQuery<UserVerificationType>({
    queryKey: ['getUserVerifyStatus', loginResponse?.sessionID, loginResponse?.authToken],
    queryFn: () => get(GET_USER_VERIFY_STATUS),
    enabled: isUserLoggedIn,
  })

  // User Phone
  const updatePhoneMutation = useMutation({
    onSuccess: (data, variables: UpdateUserPhoneMutation) => {
      variables.handleSuccess(data)
      // console.log({ _ }, { variables })
    },
    // @ts-ignore // Anti pattern from backend
    mutationFn: async ({ data }) => patch(GET_SEND_SMS_API, undefined, { queryParams: data }),
    onError: (_error: AxiosErrorWithErrorMessage, variables) => {
      variables.handleError(_error.errorMessage)
    },
  })

  const loginWithOTPMutation = useMutation({
    onSuccess: (data, variables: loginWithOTPType) => {
      variables.handleSuccess(data)
    },
    mutationFn: async ({ data }) => post(CHECK_USER_BY_MOBILE_NUMBER, data),
    onError: (_error: AxiosErrorWithErrorMessage, variables) => {
      variables.handleError(_error.errorMessage)
    },
  })

  const verifyMobileOtpMutation = useMutation({
    onSuccess: (data, variables: VerifyMobileOtpMutation) => {
      queryClient.invalidateQueries(['getUserMobile'])
      queryClient.invalidateQueries(['getUserVerifyStatus'])
      variables.handleSuccess(data)
    },
    // Using get to verify the otp. Anti pattern from backend
    // Missing Country code while verification
    mutationFn: async ({ data }) => get(`${GET_VERIFY_OTP_API}/${data.phoneNo}/${data.otp}`),
    onError: (_error: AxiosErrorWithErrorMessage, variables) => {
      variables.handleError(_error.errorMessage)
    },
  })
  const changeWhatsAppNotificationPreference = useMutation({
    onSuccess: (data, variables: UpdateWhatsAppNotificationPreferenceMutation) => {
      queryClient.invalidateQueries(['getUserVerifyStatus'])
      variables.handleSuccess?.(data)
    },
    // @ts-ignore Anti Pattern in backend calling put without any data.
    mutationFn: async ({ enable }) => put(`${GET_USER_WHATSAPP_NOTIFICATION}/${enable}`),
    onError: (_error: AxiosErrorWithErrorMessage, variables) => {
      variables.handleError(_error.errorMessage)
    },
  })

  function handleLoginSuccess({ data }: { data: auth.loginResponse }) {
    setLoginResponse(data)
    navigate('/course')
  }
  function handleLoginError(errorMessage: string) {
    Toast.error(errorMessage)
  }
  async function handleUserLogin(loginPayload: auth.login) {
    post(getUserLoginAPI, loginPayload, {
      processData: handleLoginSuccess,
      processError: handleLoginError,
    })
  }

  async function invalidateQueriesAfterChangeActiveProduct() {
    return Promise.allSettled([
      queryClient.invalidateQueries(['userBatchAndFltScore']),
      queryClient.invalidateQueries(['userTargetScore']),
      queryClient.invalidateQueries(['userEvents']),
      queryClient.invalidateQueries(['userRecommendedTasks']),
      queryClient.invalidateQueries(['user init']),
    ])
  }

  // TODO: Need to handle the auto select course from local storage
  // This works but runs a couple of times.
  // useEffect(() => {
  //   if (isUserLoggedIn) {
  //     if (isUserInitLoading) return
  //     if (!activeProductFromLocalStorage?.id) alert('No active product found in local storage.')
  //     if (!activeProductFromUserInit) return
  //     if (activeProductFromLocalStorage?.id && activeProductFromLocalStorage?.id !== activeProductFromUserInit?.id) {
  //       console.log(activeProductFromUserInit?.id, activeProductFromLocalStorage?.id)
  //       changeActiveProduct.mutate({
  //         data: {
  //           productId: activeProductFromLocalStorage.id,
  //         },

  //         handleError: (...args: any) => {
  //           alert('Error while auto selecting active product from LS.')
  //           showAPIErrorAsToast(args)
  //         },
  //         handleSuccess: () => {
  //           console.log(
  //             'Active product automatically changed from' +
  //               JSON.stringify(activeProductFromUserInit, null, 2) +
  //               JSON.stringify(activeProductFromLocalStorage, null, 2),
  //           )
  //         },
  //       })
  //     } else {
  //     }
  //   }
  // }, [isUserLoggedIn, activeProductFromUserInit, activeProductFromLocalStorage, isUserInitLoading])

  const changeActiveProduct = useMutation({
    onSuccess: async (data, variables) => {
      variables.handleSuccess?.(data)
      const activeProduct = getActiveProductFromInit(data.data)
      if (!activeProduct) {
        alert('No active product found after changing active product..')
        return
      }
      Toast.success('Active  Product Set ' + activeProduct.name)
      await invalidateQueriesAfterChangeActiveProduct()
      setActiveProductInLocalStorage(activeProduct)
    },
    mutationFn: (variables: UpdateActiveProductMutation) =>
      get(`${USER_INIT}/${variables.data.productId}`, {
        queryParams: {
          checkProduct: 'true',
        },
      }) as Promise<UserInitResponse>,
    onError: showAPIErrorAsToast,
  })

  const updateUserInfo = useMutation({
    onSuccess: (_, variables: UpdateUserInfoMutation) => {
      queryClient.invalidateQueries(['user'])
      variables.handleSuccess(_)
    },
    mutationFn: async variables => {
      return patch(USER_API, variables.data)
    },
    onError: (_error: AxiosErrorWithErrorMessage, variables) => variables.handleError(_error.errorMessage),
  })

  const updateUserAvatar = useMutation({
    onSuccess: (_, variables: UpdateUserAvatarMutation) => {
      variables.handleSuccess?.(_)
    },
    mutationFn: async variables => {
      return post(UPLOAD_AVATAR_API, variables.data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          enctype: 'multipart/form-data',
        },
      })
    },
    onError: showAPIErrorAsToast,
  })

  // Reset Password Screen
  const resetPasswordMutation = useMutation({
    onSuccess: (data, variables: ResetPasswordMutation) => {
      variables.handleSuccess(data)
      handleUserLogout()
      // console.log({ _ }, { variables })
    },
    mutationFn: async ({ data }) => patch(resetPasswordAPI, data),
    onError: (_error: AxiosErrorWithErrorMessage, variables) => {
      variables.handleError(_error.errorMessage)
    },
  })

  // Terms And Conditions API
  const { data: termsAndConditionsData, isLoading: termsAndConditionsLoading } = useQuery({
    queryKey: ['termsAndConditions'],
    queryFn: (): Promise<termsAndConditionsData> =>
      get(POSTS, {
        queryParams: {
          slug: 'terms',
          fields: 'title,content,excerpt',
        },
      }),
    enabled: location.pathname === '/pages/terms',
  })

  // Recover Password Screen
  const RecoverPasswordMutation = useMutation({
    onSuccess: (data, variables: RecoverPasswordMutation) => {
      variables.handleSuccess(data)
      navigate('auth/reset')
      // handleUserLogout()
      // console.log({ _ }, { variables })
    },
    mutationFn: async ({ data }) => post(RECOVER_PASSWORD, data),
    onError: (_error: AxiosErrorWithErrorMessage, variables) => {
      variables.handleError(_error.errorMessage)
    },
  })

  const userTasksWithGroupAndSectionsQuery = useQuery({
    queryKey: ['userTasksWithGroupAndSections', activeProductFromLocalStorage, activeProductFromUserInit],
    queryFn: () =>
      get(getUserTasksAndStructure, {
        queryParams: {
          fields: JSON.stringify(['groups', 'sections', 'records']),
        },
      }) as Promise<TaskStructureWithGroupAndSections>,
    onSuccess(data) {
      const organizeSections = (sections: { id: string; tagName: string }[]): NavItem[] => {
        const organizedData: VerticalNavItemsType = {}

        sections.forEach(section => {
          const { id, tagName } = section
          if (tagName && tagName.includes(':')) {
            const [parent, child] = tagName.split(':').map((item: string) => item.trim())

            if (!organizedData[parent]) {
              organizedData[parent] = {
                id,
                title: parent,
                icon: verticalNavItemTitleIconMap[parent],
                path: getNavItemPath(tagName, id),
                children: [],
              }
            }

            organizedData[parent]?.children?.push({
              title: child,
              path: getNavItemPath(tagName, id),
            })
          } else {
            if (!organizedData[tagName]) {
              organizedData[tagName] = {
                id,
                title: tagName,
                icon: verticalNavItemTitleIconMap[tagName],
                path: getNavItemPath(tagName, id),
              }
            }
          }
        })

        return Object.values(organizedData)
      }
      const organizedSections: NavItem[] = organizeSections(data.sections)

      const updatedNavItems = updateNavItems(navigationItems(), organizedSections, 3)
      setNavItems(updatedNavItems)
    },
    enabled: isUserLoggedIn && !!activeProductFromLocalStorage,
  })

  const handleUserLogout = () => {
    setLoginResponse(null)
    navigate('/auth/login')
    setActiveProductInLocalStorage(null)
    window.location.reload()
  }

  const kakshaUserId: number | null = React.useMemo(
    // () => 56090,
    () => 85210,
    // () => (loginResponse?.data?.userID ? (loginResponse.data.userID - 5) / 2 : null),
    [loginResponse?.data],
  )

  return (
    <UserContext.Provider
      value={{
        loading: !!loginResponse && isLoading && termsAndConditionsLoading,
        userDetails: loginResponse,
        kakshaUserId,
        handleUserLogin,
        handleUserLogout,
        termsAndConditions: termsAndConditionsData,
        isUserLoggedIn,
        resetPassword: resetPasswordMutation,
        recoverPassword: RecoverPasswordMutation,
        updateUserInfo,
        updateUserAvatar,
        userDetailsWithBio,
        userInit,
        userActiveProduct: userInit?.data.course,
        activeProductFromUserInit,
        changeActiveProduct,
        userMobileDetails,
        getUserVerifyStatus,
        updatePhoneMutation,
        verifyMobileOtpMutation,
        changeWhatsAppNotificationPreference,
        loginWithOTPMutation,
        navItems,
        userTasksWithGroupAndSectionsQuery,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  return context
}

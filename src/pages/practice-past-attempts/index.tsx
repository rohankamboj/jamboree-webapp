import { Box, Card, Grid } from '@mui/material'
import { useMemo } from 'react'

import { useQuery } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  StyledBreadcrumbLink,
  CustomizedBreadcrumb,
  StyledLastBreadcrumb,
  StyledTitle,
} from 'src/@core/components/common/Breadcrumb'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import EnhancedTable from 'src/@core/components/table/TableSort'
import { isNotFoundError, showAPIErrorAsToast } from 'src/@core/utils/ApiHelpers'
import { get } from 'src/@core/utils/request'
import { GetPastAttemptsForUserResponseType } from 'src/apis/type'
import { USER_REST_RECORDS } from 'src/apis/user'
import { getNavigationLinkForSummaryPastAttempt } from '../structure/helpers'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig
const testTypes = ['flt-q', 'flt-v', 'flt', 'scholarship', 'dt', 'flt-a']

const practiceTypes = ['dt', 'st-q', 'st-v', 'st-a']

const Breadcrumb = ({ isPracticeRoute, isTestRoute }: { isPracticeRoute: boolean; isTestRoute: boolean }) => {
  let currentRouteBreadcrumbMeta = {
    path: '404',
    label: 'NA',
  }

  if (isPracticeRoute)
    currentRouteBreadcrumbMeta = {
      path: '/app/practice/past-attempt',
      label: 'Practice',
    }

  if (isTestRoute)
    currentRouteBreadcrumbMeta = {
      path: '/app/test/past-attempt',
      label: 'Test',
    }
  const breadcrumbs = [
    <StyledBreadcrumbLink underline='hover' key='1' color='inherit' to='/'>
      Dashboard
    </StyledBreadcrumbLink>,
    <StyledBreadcrumbLink variant='h6' key='2' color='text.primary' to={currentRouteBreadcrumbMeta.path}>
      {currentRouteBreadcrumbMeta.label}
    </StyledBreadcrumbLink>,
    <StyledLastBreadcrumb variant='h6' key='2' color='text.primary'>
      Past Attempts
    </StyledLastBreadcrumb>,
  ]

  return (
    <Box display='flex' alignItems='center' gap={4} mb={4}>
      <StyledTitle variant='h5'>Practice {currentRouteBreadcrumbMeta.label} Attempts</StyledTitle>
      <CustomizedBreadcrumb>{breadcrumbs}</CustomizedBreadcrumb>
    </Box>
  )
}

const PracticePastAttempts = () => {
  const { pathname } = useLocation()
  // path='/app/practice/past-attempt'
  // path='/app/test/past-attempt'
  const isPracticeRoute = pathname.includes('practice')
  const isTestRoute = pathname.includes('test')

  const {
    data: pastAttemptsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userPastAttempts'],
    queryFn: () => get(USER_REST_RECORDS) as Promise<GetPastAttemptsForUserResponseType>,
    retry: false,
    onError: (err: any) => {
      if (isNotFoundError(err.response.data)) return
      showAPIErrorAsToast(err)
    },
  })

  const pastAttemptsToShow = useMemo(() => {
    if (isNotFoundError(error?.response?.data) || !pastAttemptsData?.data.length) return []

    return (
      pastAttemptsData?.data
        .filter(({ type }) => {
          if (isTestRoute && testTypes.includes(type)) return true
          if (isPracticeRoute && practiceTypes.includes(type)) return true
          return false
        })
        // Sort by lastUpdatedOn which has format 2024-02-16 latest appearing first
        .sort((a, b) => {
          const dateA = new Date(a.lastUpdatedOn)
          const dateB = new Date(b.lastUpdatedOn)
          return dateB.getTime() - dateA.getTime()
        })
    )
  }, [pastAttemptsData, error, isPracticeRoute, isTestRoute])

  const navigate = useNavigate()

  if (isLoading) return <FallbackSpinner />

  const handleRedirectToQuizSummary = (attemptInfo: GetPastAttemptsForUserResponseType['data'][number]) => {
    if (isTestRoute) {
      navigate(getNavigationLinkForSummaryPastAttempt(attemptInfo.attemptID, 'test'))
      return
    }
    if (isPracticeRoute) {
      navigate(getNavigationLinkForSummaryPastAttempt(attemptInfo.attemptID, 'practice'))
      return
    }
    alert('Unhandled Route.')
    return
  }

  return (
    <Grid>
      <CustomHelmet title='Practice Past Attempts' />
      <Breadcrumb isPracticeRoute={isPracticeRoute} isTestRoute={isTestRoute} />
      <Card sx={{ boxShadow: 0, border, borderRadius: 1 }}>
        <Grid margin={4} sx={{ border, borderRadius: 1 }}>
          <EnhancedTable onClickViewAttemptButton={handleRedirectToQuizSummary} data={pastAttemptsToShow} />
        </Grid>
      </Card>
    </Grid>
  )
}

export default PracticePastAttempts

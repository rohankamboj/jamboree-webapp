import { Grid } from '@mui/material'
import { useQuery } from 'react-query'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import { get } from 'src/@core/utils/request'
import { GET_USER_AWA, GET_USER_AWA_ACCOUNTS } from 'src/apis/user'

// ** MUI Imports

// ** MUI Imports
import TabPanel from '@mui/lab/TabPanel'

// ** Icon Imports
import { useNavigate, useParams } from 'react-router-dom'
import { CustomBreadcrumbs } from 'src/@core/components/common/Breadcrumb'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import { isNotFoundError, showAPIErrorAsToast } from 'src/@core/utils/ApiHelpers'
import CustomizedTabs from 'src/components/common/CustomizedTab'
import CreateAWA from './components/CreateAWA'
import PendingAWA from './components/PendingAWA'
import ReviewedAWA from './components/ReviewedAWA'

type GetUserAWAResponse = {
  data: Array<{
    addedOn: string
    awaPrompt: string
    userResponse: string
    id: string
    evaluatedBy: string | null
    evaluatedOn: string | null
    user: string
  }>
}

function AWAPages() {
  const { tabId: activeTab = 'submit' } = useParams()

  const navigate = useNavigate()

  function setActiveTab(tab: string) {
    navigate(`/app/awa/${tab}`, {
      replace: true,
    })
  }

  const getUserAWAQuery = useQuery({
    queryKey: ['getUserPendingAWA', activeTab],
    queryFn: () =>
      get(GET_USER_AWA, {
        queryParams: {
          page: '1',
          evaluated: activeTab === 'pending' ? '0' : '1',
          'sort[]': '-id',
        },
      }) as Promise<GetUserAWAResponse>,
    onError: (err: any) => {
      if (isNotFoundError(err.response.data)) return
      showAPIErrorAsToast(err)
    },
    retry: false,
  })

  const userAWACountQuery = useQuery({
    queryKey: ['userAWACount'],
    queryFn: () => get(GET_USER_AWA_ACCOUNTS),
  })

  const isNotFound = isNotFoundError(getUserAWAQuery.error?.response?.data)

  const appointmentTabs = [
    {
      value: 'submit',
      label: 'Create AWA',
      icon: 'tabler:layout-grid-add',
      component: <CreateAWA userAWACountQuery={userAWACountQuery.data} />,
    },
    {
      value: 'pending',
      label: 'Pending AWAs',
      icon: 'tabler:history',
      component: (
        <PendingAWA data={isNotFound ? [] : getUserAWAQuery.data?.data} isLoading={getUserAWAQuery.isLoading} />
      ),
    },
    {
      value: 'reviewed',
      label: 'Reviewed AWAs',
      icon: 'mdi:clipboard-check-outline',
      component: (
        <ReviewedAWA data={isNotFound ? [] : getUserAWAQuery.data?.data} isLoading={getUserAWAQuery.isLoading} />
      ),
    },
  ]

  if (userAWACountQuery.isLoading) return <FallbackSpinner />

  return (
    <Grid>
      <CustomHelmet title='AWA' />
      <CustomBreadcrumbs />
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <CustomizedTabs tabs={appointmentTabs} defaultActiveTab={activeTab} handleActiveTabChange={setActiveTab}>
            {appointmentTabs.map(item => (
              <TabPanel key={item.value} value={item.value} sx={{ pl: 0 }}>
                {item.component}
              </TabPanel>
            ))}
          </CustomizedTabs>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default AWAPages

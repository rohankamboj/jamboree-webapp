// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** MUI Imports
import TabPanel from '@mui/lab/TabPanel'

// ** Icon Imports
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { CustomBreadcrumbs } from 'src/@core/components/common/Breadcrumb'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import { isNotFoundError, showAPIErrorAsToast } from 'src/@core/utils/ApiHelpers'
import { get, put } from 'src/@core/utils/request'
import { userData } from 'src/apis/type'
import { USER_APPOINTMENTS } from 'src/apis/user'
import CustomizedTab from 'src/components/common/CustomizedTab'
import CreateTab from './components/CreateAppointmentTab'
import PastTab from './components/PastTab'
import PendingTab from './components/PendingTab'

type AppointmentTab = any
type ActiveTabValue = AppointmentTab['value']

type GetAppointmentsForUserResponseType = { data: userData.appointmentList[] }

const Appointment = () => {
  const { tabId: activeTab = 'create' } = useParams<{ tabId: ActiveTabValue }>()

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const getUserAppointmentsQuery = useQuery({
    queryKey: ['getUserAppointments', activeTab],
    queryFn: () =>
      get(USER_APPOINTMENTS, {
        queryParams: {
          approved: (activeTab === 'pending' ? 0 : 1).toString(),
          // This is for testing purpose.
          // approved: (activeTab !== 'pending' ? 0 : 1).toString(),
          'sort[]': '-id',
          page: '1',
        },
      }) as Promise<GetAppointmentsForUserResponseType>,

    retry: false,

    onError: (err: any) => {
      if (isNotFoundError(err.response.data)) return
      showAPIErrorAsToast(err)
    },
  })

  const isNotFound = isNotFoundError(getUserAppointmentsQuery.error?.response?.data)

  const createUserAppointmentMutation = useMutation({
    mutationFn: (variables: { data: userData.appointmentList; handleSuccess: () => void }) =>
      put(USER_APPOINTMENTS, variables.data),
    onError: showAPIErrorAsToast,
    onSuccess: (_, { handleSuccess }) => {
      queryClient.invalidateQueries('getUserAppointments')
      handleSuccess()
    },
  })

  function setActiveTab(tab: string) {
    navigate(`/app/account/appointment/${tab}`, {
      replace: true,
    })
  }

  const appointmentTabs = [
    {
      value: 'create',
      label: 'Create Appointment',
      icon: 'tabler:layout-grid-add',
      component: <CreateTab createUserAppointmentMutation={createUserAppointmentMutation} />,
    },
    {
      value: 'pending',
      label: 'Pending Appointment',
      icon: 'carbon:time',
      component: (
        <PendingTab
          data={isNotFound ? [] : getUserAppointmentsQuery.data?.data}
          isLoading={getUserAppointmentsQuery.isLoading}
        />
      ),
    },
    {
      value: 'past',
      label: 'Past Appointment',
      icon: 'tabler:history',
      component: (
        <PastTab
          data={isNotFound ? [] : getUserAppointmentsQuery.data?.data}
          isLoading={getUserAppointmentsQuery.isLoading}
        />
      ),
    },
  ]

  return (
    <Grid>
      <CustomHelmet title='Appointment' />

      <CustomBreadcrumbs />
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <CustomizedTab tabs={appointmentTabs} defaultActiveTab={activeTab} handleActiveTabChange={setActiveTab}>
            {appointmentTabs.map(item => (
              <TabPanel key={item.value} value={item.value} sx={{ pl: 0 }}>
                {item.component}
              </TabPanel>
            ))}
          </CustomizedTab>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Appointment

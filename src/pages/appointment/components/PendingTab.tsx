import { Card, CardHeader, Grid, Typography } from '@mui/material'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import TableCollapsible from 'src/@core/components/table/CollapsibleTable'
import { userData } from 'src/apis/type'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig

type IPendingPropsTab = {
  data: userData.appointmentList[] | undefined
  isLoading: boolean
}

const tableHeaderRows = [
  {
    icon: 'tabler:user-circle',
    label: 'Faculty',
  },
  {
    icon: 'tabler:calendar-stats',
    label: 'Requested Date',
  },
  {
    icon: 'tabler:clock',
    label: 'Duration',
  },
  {
    label: 'Action',
  },
]

const PendingTab = ({ data, isLoading }: IPendingPropsTab) => {
  if (isLoading || !data) return <FallbackSpinner />

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card sx={{ boxShadow: 0, border, borderRadius: 1 }}>
          <CardHeader
            sx={{ pb: 0 }}
            title='Pending Appointment'
            subheader='Manage Your Pending Appointments: Stay in Control of Your Schedule'
          />

          {data?.length === 0 ? (
            // Margin needs to be added due to usage of the card.
            <Typography margin={'24px'}>No Appointments Found</Typography>
          ) : (
            <Grid margin={4} sx={{ border, borderRadius: 1 }}>
              <TableCollapsible headerRow={tableHeaderRows} data={data} />
            </Grid>
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default PendingTab

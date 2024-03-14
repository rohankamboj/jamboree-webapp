import { Card, CardHeader, Grid, Typography } from '@mui/material'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import TableCollapsible from 'src/@core/components/table/CollapsibleTable'
import { userData } from 'src/apis/type'
import themeConfig from 'src/configs/themeConfig'

const { border } = themeConfig

const tableHeaderRows = [
  {
    icon: 'tabler:user-circle',
    label: 'Review ID',
  },
  {
    icon: 'tabler:calendar-stats',
    label: 'Essay Prompt',
  },
  {
    icon: 'tabler:clock',
    label: 'Date & Time',
  },
  {
    icon: 'tabler:calendar-stat',
    label: 'Source',
  },
  {
    icon: 'tabler:calendar-stat',
    label: 'Score',
  },
  {
    label: 'Action',
  },
]

type IPendingPropsTab = {
  data: userData.awaList[] | undefined
  isLoading: boolean
}

const ReviewedAWA = ({ data, isLoading }: IPendingPropsTab) => {
  if (isLoading || !data) return <FallbackSpinner />

  return (
    <Grid item xs={12}>
      <Card sx={{ boxShadow: 0, border, borderRadius: 1 }}>
        <CardHeader sx={{ pb: 0 }} title='Reviewed AWAs' />
        {data?.length === 0 ? (
          // Margin needs to be added due to usage of the card.
          <Typography margin={'24px'}>No Data Found</Typography>
        ) : (
          <Grid margin={4} sx={{ border, borderRadius: 1 }}>
            <TableCollapsible headerRow={tableHeaderRows} data={data} isAWARow />
          </Grid>
        )}
      </Card>
    </Grid>
  )
}

export default ReviewedAWA

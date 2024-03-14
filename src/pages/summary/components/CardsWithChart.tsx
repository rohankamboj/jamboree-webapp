import { Box, Theme, Typography, useMediaQuery, useTheme } from '@mui/material'
import AreaChart from 'src/@core/components/charts/AreaChart'
import IconifyIcon from 'src/@core/components/icon'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'

type Props = {
  avgCorrectAnswerTiming?: number
  avgIncorrectAnswerTiming?: number
  avgTimePerQuestion?: number
  chartData?: any
}

const CardsWithChart = ({ avgCorrectAnswerTiming, avgIncorrectAnswerTiming, avgTimePerQuestion, chartData }: Props) => {
  const theme = useTheme()
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box display='flex' gap={4} flexDirection={isSm ? 'column' : 'row'}>
      <StyledBorderedBox
        borderRadius={1}
        padding={6}
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        width={isSm ? '100%' : '30%'}
        gap={3}
      >
        <AvgTimePerQuestion
          icon={'lucide:check-circle'}
          color={theme.palette.primary.main}
          title={`${avgCorrectAnswerTiming}s`}
          description={'Avg time for correct answers'}
        />

        <AvgTimePerQuestion
          icon={'ph:x-circle'}
          color={'#F65531'}
          title={`${avgIncorrectAnswerTiming}s`}
          description={'Avg time for incorrect answers'}
        />

        <AvgTimePerQuestion
          icon={'lucide:check-circle'}
          color={'#32BAE5'}
          title={`${avgTimePerQuestion}s`}
          description={'Avg Time per question'}
        />
      </StyledBorderedBox>
      <StyledBorderedBox borderRadius={1} padding={2} width={isSm ? '100%' : '70%'}>
        <AreaChart
          option={{
            colors: ['#E8C8E8'],
            fill: {
              opacity: 0.5,
              type: 'solid',
            },
          }}
          categories={[]}
          series={chartData}
        />
      </StyledBorderedBox>
    </Box>
  )
}

const AvgTimePerQuestion = ({
  icon,
  color,
  title,
  description,
}: {
  icon: string
  color: string
  title: string
  description: string
}) => {
  return (
    <StyledBorderedBox borderRadius={1} padding={2} minHeight={80} display='flex' alignItems='center' gap={3}>
      <IconifyIcon icon={icon} height={30} width={30} color={color} />
      <Box>
        <Typography variant='h6' color={color}>
          {title}
        </Typography>
        <Typography variant='h6'>{description}</Typography>
      </Box>
    </StyledBorderedBox>
  )
}

export default CardsWithChart

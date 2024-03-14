import { useTheme } from '@mui/material/styles'

import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
// import CustomChip from 'src/@core/components/mui/chip'
import ReactApexcharts from 'react-apexcharts'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
const yAxisDummyData: ApexAxisChartSeries = [
  {
    data: [280, 200, 220, 180, 270, 250, 70, 90, 200, 150, 160, 100, 150, 100, 50],
  },
]

const xAxisDummyOptions: ApexXAxis = {
  categories: [
    '7/12',
    '8/12',
    '9/12',
    '10/12',
    '11/12',
    '12/12',
    '13/12',
    '14/12',
    '15/12',
    '16/12',
    '17/12',
    '18/12',
    '19/12',
    '20/12',
    '21/12',
  ],
}

export type ApexLineChartProps = {
  xAxisOptions: ApexXAxis
  yAxisData: ApexAxisChartSeries
  yAxisOptions?: ApexYAxis
  tooltip?: ApexTooltip
}

const ApexLineChart = ({
  yAxisData = yAxisDummyData,
  xAxisOptions = xAxisDummyOptions, // customToolTip = dummyToolTip,
  yAxisOptions,
}: ApexLineChartProps) => {
  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ['#ff9f43'],
    stroke: { curve: 'straight' },
    dataLabels: { enabled: false },
    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      colors: ['#ff9f43'],
      strokeColors: ['#fff'],
    },
    grid: {
      padding: { top: -10 },
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: true },
      },
    },
    tooltip: {
      custom(data: any) {
        return `<div class='bar-chart'>
          <span>${data.series[data.seriesIndex][data.dataPointIndex]}</span>
        </div>`
      },
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.disabled },
      },
      ...yAxisOptions,
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: theme.palette.divider },
      crosshairs: {
        stroke: { color: theme.palette.divider },
      },
      labels: {
        style: { colors: theme.palette.text.disabled },
      },
      ...xAxisOptions,
    },
  }

  return (
    <ApexChartWrapper>
      <ReactApexcharts type='line' height={300} options={options} series={yAxisData} />
    </ApexChartWrapper>
  )
}

export default ApexLineChart

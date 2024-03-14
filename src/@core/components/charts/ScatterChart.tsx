import { useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import ReactApexCharts from 'react-apexcharts'

import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// const ScatterChart = ({ chartData }: { chartData: Array<{ name: string; data: Array<{ x: number; y: number }> }> }) => {
const ScatterChart = ({
  chartData,
}: {
  chartData: {
    seriesData: ApexAxisChartSeries
  }
}) => {
  const theme = useTheme()

  // Combine all y axis data from all chart data to obtain the max value
  // const tickAmount = Math.max(
  //   ...chartData.reduce((acc, curr) => [...acc, ...curr.data.map(({ y }) => y)], [] as number[]),
  // )

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: [theme.palette.primary.main, theme.palette.error.main],
    grid: {
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: false },
      },
      yaxis: {
        lines: { show: false },
      },
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.disabled },
      },
      // tickAmount: tickAmount,
    },
    xaxis: {
      axisBorder: { show: true },
      axisTicks: { color: theme.palette.divider },
      crosshairs: {
        stroke: { color: theme.palette.divider },
      },

      labels: {
        hideOverlappingLabels: true,
        style: { colors: theme.palette.text.disabled },
        formatter: (val: string) => parseFloat(val).toFixed(0),
      },
      // tickAmount: chartData.reduce((acc, curr) => Math.max(acc, curr.data.length), 0),
      type: 'numeric',
    },
  }

  return (
    <ApexChartWrapper>
      <ReactApexCharts type='scatter' height={300} options={options} series={chartData.seriesData} />
    </ApexChartWrapper>
  )
}

export default ScatterChart

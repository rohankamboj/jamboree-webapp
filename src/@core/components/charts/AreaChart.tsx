import { useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import ReactApexCharts from 'react-apexcharts'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

const AreaChart = ({
  option,
  series,
  categories,
}: {
  option: {
    colors: Array<string>
    fill: {
      opacity: number
      type: string
    }
  }
  series: Array<{
    name: string
    data: Array<number>
  }>
  categories: Array<string>
}) => {
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    tooltip: {
      // shared: false,
      // TODO: will pass it from props
      custom: function ({ series, seriesIndex, dataPointIndex }) {
        return '<div class="chart-tooltip">' + '<span>' + series[seriesIndex][dataPointIndex] + '</span>' + '</div>'
      },
    },

    markers: {
      // TODO: color will pass it from props
      colors: [theme.palette.primary.main, theme.palette.error.main],
      strokeColors: '#FFFFFF',
      strokeWidth: 5,
      strokeOpacity: 1,
      fillOpacity: 1,
      shape: 'circle',
      radius: 2,
      hover: {
        size: 10,
        sizeOffset: 3,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      curve: 'smooth',
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      labels: { colors: theme.palette.text.secondary },
      markers: {
        offsetY: 1,
        offsetX: -3,
      },
      itemMargin: {
        vertical: 1,
        horizontal: 2,
      },
    },
    ...option,
    grid: {
      show: true,
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: true },
      },
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.disabled },
      },
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
      categories,
      tickAmount: 20,
      tooltip: {
        enabled: false,
      },
      // tickPlacement: 'between',
    },
  }
  return (
    <ApexChartWrapper>
      <ReactApexCharts type='area' height={250} options={options} series={series} />
    </ApexChartWrapper>
  )
}

export default AreaChart

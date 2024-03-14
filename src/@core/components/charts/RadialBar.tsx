import { useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import ReactApexCharts from 'react-apexcharts'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const radialBarColors = {
  series1: '#FF5F1F',
  series2: '#1FD5EB',
}

type RadialBarChartProps = {
  series: number[]
  fltScore: number
}

const RadialBarChart = ({ series, fltScore }: RadialBarChartProps) => {
  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    stroke: { lineCap: 'round' },
    labels: ['FLT  Score', 'Target Score'],
    legend: {
      show: false,
      position: 'bottom',
      labels: {
        colors: theme.palette.text.secondary,
      },
      markers: {
        offsetX: -3,
      },
      itemMargin: {
        vertical: 3,
        horizontal: 10,
      },
    },
    colors: [theme.palette.primary.main, radialBarColors.series1],
    plotOptions: {
      radialBar: {
        hollow: { size: '30%' },
        track: {
          margin: 15,
          background: hexToRGBA(theme.palette.customColors.trackBg, 1),
        },
        dataLabels: {
          name: {
            fontSize: '2rem',
          },
          value: {
            fontSize: '1rem',
            color: theme.palette.text.secondary,
          },
          total: {
            show: true,
            fontWeight: 400,
            label: 'FLT Score',
            fontSize: '1.125rem',
            color: theme.palette.text.primary,
            formatter: function () {
              return fltScore + ''
              // const totalValue =
              //   w.globals.seriesTotals.reduce((a: any, b: any) => {
              //     return a + b
              //   }, 0) / w.globals.series.length

              // if (totalValue % 1 === 0) {
              //   return totalValue + ''
              // } else {
              //   return totalValue.toFixed(2) + ''
              // }
            },
          },
        },
      },
    },
  }

  return (
    <ApexChartWrapper>
      <ReactApexCharts type='radialBar' height={250} options={options} series={series} />
    </ApexChartWrapper>
  )
}

export default RadialBarChart

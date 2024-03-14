import { useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import ReactApexCharts from 'react-apexcharts'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

type Props = {
  data: Array<number>
}

const SparkLineChart = (props: Props) => {
  const { data } = props
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      sparkline: { enabled: true },
    },
    stroke: { dashArray: 10 },
    labels: ['Completed Task'],
    colors: [hexToRGBA(theme.palette.info.main, 1)],
    states: {
      hover: {
        filter: { type: 'none' },
      },
      active: {
        filter: { type: 'none' },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        opacityTo: 0.5,
        opacityFrom: 1,
        shadeIntensity: 0.5,
        stops: [30, 70, 100],
        inverseColors: false,
        gradientToColors: [theme.palette.info.main],
      },
    },
    plotOptions: {
      radialBar: {
        endAngle: 130,
        startAngle: -140,
        hollow: { size: '60%' },
        track: { background: 'transparent' },
        dataLabels: {
          name: {
            offsetY: -15,
            color: theme.palette.text.disabled,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.body2.fontSize as string,
          },
          value: {
            offsetY: 15,
            fontWeight: 500,
            formatter: (value: any) => `${value}%`,
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.h1.fontSize as string,
          },
        },
      },
    },
    grid: {
      padding: {
        top: -30,
        bottom: 12,
      },
    },
    responsive: [
      {
        breakpoint: 1300,
        options: {
          grid: {
            padding: {
              left: 22,
            },
          },
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          grid: {
            padding: {
              left: 0,
            },
          },
        },
      },
    ],
  }

  return (
    <ApexChartWrapper>
      <ReactApexCharts type='radialBar' height={300} options={options} series={data} />
    </ApexChartWrapper>
  )
}

export default SparkLineChart

import { useTheme } from '@mui/material/styles'

import { ApexOptions } from 'apexcharts'
import ReactApexCharts from 'react-apexcharts'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const radialBarColors = {
  series1: '#62D6C5',
  series2: '#51A8F4',
}

const RoundRadialBarChart = () => {
  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    stroke: { lineCap: 'round' },

    colors: [radialBarColors.series1, radialBarColors.series2],
    plotOptions: {
      radialBar: {
        hollow: { size: '30%' },
        track: {
          margin: 15,
          background: hexToRGBA(theme.palette.customColors.trackBg, 1),
        },
        dataLabels: {
          name: {
            fontSize: '1rem',
          },
          value: {
            fontSize: '1rem',
            color: theme.palette.text.secondary,
          },
          total: {
            show: true,
            fontWeight: 400,
            label: 'Comments',
            fontSize: '1.125rem',
            color: theme.palette.text.primary,
            formatter: function (w) {
              const totalValue =
                w.globals.seriesTotals.reduce((a: any, b: any) => {
                  return a + b
                }, 0) / w.globals.series.length

              if (totalValue % 1 === 0) {
                return totalValue + '%'
              } else {
                return totalValue.toFixed(2) + '%'
              }
            },
          },
        },
      },
    },
    grid: {
      padding: {
        top: -32,
        bottom: -27,
      },
    },
  }

  return (
    <ApexChartWrapper>
      <ReactApexCharts type='radialBar' height={280} options={options} series={[80, 50]} />
    </ApexChartWrapper>
  )
}

export default RoundRadialBarChart

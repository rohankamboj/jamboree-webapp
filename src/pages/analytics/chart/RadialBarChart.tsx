import { ApexOptions } from 'apexcharts'
import ReactApexCharts from 'react-apexcharts'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

type Props = {
  series: Array<number>
  color: string
}

const RadialBarChart = (props: Props) => {
  const { series, color } = props
  const options: ApexOptions = {
    // series: [76],
    chart: {
      type: 'radialBar',
      offsetY: -20,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: '70%',
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -20,
            fontSize: '22px',
          },
        },
      },
    },
    grid: {
      padding: {
        top: 10,
        bottom: 20,
        // left: -10,
        // right: 10,
      },
    },
    fill: {
      colors: [color],
    },
    labels: ['Average Results'],
  }

  return (
    <ApexChartWrapper>
      <ReactApexCharts type='radialBar' height={250} options={options} series={series} />
    </ApexChartWrapper>
  )
}

export default RadialBarChart

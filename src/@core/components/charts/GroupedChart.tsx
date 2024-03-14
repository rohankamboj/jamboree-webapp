import { ApexOptions } from 'apexcharts'
import ReactApexCharts from 'react-apexcharts'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

const GroupedChart = () => {
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 430,
    },

    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: false,
      offsetX: -6,
      style: {
        fontSize: '12px',
        colors: ['#fff'],
      },
    },
    stroke: {
      show: false,
      width: 1,
      colors: ['#fff'],
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    colors: ['#7D83EC', '#FFA266'],
    xaxis: {
      categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
    },
  }
  return (
    <ApexChartWrapper>
      <ReactApexCharts
        type='bar'
        height={300}
        options={options}
        series={[
          {
            data: [44, 55, 41, 64, 22, 43, 21],
          },
          {
            data: [53, 32, 33, 52, 13, 44, 32],
          },
        ]}
      />
    </ApexChartWrapper>
  )
}

export default GroupedChart

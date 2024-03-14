import { TabPanel } from '@mui/lab'
import { Box, Grid } from '@mui/material'
import CustomizedTab from 'src/components/common/CustomizedTab'
import QuantVerbalComponent from './tabs/QuantVerbalComponent'
import { SummarySectionNameWithQuestion } from '../AnalysisAndSolution'
import { capitalizeFirstLetter } from 'src/utils'

export type TimeAnalysisTypes = {
  primaryTopics: string
  attempt: string
  time: string
  complexity: string
  topic: string
}

const TimeAnalysis = ({ testSections }: { testSections: SummarySectionNameWithQuestion[] }) => {
  const timeAnalysisTabs = testSections
    .map(section => {
      return {
        value: section.section,

        label: capitalizeFirstLetter(section.section).charAt(0).toUpperCase() + section.section.slice(1),
        component: <QuantVerbalComponent testSection={section} />,
      }
    })
    .reverse()

  return (
    <Box
      display='flex'
      flexDirection='column'
      gap={4}
      sx={{
        position: 'relative',
      }}
    >
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <CustomizedTab tabs={timeAnalysisTabs} defaultActiveTab={timeAnalysisTabs[0]?.value}>
            {timeAnalysisTabs.map(item => (
              <TabPanel key={item.value} value={item.value} sx={{ pl: 0 }}>
                {item.component}
              </TabPanel>
            ))}
          </CustomizedTab>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TimeAnalysis

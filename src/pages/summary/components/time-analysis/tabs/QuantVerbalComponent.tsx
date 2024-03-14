import { Box, Button } from '@mui/material'
import { Fragment, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import IconifyIcon from 'src/@core/components/icon'
import { calcSectionStats, calculateQuestionDifficulty, difficultyToLabelMap } from 'src/pages/summary'
import TimeAnalysisTable from 'src/pages/summary/components/time-analysis/TimeAnalysisTable'
import { TimeAnalysisTypes } from '..'
import { SummarySectionNameWithQuestion } from '../../AnalysisAndSolution'
import FilterComponent from '../FilterComponent'

const QuantVerbalComponent = ({ testSection }: { testSection: SummarySectionNameWithQuestion }) => {
  const { control } = useForm<TimeAnalysisTypes>()
  const [showFilterFields, setShowFilterFields] = useState(true)

  const { questions = [], section } = testSection

  const sectionStats = calcSectionStats(questions ?? [])

  // @ts-ignore
  const uniquePrimaryTopics: Array<string> = Array.from(
    questions?.reduce((acc, cQues) => {
      if (cQues.type) acc.add(cQues.type)
      return acc
    }, new Set()) ?? [],
  )

  const selectedFilters = useWatch({
    control,
    name: ['primaryTopics', 'attempt', 'time', 'complexity', 'topic'],
  })

  const questionsToRender = useMemo(() => {
    const [primaryTopics, attempt, time, complexity] = selectedFilters

    return questions?.filter(cQues => {
      if (primaryTopics && primaryTopics !== 'All' && cQues.type !== primaryTopics) return false
      if (attempt && attempt !== 'Both') {
        if (Number(attempt) != Number(cQues.result)) return false
      }
      if (time && time !== 'All') {
        const timeInSeconds = Number(cQues.timeTaken) / 1000
        if (time === 'gt180' && timeInSeconds < 180) return false
        if (!isNaN(Number(time)) && Number(time) < timeInSeconds) return false
      }
      if (
        complexity &&
        complexity !== 'All' &&
        difficultyToLabelMap[calculateQuestionDifficulty(cQues)]?.toLowerCase() !== complexity.toLowerCase()
      ) {
        return false
      }
      // if (topic !== 'All' && cQues.topic !== topic) return false
      return true
    })
  }, [selectedFilters, sectionStats])

  return (
    <Fragment>
      <Box
        sx={{
          position: 'absolute',
          right: '0px',
          top: {
            xs: '4px',
            lg: '0px',
          },
        }}
      >
        <Button variant='outlined' size='small' onClick={() => setShowFilterFields(!showFilterFields)}>
          Filter
          <IconifyIcon icon='mdi:filter-outline' />
        </Button>
      </Box>

      {showFilterFields && <FilterComponent control={control} uniquePrimaryTopics={uniquePrimaryTopics} />}

      <TimeAnalysisTable section={section} questionsToRender={questionsToRender ?? []} />
    </Fragment>
  )
}

export default QuantVerbalComponent

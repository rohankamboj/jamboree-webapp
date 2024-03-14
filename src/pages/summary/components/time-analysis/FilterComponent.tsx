import { Grid, MenuItem } from '@mui/material'
import { Control, Controller } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import { TimeAnalysisTypes } from '.'

type FilterOptionsType = {
  id: string
  name: string
}

const AttemptOptions: Array<FilterOptionsType> = [
  {
    id: 'Both',
    name: 'Both',
  },
  {
    id: '1',
    name: 'Correct',
  },
  {
    id: '0',
    name: 'Incorrect',
  },
]
const TimeOptions: Array<FilterOptionsType> = [
  {
    id: 'All',
    name: 'All',
  },
  {
    id: '60',
    name: '< 60 sec',
  },
  {
    id: '120',
    name: '< 120 sec',
  },
  {
    id: '180',
    name: '< 180 sec',
  },
  {
    id: 'gt180',
    name: '> 180 sec',
  },
]
const ComplexityOptions: Array<FilterOptionsType> = [
  {
    id: 'All',
    name: 'All',
  },
  {
    id: 'Easy',
    name: 'Easy',
  },
  {
    id: 'Medium',
    name: 'Medium',
  },
  {
    id: 'Hard',
    name: 'Hard',
  },
]
const TopicOptions: Array<FilterOptionsType> = [
  {
    id: 'All',
    name: 'All',
  },
]

// Default options.
const filters = {
  Attempt: {
    name: 'Attempt',
    id: 'Attempt',
    options: AttemptOptions,
    selected: 'Both',
  },
  Time: {
    name: 'Time',
    id: 'Time',
    options: TimeOptions,
    selected: 'All',
  },
  Complexity: {
    name: 'Complexity',
    id: 'Complexity',
    options: ComplexityOptions,
    selected: 'All',
  },
  Topic: {
    name: 'Topic',
    id: 'Topic',
    options: TopicOptions,
    selected: 'All',
  },
}

const FilterComponent = ({
  control,
  uniquePrimaryTopics,
}: {
  control: Control<TimeAnalysisTypes, any>
  uniquePrimaryTopics: string[]
}) => {
  const primaryTopics = uniquePrimaryTopics.map(item => {
    return {
      id: item,
      name: item,
    }
  })
  primaryTopics.unshift({
    id: 'All',
    name: 'All',
  })

  return (
    <>
      <Grid container spacing={5} mb={4}>
        <Grid item xs={12} sm={3}>
          <Controller
            name='primaryTopics'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField fullWidth label='Primary Topics' value={value || 'All'} onChange={onChange} select>
                {primaryTopics.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <Controller
            name='attempt'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label='Attempt'
                value={value || filters.Attempt.selected}
                onChange={onChange}
                select
              >
                {filters.Attempt.options.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <Controller
            name='time'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField fullWidth label='Time' value={value || filters.Time.selected} onChange={onChange} select>
                {filters.Time.options.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <Controller
            name='complexity'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label='Complexity'
                value={value || filters.Complexity.selected}
                onChange={onChange}
                select
              >
                {filters.Complexity.options.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Controller
            name='topic'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label='Topic'
                value={value || filters.Topic.selected}
                onChange={onChange}
                select
              >
                {filters.Topic.options.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
        </Grid>
      </Grid>
    </>
  )
}
export default FilterComponent

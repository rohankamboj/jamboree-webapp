// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

// ** Type Imports
import { CustomCheckboxBasicProps } from 'src/@core/components/custom-checkbox/types'
import { ChangeEvent } from 'react'

const CustomCheckbox = (props: CustomCheckboxBasicProps) => {
  // ** Props
  const { data, name, selected, gridProps, setSelected, color = 'primary', disabled } = props

  const { title, value } = data

  const handleChange = (prop: number | string | ChangeEvent<HTMLInputElement>) => {
    if (selected === value) {
      setSelected(null)
      return
    }
    if (typeof prop === 'number' || typeof prop === 'string') {
      setSelected(prop)
    } else {
      const selectedValue = prop.target.value
      setSelected(typeof value === 'number' ? Number(selectedValue) : selectedValue)
    }
  }

  const renderData = () => {
    return typeof title === 'string' ? (
      <Typography color={'text.secondary'} sx={{ p: 2, fontWeight: 500 }}>
        {title}
      </Typography>
    ) : (
      title
    )
  }

  const renderComponent = () => {
    return (
      <Grid item {...gridProps}>
        <Box
          onClick={() => (disabled ? {} : handleChange(value))}
          sx={{
            // height: '100%',
            display: 'flex',
            borderRadius: 1,
            cursor: 'pointer',
            position: 'relative',
            alignItems: 'center',
            border: theme => `1px solid ${theme.palette.divider}`,
            ...(selected === value
              ? { borderColor: `${color}.main` }
              : { '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` } }),
          }}
        >
          <Box sx={{ mr: 2, borderRight: theme => `2px solid ${theme.palette.divider}` }}>
            <Checkbox
              size='small'
              color={color}
              name={name}
              value={value}
              checked={selected === value}
              onChange={disabled ? () => {} : handleChange}
              sx={{ mb: -2, mt: -2.5, ml: -1.75, mr: -1.75, p: 4 }}
            />
          </Box>
          {renderData()}
        </Box>
      </Grid>
    )
  }

  return data ? renderComponent() : null
}

export default CustomCheckbox

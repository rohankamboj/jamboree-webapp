// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Typography from '@mui/material/Typography'
import { ChangeEvent } from 'react'

import { CustomRadioBasicProps } from 'src/@core/components/custom-radio/types'
import IconifyIcon from '../../icon'

const CustomRadioBasic = (props: CustomRadioBasicProps) => {
  const { name, data, selected, setSelected, gridProps, isIncorrect, quizRadioLabel, radioButtonCustomStyles } = props

  const { title, value } = data

  const color = isIncorrect ? 'error' : 'primary'

  const handleChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setSelected(prop)
    } else {
      setSelected((prop.target as HTMLInputElement).value)
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
          onClick={() => handleChange(value)}
          sx={{
            // height: '100%',
            display: 'flex',
            borderRadius: 1,
            cursor: 'pointer',
            position: 'relative',
            alignItems: 'center',
            border: theme => `1px solid ${theme.palette.divider}`,
            ...radioButtonCustomStyles,
            ...(selected === value
              ? { borderColor: `${color}.main` }
              : { '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` } }),
          }}
        >
          <Box sx={{ mr: 2, borderRight: theme => `2px solid ${theme.palette.divider}` }}>
            {quizRadioLabel ? (
              <Radio
                name={name}
                size='small'
                icon={
                  <Typography
                    // @ts-ignore
                    variant='paragraphBold'
                    sx={{ mx: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  >
                    {quizRadioLabel}
                  </Typography>
                }
                checkedIcon={
                  <Box
                    borderRadius={1}
                    bgcolor={`${color}.main`}
                    width={24}
                    height={24}
                    color='white'
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                  >
                    <IconifyIcon icon={color === 'primary' ? 'tabler:check' : 'charm:cross'} />
                  </Box>
                }
                color={color}
                value={value}
                onChange={handleChange}
                checked={selected === value}
                sx={{ mb: -2, mt: -2.5, ml: -1.75, mr: -1.75, p: 4 }}
              />
            ) : (
              <Radio
                name={name}
                size='small'
                color={color}
                value={value}
                onChange={handleChange}
                checked={selected === value}
                sx={{ mb: -2, mt: -2.5, ml: -1.75, mr: -1.75, p: 4 }}
              />
            )}
          </Box>
          {renderData()}
        </Box>
      </Grid>
    )
  }

  return data ? renderComponent() : null
}

export default CustomRadioBasic

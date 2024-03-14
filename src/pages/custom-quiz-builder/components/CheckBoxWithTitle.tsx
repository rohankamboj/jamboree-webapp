import { Box, Checkbox, Grid, GridProps } from '@mui/material'
import Typography from 'src/@core/components/common/Typography'

type Props = {
  checkedValues: Array<string | number>
  onChange: (...event: any[]) => void
  data: {
    title: string
    value: string | number
  }
  name: string
  gridProps: GridProps
}

const CheckBoxWithTitle = (props: Props) => {
  const { checkedValues = [], onChange, data, name, gridProps } = props

  const { title, value } = data

  return (
    <Grid item {...gridProps}>
      <Box
        onClick={onChange}
        sx={{
          display: 'flex',
          borderRadius: 1,
          cursor: 'pointer',
          position: 'relative',
          alignItems: 'center',
          border: theme => `1px solid ${theme.palette.divider}`,
          ...(checkedValues?.includes(value)
            ? { borderColor: 'primary.main' }
            : {
                '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` },
              }),
        }}
      >
        <Box sx={{ mr: 2, borderRight: theme => `2px solid ${theme.palette.divider}` }}>
          <Checkbox
            id={name}
            size='small'
            color='primary'
            name={name}
            value={value}
            checked={checkedValues.includes(value)}
            onChange={onChange}
            sx={{ mb: -2, mt: -2.5, ml: -1.75, mr: -1.75, p: 4 }}
          />
        </Box>
        <Typography color='text.secondary' sx={{ p: 2, fontWeight: 500 }}>
          {title}
        </Typography>
      </Box>
    </Grid>
  )
}

export default CheckBoxWithTitle

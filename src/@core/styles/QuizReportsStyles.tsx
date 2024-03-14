import { Box, BoxProps, Button, ButtonProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const ResponsiveContainer = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}))

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.up('md')]: {
    width: '50%',
    paddingRight: '16px',
    borderRight: '2px dashed rgba(219, 218, 222, 1)',
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}))

const StyledBox2 = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    width: '50%',
    paddingLeft: '16px',
  },
  [theme.breakpoints.down('md')]: {
    marginTop: '10px',
  },
}))

const ButtonBox = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    justifyContent: 'end',
  },
}))

const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}))

const HeadingBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.up('md')]: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: '4px',
  },
}))

export { ResponsiveContainer, StyledBox, StyledBox2, ButtonBox, StyledButton, HeadingBox }

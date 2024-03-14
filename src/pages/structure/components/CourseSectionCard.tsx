import LinearProgress from '@mui/material/LinearProgress'
import { Box, Card, CardProps, Collapse, styled, useTheme } from '@mui/material'
import Typography from 'src/@core/components/common/Typography'

type Props = {
  title: string
  description: string
  percentageCompleted: number
  isSelected: boolean
  onClickCard: () => void
}

const StyledCard = styled(Card)<CardProps>(() => ({
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  rowGap: 5,
  cursor: 'pointer',
}))

const CourseSectionCard = ({ title, description, percentageCompleted, isSelected, onClickCard }: Props) => {
  const theme = useTheme()
  return (
    <StyledCard
      onClick={onClickCard}
      sx={{
        border: `1px solid ${isSelected ? theme.palette.primary.main : 'rgba(219, 218, 222, 1)'}`,
        padding: 4,
        boxShadow: 0,
      }}
    >
      <Typography
        variant='paragraphLead'
        sx={{
          color: isSelected ? 'primary.main' : 'grey.50',
        }}
      >
        {title}
      </Typography>
      <Typography variant='body2' color={isSelected ? 'grey.200' : 'grey.100'}>
        {description}
      </Typography>
      <Collapse unmountOnExit in={isSelected} timeout={500}>
        {isSelected && (
          <>
            <Box display='flex' justifyContent='flex-end' alignItems='center'>
              {/* <Typography variant='caption'>Task: 237/420</Typography> */}
              <Typography variant='caption'>{percentageCompleted}% Completed</Typography>
            </Box>
            <LinearProgress sx={{ height: '8px', mt: 2 }} variant='determinate' value={percentageCompleted} />
          </>
        )}
      </Collapse>
    </StyledCard>
  )
}

export default CourseSectionCard

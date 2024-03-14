import { Box, Typography } from '@mui/material'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'

const WeekDays = [
  {
    id: 1,
    name: 'M',
    bgcolor: '#EBBD94',
  },
  {
    id: 2,
    name: 'T',
    bgcolor: '#F8E9DB',
  },
  {
    id: 3,
    name: 'W',
    bgcolor: '#F8E9DB',
  },
  {
    id: 4,
    name: 'T',
    bgcolor: '#EBBD94',
  },
  {
    id: 5,
    name: 'F',
    bgcolor: '#F1D3B7',
  },
  {
    id: 6,
    name: 'S',
    bgcolor: '#F5DEC9',
  },
  {
    id: 7,
    name: 'S',
    bgcolor: '#FcF4ED',
  },
]

const ActivityTracker = () => {
  return (
    <StyledBorderedBox mt={4} borderRadius={2} padding={4}>
      <Box display='flex' justifyContent='space-between' my={4}>
        <Box>
          <Typography variant='h5'>Activity Tracker</Typography>
          <Typography>Last 7 Days</Typography>
        </Box>
        <Typography color='#3D39FF'>View More</Typography>
      </Box>
      <Box display='flex' justifyContent='space-between'>
        {WeekDays.map(item => (
          <Box key={item.id} mt={2} display='flex' flexDirection='column' gap={2} alignItems='center'>
            <Box bgcolor={item.bgcolor} height={20} width={20} />
            <Typography>{item.name}</Typography>
          </Box>
        ))}
      </Box>
    </StyledBorderedBox>
  )
}

export default ActivityTracker

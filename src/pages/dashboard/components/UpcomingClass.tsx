import { Box, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'

const UpcomingClass = () => {
  return (
    <Box mt={4}>
      <Typography variant='h5'>Upcoming Class</Typography>
      <Box borderRadius={2} bgcolor={'#876BFF'} padding={4} mt={2}>
        <Box display='flex' alignItems='center' gap={4} pb={3} borderBottom='1px solid white'>
          <Box display='flex' justifyContent='center' padding={2} borderRadius={1} bgcolor='#9A81D6'>
            <IconifyIcon icon='tabler:video' color='white' />
          </Box>
          <Box>
            <Typography color='white'>Batch Name</Typography>
            <Typography variant='h6' color='white'>
              Verbal Morning Batch
            </Typography>
          </Box>
        </Box>
        <Box mt={3} display='flex' gap={2} flexDirection='column'>
          <Typography color='white'>Date & Time</Typography>
          <Typography color='white'>25 Jun 23 | 3:00 PM - 4:00 PM</Typography>
          <Box display='flex' justifyContent='end' sx={{ cursor: 'pointer' }}>
            <Typography bgcolor='white' padding={2} borderRadius={1}>
              Join Class
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default UpcomingClass

import { Box, Theme, Typography, useMediaQuery } from '@mui/material'

const KakshaAIIntegration = () => {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box
      border='1px solid #44A2DF'
      bgcolor='#E1F0FA'
      width={isSm ? '100%' : '58%'}
      borderRadius={1}
      display='flex'
      justifyContent='space-between'
      height='100%'
    >
      <Box display='flex' gap={2} flexDirection='column' padding={'24px'}>
        <Typography fontWeight={600} fontSize='18px' lineHeight='18px' color='#44A2DF'>
          Kaksha AI Integration{' '}
        </Typography>
        <Typography fontWeight={400} fontSize='14px' lineHeight='25px'>
          WooCommerce iOS App Completed
        </Typography>
        <Box
          bgcolor='#44A2DF'
          padding={isSm ? 2 : 2}
          mt={2}
          borderRadius={1}
          display='flex'
          alignItems='center'
          justifyContent='center'
          sx={{
            cursor: 'pointer',
          }}
        >
          <Typography color='white' variant='h6'>
            Action Button
          </Typography>
        </Box>
      </Box>
      <img src='/images/Rocket.png' alt='Rocket' style={{ paddingTop: 10, objectFit: 'contain' }} />
    </Box>
  )
}

export default KakshaAIIntegration

// ** React Imports

// ** Next Import
import { Link } from 'react-router-dom'

// ** MUI Components
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'

// ** Layout Import
// import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
// import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw',
  },
}))

const Error404 = () => {
  return (
    <BlankLayout>
      <CustomHelmet title='404 Not Found' />
      <Box className='content-center'>
        <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <BoxWrapper>
            <Typography variant='h2' sx={{ mb: 1.5 }}>
              Page Not Found :(
            </Typography>
            <Typography sx={{ mb: 6, color: 'text.secondary' }}>
              Oops! 😖 The requested URL was not found on this server.
            </Typography>
            <Button to='/' component={Link} variant='contained'>
              Back to Home
            </Button>
          </BoxWrapper>
          <img height='500' alt='error-illustration' src='/images/pages/404.png' />
        </Box>
        {/* <FooterIllustrations /> */}
      </Box>
    </BlankLayout>
  )
}

export default Error404

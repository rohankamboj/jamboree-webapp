import { Box } from '@mui/material'
import Typography from 'src/@core/components/common/Typography'

const Slide1 = () => {
  return (
    <>
      <Box bgcolor='#F6F6F7' padding={4}>
        <Typography variant='h5'>A few questions before we get started</Typography>
      </Box>
      <Typography variant='paragraphMedium' padding={4}>
        We'll ask you some questions on the basis of which we will automate your Dashboard.
      </Typography>
    </>
  )
}

export default Slide1

import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { ASSETS_BASE_URL } from 'src/@core/utils/ApiHelpers'

type Props = {
  heading: string
  description: string
  jamboreeCoursePath: string
  bgColor: string
}

export const SuggestedProducts = (props: Props) => {
  const { heading, description, jamboreeCoursePath, bgColor } = props

  return (
    <Box
      p={4}
      bgcolor={bgColor}
      maxWidth={'230px'}
      minHeight={'200px'}
      borderRadius={1}
      display='flex'
      flexDirection='column'
      gap={4}
    >
      <Typography variant='h6' className='truncate' color={'white'}>
        {heading}
      </Typography>
      {/* @ts-ignore */}
      <Typography variant='paragraph' color={'white'}>
        {description}
      </Typography>
      <Box display='flex' justifyContent='end'>
        {/* @ts-ignore */}
        <Button
          LinkComponent={Link}
          to={ASSETS_BASE_URL + jamboreeCoursePath}
          target='_blank'
          variant='tonal'
          color='secondary'
          sx={{ color: 'white' }}
        >
          Buy Now
        </Button>
      </Box>
    </Box>
  )
}

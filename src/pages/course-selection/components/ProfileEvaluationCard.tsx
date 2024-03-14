import { Box, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { ReactNode } from 'react'
import themeConfig from 'src/configs/themeConfig'

type Props = {
  heading: string
  image: string
  content: ReactNode
  button: ReactNode
}
const { border } = themeConfig

export const ProfileEvaluationCard = (props: Props) => {
  const { heading, image, content, button } = props

  return (
    <Card sx={{ boxShadow: 0, border, borderRadius: 1, minWidth: '250px' }}>
      <CardContent>
        <Typography variant='h6' pb={4}>
          {heading}
        </Typography>
        <Box width='100%' display='flex' justifyContent='center'>
          <img src={image} height={200} style={{ objectFit: 'cover' }} />
        </Box>
        {content}
        {button}
      </CardContent>
    </Card>
  )
}

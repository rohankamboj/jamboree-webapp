import { Box, Link, Tooltip, Typography, useTheme } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import { convert24HrTimetoAMPM } from 'src/@core/utils/helpers'
import themeConfig from 'src/configs/themeConfig'

type Props = { image: string; heading: string; startDateAndTime: string; href: string; linkText: string }

const { border } = themeConfig

export const WatchNowCard = (props: Props) => {
  const { image, heading, startDateAndTime, href, linkText } = props

  const [date, timing = '12:00AM'] = startDateAndTime?.split(' ') || []
  const theme = useTheme()

  return (
    <Card sx={{ boxShadow: 0, border, borderRadius: 1, minWidth: '300px' }}>
      <CardMedia sx={{ height: '12.5625rem', objectFit: 'fill' }} image={image} />
      <CardContent>
        <Tooltip title={heading}>
          <Typography className='truncate' variant='h6' borderBottom={border} pb={4}>
            {heading}
          </Typography>
        </Tooltip>
        <Box display='flex' justifyContent='space-between' my={4}>
          {/* @ts-ignore */}
          <Typography color='text.secondary' variant='paragraphMedium'>
            {date}
          </Typography>
          {/* @ts-ignore */}
          {timing && <Typography variant='paragraphMedium'>{convert24HrTimetoAMPM(timing)}</Typography>}
        </Box>
        <Box display='flex' justifyContent='end' sx={{ marginTop: 7 }}>
          <Link
            href={href}
            paddingY={3}
            paddingX={6}
            borderRadius={1}
            bgcolor='#E6EAE7'
            color={theme.palette.secondary.main}
            //  @ts-ignore
            variant='paragraphMedium'
          >
            {linkText}
          </Link>
        </Box>
      </CardContent>
    </Card>
  )
}

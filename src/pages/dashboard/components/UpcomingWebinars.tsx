import { Box, Button, Theme, useMediaQuery } from '@mui/material'
import { useCallback } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import Typography from 'src/@core/components/common/Typography'
import IconifyIcon from 'src/@core/components/icon'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'
import { extractHrefFromAnchorTag } from 'src/@core/utils/helpers'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig
const UpcomingWebinars = ({ webinars = [] }: { webinars: WebinarItem[] | undefined }) => {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  // "description": "https:\/\/jamboree.zoom.us\/j\/83123833511", or
  // <a href=\"https:\/\/jamboree.zoom.us\/j\/83323376671\">https:\/\/jamboree.zoom.us\/j\/83323376671<\/a>
  const getNavLink = useCallback(
    (item: WebinarItem) => extractHrefFromAnchorTag('https://jamboree.zoom.us/j/83323376671' || item.description),
    [],
  )

  return (
    <StyledBorderedBox borderRadius={1} display='flex' flexDirection='column' width={isSm ? '100%' : '60%'}>
      <Typography variant='h5' paddingTop='24px' paddingBottom='16px' paddingX='24px'>
        Upcoming Webinars
      </Typography>

      {webinars.map(webinar => {
        const startDate = new Date(webinar.start.dateTime)
        const endDate = new Date(webinar.end.dateTime)

        const formattedDate = `${startDate.getDate()} ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
          startDate,
        )} ${startDate.getFullYear()}`
        // 3:00 PM
        const formattedStartTime = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(startDate)
        const formattedEndTime = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(endDate)

        return (
          <Box key={webinar.id} display='flex' justifyContent='space-between' alignItems='center' borderTop={border}>
            <Box display='flex' gap={4} alignItems='center' paddingY='15px' paddingX='24px'>
              <Box
                display='flex'
                justifyContent='center'
                padding='6px'
                borderRadius='100%'
                bgcolor='#EDECEE'
                color='grey.50'
              >
                <IconifyIcon icon='tabler:video' color='inherit' />
              </Box>
              <Box>
                <Typography variant='h6' color='grey.600'>
                  {webinar.summary}
                </Typography>
                <Typography color='grey.100'>
                  {/* Sample display */}
                  {/* 25 June 2023, 3:00 PM - 4:00 PM */}
                  {formattedDate}, {formattedStartTime} - {formattedEndTime}
                </Typography>
              </Box>
            </Box>
            {/* @ts-ignore */}
            <Button
              LinkComponent={Link}
              variant='text'
              sx={{ marginRight: 2, color: '#4B465C' }}
              to={getNavLink(webinar) as LinkProps['to']}
              rel='noopener noreferrer'
              target='_blank'
            >
              Join
            </Button>
          </Box>
        )
      })}
      <Typography
        textAlign='center'
        paddingTop='16px'
        paddingBottom='24px'
        borderTop={border}
        color='success.main'
        sx={{
          cursor: 'pointer',
        }}
        variant='paragraphSmall'
        onClick={() => alert('View All webinars')}
      >
        View All webinars
      </Typography>
    </StyledBorderedBox>
  )
}

export default UpcomingWebinars

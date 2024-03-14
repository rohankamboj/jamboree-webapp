import { Box, Button, Typography } from '@mui/material'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'
import { parseSubjectCategory } from '../helpers'
import { extractHrefFromAnchorTag, get12HrFormatTime } from 'src/@core/utils/helpers'
import { Link } from 'react-router-dom'

const Recordings = ({ recordings }: { recordings: (WebinarItem & { start: number; end: number })[] }) => {
  return (
    <Box display='flex' flexDirection='column' gap={4}>
      {recordings?.map(recording => (
        <StyledBorderedBox
          key={recording.id}
          borderRadius={1}
          padding={4}
          display='flex'
          justifyContent='space-between'
          alignItems='center'
        >
          <Box display='flex' gap={2} alignItems='center'>
            <Box
              padding={3}
              display='flex'
              flexDirection='column'
              alignItems='center'
              borderRadius={1}
              gap={1}
              bgcolor='#f5f7f2'
            >
              {/* Show Date */}
              <Typography>{new Date(recording.start).toLocaleDateString('en-US', { day: 'numeric' })}</Typography>
              {/* Show 3 letter month */}
              <Typography>{new Date(recording.start).toLocaleDateString('en-US', { month: 'short' })}</Typography>
            </Box>
            <Box display='flex' flexDirection='column'>
              <Typography color='#fd9351'>{parseSubjectCategory(recording.summary)}</Typography>
              <Typography>{recording.summary}</Typography>
              <Typography>{`${get12HrFormatTime(new Date(recording.start))}- ${get12HrFormatTime(
                new Date(recording.end),
              )}`}</Typography>
            </Box>
          </Box>

          {/* @ts-ignore */}
          <Button
            LinkComponent={Link}
            target='_blank'
            /* @ts-ignore */
            to={extractHrefFromAnchorTag(recording.link || '')}
            variant='contained'
          >
            View
          </Button>
        </StyledBorderedBox>
      ))}
    </Box>
  )
}

export default Recordings

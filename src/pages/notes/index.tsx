import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { CustomBreadcrumbs } from 'src/@core/components/common/Breadcrumb'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import Icon from 'src/@core/components/icon'
import { formatSecondsToDateString } from 'src/@core/utils/helpers'
import { get } from 'src/@core/utils/request'
import { GET_USER_NOTES } from 'src/apis/user'
import themeConfig from 'src/configs/themeConfig'

type UserNotesAPIResponseType = {
  data: Array<{
    tid: string
    name: string
  }>
}
type UserNotesDetailAPIResponseType = {
  data: Array<{
    lastUpdatedOn: string
    note: string
  }>
}

const Notes = () => {
  const { border } = themeConfig
  const [hoveredNotesId, setHoveredNoteId] = useState<string | null>(null)
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null)

  // If no notes are expanded, optimistically set to hovered note,
  // so that the details are fetched on hover.
  const detailsNotesIdToFetch = expandedNotesId || hoveredNotesId

  const getUserNotes = useQuery({
    queryKey: 'getUserNotes',
    queryFn: () =>
      get(GET_USER_NOTES, {
        queryParams: {
          tid: 'null',
          fields: `["tid","name"]`,
        },
      }) as Promise<UserNotesAPIResponseType>,
    refetchOnWindowFocus: false,
  })

  const getDetailedNotes = useQuery({
    queryKey: ['getDetailedNotes', detailsNotesIdToFetch],
    queryFn: () =>
      get(GET_USER_NOTES, {
        queryParams: { tid: detailsNotesIdToFetch as string, fields: `["note","lastUpdatedOn"]` },
      }) as Promise<UserNotesDetailAPIResponseType>,
    enabled: !!detailsNotesIdToFetch,
    // 5 minutes
    cacheTime: 300000,
    staleTime: 300000,
  })

  if (getUserNotes.isLoading) return <div>Loading...</div>

  return (
    <div>
      <CustomHelmet title='Notes' />
      <CustomBreadcrumbs />
      {getUserNotes.data?.data.map((note, idx) => (
        <Accordion
          style={{ boxShadow: 'none' }}
          onChange={(_, expanded) => {
            setExpandedNotesId(expanded ? note.tid : null)
          }}
          expanded={expandedNotesId === note.tid}
          onMouseOver={() => setHoveredNoteId(note.tid)}
          key={note.tid}
          sx={{ boxShadow: 0, border }}
        >
          <AccordionSummary
            expandIcon={<Icon icon={'tabler:chevron-down'} />}
            aria-controls={`notes-${idx}a-content`}
            id={`notes-${idx}a-header`}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', marginY: 2, gap: 2 }}>
              <Typography
                bgcolor={'#A8AAAE29'}
                paddingX={3}
                paddingY={1}
                display={'flex'}
                borderRadius={1}
                color={'text.secondary'}
              >
                {idx + 1}
              </Typography>
              <Typography variant='h5'>{note.name}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ boxShadow: 0 }}>
            {getDetailedNotes.data?.data.map(({ note, lastUpdatedOn }, idx) => (
              <Box key={`notes${idx}`} bgcolor={'#4B465C10'} padding={5} borderRadius={1} marginBottom={4}>
                <Box display={'flex'} gap={2}>
                  <Icon icon={'tabler:notes'} />
                  <Typography variant='h6' color={'text.secondary'}>
                    Created on {formatSecondsToDateString(lastUpdatedOn)}
                  </Typography>
                </Box>
                <Typography color={'text.secondary'} marginTop={2}>
                  {note}
                </Typography>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}

export default Notes

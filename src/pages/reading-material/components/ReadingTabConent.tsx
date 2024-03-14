import { Box, Grid, Theme, Typography, useMediaQuery } from '@mui/material'
import React, { Suspense, useEffect, useState } from 'react'
import Dropdown from 'src/@core/components/dropdown'
import IconifyIcon from 'src/@core/components/icon'
import useUpdateTaskStatus from 'src/apis/useUpdateTaskStatus'
import themeConfig from 'src/configs/themeConfig'
import { TaskPrePos, TaskType } from '..'
const Ebook = React.lazy(() => import('./Ebook'))

function generateReadingMaterialDropdownLabels(prePostDataKey: string, isUserActiveCourseSatOrSatd: boolean) {
  if (prePostDataKey === 'pre') {
    return isUserActiveCourseSatOrSatd ? 'Class-work' : 'Pre-Class Theory'
  }
  if (prePostDataKey === 'post') {
    return isUserActiveCourseSatOrSatd ? 'Homework' : 'Post-Class Homework'
  }
  return prePostDataKey
}

export default function ReadingMaterialTabContent({
  prePostData,
  userActiveCourse,
}: {
  prePostData: TaskPrePos
  userActiveCourse: string
}) {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isUserActiveCourseSatOrSatd = ['sat', 'satd'].includes(userActiveCourse)
  const dropDownOptions = Object.keys(prePostData || {}).map(dataKey => ({
    label: generateReadingMaterialDropdownLabels(dataKey, isUserActiveCourseSatOrSatd),
    value: dataKey,
  }))
  const [selectedDropdownOption, setSelectedDropdownOption] = useState(dropDownOptions[0].value)

  const [showBeginButton, setShowBeginButton] = useState<string | null>(null)

  const handleShowBeginButton = (idx: string) => setShowBeginButton(idx)
  const handleHideBeginButton = () => setShowBeginButton(null)

  const dataToRender = prePostData[selectedDropdownOption as keyof TaskPrePos]
  const [selectedChapterTaskId, setSelectedChapterTaskId] = useState(dataToRender[0].taskID)

  const chapterToRender = dataToRender.find(d => d.taskID === selectedChapterTaskId)

  const { markTaskAsEnded } = useUpdateTaskStatus()

  useEffect(() => {
    if (selectedChapterTaskId) {
      markTaskAsEnded.mutate({ taskID: selectedChapterTaskId })
    }
  }, [selectedChapterTaskId])

  // First Chapter is selected by default on dropdown option change
  useEffect(() => {
    if (selectedDropdownOption) {
      setSelectedChapterTaskId(dataToRender[0].taskID)
    }
  }, [selectedDropdownOption])
  const isCardActive = (taskID: string) => selectedChapterTaskId === taskID || showBeginButton === taskID

  if (!chapterToRender) return <p>No chapter is selected.</p>

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={4} xl={3}>
        <Dropdown
          options={dropDownOptions}
          defaultValue={selectedDropdownOption}
          onOptionChange={setSelectedDropdownOption}
        />
        <Box
          sx={{
            mt: 4,
            height: isSm ? '40vh' : '80vh',
            overflow: 'scroll',
          }}
        >
          {dataToRender.map(({ taskID, id, tasknameshow }) => {
            return (
              <Box
                key={id}
                onClick={() => setSelectedChapterTaskId(taskID)}
                border={themeConfig.border}
                padding={4}
                mt={2}
                borderRadius={1}
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                color={isCardActive(taskID) ? 'white' : 'grey.50'}
                bgcolor={isCardActive(taskID) ? '#00875A' : ''}
                sx={{ cursor: 'pointer' }}
                onMouseEnter={() => handleShowBeginButton(taskID)}
                onMouseLeave={handleHideBeginButton}
              >
                <Typography color={isCardActive(taskID) ? 'white' : 'grey.50'}>{tasknameshow}</Typography>

                {/* <RightSideArrow /> */}

                {isCardActive(taskID) && <IconifyIcon icon='icon-park-outline:right' />}
              </Box>
            )
          })}
        </Box>
      </Grid>

      <Grid item xs={12} md={8} xl={9}>
        <ReadingMaterialChapterViewer contentLink={chapterToRender.resourceid} contentType={chapterToRender.type} />
      </Grid>
    </Grid>
  )
}

function ReadingMaterialChapterViewer({
  contentLink,
  contentType,
}: {
  contentLink: TaskType['resourceid']
  contentType: TaskType['type']
}) {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  if (contentType === 'pdflink' || contentType === 'link')
    return (
      <iframe
        src={contentType === 'link' ? contentLink : `https://jamboree.online${contentLink}#toolbar=0`}
        width='100%'
        style={{ minHeight: 600 }}
        height='100%'
      ></iframe>
    )

  if (contentType === 'ebook')
    return (
      <Suspense>
        <Box
          sx={{
            height: isSm ? '40vh' : '80vh',
            overflow: 'scroll',
          }}
        >
          <Ebook stringifiedEbookData={contentLink} />
        </Box>
      </Suspense>
    )

  return (
    <Typography variant='h1'>{`Unsupported content type {{${contentType}}} Please contact the dev to resolve this.`}</Typography>
  )
}

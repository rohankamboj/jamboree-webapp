import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import { Accordion, AccordionDetails, AccordionSummary, useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import { Theme } from '@mui/system'
import { useNavigate, useParams } from 'react-router-dom'
import Typography from 'src/@core/components/common/Typography'

import Icon from 'src/@core/components/icon'
import { resourceTypeToIconifyIconMap } from 'src/@core/constants'
import { formatSecondsToFriendlyFormat } from 'src/@core/utils/helpers'
import themeConfig from 'src/configs/themeConfig'

type Props = {
  task: tasks.detailed | undefined
  taskSections: tasks.detailed[] | undefined
  taskGroup: tasks.group | undefined
  isActiveTask?: boolean
}

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none',
    },
  },
})

const TimelineComponent = ({ task, taskGroup, taskSections, isActiveTask }: Props) => {
  const theme = useTheme()
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { border } = themeConfig
  const navigate = useNavigate()

  const { subsectionId } = useParams()

  const handleOnClickTask = (type: AllowedTaskTypes | 'quiz' | undefined, taskId: string, index?: number) => {
    if (type === 'practice' || type === 'test') {
      return navigate(`/app/${type}/view/${taskId}`, {
        replace: true,
      })
    }

    navigate(`/app/learn/view/${taskId}${index ? '/' + index : ''}`, { replace: true })
  }

  return (
    <Accordion
      style={{
        boxShadow: 'none',
      }}
      sx={{ border }}
      defaultExpanded={isSm ? false : isActiveTask}
    >
      <AccordionSummary
        expandIcon={<Icon icon='tabler:chevron-down' />}
        sx={{
          borderBottom: border,
        }}
      >
        <Box display='flex' alignItems='center' gap={2}>
          <Box
            display='flex'
            justifyContent='center'
            padding={1}
            border={`1px solid ${theme.palette.grey[50]}`}
            borderRadius='100%'
          >
            <Icon icon='tabler:book' color={theme.palette.secondary.main} />
          </Box>
          <Typography variant='h5' color='grey.200' pl='10px'>
            {taskGroup?.taskgroupName}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ boxShadow: 0 }}>
        <Box paddingY='24px'>
          {taskSections?.map(({ taskName, taskID, duration, type }) => (
            <Timeline key={taskID}>
              <TimelineItem>
                <TimelineSeparator>
                  <Box
                    display='flex'
                    justifyContent='center'
                    padding={1}
                    border={`1px solid ${theme.palette.grey[50]}`}
                    borderRadius='100%'
                  >
                    <Icon
                      icon={resourceTypeToIconifyIconMap[type as string] || 'icon-park-outline:invalid-files'}
                      color={theme.palette.secondary.main}
                    />
                  </Box>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent
                  sx={{
                    paddingTop: '0px !important',
                    paddingRight: '0px !important',
                  }}
                >
                  <Box pl='16px' padding={0} display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography
                      onClick={() => handleOnClickTask(type, taskID)}
                      sx={{
                        cursor: 'pointer',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical',
                      }}
                      variant='h6'
                    >
                      {taskName}
                    </Typography>
                    <Typography color={theme.palette.secondary.main}>
                      {formatSecondsToFriendlyFormat(duration || 0)}
                    </Typography>
                  </Box>
                  {/* {taskID === task?.taskID && ( */}
                  <Box mt='26px'>
                    <CustomTimelineItem
                      isActive={taskID === task?.taskID && !subsectionId}
                      onClick={() => handleOnClickTask(type, taskID)}
                      title={taskName}
                      icon={resourceTypeToIconifyIconMap[type as string] || 'icon-park-outline:invalid-files'}
                    />
                    {/* @ts-ignore */}
                    {task?.resource?.children?.map((res, idx) => (
                      <CustomTimelineItem
                        isActive={taskID === task?.taskID && subsectionId === (idx + 1).toString()}
                        onClick={() => handleOnClickTask(type, taskID, idx + 1)}
                        title={`${res.title}-${idx + 1}`}
                        icon={resourceTypeToIconifyIconMap[type as string] || 'icon-park-outline:invalid-files'}
                      />
                    ))}
                  </Box>
                  {/* )} */}
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default TimelineComponent

function CustomTimelineItem({
  title,
  onClick,
  isActive,
  icon,
}: {
  title: string
  onClick: () => void
  icon: string
  isActive?: boolean
}) {
  const theme = useTheme()

  const handleColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return theme.palette.primary.main
      case 'pending':
        return theme.palette.secondary.main
      default:
        return theme.palette.secondary.main
    }
  }
  return (
    <TimelineItem onClick={onClick} sx={{ cursor: 'pointer' }}>
      <TimelineSeparator>
        <Box
          display='flex'
          justifyContent='center'
          padding={1}
          border={`1px solid ${isActive ? theme.palette.primary.main : handleColor()}`}
          borderRadius={'100%'}
          bgcolor={isActive ? theme.palette.primary.light : 'transparent'}
        >
          <Icon icon={icon} color={isActive ? theme.palette.primary.main : handleColor()} />
        </Box>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Typography
          color={handleColor()}
          sx={{
            color: isActive ? theme.palette.primary.main : undefined,
            '&:hover': { color: theme.palette.primary.main },
          }}
        >
          {title}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  )
}

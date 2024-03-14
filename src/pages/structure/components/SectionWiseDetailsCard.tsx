import { Box, Button, Card, Divider, Fade, Theme, useMediaQuery, useTheme } from '@mui/material'
import { Fragment, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Typography from 'src/@core/components/common/Typography'
import { default as Icon, default as IconifyIcon } from 'src/@core/components/icon'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'
import { formatSecondsToDateString, formatSecondsToFriendlyFormat } from 'src/@core/utils/helpers'
import { CustomIcon } from 'src/assets/Icons/Icons'
import { TaskStructureWithDetail, TestAndPracticeAPIResponse } from '..'
import Question from '/question.svg'
import {
  getInAppLinkForTask,
  getNavigationLinkForSummaryPastAttempt,
  getPastAttemptsTestAttemptsForTaskId,
} from '../helpers'
import { resourceTypeToIconifyIconMap } from 'src/@core/constants'

const SectionWiseDetailsCard = ({
  testResultList,
  taskGroup,
  taskGroupMeta,
  taskCompletionStatusMap,
  showQuestionCount,
  activeTab,
}: {
  testResultList?: TestAndPracticeAPIResponse
  taskGroup: TaskStructureWithDetail['data'][number]
  taskGroupMeta: tasks.group | undefined
  taskCompletionStatusMap?: Record<number, 0 | 1>
  showQuestionCount?: boolean
  activeTab: string | 'Test' | 'Practice' | 'Learn:Quant' | 'Learn:Verbal' | null
}) => {
  const [showBeginButton, setShowBeginButton] = useState<number | null>(null)
  const theme = useTheme()
  const handleShowBeginButton = (idx: number) => setShowBeginButton(idx)
  const handleHideBeginButton = () => setShowBeginButton(null)
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const navigate = useNavigate()

  const [showPastAttemptsForTaskId, setShowPastAttemptsForTaskId] = useState<string>()

  const [showMore, setShowMore] = useState(false)

  const toggleReadMore = () => {
    setShowMore(!showMore)
  }

  const isButtonVisible = (id: number): boolean => showBeginButton === id

  const pastAttemptsToShow = useMemo(() => {
    if (showPastAttemptsForTaskId && testResultList) {
      return getPastAttemptsTestAttemptsForTaskId(showPastAttemptsForTaskId, testResultList)
    }
    return []
  }, [showPastAttemptsForTaskId, testResultList])

  const handleOnClickBeginTask = (task: TaskStructureWithDetail['data'][number]['tasks'][number]) =>
    navigate(getInAppLinkForTask(task))

  const handleNavigateToSummaryPage = (attemptId: string) => {
    switch (activeTab) {
      case 'Test':
        navigate(getNavigationLinkForSummaryPastAttempt(attemptId, 'test'))
        break
      case 'Practice':
        navigate(getNavigationLinkForSummaryPastAttempt(attemptId, 'practice'))
        break
      default:
        console.warn('Unhandle Active Tab Past attemps')
        navigate(`/404`)
    }
  }

  const getTestStats = (taskID: string) => {
    const testStats = {
      isTestLimitReached: false,
      isTestInProgress: false,
    }
    if (testResultList?.tests) {
      const test = testResultList.tests.find(test => test.taskID === taskID)
      if (test) {
        testStats.isTestLimitReached = test.active === 0
        testStats.isTestInProgress = test.completed === 0
      }
    }
    return testStats
  }

  const getButtonLabelAndState = (task: TaskStructureWithDetail['data'][number]['tasks'][number]) => {
    const btnStateAndText = { isDisabled: false, btnText: 'Begin' }
    switch (task.type) {
      case 'test':
        const { isTestInProgress, isTestLimitReached } = getTestStats(task.taskID) // isTestLimitReached
        if (isTestLimitReached) {
          btnStateAndText.btnText = 'Limit Reached'
          btnStateAndText.isDisabled = true
        }
        if (isTestInProgress) {
          btnStateAndText.btnText = 'Resume'
        }
        break
      default:
        break
    }
    return btnStateAndText
  }
  return (
    <Card
      sx={{
        display: 'flex',
        border: `1px solid rgba(219, 218, 222, 1)`,
        flexDirection: 'column',
        width: '100%',
        boxShadow: 'none',
      }}
    >
      <Box paddingX={4} paddingY={2}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h5' color='grey.200'>
            {taskGroupMeta?.taskgroupName}
          </Typography>
          {typeof taskGroupMeta?.overallCompleted === 'number' && (
            <Typography color='grey.100'>{taskGroupMeta?.overallCompleted}% Completed</Typography>
          )}
        </Box>
        {taskGroupMeta?.taskgroupDescription && (
          <Box display='flex' alignItems='start' gap={1}>
            <img src={Question} alt='question' />
            <Box display='flex'>
              <Typography
                variant='body1'
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: showMore ? 'unset' : 1,
                  '& p': {
                    margin: '0px !important',
                  },
                }}
                dangerouslySetInnerHTML={{
                  __html: showMore
                    ? taskGroupMeta.taskgroupDescription
                    : `${taskGroupMeta.taskgroupDescription.slice(0, 150)}...`,
                }}
              />

              {taskGroupMeta.taskgroupDescription.length > 30 && (
                <Typography
                  color='primary.main'
                  onClick={toggleReadMore}
                  sx={{
                    cursor: 'pointer',
                  }}
                >
                  {showMore ? 'Less' : 'More'}
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
      {taskGroup.tasks.map((task, idx) => {
        return (
          <Fragment key={task.taskID}>
            <Divider />
            <Box
              component='div'
              paddingX={4}
              paddingY={2}
              display='flex'
              justifyContent='space-between'
              alignItems={isSm ? 'start' : 'center'}
              gap={isSm && isButtonVisible(idx) ? 2 : 0}
              flexDirection={isSm && isButtonVisible(idx) ? 'column' : 'row'}
              onMouseEnter={() => handleShowBeginButton(idx)}
              onMouseLeave={() => (isSm ? {} : handleHideBeginButton())}
              sx={{ ...(isButtonVisible(idx) && { bgcolor: '#F6F6F7', cursor: 'pointer' }) }}
            >
              <Box display='flex' alignItems='center' gap={2}>
                <Typography variant='paragraphMedium' width='20px' color={theme.palette.secondary.main}>{`${
                  idx + 1
                }.`}</Typography>
                <RenderResourceTypeToIconifyIcon
                  isCompleted={!!taskCompletionStatusMap?.[Number(task?.taskID)]}
                  type={task.type}
                />
                <Typography
                  variant='paragraphMedium'
                  color={isButtonVisible(idx) ? 'primary.main' : undefined}
                >{` ${task.taskName}`}</Typography>
              </Box>
              <Box width={isSm ? '100%' : 'auto'}>
                {isButtonVisible(idx) ? (
                  <Fade in timeout={800}>
                    <Box display='flex' gap={4} width='100%' justifyContent='space-between'>
                      {testResultList && !!getPastAttemptsTestAttemptsForTaskId(task.taskID, testResultList).length && (
                        <Button
                          fullWidth={isSm}
                          onClick={() =>
                            setShowPastAttemptsForTaskId(val => (val === task.taskID ? undefined : task.taskID))
                          }
                          size='small'
                          variant='contained'
                          endIcon={<IconifyIcon icon='mingcute:down-line' />}
                        >
                          Past Attempts
                        </Button>
                      )}

                      <Button
                        fullWidth={isSm}
                        onClick={() => handleOnClickBeginTask(task)}
                        size='small'
                        variant='contained'
                        color={getButtonLabelAndState(task).isDisabled ? 'secondary' : 'primary'}
                        disabled={getButtonLabelAndState(task).isDisabled}
                        endIcon={<IconifyIcon icon='mingcute:right-line' />}
                      >
                        {getButtonLabelAndState(task).btnText}
                      </Button>
                    </Box>
                  </Fade>
                ) : (
                  <Typography
                    sx={{
                      textAlign: 'end',
                    }}
                    color='grey.100'
                  >
                    {(showQuestionCount ? task.totalquestion + ' Questions | ' : '') +
                      formatSecondsToFriendlyFormat(Number(task.duration))}
                  </Typography>
                )}
              </Box>
            </Box>

            {task.taskID === showPastAttemptsForTaskId && !!pastAttemptsToShow?.length && (
              <Box margin={8}>
                {pastAttemptsToShow.map(({ lastUpdatedOn, attemptID }) => (
                  <StyledBorderedBox
                    paddingY={2}
                    paddingX={4}
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <Box display='flex' gap={2}>
                      <IconifyIcon icon={'wpf:past'} />
                      <Typography>{formatSecondsToDateString(lastUpdatedOn)}</Typography>
                    </Box>
                    <Button onClick={() => handleNavigateToSummaryPage(attemptID)} variant='text' color='info'>
                      Summary &nbsp;
                      <IconifyIcon icon='tabler:arrow-right' />
                    </Button>
                  </StyledBorderedBox>
                ))}
              </Box>
            )}
          </Fragment>
        )
      })}
    </Card>
  )
}

const RenderResourceTypeToIconifyIcon = ({
  isCompleted,
  type,
}: {
  isCompleted: boolean
  type: TaskStructureWithDetail['data'][number]['tasks'][number]['type']
}) => {
  const theme = useTheme()

  const customIconStyleProps = useMemo(() => {
    const defaultCustomIconProps = {
      border: '1px solid red',
      iconBackgroundColor: 'pink',
      iconColor: 'yellow',
    }

    if (isCompleted) {
      return {
        iconColor: 'white',
        iconBackgroundColor: theme.palette.success.main,
      }
    }

    switch (type) {
      case 'video':
      case 'playlist':
        return {
          border: `1px solid ${theme.palette.primary.main}`,
          iconColor: theme.palette.primary.main,
          iconBackgroundColor: theme.palette.primary.light,
        }
      case 'ebook':
      case 'link':
      case 'test':
      case 'practice':
        return {
          border: `1px solid ${theme.palette.warning.main}`,
          iconColor: theme.palette.warning.main,
          iconBackgroundColor: '#FFECD9',
        }

      default:
        return defaultCustomIconProps
    }
  }, [type, isCompleted])

  return (
    <CustomIcon
      bgColor={customIconStyleProps.iconBackgroundColor}
      icon={
        <Icon
          icon={isCompleted ? 'mdi:tick' : resourceTypeToIconifyIconMap[type]}
          color={customIconStyleProps.iconColor}
          width={17}
        />
      }
    />
  )
}

export default SectionWiseDetailsCard

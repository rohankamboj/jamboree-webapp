import { Box, Button, Divider, LinearProgress, Theme, Typography, useMediaQuery, useTheme } from '@mui/material'
import { UseQueryResult } from 'react-query'
import { useNavigate } from 'react-router-dom'
import SparkLineChart from 'src/@core/components/charts/Sparkline'
import IconifyIcon from 'src/@core/components/icon'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'
import { resourceTypeToIconifyIconMap } from 'src/@core/constants'
import themeConfig from 'src/configs/themeConfig'
import { getInAppLinkForTask } from 'src/pages/structure/helpers'
import { formatTime } from 'src/pages/summary'
const { border } = themeConfig
const CourseProgressWithCurrentActiveTask = ({
  recommendedTasks,
}: {
  recommendedTasks: UseQueryResult<tasks.UserRecommendedTask, any>
}) => {
  const theme = useTheme()
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  if (!recommendedTasks.data) return null

  const { data, meta } = recommendedTasks?.data

  const icon =
    resourceTypeToIconifyIconMap[data.active.type as keyof typeof resourceTypeToIconifyIconMap] ||
    resourceTypeToIconifyIconMap['video']

  const courseProgress = Number((((meta?.totalCompleted ?? 0) / (meta?.totalTasks ?? 1)) * 100).toFixed(2))

  const getTaskCompletionPercentage = (task: tasks.UserRecommendedTask['data']['active']) => {
    // From the API docs:
    //     if status == "1", completedPercentage == 100%
    // 4. else if taskData.status == null, completedPercentage == 0%
    // 5. else if 'status == "0" && type != "playlist" && type != "video"', completedPercentage == 50%
    // 6. else if, status == "0" && (type == "playlist" || type == "video"), completedPercentage ==(completedtime / duration) * 100, Rounding to one decimal place.
    if (task.status === '1') return 100
    if (task.status === null) return 0
    if (task.status === '0' && task.type !== 'playlist' && task.type !== 'video') return 50
    if (task.status === '0' && (task.type === 'playlist' || task.type === 'video'))
      return Number(((Number(task.completedtime) / Number(task.duration)) * 100).toFixed(1))

    return 0
  }

  const navigate = useNavigate()

  return (
    <StyledBorderedBox borderRadius={1} mt={4} display='flex' sx={{ ...(isSm && { flexDirection: 'column' }) }}>
      <Box
        padding={'24px'}
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        width={isSm ? '100%' : '40%'}
        borderRight={border}
      >
        <Typography variant='h5'>Course Progress</Typography>
        <Box my={2}>
          <SparkLineChart data={[courseProgress]} />
        </Box>
        <Box display='flex' justifyContent='center'>
          <Button
            variant='outlined'
            color='primary'
            sx={{
              width: isSm ? '100%' : undefined,
            }}
            onClick={() => navigate('/app/planner')}
          >
            Study Planner
          </Button>
        </Box>
      </Box>

      <Box display='flex' flexDirection='column' width={isSm ? '100%' : '60%'}>
        <Typography variant='h5' padding='24px'>
          Current Active Task
        </Typography>
        <Divider />
        <Box display='flex' flexDirection='column' gap={2}>
          <Box display='flex' gap={2} padding='24px' sx={{ ...(isSm && { flexDirection: 'column' }) }}>
            <Box
              width={isSm ? '30%' : undefined}
              border='1px solid #28C76F'
              borderRadius={1}
              bgcolor='#DDF6E8'
              display='flex'
              justifyContent='center'
              alignItems='center'
              px={6}
            >
              {icon ? <IconifyIcon width='60px' icon={icon} color={theme.palette.primary.main} /> : null}
            </Box>
            <Box width='100%'>
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant='h6' color='#3DCD7D'>
                  {data.active?.taskName}
                </Typography>
                <Button size='small' variant='tonal' color='secondary'>
                  {data.active?.tagName}
                </Button>
              </Box>
              <Typography variant='h6'>
                {data.active?.taskgroupName} | {formatTime(Number(data.active?.duration) * 1000)}
              </Typography>
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Box display='flex' gap={2} width='100%' alignItems='center'>
                  <LinearProgress
                    color='warning'
                    value={getTaskCompletionPercentage(data.active)}
                    variant='determinate'
                    sx={{
                      height: 10,
                      width: '80%',
                      borderRadius: 8,
                      backgroundColor: '#F1F0F2',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 8,
                      },
                    }}
                  />
                  <Typography>{getTaskCompletionPercentage(data.active)}%</Typography>
                </Box>

                <Button size='small' onClick={() => navigate(getInAppLinkForTask(data.active))} variant='contained'>
                  Continue
                </Button>
              </Box>
            </Box>
          </Box>
          <Divider />
          <Box display='flex' justifyContent='space-between' alignItems='center' paddingY={2} paddingX='24px'>
            <Box display='flex' alignItems='center' gap={2}>
              <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                padding={2}
                bgcolor='#EDECEE'
                borderRadius={1}
              >
                <img src='/Book.svg' alt='book' />
              </Box>
              <Typography variant='h6' color='grey.600'>
                {data.recommended_1?.taskName}-{data.recommended_1?.taskgroupName}
              </Typography>
            </Box>
            <Button variant='tonal' color='secondary' size='small'>
              {data.recommended_1?.tagName}
            </Button>
          </Box>
          <Divider />
          <Box display='flex' justifyContent='space-between' alignItems='center' paddingY={2} paddingX='24px'>
            <Box display='flex' alignItems='center' gap={2}>
              <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                padding={2}
                bgcolor='#EDECEE'
                borderRadius={1}
              >
                <img src='/Book.svg' alt='book' />
              </Box>
              <Typography variant='h6' color='grey.600'>
                {data.recommended_2?.taskName}-{data.recommended_2?.taskgroupName}
              </Typography>
            </Box>
            <Button variant='tonal' color='secondary' size='small'>
              {data.recommended_2?.tagName}
            </Button>
          </Box>
        </Box>
      </Box>
    </StyledBorderedBox>
  )
}

export default CourseProgressWithCurrentActiveTask

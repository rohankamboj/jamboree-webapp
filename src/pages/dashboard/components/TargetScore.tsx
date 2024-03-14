import { Box, Divider, LinearProgress, Theme, useTheme } from '@mui/material'
import Typography from 'src/@core/components/common/Typography'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'
import { selectedCourseMinMaxAndIntervalType } from '../helpers'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig
type Props = {
  title: string
  label1: string
  label2: string
  targetScore: number
  lastFltScore: number
  editTextColor?: string
  label1ScoreColor?: string
  labelBoxBgColor?: string
  openEditModal: () => void
  activeProductMixMaxAndIntervalScore: selectedCourseMinMaxAndIntervalType
}

const TargetScore = ({
  targetScore,
  lastFltScore,
  activeProductMixMaxAndIntervalScore,
  title,
  label1,
  label2,
  editTextColor,
  label1ScoreColor,
  labelBoxBgColor,
  openEditModal,
}: Props) => {
  const theme = useTheme()
  const targetScorePercentage = (lastFltScore / targetScore) * 100
  // If % is less than 50% red greater than 50 but less than 75 then orange(waring) if more than 75 then red else green
  const linearProgressColor = targetScorePercentage < 50 ? 'error' : targetScorePercentage < 75 ? 'warning' : 'success'
  const targetScoreToToTotalScorePercentageScore = (targetScore / activeProductMixMaxAndIntervalScore.max) * 100

  return (
    <StyledBorderedBox borderRadius={1} my='26px'>
      <Box borderBottom={border} padding={5}>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
          <Typography variant='h5'>{title}</Typography>
          <Typography
            variant='paragraphSmall'
            color={editTextColor}
            sx={{
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            onClick={openEditModal}
          >
            Edit
          </Typography>
        </Box>
        <Box position='relative'>
          <LinearProgress
            color={linearProgressColor}
            value={targetScorePercentage}
            variant='determinate'
            sx={{
              height: 10,
              width: '100%',
              borderRadius: 8,
              backgroundColor: '#F1F0F2',
              '& .MuiLinearProgress-bar': {
                borderRadius: 8,
              },
            }}
          />
          <div>
            <Box
              position='absolute'
              height={'30px'}
              width='6px'
              borderRadius={4}
              bgcolor={(theme: Theme) => theme.palette.success.main}
              // right={'10%'}
              left={`${targetScoreToToTotalScorePercentageScore}%`}
              top={-10}
            />
          </div>
        </Box>
      </Box>
      <Box
        display='flex'
        justifyContent='space-between'
        paddingX={5}
        paddingY={4}
        bgcolor={labelBoxBgColor}
        color='grey.200'
      >
        <Box display='flex' flexDirection='column' gap={2}>
          <Typography variant='h6' color='inherit'>
            {label1}
          </Typography>
          <Typography variant='h5' color={label1ScoreColor}>
            {lastFltScore}
          </Typography>
        </Box>
        <Divider flexItem orientation='vertical' color={theme.palette.grey[400]} />
        <Box display='flex' flexDirection='column' gap={2}>
          <Typography variant='h6' color='inherit'>
            {label2}
          </Typography>
          <Typography variant='h5' color='#29C76F'>
            {targetScore}
          </Typography>
        </Box>
      </Box>
    </StyledBorderedBox>
  )
}

export default TargetScore

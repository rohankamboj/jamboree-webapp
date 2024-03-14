import { Box, Divider, LinearProgress, Theme, useMediaQuery } from '@mui/material'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'
import { formatTime } from '..'
import { getSum } from 'src/@core/utils/helpers'
import Typography from 'src/@core/components/common/Typography'
type SectionStats = {
  acc: string[]
  tUser: number[]
  tAll: number[]
  name: string
}

const AccuracySection = ({
  subSectionStats,
  sectionName,
  sectionStats,
}: {
  subSectionStats: SectionStats[]
  sectionName: string
  sectionStats: Omit<SectionStats, 'name'>
}) => {
  const sectionAvgTimeAllUsers = (getSum(sectionStats.tAll) / sectionStats.tAll.length) * 10
  const sectionUserAvgTime = getSum(sectionStats.tUser) / sectionStats.tUser.length

  const fontColor = sectionUserAvgTime > sectionAvgTimeAllUsers ? 'error.main' : 'primary.main'
  return (
    <StyledBorderedBox borderRadius={1} minHeight='100%'>
      <Box display='flex' justifyContent='space-between' padding={4} pt={5}>
        <Typography variant='paragraphMedium'>Section</Typography>
        <Typography>Accuracy</Typography>
        <Typography>AVG. Time</Typography>
      </Box>
      <Divider />
      <Box px={4} py={5} display='flex' flexDirection='column' gap={4}>
        {subSectionStats.map(section => (
          <SubSectionRow key={section.name} section={section} />
        ))}
      </Box>
      <Divider />
      <Box padding={4} display='flex' justifyContent='space-between' pb={2}>
        <Typography variant='paragraphBold' sx={{ textTransform: 'uppercase' }}>
          {sectionName}
        </Typography>
        <Typography>
          {getSum(sectionStats.acc)}/{sectionStats.acc.length}
        </Typography>
        <Box display='flex' gap={1}>
          <Typography color={fontColor}>{formatTime(sectionUserAvgTime)}</Typography>
          <Typography>/ {formatTime(sectionAvgTimeAllUsers)}</Typography>
        </Box>
      </Box>
    </StyledBorderedBox>
  )
}

export default AccuracySection

function SubSectionRow({ section }: { section: SectionStats }) {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const sectionCorrectAnswers = getSum(section.acc)
  const avgTimeForAllUsers = (getSum(section.tAll) / section.tAll.length) * 10
  const avgTimeForCurrentUser = getSum(section.tUser) / section.tUser.length

  const fontColor = avgTimeForCurrentUser > avgTimeForAllUsers ? 'error.main' : 'primary.main'

  return (
    <Box display='flex' justifyContent='space-between'>
      {/* @ts-ignore */}
      <Typography variant='paragraphMedium' width='33%'>
        {section.name || 'N/A'}
      </Typography>
      <Box display='flex' gap={isSm ? 2 : 8} alignItems='center' width='34%'>
        <LinearProgress
          color='primary'
          value={(sectionCorrectAnswers / section.acc.length) * 100}
          variant='determinate'
          sx={{
            height: 16,
            width: isSm ? '50px' : '100px',
            borderRadius: 1,
            backgroundColor: '#F1F0F2',
            '& .MuiLinearProgress-bar': {
              borderRadius: 1,
            },
          }}
        />
        <Typography width='33%'>
          {sectionCorrectAnswers}/{section.acc.length}
        </Typography>
      </Box>
      <Box display='flex' gap={1}>
        <Typography color={fontColor}>{formatTime(avgTimeForCurrentUser)}</Typography>
        <Typography>/ {formatTime(avgTimeForAllUsers)}</Typography>
      </Box>
    </Box>
  )
}

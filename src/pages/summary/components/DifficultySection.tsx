import { Box, Divider, LinearProgress, Theme, useMediaQuery } from '@mui/material'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'
import Typography from 'src/@core/components/common/Typography'
import { getSum } from 'src/@core/utils/helpers'
import { formatTime } from '..'
type SectionStats = {
  acc: string[]
  tUser: number[]
  tAll: number[]
  name: string
}

const DifficultySection = ({
  sectionName,
  difficultyWiseSectionStats,
}: {
  difficultyWiseSectionStats: Record<string, SectionStats>
  sectionName: string
}) => {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const width = isSm ? '40%' : '30%'
  return (
    <StyledBorderedBox borderRadius={1} minHeight='100%'>
      <Box display='flex' justifyContent='space-between' padding={4} pt={5}>
        <Typography width='20%'>Section</Typography>
        {!isSm && <Typography width='30%'>Difficulty</Typography>}
        <Typography width={width} textAlign='center'>
          Accuracy
        </Typography>
        <Typography width={width} textAlign='end'>
          AVG. Time
        </Typography>
      </Box>
      <Divider />
      <Box display='flex' gap={4} alignItems='center' py={14} px={4}>
        <Typography
          variant='paragraphMedium'
          width='20%'
          sx={{
            textTransform: 'uppercase',
          }}
        >
          {sectionName}
        </Typography>
        <Box width='80%' display='flex' flexDirection='column' gap={4}>
          {Object.entries(difficultyWiseSectionStats).map(([difficulty, difficultyStats]) => (
            <SubSectionRow key={difficulty} difficulty={difficulty} difficultyStats={difficultyStats} />
          ))}
        </Box>
      </Box>
    </StyledBorderedBox>
  )
}

export default DifficultySection

function SubSectionRow({ difficulty, difficultyStats }: { difficulty: string; difficultyStats: SectionStats }) {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const width = isSm ? '40%' : '30%'
  const difficultyCorrectAnswers = getSum(difficultyStats.acc)

  const difficultyAvgTimeAllUsers = (getSum(difficultyStats.tAll) / difficultyStats.tAll.length) * 10
  const difficultyUserAvgTime = getSum(difficultyStats.tUser) / difficultyStats.tUser.length

  const fontColor = difficultyUserAvgTime > difficultyAvgTimeAllUsers ? 'error.main' : 'primary.main'

  return (
    <Box display='flex' justifyContent='space-between'>
      {!isSm && (
        <Typography textTransform='capitalize' variant='paragraphMedium' width='20%'>
          {difficulty}
        </Typography>
      )}
      <Box display='flex' gap={isSm ? 2 : 6} alignItems='center' width={width}>
        <LinearProgress
          color='primary'
          value={(difficultyCorrectAnswers / difficultyStats.acc.length) * 100}
          variant='determinate'
          sx={{
            height: 12,
            width: isSm ? '80px' : '200px',
            borderRadius: 1,
            backgroundColor: '#F1F0F2',
            '& .MuiLinearProgress-bar': {
              borderRadius: 1,
            },
          }}
        />
        <Typography width='20%'>
          {difficultyCorrectAnswers}/{difficultyStats.acc.length}
        </Typography>
      </Box>
      <Box gap={1} display='flex' justifyContent='end' width={width}>
        <Typography color={fontColor}>{formatTime(difficultyUserAvgTime || 0)}</Typography>
        <Typography>/ {formatTime(difficultyAvgTimeAllUsers || 0)}</Typography>
      </Box>
    </Box>
  )
}

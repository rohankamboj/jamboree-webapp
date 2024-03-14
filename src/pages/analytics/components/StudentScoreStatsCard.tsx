import { Box, BoxProps, Theme, styled, useMediaQuery } from '@mui/material'
import Typography from 'src/@core/components/common/Typography'
import IconifyIcon from 'src/@core/components/icon'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'

type Props = {
  icon: string
  iconColor: string
  iconBgColor: string
  statName: string
  statValue: string | number
}

const StyledIconBox = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  paddingTop: 30,
  paddingBottom: 30,
  borderRadius: 1,
}))

function StudentScoreStatsCard({ iconBgColor, icon, statName, statValue, iconColor }: Props) {
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  return (
    <StyledBorderedBox
      display='flex'
      flexDirection={isMd ? 'row' : 'column'}
      gap={isMd ? 4 : 2}
      padding={4}
      borderRadius={1}
      width={isMd ? '100%' : '20%'}
    >
      <StyledIconBox width={isMd ? '100px' : '50%'} bgcolor={iconBgColor}>
        <IconifyIcon icon={icon} rotate={3} color={iconColor} />
      </StyledIconBox>
      <Box mt={3}>
        <Typography variant='h6'>{statName}</Typography>
        <Typography variant='h4' mt={4}>
          {statValue}
        </Typography>
      </Box>
    </StyledBorderedBox>
  )
}

export default StudentScoreStatsCard

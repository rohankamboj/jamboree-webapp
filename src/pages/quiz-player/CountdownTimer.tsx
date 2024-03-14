import { Box, useTheme } from '@mui/material'
import { useMemo, useState } from 'react'
import Typography from 'src/@core/components/common/Typography'
import IconifyIcon from 'src/@core/components/icon'
import { useCountdown } from 'src/@core/hooks/useCountDownTimer'
import { getColonSeparatedHrMinsAndSeconds } from 'src/@core/utils/helpers'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig
function CountdownTimer({ timeToCountDown, onExpireTimer }: { timeToCountDown: number; onExpireTimer: () => void }) {
  const theme = useTheme()
  const [showQuizTimer, setShowQuizTimer] = useState(!!timeToCountDown)
  const timeLeftInSeconds = useCountdown(timeToCountDown ?? 0, {
    interval: 1000,
    onTick: time => (time === 10 ? alert('Only 10 seconds left') : {}),
    onComplete: onExpireTimer,
    isEnabled: !!timeToCountDown,
  })

  const { formatted: formattedTimeLeft } = useMemo(
    () => getColonSeparatedHrMinsAndSeconds(timeLeftInSeconds),
    [timeLeftInSeconds],
  )
  return (
    <Box
      sx={{ cursor: 'pointer' }}
      border={border}
      margin={2}
      display='flex'
      justifyContent='center'
      alignItems='center'
      columnGap={2}
      padding={2}
      borderRadius={1}
      onClick={() => setShowQuizTimer(isVisible => !isVisible)}
    >
      {showQuizTimer && (
        <>
          <IconifyIcon icon='mdi:clock-outline' color='#A5A3AE' />

          <Typography color='#A5A3AE' variant='paragraphSmall'>
            {formattedTimeLeft}
          </Typography>
        </>
      )}
      <Typography
        variant='paragraphSmall'
        borderLeft={showQuizTimer ? { border } : undefined}
        color={theme.palette.grey[50]}
        paddingLeft={showQuizTimer ? 2 : undefined}
      >
        {showQuizTimer ? 'Hide Time' : 'Show Time'}
      </Typography>
    </Box>
  )
}

export default CountdownTimer

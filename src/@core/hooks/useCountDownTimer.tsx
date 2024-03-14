import React, { useCallback } from 'react'

export function useCountdown(
  countDownTill: number,
  options: {
    interval: number
    onComplete: () => any
    onTick: (timeLeft: number) => any
    decreaseBy?: number
    isEnabled: boolean
  },
) {
  const [count, setCount] = React.useState<number>(countDownTill)
  const intervalIdRef = React.useRef<number>()

  const handleClearInterval = useCallback(() => clearInterval(intervalIdRef?.current), [intervalIdRef?.current])

  const onTick = useCallback(() => {
    setCount(c => {
      if (c <= 0) {
        handleClearInterval()
        options.onComplete()
        return 0
      } else {
        options.onTick(c)
        return c - (options.decreaseBy ?? 1)
      }
    })
  }, [])

  React.useEffect(() => {
    // @ts-ignore
    if (options.isEnabled) intervalIdRef.current = setInterval(onTick, options.interval)
    return () => handleClearInterval()
  }, [options.interval])

  return count
}

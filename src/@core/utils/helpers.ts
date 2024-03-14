type CustomOption = Intl.DateTimeFormatOptions & {
  showTime: boolean
}

export function formatSecondsToDateString(timeFromEpochInSeconds: string, customOptions?: CustomOption) {
  const { showTime = true, ...restOptions } = customOptions || {}
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(showTime ? { hour: 'numeric', minute: 'numeric', hour12: true } : {}),
    ...restOptions,
  }
  return new Date(Number(timeFromEpochInSeconds) * 1000).toLocaleString('en-US', options)
}

export function formatSecondsToFriendlyFormat(seconds: number, showMins = true) {
  const { hours, minutes, seconds: secondsRemaining } = getHoursMinsAndSeconds(seconds)
  return `${hours ? hours + ':' : ''}${minutes.toString().padStart(2, '0')}:${secondsRemaining
    .toString()
    .padStart(2, '0')} ${
    showMins
      ? // If minutes is 0, don't show 'Mins' show 'Secs' instead
        minutes
        ? 'Mins'
        : 'Secs'
      : ''
  }`
}

export function getHoursMinsAndSeconds(timeInSeconds: number) {
  const secondsInMinute = 60
  const minutesIn1Hour = 60
  const secondsIn1hr = minutesIn1Hour * secondsInMinute
  const hours = Math.floor(timeInSeconds / secondsIn1hr)
  const minutesLeftAfterHours = timeInSeconds % secondsIn1hr
  const minutes = Math.floor(minutesLeftAfterHours / 60)
  const secondsLeftAfterMinutes = minutesLeftAfterHours % 60
  const seconds = Math.round(secondsLeftAfterMinutes)
  return { hours, minutes, seconds }
}

export function getColonSeparatedHrMinsAndSeconds(timeLeftInSeconds: number) {
  const { hours, minutes, seconds } = getHoursMinsAndSeconds(timeLeftInSeconds)
  return {
    hours,
    minutes,
    seconds,
    formatted: `${!hours ? '' : hours.toString().padStart(2, '0') + ':'}${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`,
  }
}

// const rtf = new Intl.RelativeTimeFormat("en", {
//   localeMatcher: "best fit", // other values: "lookup"
//   numeric: "always", // other values: "auto"
//   style: "long", // other values: "short" or "narrow"
// });

// export const

export function convert24HrTimetoAMPM(time: any) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1) // Remove full string match value
    time[5] = +time[0] < 12 ? 'AM' : 'PM' // Set AM/PM
    time[0] = +time[0] % 12 || 12 // Adjust hours
  }
  return time.join('') // return adjusted time or original string
}

export const get12HrFormatTime = (date: Date) =>
  date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

// Long format
// November 26, 2022
export const getDayMonthAndYearFromTimestampWithFullMonth = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

export const extractHrefFromAnchorTag = (htmlString: string) => {
  // Using a regular expression to extract the href value
  const regex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/i
  const match = htmlString.match(regex)

  // Extracted href value
  const hrefValue = match ? match[1] : htmlString
  return hrefValue
}

export function extractAllHrefAndTextFromAnchorTag(htmlString: string) {
  const regex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>([^<]*)<\/a>/gi
  const matches = htmlString.matchAll(regex)
  const result = Array.from(matches, match => {
    return {
      href: match[1],
      text: match[2],
    }
  })
  return result
}

export const getSum = (arr: Array<string | number>) => Number(arr.reduce((a, b) => Number(a) + Number(b), 0) || 0)

export const safeJsonParse = <T>(str: string) => {
  try {
    const jsonValue: T = JSON.parse(str)

    return jsonValue
  } catch (err) {
    console.log(err, 'Error in parsing JSON')
    return undefined
  }
}
export const convertEpochTimeToJSDate = (seconds: number) => new Date(convertEpochSecondsToMs(seconds))
export const convertEpochSecondsToMs = (seconds: number) => seconds * 1000

import moment from 'moment'

export const reformatDateFromNow = (date: Date | string) => {
  const momentDate = moment(date)
  const now = moment()
  const duration = moment.duration(now.diff(momentDate))

  if (duration.asHours() < 1) {
    const minutes = Math.floor(duration.asMinutes())
    return minutes < 1 ? `${Math.floor(duration.asSeconds())}s ago` : `${minutes}m ago`
  } else if (duration.asHours() < 24) {
    return `${Math.floor(duration.asHours())}h ago`
  } else {
    return momentDate.format('MMM DD, yyyy')
  }
}

export const checkSameDay = (date: Date | string) => {
  return moment(date).isSame(moment(), 'day')
}

export const formatDay = (date: Date) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

export const formatDate = (date: Date) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  const month = months[date.getMonth()]
  const day = date.getDate()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month} ${day}, ${hours}:${minutes}`
}

export const getYearByISOString = (isoString) => {
  const date = new Date(isoString)
  const year = date.getUTCFullYear()
  return year
}

export function convertSecondsToMmSs(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const mm = String(minutes).padStart(2, '0')
  const ss = String(remainingSeconds).padStart(2, '0')
  return mm + ':' + ss
}

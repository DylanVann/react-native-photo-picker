import moment from 'moment'

export default (date) => {
  const today = moment()

  if (today.startOf('day').isSame(date.startOf('day'))) {
    return 'Today'
  }

  if (today.subtract(1, 'day').startOf('day').isSame(date.startOf('day'))) {
    return 'Yesterday'
  }

  // Day of the week: Monday, Tuesday, etc
  if (today.diff(date, 'days') <= 7) {
    return date.format('dddd')
  }

  // Same year: Friday, Aug 5
  if (today.format('YYYY') === date.format('YYYY')) {
    return date.format('dddd, MMM D')
  }

  // Friday, Aug 5, 2015
  return date.format('dddd, MMM D, YYYY')
}

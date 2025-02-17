import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

export default function HistoryTimelineDate({ date }) {
  return (
    <span
      style={{
        color: 'rgb(0, 0, 0, 0.54)',
      }}
    >
      {moment(date).format('D MMM YYYY, HH:mm')}
    </span>
  )
}

HistoryTimelineDate.propTypes = {
  date: PropTypes.object,
}

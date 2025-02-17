import { Card, Timeline } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import HistoryTimelineDate from './HistoryTimelineDate'

export default function HistoryTimelineAttachment({
  date,
  title,
  action,
  oldValue,
  newValue,
  userName,
}) {
  return (
    <Timeline.Item color="gray">
      <HistoryTimelineDate date={date} />
      <Card className="mt-3">
        <h3 className="font-bold">{title}</h3>
        <p>{`${
          action === 'Exclude' ? 'Excluido' : 'Enviado'
        } por ${userName}`}</p>
        <p>
          <i className="fa fa-link mr-2 fa-lg" aria-hidden="true" />
          {newValue || oldValue}
        </p>
      </Card>
    </Timeline.Item>
  )
}

HistoryTimelineAttachment.propTypes = {
  action: PropTypes.string,
  date: PropTypes.object,
  newValue: PropTypes.string,
  oldValue: PropTypes.string,
  title: PropTypes.string,
  userName: PropTypes.string,
}

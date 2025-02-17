import { Card, Col, Row, Timeline } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import HistoryTimelineDate from './HistoryTimelineDate'

export default function HistoryTimelineProposal({
  date,
  title,
  action,
  oldValue,
  newValue,
  userName,
}) {
  const [comments] = useState(newValue.split('\n'))

  return (
    <Timeline.Item color="gray">
      <HistoryTimelineDate date={date} />
      <Card className="mt-3" style={{ backgroundColor: '#FAFAFA' }}>
        <h3 className="font-bold">{`${title} por ${userName}`}</h3>
        {comments.map((comment, index) => (
          <Row key={index}>
            <Col>
              {comment && <React.Fragment>{comment}</React.Fragment>}
              {!comment && <br />}
            </Col>
          </Row>
        ))}
      </Card>
    </Timeline.Item>
  )
}

HistoryTimelineProposal.propTypes = {
  action: PropTypes.string,
  date: PropTypes.object,
  newValue: PropTypes.string,
  oldValue: PropTypes.string,
  title: PropTypes.string,
  userName: PropTypes.string,
}

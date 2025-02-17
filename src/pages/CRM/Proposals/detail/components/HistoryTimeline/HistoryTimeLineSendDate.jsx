import React, { useState } from 'react'
import { Card, Col, Row, Timeline } from 'antd'
import HistoryTimelineDate from './HistoryTimelineDate'
import moment from 'moment'

const HistoryTimeLineSendDate = ({
  date,
  title,
  action,
  oldValue,
  newValue,
  userName,
}) => {
  const [comments] = useState(newValue.split('\n'))

  return (
    <Timeline.Item color="gray">
      <HistoryTimelineDate date={date} />
      <Card className="mt-3" style={{ backgroundColor: '#FAFAFA' }}>
        <h3 className="font-bold">{`${title} por ${userName}`}</h3>
        {comments.map((comment, index) => (
          <Row key={index}>
            <Col>
              {comment && <React.Fragment>{ moment(...comments).format('L') }</React.Fragment>}
              {!comment && <br />}
            </Col>
          </Row>
        ))}
      </Card>
    </Timeline.Item>
  )
}

export default HistoryTimeLineSendDate

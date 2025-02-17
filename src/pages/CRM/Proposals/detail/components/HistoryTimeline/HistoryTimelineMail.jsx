import { Card, Timeline } from 'antd'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import HistoryTimelineDate from './HistoryTimelineDate'

export default function HistoryTimelineMail({
  date,
  title,
  action,
  oldValue,
  newValue,
  userName,
  emailSentId,
  showEmail,
}) {
  
  const [email, setEmail] = useState(null)

  useEffect(() => {
    try {
      setEmail(JSON.parse(newValue))
    } catch (error) {
      // console.log(error)
    }
  }, [newValue])
  
  return (
    <Timeline.Item color="gray">
      <HistoryTimelineDate date={date} />
      <Card className="mt-3" bodyStyle={{ padding: 0 }}>
        <h3 className="text-white p-4" style={{ backgroundColor: '#3F51B5' }}>
          <i className="fa fa-envelope mr-3 ml-1 fa-lg" aria-hidden="true" />
          <b>{title}</b>
          <span>{` - por ${userName}`}</span>
        </h3>
        <div className="p-4">
          <h4>
            <span className="font-bold mr-2">Assunto:</span>
            <span
              role="button"
              className="primary-color cursor-pointer"
              onClick={() => showEmail(emailSentId)}
            >
              {email?.subject}
            </span>
          </h4>
          <h4>
            <span className="font-bold mr-2">Para:</span>
            <span>{email?.to}</span>
          </h4>
        </div>
      </Card>
    </Timeline.Item>
  )
}

HistoryTimelineMail.propTypes = {
  action: PropTypes.string,
  date: PropTypes.object,
  newValue: PropTypes.string,
  oldValue: PropTypes.string,
  title: PropTypes.string,
  userName: PropTypes.string,
  emailSentId: PropTypes.number,
  showEmail: PropTypes.func,
}

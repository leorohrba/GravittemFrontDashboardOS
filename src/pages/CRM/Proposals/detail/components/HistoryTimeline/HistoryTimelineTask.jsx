import { formatTaskDuration } from '@utils'
import { Card, Col, Row, Timeline } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import HistoryTimelineDate from './HistoryTimelineDate'

export default function HistoryTimelineTask({
  date,
  title,
  action,
  oldValue,
  newValue,
  userName,
}) {
  const [task, setTask] = useState(null)
  const [comments, setComments] = useState([])

  useEffect(() => {
    try {
      const taskWork = JSON.parse(newValue)
      setTask(taskWork)
      if (taskWork.observation) {
        setComments(taskWork.observation.split('\n'))
      }
      // eslint-disable-next-line no-console
    } catch (error) {
      // console.log(error)
    }
  }, [newValue])

  return (
    <React.Fragment>
      {task && (
        <Timeline.Item color="gray">
          <HistoryTimelineDate date={date} />
          <Card className="mt-3" bodyStyle={{ padding: 0 }}>
            <h3
              className="text-white p-4"
              style={{
                backgroundColor:
                  action === 'Include'
                    ? '#1976d2'
                    : action === 'Exclude'
                    ? '#c53030'
                    : '#4CAF50',
              }}
            >
              <i
                className={`fa fa-${
                  action === 'Exclude' ? 'calendar-times-o' : 'calendar-check-o'
                } mr-3 ml-1 fa-lg`}
                aria-hidden="true"
              />
              <b>{title}</b>
              <span>{` - por ${userName}`}</span>
            </h3>
            <div className="p-4">
              {task.subject && (
                <h4>
                  <span className="font-bold">{task.subject}</span>
                </h4>
              )}
              {task.expectedDuration && (
                <h4>
                  <span className="font-bold">Duração: </span>
                  <span>{formatTaskDuration(task.expectedDuration)}</span>
                </h4>
              )}
              {task.observation && (
                <h4>
                  <Row type="flex">
                    <Col className="mr-2">
                      <span className="font-bold">Observações: </span>
                    </Col>
                    <Col>
                      {comments.map((comment, index) => (
                        <Row key={index}>
                          <Col>
                            {comment && (
                              <React.Fragment>{comment}</React.Fragment>
                            )}
                            {!comment && <br />}
                          </Col>
                        </Row>
                      ))}
                    </Col>
                  </Row>
                </h4>
              )}
            </div>
          </Card>
        </Timeline.Item>
      )}
    </React.Fragment>
  )
}

HistoryTimelineTask.propTypes = {
  action: PropTypes.string,
  date: PropTypes.object,
  newValue: PropTypes.string,
  oldValue: PropTypes.string,
  title: PropTypes.string,
  userName: PropTypes.string,
}

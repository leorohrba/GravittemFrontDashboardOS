import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Button, Col, Input, message, Row, Spin, Timeline } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'

const { TextArea } = Input

function CallHistoryHeaderNewModalHistory(props) {
  const { history, loading, callId, canBeUpdated, onChange } = props
  const [comment, setComment] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef(null)

  const handleChangeComment = e => {
    setComment(e.target.value)
  }

  async function saveHistory() {
    if (!comment) {
      message.error('Informe alguma observação!')
      return
    }

    const historyBody = {
      callHistory: {
        callId,
        type: 'Comment',
        title: 'Comentário adicionado',
        action: 'Include',
        oldValue: '',
        newValue: comment,
      },
    }

    setIsSaving(true)

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/callHistory`,
        data: historyBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        setComment(null)
        onChange()
        if (inputRef.current != null) {
          inputRef.current.focus()
        }
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  return (
    <Spin size="large" spinning={loading}>
      {callId > 0 && canBeUpdated && (
        <Row className="mb-6" type="flex" align="bottom" gutter={5}>
          <Col style={{ width: '550px' }}>
            <Col className="mb-1">
              <b>Observação</b>
            </Col>
            <Col>
              <TextArea
                autoSize
                value={comment}
                onChange={handleChangeComment}
                ref={inputRef}
              />
            </Col>
          </Col>
          <Col>
            <Button
              onClick={() => saveHistory()}
              loading={isSaving}
              type="primary"
            >
              Comentar
            </Button>
          </Col>
        </Row>
      )}

      {history.length === 0 && (
        <h2 className="mt-5 mb-5">Este chamado não possui histórico</h2>
      )}

      <Timeline mode="alternate">
        {history.map(record => (
          <Timeline.Item key={record.callHistoryId}>
            <h3>
              <b>
                {moment(record.createDateTime).format('DD/MM/YYYY - HH:mm')}
              </b>
            </h3>
            <p>{record.createUserName}</p>
            <h4>{record.title}</h4>
            {record.action === 'Include' ? (
              <h4 className="primary-color">{record.newValue}</h4>
            ) : (
              <React.Fragment>
                {record.oldValue && record.newValue && (
                  <h4>
                    <span>
                      <strike>
                        <b>{record.oldValue}</b>
                      </strike>
                      &nbsp;
                      <i className="fa fa-angle-right primary-color" />
                      &nbsp;
                      <b className="primary-color">{record.newValue}</b>
                    </span>
                  </h4>
                )}
                {!record.oldValue && record.newValue && (
                  <h4>
                    Alterado para{' '}
                    <b className="primary-color">{record.newValue}</b>
                  </h4>
                )}
                {record.oldValue && !record.newValue && (
                  <h4>
                    Retirado o valor{' '}
                    <strike>
                      <b>{record.oldValue}</b>
                    </strike>
                  </h4>
                )}
              </React.Fragment>
            )}
          </Timeline.Item>
        ))}
      </Timeline>
    </Spin>
  )
}

CallHistoryHeaderNewModalHistory.propTypes = {
  history: PropTypes.array,
  loading: PropTypes.bool,
  callId: PropTypes.number,
  canBeUpdated: PropTypes.bool,
  onChange: PropTypes.func,
}

export default CallHistoryHeaderNewModalHistory

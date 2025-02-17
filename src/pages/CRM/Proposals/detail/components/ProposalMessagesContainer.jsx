import React from 'react'
import { Collapse, Alert } from 'antd'
import { useDetailProposalContext } from '../context/DetailProposalContext'

const { Panel } = Collapse

const ProposalMessagesContainer = () => {
  const { messageList, setMessageList } = useDetailProposalContext()

  const onClose = key => {
    const newList = messageList.splice(key, 1)
    setMessageList(newList)
  }

  return (
    <div className="w-full container">
      <Collapse defaultActiveKey="1">
        <Panel header={`Avisos ( ${messageList.length} )`} key="1">
          {messageList.map(d => (
            <div className="mb-3">
              <Alert
                showIcon
                message={d.message}
                type={d.type}
                closable
                onClose={() => onClose(d.key)}
              />
            </div>
          ))}
        </Panel>
      </Collapse>
    </div>
  )
}

export default ProposalMessagesContainer

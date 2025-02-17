import { Button, Modal, Row, Col } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import MessageModel from '../components/MessageModel'

export default function MessageModelModal({
  setVisibleMessageModelModal,
  visibleMessageModelModal,
  userPermissions,
  onSelectModel,
}) {
  
  if (!visibleMessageModelModal) {
    return null
  }
  
  return (
    <Modal
      title="Modelos de e-mail"
      visible={visibleMessageModelModal}
      width="70%"
      centered
      destroyOnClose
      onCancel={() => setVisibleMessageModelModal(false)}
      footer={
        <Row type="flex">
          <Col className="ml-auto">
            <Button
              type="secondary"
              key="back"
              onClick={() => setVisibleMessageModelModal(false)}
            >
              Fechar
            </Button>
          </Col>
        </Row>
      }
    >
      <MessageModel
        userPermissions={userPermissions || []}
        onSelectModel={onSelectModel}
      />  
    </Modal>
  )
}

MessageModelModal.propTypes = {
  setVisibleMessageModelModal: PropTypes.func,
  visibleMessageModelModal: PropTypes.bool,
  userPermissions: PropTypes.array,
  onSelectModel: PropTypes.func,
}


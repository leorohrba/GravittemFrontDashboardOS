import { Button, Modal, Row, Col } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import Email from './Email'

export default function EmailModal({
  setVisibleEmailModal,
  visibleEmailModal,
  userPermissions,
  emailSentId,
  whatsappData,
  printLayouts,
  allContacts,
}) {
  if (!visibleEmailModal) {
    return null
  }
  return (
    <Modal
      title={whatsappData ? 'Mensagem enviada' : 'E-mail enviado'}
      visible={visibleEmailModal}
      width="80%"
      centered
      destroyOnClose
      onCancel={() => setVisibleEmailModal(false)}
      footer={
        <Row type="flex">
          <Col className="ml-auto">
            <Button
              type="secondary"
              key="back"
              onClick={() => setVisibleEmailModal(false)}
            >
              Fechar
            </Button>
          </Col>
        </Row>
      }
    >
      <Email
        userPermissions={userPermissions || []}
        emailSentId={emailSentId}
        printLayouts={printLayouts}
        emailsFrom={[]}
        whatsappData={whatsappData}
        allContacts={allContacts}
      />
    </Modal>
  )
}

EmailModal.propTypes = {
  setVisibleEmailModal: PropTypes.func,
  visibleEmailModal: PropTypes.bool,
  userPermissions: PropTypes.array,
  emailSentId: PropTypes.number,
  printLayouts: PropTypes.array,
}

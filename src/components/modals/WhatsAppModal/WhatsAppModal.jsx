/* eslint-disable react/no-unused-prop-types */
import { Button, Modal, Row, Col } from 'antd'
import React, { useState } from 'react'
import WhatsAppModalHeader from './components/WhatsAppModalHeader'
import { WhatsAppOutlined } from '@ant-design/icons'

export default function WhatsAppModal({
  whatsAppModalVisible,
  setWhatsAppModalVisible,
  whatsappData,
  person,
  getChats,
  entityId,
  outerSync = false,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }
  return (
    <React.Fragment>
      <Modal
        centered
        okButtonProps={{ hidden: true }}
        width={700}
        footer={
          <Row type="flex" justify="space-between" align="middle">
            <Col>
              {!outerSync && (
                <Button
                  type="primary"
                  style={{ background: 'green', borderColor: 'darkgreen' }}
                  onClick={showModal}
                >
                  Sincronizar conversa
                </Button>
              )}
              <Button
                id="button-cancel-attachment"
                type="secondary"
                onClick={() => setWhatsAppModalVisible(false)}
              >
                Voltar
              </Button>
            </Col>
            <Col>
              <p className="mb-0">{`${whatsappData.length} conversas sincronizadas`}</p>
            </Col>
          </Row>
        }
        open={whatsAppModalVisible}
        title={
          <>
            Conversa WhatsApp &nbsp;&nbsp;
            <span
              style={{
                display: 'inline-block',
                padding: '4px',
                borderRadius: '17%',
                border: '2px solid lightgray',
              }}
            >
              <WhatsAppOutlined />
            </span>
          </>
        }
        cancelText="Voltar"
        onCancel={() => setWhatsAppModalVisible(false)}
      >
        <React.Fragment>
          <WhatsAppModalHeader
            {...{
              getChats,
              entityId,
              person,
              whatsappData,
              isModalOpen,
              setIsModalOpen,
            }}
          />
        </React.Fragment>
      </Modal>
    </React.Fragment>
  )
}

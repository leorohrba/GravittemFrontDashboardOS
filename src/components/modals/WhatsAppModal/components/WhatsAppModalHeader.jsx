/* eslint-disable import/extensions */
import React from 'react'
import SyncChat from './SyncChat'
import { Row } from 'antd' // Add Modal and Button imports
import WhatsAppModalList from './WhatsAppModalList'

export default function WhatsAppModalHeader({
  setIsModalOpen,
  isModalOpen,
  whatsappData,
  getChats,
  person,
  entityId,
}) {
  return (
    <React.Fragment>
      <Row justify="center">
        <SyncChat
          {...{
            getChats,
            isModalOpen,
            setIsModalOpen,
            person,
            entityId,
          }}
        />
        {whatsappData.length === 0 ? (
          <div style={{ padding: 24, minHeight: 275 }}>
            <></>
          </div>
        ) : (
          <WhatsAppModalList whatsappData={whatsappData} />
        )}
      </Row>
    </React.Fragment>
  )
}

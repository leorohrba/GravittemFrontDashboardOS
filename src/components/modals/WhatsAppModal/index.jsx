import Button from '@components/Button'
import { getAuthToken } from '@utils'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import WhatsAppModal from './WhatsAppModal'
import WhatsAppModalHeader from './components/WhatsAppModalHeader'
import { getChats } from './components/Service'

export default function WhatsAppModalConfig({
  entityId,
  whatsappData,
  setWhatsappData,
  hideModal,
  buttonClassName,
  person,
  outerSync,
  refresh = 0,
}) {
  const [whatsAppModalVisible, setWhatsAppModalVisible] = useState(false)

  const getChatsAsync = async () => {
    const response = await getChats(entityId)
    setWhatsappData(response)
  }
  useEffect(() => {
    if (entityId) {
      getAuthToken()
      getChatsAsync()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh])

  return hideModal ? (
    <React.Fragment>
      <WhatsAppModalHeader
        getChats={getChatsAsync}
        {...{
          whatsappData,
          setWhatsappData,
          entityId,
          person,
        }}
      />
    </React.Fragment>
  ) : (
    <React.Fragment>
      <Button
        onClick={() => setWhatsAppModalVisible(true)}
        quantity={whatsappData?.length}
        disabled={!entityId}
        className={buttonClassName}
      >
        <i className="fa fa-whatsapp fa-lg mr-3" />
        WhatsApp
      </Button>
      <WhatsAppModal
        getChats={getChatsAsync}
        {...{
          outerSync,
          whatsAppModalVisible,
          setWhatsAppModalVisible,
          entityId,
          whatsappData,
          setWhatsappData,
          person,
        }}
      />
    </React.Fragment>
  )
}

WhatsAppModalConfig.propTypes = {
  buttonClassName: PropTypes.string,
  whatsappData: PropTypes.array,
  entityId: PropTypes.string,
  hideModal: PropTypes.bool,
  setWhatsappData: PropTypes.func,
}

import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import WhatsAppModalListItem from '../../../../../../components/modals/WhatsAppModal/components/WhatsAppModalListItem'

export default function HistoryTimelineWhatsappChat({
  key,
  date,
  chatId,
  newValue,
  userName,
  title,
  isProposal = true,
}) {
  const [whatsapp, setWhatsapp] = useState(null)

  useEffect(() => {
    try {
      setWhatsapp(isProposal ? JSON.parse(newValue) : newValue)
    } catch (error) {
      // console.log(error)
    }
  }, [newValue, isProposal])

  return (
    whatsapp && (
      <WhatsAppModalListItem
        chat={
          isProposal
            ? { ...whatsapp, id: chatId, data: date, nomeDestinatario: title }
            : whatsapp
        }
      />
    )
  )
}

HistoryTimelineWhatsappChat.propTypes = {
  date: PropTypes.object,
  newValue: PropTypes.string,
  userName: PropTypes.string,
  isProposal: PropTypes.bool,
}

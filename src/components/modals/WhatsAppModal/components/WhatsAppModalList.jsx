import { Timeline } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import HistoryTimelineWhatsappChat from '../../../../pages/CRM/Proposals/detail/components/HistoryTimeline/HistoryTimelineWhatsappChat'

export default function WhatsAppModalList({ whatsappData }) {
  if (whatsappData == null) return null
  return (
    <Timeline>
      {whatsappData.map((chat) => (
        <HistoryTimelineWhatsappChat
          isProposal={false}
          chatId={chat.id}
          date={chat.data}
          newValue={chat}
        />
      ))}
    </Timeline>
  )
}

WhatsAppModalList.propTypes = {
  whatsappData: PropTypes.array,
}

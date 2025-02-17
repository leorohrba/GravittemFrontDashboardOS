import { Card, Timeline } from 'antd'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import HistoryTimelineDate from './HistoryTimelineDate'
import { formatCellPhone } from '../../../../../../utils'

export default function HistoryTimelineWhatsappProposal({
  date,
  title,
  action,
  oldValue,
  newValue,
  userName,
  whatsappSentId,
  showWhatsapp,
}) {
  const [whatsapp, setWhatsapp] = useState(null)

  useEffect(() => {
    try {
      setWhatsapp(JSON.parse(newValue))
    } catch (error) {
      // console.log(error)
    }
  }, [newValue])

  return (
    <Timeline.Item color="gray">
      <HistoryTimelineDate date={date} />
      <Card className="mt-3" bodyStyle={{ padding: 0 }}>
        <h3 className="text-white p-4" style={{ backgroundColor: '#128C7E' }}>
          <i className="fa fa-whatsapp mr-3 ml-1 fa-lg" aria-hidden="true" />
          <b>{title}</b>
          <span>{` - por ${userName}`}</span>
        </h3>
        <div className="p-2">
          <h4>
            <span className="font-bold mr-2">Para:</span>
            <span>{formatCellPhone(whatsapp?.to)}</span>
          </h4>
        </div>
        <div className="p-2">
          <h4>
            <span className="font-bold mr-2">Mensagem:</span>
            <span
              role="button"
              className="primary-color cursor-pointer"
              onClick={() => showWhatsapp(whatsapp)}
            >
              {whatsapp?.body}
            </span>
          </h4>
        </div>
      </Card>
    </Timeline.Item>
  )
}

HistoryTimelineWhatsappProposal.propTypes = {
  action: PropTypes.string,
  date: PropTypes.object,
  newValue: PropTypes.string,
  oldValue: PropTypes.string,
  title: PropTypes.string,
  userName: PropTypes.string,
  whatsappSentId: PropTypes.number,
  showWhatsapp: PropTypes.func,
}

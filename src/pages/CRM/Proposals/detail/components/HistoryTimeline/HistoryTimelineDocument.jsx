import { Card, Timeline } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import HistoryTimelineDate from './HistoryTimelineDate'

export default function HistoryTimelineDocument({
  date,
  title,
  action,
  oldValue,
  newValue,
  userName,
}) {
  const [document, setDocument] = useState(null)

  useEffect(() => {
    try {
      const documentWork = JSON.parse(newValue)
      setDocument(documentWork)
      // eslint-disable-next-line no-console
    } catch (error) {
      // console.log(error)
    }
  }, [newValue])

  return (
    <React.Fragment>
      {document && (
        <Timeline.Item color="gray">
          <HistoryTimelineDate date={date} />
          <Card className="mt-3" bodyStyle={{ padding: 0 }}>
            <h3
              className="text-white p-4"
              style={{
                backgroundColor:
                  action === 'Include'
                    ? '#1976d2'
                    : action === 'Exclude'
                    ? '#c53030'
                    : '#4CAF50',
              }}
            >
              <i
                className={`fa fa-${
                  action === 'Exclude' ? 'calendar-times-o' : 'calendar-check-o'
                } mr-3 ml-1 fa-lg`}
                aria-hidden="true"
              />
              <b>{title}</b>
              <span>{` - por ${userName}`}</span>
            </h3>
            <div className="p-4">
              {document.tipoDocumento && (
                <h4>
                  <span className="font-bold">
                    {document.tipoDocumento === 1
                      ? 'Ordem de serviço'
                      : document.tipoDocumento === 2
                      ? 'Pedido de venda'
                      : 'Contrato'}
                  </span>
                </h4>
              )}
              {document.valor && (
                <h4>
                  <span className="font-bold">{document.valor}</span>
                </h4>
              )}
            </div>
          </Card>
        </Timeline.Item>
      )}
    </React.Fragment>
  )
}

HistoryTimelineDocument.propTypes = {
  action: PropTypes.string,
  date: PropTypes.object,
  newValue: PropTypes.string,
  oldValue: PropTypes.string,
  title: PropTypes.string,
  userName: PropTypes.string,
}

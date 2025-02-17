import { Card, Timeline } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import HistoryTimelineDate from './HistoryTimelineDate'

export default function HistoryTimelineProposal({
  date,
  title,
  action,
  oldValue,
  newValue,
  userName,
  priceList = null,
}) {
  const formattedNumber = value => {
    // Verifica se o valor contém "%"
    if (value.includes('%')) {
      const numericValue = parseFloat(value.replace('%', '').replace(',', '.'))
      return isNaN(numericValue)
        ? value
        : `${numericValue.toFixed(2).replace('.', ',')}%`
    }

    // Verifica se o valor contém "R$"
    if (value.includes('R$')) {
      let cleanedValue = value.startsWith('R$')
        ? value.replace('R$', '').trim()
        : value.trim()

      // Verifica se o valor está no formato estrangeiro (ex: 1,100.00)
      if (/^\d{1,3}(,\d{3})*\.\d{2}$/.test(cleanedValue)) {
        cleanedValue = cleanedValue.replace(/,/g, '').replace(/\./, ',')
      }
      // Verifica se o valor está no formato "1,0" e precisa ser convertido para "1,00"
      else if (/^\d+,\d{1}$/.test(cleanedValue)) {
        cleanedValue += '0'
      }
      // Verifica se o valor já está no formato brasileiro (ex: 1.100,00)
      else if (/^\d{1,3}(\.\d{3})*(,\d{2})?$/.test(cleanedValue)) {
        cleanedValue = cleanedValue.replace(/\./g, '').replace(',', '.')
      }

      // Converte o valor numérico para o formato brasileiro
      const numericValue = parseFloat(cleanedValue)
      return isNaN(numericValue)
        ? value
        : `R$ ${numericValue.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
    }
    // Retorna o valor original se não precisar de formatação
    return value
  }

  const matchedItem =
    priceList && priceList.find(item => title.includes(item.name))

  return (
    <Timeline.Item color="gray">
      <HistoryTimelineDate date={date} />

      {action === 'Include' && !newValue && !oldValue ? (
        <h3 className="mt-3 text-white p-4 primary-background-color">
          <i
            className="fa fa-calendar-plus-o mr-3 ml-1 fa-lg"
            aria-hidden="true"
          />
          <b>{title}</b>
          <span>{` - por ${userName}`}</span>
        </h3>
      ) : (
        <Card className="mt-3">
          <h3 className="font-bold">
            {matchedItem != null ? matchedItem?.name : title}
          </h3>

          {action === 'Alter' && !oldValue && newValue && (
            <p>
              {`${title} para`}
              <b>{formattedNumber(newValue)}</b>
              {` por `}
              {userName}
            </p>
          )}

          {action === 'Alter' && !oldValue && !newValue && (
            <p>Nenhum valor alterado</p>
          )}

          {action === 'Alter' && oldValue && !newValue && (
            <p>
              <span>{`${title} sendo retirado o valor `}</span>
              <b>
                <strike>{formattedNumber(oldValue)}</strike>
              </b>
              {` por `}
              {userName}
            </p>
          )}

          {action === 'Alter' && oldValue && newValue && (
            <p>
              <span>{`${title} de `}</span>
              <b>
                <strike>{formattedNumber(oldValue)}</strike>
              </b>
              {` para `}
              <b>{formattedNumber(newValue)}</b>
              {` por `}
              {userName}
            </p>
          )}

          {action !== 'Alter' && !newValue && !oldValue && (
            <p>{`${title} por ${userName}`}</p>
          )}
          {action !== 'Alter' && (newValue || oldValue) && (
            <p>{`${title}, valor: ${formattedNumber(newValue) ||
              formattedNumber(oldValue)} por ${userName}`}</p>
          )}
        </Card>
      )}
    </Timeline.Item>
  )
}

HistoryTimelineProposal.propTypes = {
  action: PropTypes.string,
  date: PropTypes.object,
  newValue: PropTypes.string,
  oldValue: PropTypes.string,
  title: PropTypes.string,
  userName: PropTypes.string,
}

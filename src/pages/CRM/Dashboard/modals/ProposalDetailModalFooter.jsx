/* eslint-disable react-hooks/exhaustive-deps  */
import { Row, Col } from 'antd'
import React, { useState, useEffect } from 'react'
import { addBrlCurrencyToNumber, formatNumber } from '@utils'
import PropTypes from 'prop-types'

const totalTemplate = { Won: 0, Lost: 0, Open: 0, Total: 0 } 
const colWidth = 10 // em %

export default function ProposalDetailModalFooter ({ proposalDetail, proposalDetailType, proposalDetailParams } )
{

  const [uniqueValue, setUniqueValue] = useState(totalTemplate) 
  const [recurrenceValue, setRecurrenceValue] = useState(totalTemplate)
  const [quantity, setQuantity] = useState(totalTemplate)
  const [quantityDaysWon, setQuantityDaysWon] = useState(0)
  const [conversionRate, setConversionRate] = useState({ quantityWon: 0, quantityCreated: 0, percent: 0 })
  
  const getAverageTicket = (value, quantity) => {
     const average = quantity === 0 ? 0 : value / quantity
     return parseFloat(average.toFixed(2))
  }

  const getAverageCycle = (days, proposalQuantity) => {
    let value = proposalQuantity === 0 ? 0 : days / proposalQuantity
    value = parseFloat(value.toFixed(0))
    const average = `${formatNumber(value,0)} ${value === 1 ? 'dia' : 'dias'}`
    return average
  }
  
  useEffect(() => {
    let source = proposalDetail
    
    const quantityTotal = source.length
    const uniqueValueTotal = source.reduce((accumulator, { uniqueValue }) => accumulator + uniqueValue ,0) || 0
    const recurrenceValueTotal = source.reduce((accumulator, { recurrenceValue }) => accumulator + recurrenceValue ,0) || 0

    source = proposalDetail.filter(x => x.actStatusCode === 'WON')
    const quantityWon = source.length
    const uniqueValueWon = source.reduce((accumulator, { uniqueValue }) => accumulator + uniqueValue ,0) || 0
    const recurrenceValueWon = source.reduce((accumulator, { recurrenceValue }) => accumulator + recurrenceValue ,0) || 0
    const days = source.reduce((accumulator, { quantityDaysFinish }) => accumulator + quantityDaysFinish ,0) || 0

    source = proposalDetail.filter(x => x.actStatusCode === 'LOST')
    const quantityLost = source.length
    const uniqueValueLost = source.reduce((accumulator, { uniqueValue }) => accumulator + uniqueValue ,0) || 0
    const recurrenceValueLost = source.reduce((accumulator, { recurrenceValue }) => accumulator + recurrenceValue ,0) || 0

    source = proposalDetail.filter(x => x.actStatusCode === 'ABRT')
    const quantityOpen = source.length
    const uniqueValueOpen = source.reduce((accumulator, { uniqueValue }) => accumulator + uniqueValue ,0) || 0
    const recurrenceValueOpen = source.reduce((accumulator, { recurrenceValue }) => accumulator + recurrenceValue ,0) || 0
    
    if (proposalDetailType === 'conversionRate') {
      source = proposalDetail.filter(x => x.monthYearCreate?.substr(0,10) >= proposalDetailParams.startMonthYearCreate && x.monthYearCreate?.substr(0,10) <= proposalDetailParams.endMonthYearCreate)
      const quantityCreated = source.length   
      source = proposalDetail.filter(x => x.actStatusCode === 'WON' && x.monthYearClosed?.substr(0,10) >= proposalDetailParams.startMonthYearClosed && x.monthYearClosed?.substr(0,10) <= proposalDetailParams.endMonthYearClosed)
      const quantityClosedWon = source.length 
      setConversionRate( { quantityCreated, 
                           quantityWon: quantityClosedWon, 
                           percent: quantityCreated === 0 ? 0 : 100 * quantityClosedWon / quantityCreated 
                          } 
                       )
    }
    
    setUniqueValue( { Won: uniqueValueWon, Lost: uniqueValueLost, Open: uniqueValueOpen, Total: uniqueValueTotal } )
    setRecurrenceValue( { Won: recurrenceValueWon, Lost: recurrenceValueLost, Open: recurrenceValueOpen, Total: recurrenceValueTotal } )
    setQuantity( { Won: quantityWon, Lost: quantityLost, Open: quantityOpen, Total: quantityTotal } )
    setQuantityDaysWon(days)
    
  },[proposalDetail])

  return (
    <React.Fragment>
      <Row className="w-full mt-2 mb-1" justify="end" type="flex">
        <Col style={{ width: `${colWidth}%`}}>
          <b>Totais</b>
        </Col>
        <Col className="text-right" style={{ width: `${colWidth}%`}}>
          <b>Aberto</b>
        </Col>
        <Col className="text-right" style={{ width: `${colWidth}%`}}>
          <b>Ganho</b><i className="ml-2 fa fa-check" style={{ color: '#4caf50' }} />
        </Col>
        <Col className="text-right" style={{ width: `${colWidth}%`}}>
          <b>Perdido</b><i className="ml-2 fa fa-times" style={{ color: 'red' }} />
        </Col>
        <Col className="text-right" style={{ width: `${colWidth}%`}}>
          <b>Total</b>
        </Col>
      </Row>
      <Row className="w-full mb-1" justify="end" type="flex">
        <Col style={{ width: `${5 * colWidth}%`}}>
          <hr />
        </Col>
      </Row>
      <Row className="w-full mb-1" justify="end" type="flex">
        <Col style={{ width: `${colWidth}%`}}>
          <b>Valor único</b>
        </Col>
        <Col className="text-right" style={{ width: `${colWidth}%`}}>
          {addBrlCurrencyToNumber(uniqueValue?.Open || 0)}
        </Col>
        <Col className="text-right" style={{ width: `${colWidth}%`}}>
          {addBrlCurrencyToNumber(uniqueValue?.Won || 0)}
        </Col>
        <Col className="text-right" style={{ width: `${colWidth}%`}}>
          {addBrlCurrencyToNumber(uniqueValue?.Lost || 0)}
        </Col>
        <Col className="text-right" style={{ width: `${colWidth}%`}}>
          {addBrlCurrencyToNumber(uniqueValue?.Total || 0)}
        </Col>
      </Row>
      <Row className="w-full mb-1" justify="end" type="flex">
        <Col style={{ width: `${colWidth}%`}}>
          <b>Valor recorrente</b>
        </Col>
        <Col className="text-right" style={{ width: `${colWidth}%`}}>
          {addBrlCurrencyToNumber(recurrenceValue?.Open || 0)}
        </Col>
        <Col className="text-right" style={{ width: `${colWidth}%`}}>
          {addBrlCurrencyToNumber(recurrenceValue?.Won || 0)}
        </Col>
        <Col className="text-right" style={{ width: `${colWidth}%`}}>
          {addBrlCurrencyToNumber(recurrenceValue?.Lost || 0)}
        </Col>
        <Col className="text-right" style={{ width: `${colWidth}%`}}>
          {addBrlCurrencyToNumber(recurrenceValue?.Total || 0)}
        </Col>
      </Row>
      <Row className="w-full mb-2" justify="end" type="flex">
        <Col style={{ width: `${colWidth}%`}}>
          <b>Quantidade</b>
        </Col>
        <Col className="text-right" style={{ width: `${colWidth}%`}}>
          {formatNumber(quantity.Open || 0, 0)}
        </Col>
        <Col className="text-right" style={{ width: `${colWidth}%`}}>
          {formatNumber(quantity.Won || 0, 0)}
        </Col>
        <Col className="text-right" style={{ width: `${colWidth}%`}}>
          {formatNumber(quantity.Lost || 0, 0)}
        </Col>
        <Col className="text-right" style={{ width: `${colWidth}%`}}>
          {formatNumber(quantity.Total || 0, 0)}
        </Col>
      </Row>
      {proposalDetailType === 'averageTicket' && (
        <div>
          <Row className="mb-1" type="flex" justify="end">
            <Col><b>Ticket médio:</b></Col>
            <Col className="ml-2">
               {addBrlCurrencyToNumber(getAverageTicket(uniqueValue.Total, quantity.Total))}
               <span className="ml-1" style={{ color: 'gray' }}>(Único)</span>
            </Col>           
            <Col className="ml-2">
               {addBrlCurrencyToNumber(getAverageTicket(recurrenceValue.Total, quantity.Total))}
               <span className="ml-1" style={{ color: 'gray' }}>(Recorrente)</span>
            </Col>           
          </Row>
          <Row className="mt-1 mb-1" type="flex" justify="end">
            <small style={{ color: 'gray'}}>* Valor total dos negócios ganhos /  quantidade dos negócios ganhos</small>
          </Row>
        </div>
      )}
      {proposalDetailType === 'averageCycle' && (
        <div>
          <Row className="mt-1 mb-1" type="flex" justify="end">
            <Col><b>Ciclo médio de vendas:</b></Col>
            <Col className="ml-2">
               {getAverageCycle(quantityDaysWon || 0, quantity?.Won || 0)}
            </Col>           
          </Row>
          <Row className="mt-1 mb-1" type="flex" justify="end">
            <small style={{ color: 'gray'}}>{`* Quantidade de dias em que cada negócio ganho ficou em aberto (${quantityDaysWon || 0}) / quantidade de negócios ganhos (${quantity?.Won || 0})`}</small>
          </Row>
        </div>
      )}
      {proposalDetailType === 'conversionRate' && (
        <div>
          <Row className="mt-1 mb-1" type="flex" justify="end">
            <Col><b>Taxa de conversão de vendas:</b></Col>
            <Col className="ml-2">
               {`${formatNumber(conversionRate?.percent || 0,0)} %`}
            </Col>           
          </Row>
          <Row className="mt-1 mb-1" type="flex" justify="end">
            <small style={{ color: 'gray'}}>{`* Quantidade de negócios ganhos no período (${conversionRate?.quantityWon || 0}) / quantidade de negócios criados no período (${conversionRate?.quantityCreated || 0})`}</small>
          </Row>
        </div>        
      )}
    </React.Fragment>      
  )
}

ProposalDetailModalFooter.propTypes = {
  proposalDetail: PropTypes.array,
  proposalDetailType: PropTypes.string,
  proposalDetailParams: PropTypes.any,
}

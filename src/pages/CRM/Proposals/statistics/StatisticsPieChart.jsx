/* eslint-disable no-underscore-dangle */
import React from 'react'
import { Chart, Geom, Axis, Tooltip, Label, Coord, Guide } from 'bizcharts'
import { formatNumber, addBrlCurrencyToNumber } from '@utils'
import PropTypes from 'prop-types'
import { Row, Col, Tooltip as TooltipAntd } from 'antd'

const { Html } = Guide

const chartTop = 10
const chartRight = 10
const chartBottom = 10
const chartLeft = 10

const scale = {
  percent: {
    min: 0,
    // max: scaleMax,
    formatter: val => `${formatNumber(val*100,2)}%`
  },
}

function StatisticsPieChart (props) {
  
  const { data, chartHeight, openProposals, valueType } = props

  const getColor = (color) => {
    return color
  }      

  return (
    <Row gutter={12} type="flex" justify="center" align="middle">
      <Col>
        <Chart
          height={chartHeight}
          padding={{ top: chartTop, right: chartRight, bottom: chartBottom, left: chartLeft }}
          forceFit
          data={data.data}
          scale={scale}
          onPlotDblClick={evt => {
                if (evt.data != null)
                {
                   try {
                     openProposals(data.index, evt.data._origin.id, evt.data._origin.type)
                   }
                   catch {}
                }
              }}
        >

         <Coord type="theta" radius={.73} innerRadius={0.6} />

          <Axis name="percent" />
         
          <Tooltip showTitle={false} />
        
          <Guide>
            <Html
              position={["50%", "50%"]}
              html={`<h4>${valueType === 'quantity' ? formatNumber(data[valueType], 0) : `R$ ${  formatNumber(data[valueType], 2)}`}</h4>`}
              alignX="middle"
              alignY="middle"
            />
          </Guide>

          <Geom
            type="intervalStack"
            position={`${valueType}Percent`}
            color={data.hasColor ? ['color', getColor] : 'description'}
            tooltip={[
              `description*${valueType}`,
              (description, quantity) => {
                return {
                  name: description,
                  value: valueType === 'quantity' ? formatNumber(quantity, 0) : `R$ ${formatNumber(quantity,2)}`,
                };
              }
            ]}
          >
            <Label
              textStyle={{
                 fill: '#404040', // color of label text
                 fontSize: '12', // font size of label text
               }}
              content={[
                `description*${valueType}*${valueType}Percent`,
                (description, quantity, percent) => {
                  return `${valueType === 'quantity' ? formatNumber(quantity,0) : `R$ ${  formatNumber(quantity,2)}`} (${formatNumber(percent * 100, 1)}%)`;
                }
              ]}
            />
          </Geom>

        </Chart>
      </Col>
      <Col>
        <div style={{ maxHeight: chartHeight, overflowY: 'auto' }}>
          <div className="px-4">
            {data.data.map((d) => (
              <Row className="mb-2" type="flex">
                <Col>
                  <i className="fa fa-circle mr-2" style={{ color: d.color }} />
                </Col>
                <Col>
                 <TooltipAntd title={
                   <Row>
                    <Col>
                     {d.description}
                    </Col>
                    <Col>
                       <span className="mr-2">Quantidade:</span>
                       <span>{d.quantity}</span>
                    </Col>
                    <Col>
                       <span className="mr-2">Valor único:</span>
                       <span>{addBrlCurrencyToNumber(d.singleTotalAmount)}</span>
                    </Col>
                    <Col>
                       <span className="mr-2">Valor recorrente:</span>
                       <span>{addBrlCurrencyToNumber(d.recurringValue)}</span>
                    </Col>
                  </Row>}  
                 >                
                   <span
                     role="button"
                     className="flex cursor-pointer"
                     onClick={() => openProposals(data.index, d.id, d.type)}
                   >
                    <div style={{ width: '200px' }} className="truncate">
                      {d.description}
                    </div>    
                    <span className="ml-1">
                      {`${valueType === 'quantity' ? formatNumber(d[valueType],0) : addBrlCurrencyToNumber(d[valueType])} (${formatNumber(d[`${valueType  }Percent`] * 100,2)}%)`}
                    </span>  
                   </span>
                 </TooltipAntd>
                </Col>                  
              </Row>
            ))}
          </div>
        </div>  
      </Col>
    </Row>  
  )
  
}

StatisticsPieChart.propTypes = {
  data: PropTypes.array,
  chartHeight: PropTypes.number,
  openProposals: PropTypes.func,
  valueType: PropTypes.string,
}

export default StatisticsPieChart
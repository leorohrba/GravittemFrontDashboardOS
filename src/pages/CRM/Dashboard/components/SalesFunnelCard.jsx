/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react'
import { Card, Spin, Row, Col, Tooltip as TooltipAntd } from 'antd'
import { Chart, Geom, Axis, Tooltip, Coord, Guide } from 'bizcharts'
import { formatNumber, addBrlCurrencyToNumber } from '@utils'
import PropTypes from 'prop-types'

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

function SalesFunnelCard (props) {
  
  const { type, data, salesFunnelName, chartHeight, loading, openProposalDetail } = props

  const [chartData, setChartData] = useState([])
  const [totalQuantity, setTotalQuantity] = useState(0)

  useEffect(() => {
    const dataSource = []
    const total = data.reduce((accumulator, { quantity }) => accumulator + quantity ,0) || 0
    data.map((r) => {

      dataSource.push({
                       id: r.id,
                       description: r.description,
                       color: r.color,
                       uniqueValue: r.uniqueValue,
                       recurrenceValue: r.recurrenceValue,
                       locationValue: r.locationValue,
                       quantity: r.quantity,
                       icon: r.icon,
                       percent: total === 0 ? 0 : r.quantity / total,
                     })

        return true
    })
    setTotalQuantity(total)
    setChartData(dataSource)
  }, [data])
  
  const getColor = (color) => {
    return color
  }      

  return (
   <Spin spinning={loading} size="large">
      <Card 
        size="small"
        title={<Row type="flex" className="w-full">
                <TooltipAntd title="Relatório de negócios com data de criação conforme período selecionado">              
                  <h3>
                    {type === 'funnelStage' ? `Fases do funil: ${salesFunnelName || ''}` : 'Funil de vendas'}
                  </h3>
                </TooltipAntd>  
                <Col className="ml-auto primary-color">
                  <small>RELATÓRIO EM TEMPO REAL</small>
                </Col>
              </Row>
              }
      >
        <Row type="flex" align="middle" justify="center" gutter={12}>
          <Col span={12}>
            <Chart
              height={chartHeight}
              padding={{ top: chartTop, right: chartRight, bottom: chartBottom, left: chartLeft }}
              forceFit
              data={chartData}
              scale={scale}
              onPlotDblClick={evt => {
                    if (evt.data != null)
                    {
                       try {
                          openProposalDetail(type, evt.data._origin.id)
                       }
                       catch {}
                    }  
              }}
            >
             <Coord type="theta" radius={1} innerRadius={0.6} />

              <Axis name="percent" />
             
              <Tooltip showTitle={false} />
            
              <Guide>
                <Html
                  position={["50%", "50%"]}
                  html={`<div align="center"><span style="font-size: 250%">${totalQuantity}</span><br /><span style="color: gray;">${totalQuantity === 1 ? 'Negócio' : 'Negócios'}</span></div>`}
                  alignX="middle"
                  alignY="middle"
                />
              </Guide>

              <Geom
                type="intervalStack"
                position="percent"
                color={['color', getColor]}
                tooltip={[
                  "description*quantity*percent",
                  (description, quantity, percent) => {
                    return {
                      name: description,
                      value: `${formatNumber(quantity, 0)} (${formatNumber(100 * percent,2)}%)`,
                    };
                  }
                ]}
              />

            </Chart>
          </Col>
          <Col span={12}>
            {chartData.map((d) => (
              <Row className="mb-2" type="flex">
                <Col>
                  <i className="fa fa-circle mr-2" style={{ color: d.color }} />
                </Col>
                <Col style={{ display: d.icon ? 'flex' : 'none'}}>
                  <i className={`mr-2 fa ${d.icon} fa-fw mt-1`} style={{ color: '#3182ce' }} />
                </Col>
                <Col>
                 <TooltipAntd title={
                   <Row>
                    <Col>
                     {d.description}
                    </Col>
                    <Col>
                       <span className="mr-2">Valor único:</span>
                       <span>{addBrlCurrencyToNumber(d.uniqueValue)}</span>
                    </Col>
                    <Col>
                       <span className="mr-2">Valor recorrente:</span>
                       <span>{addBrlCurrencyToNumber(d.recurrenceValue)}</span>
                    </Col>
                  </Row>}  
                 >                
                   <span
                     role="button"
                     className="flex cursor-pointer"
                     onClick={() => openProposalDetail(type, d.id)}
                   >
                    <div style={{ maxWidth: '140px' }} className="truncate">
                      {d.description}
                    </div>    
                    <span className="ml-1">
                      {`- ${d.quantity} (${formatNumber(d.percent * 100,2)}%)`}
                    </span>  
                   </span>
                 </TooltipAntd>
                </Col>                  
              </Row>
            ))}
          </Col>
        </Row>            
              
      </Card>
    </Spin>  
  )
  
}

SalesFunnelCard.propTypes = {
  type: PropTypes.string,
  data: PropTypes.array,
  openProposalDetail: PropTypes.func,
  chartHeight: PropTypes.number,
  loading: PropTypes.bool,
  salesFunnelName: PropTypes.string,
}

export default SalesFunnelCard
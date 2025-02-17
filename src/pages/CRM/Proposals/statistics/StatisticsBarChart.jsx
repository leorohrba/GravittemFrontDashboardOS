/* eslint-disable no-underscore-dangle */
import React from 'react'
import { Chart, Geom, Axis, Tooltip, Label, Coord } from 'bizcharts'
import { formatNumber } from '@utils'
import PropTypes from 'prop-types'

const chartTopH = 10
const chartRightH = 80
const chartBottomH = 50
const chartLeftH = 170

const chartTop = 40
const chartRight = 60
const chartBottom = 70
const chartLeft = 85

const maxLengthAxisLabel = 30 // número de caracteres para aparecer no label do eixo x

const scale = {
  quantity: {
    min: 0,
    // max: scaleMax,
    formatter: val => formatNumber(val,0),
  },
  singleTotalAmount: {
    min: 0,
    // max: scaleMax,
    formatter: val => `R$ ${formatNumber(val,0)}`,
  },
  recurringValue: {
    min: 0,
    // max: scaleMax,
    formatter: val => `R$ ${formatNumber(val,0)}`,
  },
}

function StatisticsBarChart (props) {
  
  const { data, isHorizontal, chartHeight, openProposals, valueType } = props

  const getColor = (color) => {
    return '#63b3ed' // color
  }      
  
  return (
      <Chart
        height={chartHeight}
        padding={{ top: isHorizontal ? chartTopH : chartTop, 
                   right: isHorizontal ? chartRightH : chartRight, 
                   bottom: isHorizontal ? chartBottomH : chartBottom, 
                   left: isHorizontal ? chartLeftH : chartLeft 
                 }}
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
        {isHorizontal && (<Coord transpose />)}
        
        <Axis
          name="description" 
          visible
          label={{autoRotate: true, 
                   formatter(text, item, index) {
                       return text && text.length > maxLengthAxisLabel ?
                              `${text.substr(0,maxLengthAxisLabel)}...`:
                              text
                    },
                 }}
        />

        <Tooltip showTitle={false} />
      
        <Geom
          type="interval"
          color={['color', getColor]}
          position={`description*${valueType}`}
          tooltip={[
            `description*${valueType}`,
            (description, quantity) => {
              return {
                name: description,
                value: valueType === 'quantity' ? formatNumber(quantity, 0) : `R$ ${formatNumber(quantity, 2)}`,
              };
            }
          ]}
        >
          {(valueType === 'quantity' || data.data.length <= 20) && (
            <Label
              content={[
                `description*${valueType}`,
                (description, quantity) => {
                  return valueType === 'quantity' ? formatNumber(quantity, 0) : `R$ ${formatNumber(quantity, 2)}`
                }
              ]}
            />
          )}
        </Geom>

      </Chart>
  )
  
}

StatisticsBarChart.propTypes = {
  data: PropTypes.array,
  isHorizontal: PropTypes.bool,
  openProposals: PropTypes.func,
  chartHeight: PropTypes.number,
  valueType: PropTypes.string,
}

export default StatisticsBarChart
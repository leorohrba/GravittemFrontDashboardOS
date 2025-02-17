import React  from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Select } from 'antd'
import StatisticsBarChart from './StatisticsBarChart'
import StatisticsPieChart from './StatisticsPieChart'

const colorEnabled = '#1976d2'
const colorDisabled = 'gray'
const chartHeightBar = 335
const chartHeightPie = 300
const { Option } = Select 

function StatisticsContent(props) {
  
  const { data, chartType, setChartType, openProposals, setValueType, valueType } = props
  
  return (
   <div>
     <Row type="flex" className="mb-2">
        <Col>
          <h3>{data.chartDescription}</h3>
        </Col>  
        <Col style={{ marginLeft: 'auto' }}>
          <Select style={{ width: '150px' }} className="mr-2" size="small" value={valueType} onChange={(value) => setValueType(value)}>
            <Option value="quantity">Quantidade</Option>
            <Option value="singleTotalAmount">Valor único</Option>
            <Option value="recurringValue">Valor recorrente</Option>
          </Select>
        </Col>
        <Col>      
          <i
            role="button"
            className="ml-2 fa fa-bar-chart fa-lg cursor-pointer"
            style={{ color: chartType === 'VB' ? colorEnabled : colorDisabled}}
            onClick={() => setChartType('VB')}
          />  
        </Col>
        <Col>
          <i
            role="button"
            className="ml-2 fa fa-bar-chart fa-rotate-90 fa-lg cursor-pointer"
            style={{ color: chartType === 'HB' ? colorEnabled : colorDisabled}}
            onClick={() => setChartType('HB')}
          />  
        </Col>
        <Col>
          <i
            role="button"
            className="ml-2 fa fa-pie-chart fa-lg cursor-pointer"
            style={{ color: chartType === 'P' ? colorEnabled : colorDisabled}}
            onClick={() => setChartType('P')}
          />  
        </Col>
     </Row>
     {chartType === 'P' ? (
        <StatisticsPieChart
          data={data}
          chartHeight={chartHeightPie}
          openProposals={openProposals}
          valueType={valueType}
        />
       ) : (  
        <StatisticsBarChart
          data={data}
          chartHeight={chartHeightBar}
          isHorizontal={chartType === 'HB'}
          openProposals={openProposals}
          valueType={valueType}
        />
     )}  
   </div>
  )
  
}

StatisticsContent.propTypes = {
  data: PropTypes.any,
  chartType: PropTypes.string,
  setChartType: PropTypes.func,
  openProposals: PropTypes.func,
  setValueType: PropTypes.func,
  valueType: PropTypes.string,
}

export default StatisticsContent
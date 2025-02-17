import React from 'react'
import DefaultTable from '@components/DefaultTable'
import { Card, Spin, Tooltip, Row, Col } from 'antd'
import { addBrlCurrencyToNumber } from '@utils'
import PropTypes from 'prop-types'

export default function LossReasonCard ({ loading, proposalLossReason, openProposalDetail }) {
  
  const columns = [
    {
      title: (<Tooltip title='Negócios perdidos com data de fechamento conforme período selecionado'>
                 Principais motivo de perda
              </Tooltip>),
      dataIndex: 'lossReasonName',
      render: (text, d) => (
         <span
           role="button"
           className="cursor-pointer"
           onClick={() => openProposalDetail('lossReason',d.lossReasonId)}
         >
          {text}
         </span>),
    },
    {
      dataIndex: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
      render: (text, d) => (
          <Tooltip title={<Row>
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
             className="cursor-pointer"
             onClick={() => openProposalDetail('lossReason',d.lossReasonId)}
           >
            {text}
           </span>
          </Tooltip>           
      )
    },
  ]

  return (
  <Spin spinning={loading}>  
    <Card>
      <DefaultTable
        size="small"
        rowKey={record => record.lossReasonId}
        columns={columns}
        dataSource={proposalLossReason}
        pagination={false}
      />
    </Card>
  </Spin>  
  )
}

LossReasonCard.propTypes = {
  loading: PropTypes.bool,
  proposalLossReason: PropTypes.array, 
  openProposalDetail: PropTypes.func,
}

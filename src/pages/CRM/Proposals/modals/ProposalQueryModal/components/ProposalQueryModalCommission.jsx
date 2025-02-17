import { Row, Col, Card, Tag } from 'antd'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import ProposalQueryModalCommissionTotalCard from './ProposalQueryModalCommissionTotalCard'
import ProposalQueryModalField from './ProposalQueryModalField'
import { addBrlCurrencyToNumber, formatNumber } from '@utils'
import DefaultTable from '@components/DefaultTable'
import moment from 'moment'

const spaceWidth = 1
const quantityCards = 4
const colWidth = (100 - (spaceWidth * (quantityCards - 1))) / quantityCards
const gutter = 12

export default function ProposalQueryModalCommission({
  commissions,
}) {
  
  const columns = [
    {
      title: 'Mês/ano',
      dataIndex: 'referenceDate',
      render: (text, record) => (
           <div>
             {record.referenceDate && (
               <React.Fragment>
                 <span>
                    {moment(record.referenceDate).format('MMM/YYYY')}
                    {record.royaltyType === 5 && record.recurrenceNumber && (
                      <span className="ml-2" style={{ color: 'gray'}}>
                        {`(${record.recurrenceNumber})`}
                      </span>               
                    )}  
                 </span>
                 <span className="ml-4">
                  {record.state === 2 ? (
                    <Tag color="green">Pago</Tag>
                    ) : (
                    <Tag>Pendente</Tag>
                  )}
                 </span> 
               </React.Fragment>
             )}
           </div>
         ),           
    },
    {
      title: 'Marketing',
      dataIndex: 'marketingValue',
      render: (text, record) => addBrlCurrencyToNumber(text)
    },
    {
      title: 'Comissão',
      dataIndex: 'commissionValue',
      render: (text, record) => addBrlCurrencyToNumber(text)
    },
  ]
  
  const [totalCommission, setTotalCommission] = useState(0)
  const [totalMarketing, setTotalMarketing] = useState(0)  
  const [commission, setCommission] = useState(null)
  
  useEffect(() => {
    setCommission(commissions.find(x => x.state === 1) || commissions[commissions.length - 1])
    setTotalCommission(commissions.reduce((sum, { commissionValue }) => sum + commissionValue,0))
    setTotalMarketing(commissions.reduce((sum, { marketingValue }) => sum + marketingValue,0))
  },[commissions])  
  
  return (
  <Card
    title={<div>
            <span style={{fontSize: '16px'}}>
              Comissionamento e marketing
            </span>
           </div>
          }
    className="mt-4 px-2 py-2"
    size="small"
  >
   {commission && (
    <React.Fragment>
      <Row className="mt-2 w-full mb-4" type="flex">
       <Col style={{width: `${colWidth}%`}}>
         <ProposalQueryModalCommissionTotalCard
           title="Valor dos produtos"
           grossValue={commission.grossProductValue}
           value={commission.productValue}
           percentDiscount={commission.percentDiscountProductAverage}
         />
       </Col>        
       <Col style={{width: `${colWidth}%`, marginLeft: `${spaceWidth}%`}}>
         <ProposalQueryModalCommissionTotalCard
           title="Valor dos serviços"
           grossValue={commission.grossServiceValue}
           value={commission.serviceValue}
           percentDiscount={commission.percentDiscountServiceAverage}
         />
       </Col>        
       <Col style={{width: `${colWidth}%`, marginLeft: `${spaceWidth}%`}}>
         <ProposalQueryModalCommissionTotalCard
           title="Valor total"
           grossValue={commission.grossTotalValue}
           value={commission.totalValue}
           percentDiscount={commission.percentDiscountTotalAverage}
         />
       </Col>        
       <Col style={{width: `${colWidth}%`, marginLeft: `${spaceWidth}%`}}>
         <ProposalQueryModalCommissionTotalCard
           title="Valor das recorrências"
           grossValue={commission.grossRecurrenceValue}
           value={commission.recurrenceValue}
           percentDiscount={commission.percentDiscountRecurrenceAverage}
         />
       </Col>        
      </Row>
      <Row type="flex">
        <Col>
          <span className="mr-2"><b>Método de cobrança: </b></span>
        </Col>
        <Col>
         {commission.commissionTypeDescription &&
            (<div>
               <span>{commission.commissionTypeDescription}</span>               
               {commission.royaltyType === 5 && (
                 <span className="ml-2">
                    {commission.recurrenceQuantity === 0 ? 
                     '(Não há recorrências)' :
                     commission.recurrenceQuantity === 1 ?
                     '(1 recorrência)' :
                     `(${commission.recurrenceQuantity} recorrências)`
                     }
                 </span> 
               )}
            </div>
         )}
        </Col>  
      </Row>
      <Row type="flex" className="mt-4" gutter={16} align="center">
        <Col style={{ width: '50%'}}>
          <Card title="Marketing" size="small">
            <Row type="flex" gutter={gutter}>
              <ProposalQueryModalField 
                label="Base de cálculo:" 
                value={addBrlCurrencyToNumber(commission.baseMarketingValue)}
                width="150"
              />          
              <ProposalQueryModalField 
                label="Percentual:" 
                value={`${formatNumber(commission.marketingPercentage,2)}%`}
                width="100"
              />          
              <ProposalQueryModalField 
                label="Valor:" 
                value={addBrlCurrencyToNumber(commission.marketingValue)}
                width="140"
              />          
              </Row>
          </Card>
        </Col>
        <Col style={{ width: '50%'}}>
          <Card title="Comissão" size="small">
            <Row type="flex" gutter={gutter}>
              <ProposalQueryModalField 
                label="Base de cálculo:" 
                value={addBrlCurrencyToNumber(commission.baseCommissionValue)}
                width="150"
              />          
              <ProposalQueryModalField 
                label="Percentual:" 
                value={`${formatNumber(commission.commissionPercentage,2)}%`}
                width="100"
              />          
              <ProposalQueryModalField 
                label="Valor:" 
                value={addBrlCurrencyToNumber(commission.commissionValue)}
                width="140"
              />   
            </Row>
          </Card>  
        </Col>      
      </Row>
      <Row className="w-2/3">
        <DefaultTable
          className="mt-5"
          size="small"
          rowKey={record => record.referenceDate}
          columns={columns}
          dataSource={commissions}
          pagination={false}
        />      
        <div className="mt-4">
          <div className="text-base text-right">
            <div>
              <span>
                Total de marketing:
                <b className="ml-2">
                  {addBrlCurrencyToNumber(totalMarketing)}
                </b>
              </span>
            </div>
            <div>
              <span>
                Total de comissão:
                <b className="ml-2">
                  {addBrlCurrencyToNumber(totalCommission)}
                </b>
              </span>
            </div>
          </div>
        </div>
      </Row>
    </React.Fragment> 
   )}
  </Card>  

  )
}

ProposalQueryModalCommission.propTypes = {
  commissions: PropTypes.array,
}

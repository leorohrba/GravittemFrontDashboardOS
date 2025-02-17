import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { Tag, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import moment from 'moment'
import { formatNumber } from 'umi-plugin-react/locale'
import CommissioningFranchiseeReportTableDetail from './CommissioningFranchiseeReportTableDetail'
import { formatNumber as customFormatNumber } from '@utils'

export default function CommissioningFranchiseeReportTable({ reportData, getProposal }) {
  
  const columns = [
    {
      title: 'Período',
      key: 'referenceDate',
      render: record => (
           <Tooltip title={record.proposalCommission.length === 1 ?
                           '1 negócio' : 
                           `${record.proposalCommission.length} negócios`
                           }
           >
             {record.referenceDate ? moment(record.referenceDate).format('MMMM') : ''}
           </Tooltip>  
           ),
    },
    {
      title: 'Método de cobrança',
      key: 'commissionTypeDescription',
      render: record => (
        <p className="mb-0">
          {record.commissionTypeDescription}
          {record.royaltyType === 5 && (
             <React.Fragment>
               <br />
               <SmallTableFieldDescription
                 color="gray"
                 label={record.recurrenceQuantity === 0 ? 
                        'Quantidade de recorrências não definida' :
                        record.recurrenceQuantity === 1 ?
                        '1 recorrência' :
                        `${record.recurrenceQuantity} recorrências`
                       }
                 fontStyle="italic"
               />
             </React.Fragment>  
          )}
        </p>
      ),
    },
    {
      title: 'Faturamento bruto',
      key: 'grossBilling',
      render: record =>
        `${formatNumber(record.grossBilling, {
          style: 'currency',
          currency: 'BRL',
        })}`,
    },
    {
      title: 'Marketing',
      key: 'marketingValue',
      render: record => (
        <Tooltip
          title={
              `Base de cálculo: ${
            formatNumber(record.baseMarketingValue, {
                         style: 'currency',
                         currency: 'BRL',
                        })
            }`}
        >                 
          <p className="mb-0">
            {formatNumber(record.marketingValue, {
              style: 'currency',
              currency: 'BRL',
            })}
            {!!record.marketingValue && (
             <React.Fragment>
               <br />
               <SmallTableFieldDescription
                 color="gray"
                 label={`${customFormatNumber(record.marketingPercentage,2)}%`}
                 fontStyle="italic"
               />
             </React.Fragment>
            )}           
          </p>
        </Tooltip>  
      ),
    },
    {
      title: 'Comissão',
      key: 'commissionValue',
      render: record => (
        <Tooltip
          title={
              `Base de cálculo: ${
            formatNumber(record.baseCommissionValue, {
                         style: 'currency',
                         currency: 'BRL',
                        })
            }`}
        >                 
          <p className="mb-0">
            {formatNumber(record.commissionValue, {
              style: 'currency',
              currency: 'BRL',
            })}
            {!!record.commissionValue && (
             <React.Fragment>
               <br />
               <SmallTableFieldDescription
                 color="gray"
                 label={`${customFormatNumber(record.commissionPercentage,2)}%`}
                 fontStyle="italic"
               />
             </React.Fragment>
            )}           
          </p>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: record =>
       <React.Fragment>
        {record.state && (
          <React.Fragment>
            {record.state === 2 ? (
              <Tag color="green">Pago</Tag>
              ) : (
              <Tag>Pendente</Tag>
            )}
          </React.Fragment>
        )}  
       </React.Fragment> 
    },
  ]
  
  return (
    <React.Fragment>
      <DefaultTable
        rowKey={record => record.referenceDate}
        className="mt-5"
        columns={columns}
        expandedRowRender={record => 
                          <CommissioningFranchiseeReportTableDetail
                            proposals={record.proposalCommission}
                            getProposal={getProposal}
                          />
                          }
        dataSource={reportData}
      />
    </React.Fragment>
  )
}

CommissioningFranchiseeReportTable.propTypes = {
  reportData: PropTypes.array,
  getProposal: PropTypes.func,
}

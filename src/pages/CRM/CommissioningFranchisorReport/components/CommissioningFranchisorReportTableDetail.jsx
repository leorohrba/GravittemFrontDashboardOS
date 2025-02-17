import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import React from 'react'
import { Tooltip, Button } from 'antd'
import { formatNumber } from 'umi-plugin-react/locale'
import { formatNumber as customFormatNumber, customSort } from '@utils'
import PropTypes from 'prop-types'
import moment from 'moment'

const CommissioningFranchisorReportTableDetail = (props) => {
  
  const { proposals, getProposal } = props
  
  const columns = [
    {
      title: 'N° negócio',
      key: 'number',
      dataIndex: 'number',
      sorter: (a, b) => a.number - b.number,
      render: (text, record) => (
          <Tooltip title={record.companyShortName}>
              {record.number}
          </Tooltip>
          ),
    },
    {
      title: 'Fechamento',
      key: 'closedDate',
      dataIndex: 'closedDate',
      sorter: (a, b) => customSort(a.closedDate, b.closedDate),
      render: (text, record) => record.closedDate ? moment(record.closedDate).format('DD/MM/YYYY') : '',
    },
    {
      title: 'Valor de recorrência',
      key: 'recurrenceValue',
      sorter: (a, b) => a.recurrenceValue - b.recurrenceValue,
      render: record =>
       (
       <React.Fragment>
         {!!record.recurrenceValue && (
          <span>
            {formatNumber(record.recurrenceValue, {
              style: 'currency',
              currency: 'BRL',
            })}
            {!!record.recurrenceNumber && (
              <React.Fragment>
                <br />
                <SmallTableFieldDescription
                  color="gray"
                  label={`Recorrência nº ${record.recurrenceNumber}`}
                  fontStyle="italic"
                />
              </React.Fragment>
            )}            
          </span>      
         )}
       </React.Fragment>
       ),
    },
    {
      title: 'Valor do produto',
      key: 'productValue',
      sorter: (a, b) => a.productValue - b.productValue,
      render: record =>
        record.productValue ?
        formatNumber(record.productValue, {
          style: 'currency',
          currency: 'BRL',
        })
        : ''
    },
    {
      title: 'Valor do serviço',
      key: 'serviceValue',
      sorter: (a, b) => a.serviceValue - b.serviceValue,
      render: record => 
         record.serviceValue ?
         formatNumber(record.serviceValue, {
            style: 'currency',
            currency: 'BRL',
          })
          : ''
    },
    {
      title: 'Valor total',
      key: 'totalValue',
      sorter: (a, b) => a.totalValue - b.totalValue,
      render: record => 
         record.totalValue ?
         formatNumber(record.totalValue, {
            style: 'currency',
            currency: 'BRL',
          })
          : '',
    },
    {
      title: 'Marketing',
      key: 'marketingValue',
      sorter: (a, b) => a.marketingValue - b.marketingValue,
      render: record =>
       (
        <Tooltip
          title={
              `Base de cálculo: ${
            formatNumber(record.baseMarketingValue, {
                         style: 'currency',
                         currency: 'BRL',
                        })
            }`}
        >                 
          <span>
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
          </span>
        </Tooltip>          
       ),
    },
    {
      title: 'Rebate',
      key: 'commissionValue',
      sorter: (a, b) => a.commissionValue - b.commissionValue,
      render: record =>
       (
        <Tooltip
          title={
              `Base de cálculo: ${
            formatNumber(record.baseCommissionValue, {
                         style: 'currency',
                         currency: 'BRL',
                        })
            }`}
        >                 
          <span>
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
          </span>
        </Tooltip>          
       ),
    },
    {
      title: 'Recorrência líquida',
      key: 'finalRecurrenceValue',
      sorter: (a, b) => a.finalRecurrenceValue - b.finalRecurrenceValue,
      render: record => 
         record.finalRecurrenceValue ?
         formatNumber(record.finalRecurrenceValue, {
            style: 'currency',
            currency: 'BRL',
          })
          : '',
    },    
    {
      title: '',
      key: 'operation',
      width: 90,
      align: 'center',
      render: (text, record) => (
        <Tooltip placement="top" title="Consultar negócio">
          <Button
            shape="circle"
            size="default"
            type="primary"
            ghost
            onClick={() => getProposal(record.proposalId)}
            className="iconButton"
          >
            <i className="fa fa-search fa-lg" />
          </Button>
        </Tooltip>
      ),
    },
    
  ]

  return (
    <DefaultTable
      rowKey={record => record.proposalId}
      columns={columns}
      dataSource={proposals}
      pagination={false}
    />
  )
}

CommissioningFranchisorReportTableDetail.propTypes = {
  proposals: PropTypes.array,
  getProposal: PropTypes.func,
}
export default CommissioningFranchisorReportTableDetail

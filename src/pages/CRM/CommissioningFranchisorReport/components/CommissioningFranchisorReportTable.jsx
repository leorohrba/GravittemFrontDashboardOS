import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
// import { Tag, Tooltip, Popover, Button } from 'antd'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import CommissioningFranchisorReportTableDetail from './CommissioningFranchisorReportTableDetail'
import { formatNumber as customFormatNumber } from '@utils'

export default function CommissioningFranchisorReportTable({ 
  reportData, 
  getProposal, 
  // userPermissions, 
  // setCommissionState, 
  // ownerProfile,
  // changeCommissionStateDisabled,
  keyTable,
  }) {

  // const [tooltipVisible, setTooltipVisible] = useState(false)
  // const [keyPopover, setKeyPopover] = useState(0)
  
  const columns = [
    {
      title: 'Franqueado',
      key: 'franchiseeName',
      render: record => (
           <Tooltip title={record.proposalCommission.length === 1 ?
                           '1 negócio' : 
                           `${record.proposalCommission.length} negócios`
                           }
           >
             {record.franchiseeName}
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
      title: 'Total recorrência',
      key: 'recurrenceValue',
      render: record =>
        `${formatNumber(record.recurrenceValue, {
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
      title: 'Rebate',
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
      title: 'Recorrência líquida',
      key: 'finalRecurrenceValue',
      render: record =>
        <div>
          <p className="mb-0">
            {`${formatNumber(record.finalRecurrenceValue, {
              style: 'currency',
              currency: 'BRL',
            })}`}
          </p>
        </div>
    },
    /*
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
    {
      title: '',
      key: 'operation',
      width: '90',
      render: record =>
        <React.Fragment>
          {!changeCommissionStateDisabled && record.state && hasPermission(userPermissions, 'Alter') && ownerProfile === 'Franchisor' && (
            <Tooltip placement="top" title="Opções">
              <Popover
                placement="bottomLeft"
                visible={tooltipVisible && keyPopover === record.franchiseeId}
                onVisibleChange={visible => handleVisibleChange(visible, record.franchiseeId)}          
                overlayClassName="table-popover"
                trigger="click"
                content={
                   <button
                     className="popover-button"
                     type="button"
                     onClick={event => {
                        setTooltipVisible(false)
                        setCommissionState(record.franchiseeId, record.state)
                     }}
                   >
                    {record.state === 1 ? 'Marcar como pago' : 'Marcar como pendente'}
                   </button>
                  }
              >
                <Button
                  className="iconButton"
                >
                  <i className="fa fa-ellipsis-v fa-lg" style={{color: 'gray'}} />
                </Button>
              </Popover>
            </Tooltip>
          )} 
        </React.Fragment>   
    },
    */
  ]

  /*
  const handleVisibleChange = (visible, key) => {
    setTooltipVisible(visible)
    setKeyPopover(key)
  }
  */

  return (
    <React.Fragment>
      <DefaultTable
        rowKey={record => record.franchiseeId}
        className="mt-5"
        columns={columns}
        key={keyTable}
        expandedRowRender={record => 
                          <CommissioningFranchisorReportTableDetail
                            proposals={record.proposalCommission}
                            getProposal={getProposal}
                          />
                          }
        dataSource={reportData}
        locale={{
          emptyText: (
            <div style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
              <i className="fa fa-search fa-3x m-5" aria-hidden="true" />
              <h3 className="my-2">
                Faça uma pesquisa para requisitar os dados.
              </h3>
            </div>
          ),
        }}
      />
    </React.Fragment>
  )
}

CommissioningFranchisorReportTable.propTypes = {
  reportData: PropTypes.array,
  getProposal: PropTypes.func,
  userPermissions: PropTypes.array,
  setCommissionState: PropTypes.func,
  ownerProfile: PropTypes.string,
  changeCommissionStateDisabled: PropTypes.bool,
  keyTable: PropTypes.number,
}

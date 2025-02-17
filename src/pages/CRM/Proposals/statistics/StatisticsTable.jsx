import DefaultTable from '@components/DefaultTable'
import { customSort } from '@utils'
import { Tooltip, Row, Col } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatNumber } from 'umi-plugin-react/locale'

export default function StatisticsTable({
  data,
  userPermissions,
  editProposal,
  ownerProfile,
}) {
  const columns = [
    {
      title: 'Número',
      sorter: (a, b) => a.number - b.number,
      render: d => (
        <span
          role="button"
          className="cursor-pointer primary-color"
          onClick={() => editProposal(d.proposalId)}
        >
          {d.number}
        </span>
      ),
    },
    {
      title: 'Organização',
      dataIndex: 'companyShortName',
      sorter: (a, b) => customSort(a.companyShortName, b.companyShortName),
    },
    {
      title: 'Franqueado',
      dataIndex: 'franchiseeName',
      sorter: (a, b) => customSort(a.franchiseeName, b.franchiseeName),
    },
    {
      title: 'Vendedor',
      dataIndex: 'sellerName',
      sorter: (a, b) => customSort(a.sellerName, b.sellerName),
    },
    {
      title: 'Valores',
      dataIndex: 'singleTotalAmount',
      sorter: (a, b) => a.singleTotalAmount - b.singleTotalAmount,
      render: (text, record) => (
        <span>
          <Tooltip
            placement="right"
            title={
              <div>
                <p className="mb-0">{`Valor único: ${formatNumber(
                  record.singleTotalAmount,
                  {
                    style: 'currency',
                    currency: 'BRL',
                  },
                )}`}</p>
                <p className="mb-0">{`Recorrência: ${formatNumber(
                  record.recurringValue,
                  {
                    style: 'currency',
                    currency: 'BRL',
                  },
                )}`}</p>
              </div>
            }
          >
            <p className="mb-0">
              {formatNumber(record.singleTotalAmount, {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
            <small style={{ color: 'gray', fontStyle: 'italic' }}>
              {formatNumber(record.recurringValue, {
                style: 'currency',
                currency: 'BRL',
              })}
            </small>
          </Tooltip>
        </span>
      ),
    },
  ]

  // Fazer cópia das colunas 'default' para 'franchisees'
  const standardColumns = columns.map(a => {
    const newObject = {}
    Object.keys(a).forEach(propertyKey => {
      newObject[propertyKey] = a[propertyKey]
    })
    return newObject
  })

  const index = standardColumns.findIndex(x => x.dataIndex === 'franchiseeName')
  if (index >= 0) {
    standardColumns.splice(index, 1)
  }

  return (
    <React.Fragment>
      <DefaultTable
        size="small"
        dataSource={data}
        columns={ownerProfile === 'Standard' ? standardColumns : columns}
        rowKey={record => record.id}
      />
      <div className="px-2">
        <Row type="flex">
          <Col className="ml-auto">
            Total de recorrência:
            <b className="ml-2">
              {formatNumber(
                data.reduce(
                  (sum, { recurringValue }) => sum + recurringValue,
                  0,
                ),
                {
                  style: 'currency',
                  currency: 'BRL',
                },
              )}
            </b>
          </Col>
        </Row>
        <Row type="flex">
          <Col className="ml-auto">
            Total único:
            <b className="ml-2">
              {formatNumber(
                data.reduce(
                  (sum, { singleTotalAmount }) => sum + singleTotalAmount,
                  0,
                ),
                {
                  style: 'currency',
                  currency: 'BRL',
                },
              )}
            </b>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  )
}

StatisticsTable.propTypes = {
  data: PropTypes.array,
  userPermissions: PropTypes.array,
  editProposal: PropTypes.func,
  ownerProfile: PropTypes.string,
}

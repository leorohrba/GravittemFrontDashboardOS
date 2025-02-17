import DefaultTable from '@components/DefaultTable'
import PropTypes from 'prop-types'
import React from 'react'
import { addBrlCurrencyToNumber, formatNumber } from '@utils'

export default function ProposalQueryModalItems({
  items
}) {
  
  const columns = [
    {
      title: 'Produtos ou serviços',
      dataIndex: 'itemName',
      width: '34%', // 350,
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      width: '10%', // 100,
      render: type => {
        return type === 'Product' ? 'Produto' : 'Serviço'
      },
    },
    {
      title: 'Quantidade',
      dataIndex: 'quantity',
      width: '12%', // 120,
      render: quantity => {
        return `${quantity} un`
      },
    },
    {
      title: 'Desconto',
      width: '12%', // 120,
      dataIndex: 'percentDiscount',
      render: percentDiscount => {
        return percentDiscount ? `${formatNumber(percentDiscount, 2)}%` : ''
      },
    },
    {
      title: 'Valores',
      width: '12%', // 120,
      dataIndex: 'unitValue',
      render: (text, record) => (
        <span>
          <p className="m-0">{addBrlCurrencyToNumber(text)}</p>
          <p
            className="m-0"
            style={{
              fontSize: 'small',
              color: 'gray',
              fontStyle: 'italic',
            }}
          >
            {addBrlCurrencyToNumber(record.totalValue)}
          </p>
        </span>
      ),
    },
    {
      title: 'Recorrência',
      width: '12%', // 100,
      dataIndex: 'isRecurrence',
      render: bool => (bool === true ? 'Recorrente' : 'Único'),
    },
  ]

  return (
    <DefaultTable
      className="mt-4"
      size="small"
      rowKey={record => record.proposalItemId}
      columns={columns}
      dataSource={items}
      pagination={false}
    />
  )
}

ProposalQueryModalItems.propTypes = {
  items: PropTypes.array,
}

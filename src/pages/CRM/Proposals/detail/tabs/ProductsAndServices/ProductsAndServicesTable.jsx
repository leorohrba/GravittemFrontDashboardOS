import Button from '@components/Button'
import DefaultTable from '@components/DefaultTable'
import { addBrlCurrencyToNumber, customSort, formatNumber } from '@utils'
import { Col, Modal, Row, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function ProductsAndServicesTable({
  rowSelection,
  productsAndServicesData,
  loading,
  canAlter,
  editItem,
  profitPercent,
  owner,
}) {
  const columns = [
    {
      title: 'Nome',
      dataIndex: 'itemName',
      width: '34%', // 350,
      sorter: (a, b) => customSort(a.itemName, b.itemName),
    },
    {
      title: 'Identificador',
      dataIndex: 'identifier',
      width: '6%', // 100,
      render: identifier => identifier,
      sorter: (a, b) => customSort(a.identifier, b.identifier),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      width: '6%', // 100,
      render: type => (type === 'Product' ? 'Produto' : 'Serviço'),
      sorter: (a, b) => customSort(a.type, b.type),
    },
    {
      title: 'Categoria',
      dataIndex: 'materialTypeDescription',
      width: '7%', // 100,
      sorter: (a, b) =>
        customSort(a.materialTypeDescription, b.materialTypeDescription),
    },
    {
      title: 'Quantidade',
      dataIndex: 'quantity',
      width: '12%', // 120,
      render: (quantity, record) =>
        `${quantity} ${record.unMedida ? record.unMedida : ''}`,
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: '% de desconto',
      width: '12%', // 120,
      dataIndex: 'percentDiscount',
      render: percentDiscount =>
        percentDiscount ? `${formatNumber(percentDiscount, 2)}%` : '',
      sorter: (a, b) => a.percentDiscount - b.percentDiscount,
    },
    {
      title: 'Valor de desconto',
      width: '12%', // 120,
      dataIndex: 'discountValue',
      render: discountValue =>
        discountValue ? addBrlCurrencyToNumber(discountValue) : '',
      sorter: (a, b) => a.discountValue - b.discountValue,
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
          {!!record.profitValue && (
            <p
              className="m-0"
              style={{
                fontSize: 'small',
                color: 'gray',
                fontStyle: 'italic',
              }}
            >
              {`Lucro: ${addBrlCurrencyToNumber(record.profitValue)}`}
            </p>
          )}
        </span>
      ),
      sorter: (a, b) => a.unitValue - b.unitValue,
    },
    {
      title: 'Recorrência',
      width: '10%', // 100,
      dataIndex: 'isRecurrence',
      sorter: (a, b) => customSort(a.isRecurrence, b.isRecurrence),
      render: bool => (bool === true ? 'Recorrente' : 'Único'),
    },

    {
      title: '',
      key: 'operation',
      width: '10%', // 100,
      render: (text, record) => (
        <div className="flex">
          <Tooltip placement="top" title="Comentário">
            <Button
              onClick={e => info(e, record.note)}
              shape="circle"
              size="default"
              data-testid="commentButton"
              type="primary"
              ghost
              className="iconButton ml-2"
            >
              <i className="fa fa-comment fa-lg" />
            </Button>
          </Tooltip>
          <Tooltip placement="top" title={!canAlter ? 'Consultar' : 'Editar'}>
            <Button
              shape="circle"
              size="default"
              type="primary"
              data-testid="editButton"
              ghost
              onClick={e => editProposalItem(e, record.proposalItemId)}
              className="iconButton ml-2"
            >
              <i
                className={`fa ${!canAlter ? 'fa-search' : 'fa-pencil'} fa-lg`}
              />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ]

  // Fazer cópia das colunas
  const standardColumns = columns.map(a => {
    const newObject = {}
    Object.keys(a).forEach(propertyKey => {
      newObject[propertyKey] = a[propertyKey]
    })
    return newObject
  })
  standardColumns.splice(1, 1) // elimina a coluna do identificador

  const editProposalItem = (e, id) => {
    e.preventDefault()
    editItem(id)
  }

  return (
    <DefaultTable
      className="mt-5"
      rowKey={record => record.proposalItemId}
      rowSelection={rowSelection}
      columns={owner?.ownerProfile === 'Standard' ? standardColumns : columns}
      loading={loading}
      dataSource={productsAndServicesData}
    />
  )
}
const info = (e, comment) => {
  e.preventDefault()
  const notes = comment ? comment.split('\n') : []
  Modal.info({
    title: 'Comentários sobre o item',
    okText: 'Voltar',
    content: (
      <React.Fragment>
        {notes.map((note, index) => (
          <Row key={index}>
            <Col>{note && <React.Fragment>{note}</React.Fragment>}</Col>
          </Row>
        ))}
      </React.Fragment>
    ),
    onOk() {},
  })
}

ProductsAndServicesTable.propTypes = {
  productsAndServicesData: PropTypes.array,
  rowSelection: PropTypes.object,
  loading: PropTypes.bool,
  canAlter: PropTypes.bool,
  editItem: PropTypes.func,
  profitPercent: PropTypes.number,
  owner: PropTypes.any,
}

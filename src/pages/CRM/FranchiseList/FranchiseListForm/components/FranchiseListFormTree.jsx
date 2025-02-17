import { Form } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import TableTransfer from './TableTransfer'
import { customSort } from '@utils'

const leftTableColumns = [
  {
    dataIndex: 'name',
    title: 'Nome',
    sorter: (a, b) => customSort(a.name, b.name),
  },
  {
    dataIndex: 'city',
    title: 'Cidade',
    sorter: (a, b) => customSort(a.city, b.city),
  },
  {
    dataIndex: 'state',
    title: 'Estado',
    sorter: (a, b) => customSort(a.state, b.state),
  },
]
const rightTableColumns = [
  {
    dataIndex: 'name',
    title: 'Nome',
    sorter: (a, b) => customSort(a.name, b.name),
  },
  {
    dataIndex: 'city',
    title: 'Cidade',
    sorter: (a, b) => customSort(a.city, b.city),
  },
  {
    dataIndex: 'state',
    title: 'Estado',
    sorter: (a, b) => customSort(a.state, b.state),
  },
]

function FranchiseListFormTree({ form, franchiseData, initialFranchiseIds, disabled }) {
  const { getFieldDecorator } = form
  return (
    <div>
      <Form.Item>
        {getFieldDecorator('franchiseIds', {
          valuePropName: 'targetKeys',
          initialValue: initialFranchiseIds,
          rules: [
              {
                required: true,
                message: 'Informe pelo menos um contato para a lista!',
              },
            ],          
        })(
          <TableTransfer
            dataSource={franchiseData}
            disabled={disabled}
            locale={{
              itemUnit: 'contato',
              itemsUnit: 'contatos',
              searchPlaceholder: 'Pesquise um contato',
            }}
            titles={['Todos os contatos', 'Nova lista']}
            showSearch
            filterOption={(inputValue, item) =>
              item.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
            }
            leftColumns={leftTableColumns}
            rightColumns={rightTableColumns}
          />,
        )}
      </Form.Item>
    </div>
  )
}

FranchiseListFormTree.propTypes = {
  form: PropTypes.object,
  franchiseData: PropTypes.array,
  initialFranchiseIds: PropTypes.array,
  disabled: PropTypes.bool,
}

export default FranchiseListFormTree

import React from 'react'
import { Badge } from 'antd'
import { formatZipCode } from '../index'

const personAddressTableCol = (tiposEndereco) => {
  return (
    [
      {
        title: 'Tipo de endereço',
        dataIndex: 'typeId',
        render: (typeId, record) => (
          <div>
            {tiposEndereco?.find(tipo => tipo.id === typeId)?.nome ??
              'Indefinido'}
          </div>
        ),
        width: '11%',
      },
      {
        title: 'Endereço',
        dataIndex: 'name',
        render: (text, record) => (
          <span>
            <p className="m-0">
              {record.name}
              {record.number === '' || record.number === null
                ? ''
                : `, ${record.number}`}
              {record.neighborhood === '' || record.neighborhood === null
                ? ''
                : ` - ${record.neighborhood}`}
            </p>
            <p
              className="m-0"
              style={{
                fontSize: 'small',
                color: 'gray',
                fontStyle: 'italic',
              }}
            >
              {record.cityName}
              {record.cityName === null ? '' : ' - '}
              {record.stateAbbreviation}
              {record.zipCode === '' || record.zipCode === null
                ? ''
                : `, ${formatZipCode(record.zipCode)}`}
            </p>
          </span>
        ),
        width: '33%',
      },
      {
        title: 'Complemento',
        dataIndex: 'complement',
        width: '18%',
      },
      {
        title: 'Referência',
        dataIndex: 'locationReference',
        width: '18%',
      },
      {
        title: 'Status do endereço',
        dataIndex: 'isActive',
        render: (isActive, record) => (
          <span>
            <Badge
              status={isActive ? 'success' : 'error'}
              text={isActive ? 'Ativo' : 'Inativo'}
            />
          </span>
        ),
        width: '13%',
      },
    ]
  )
}

export default personAddressTableCol

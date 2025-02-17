import DefaultTable from '@components/DefaultTable'
import { getLocaleCurrency } from '@utils'
import PropTypes from 'prop-types'
import React from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import moment from 'moment'

export default function GenerateContractParcels({ parcelas }) {
  const columns = [
    {
      title: 'Número',
      dataIndex: 'numero',
    },
    {
      title: 'Vencimento',
      dataIndex: 'dataVencimento',
      render: (text, d) => d.dataVencimento ? moment(d.dataVencimento).format('DD/MM/YYYY') : null,
    },
    {
      title: 'Valor',
      key: 'valor',
      dataIndex: 'valor',
      render: v =>
        formatNumber(v, {
          style: 'currency',
          currency: getLocaleCurrency(),
        }),
    },
  ]

  return (
    <div className="w-full flex">
     <div className="w-1/2 ml-auto">
       <DefaultTable size="small" columns={columns} dataSource={parcelas} pagination={false} />
     </div>  
    </div> 
  )
}

GenerateContractParcels.propTypes = {
  parcelas: PropTypes.array,
}

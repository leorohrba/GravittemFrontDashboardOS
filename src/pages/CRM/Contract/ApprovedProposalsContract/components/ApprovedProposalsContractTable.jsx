import React from 'react'
import { DefaultTable } from '@components'
import { getLocaleCurrency, getLocaleDateFormat, customSort } from '@utils'
import { Badge, Button, Tooltip } from 'antd'
import { formatNumber } from 'umi-plugin-react/locale'
import { useApprovedProposalsContractContext } from '../context/ApprovedProposalsContract'
import PropTypes from 'prop-types'
import moment from 'moment'

export default function ApprovedProposalsContractTable({
  handleEdit,
  setTotalRecurrenceValue = null,
}) {
  const { data } = useApprovedProposalsContractContext()

  const columns = [
    {
      title: 'Proposta',
      sorter: (a, b) => a.number - b.number,
      render: d => d.number,
    },
    {
      title: 'Tipo',
      sorter: (a, b) =>
        customSort(a.proposalTypeDescription, b.proposalTypeDescription),
      render: d => d.proposalTypeDescription,
    },
    {
      title: 'Data de aprovação',
      sorter: (a, b) => customSort(a.closedDate, b.closedDate),
      render: d =>
        d.closedDate && moment(d.closedDate).format(getLocaleDateFormat()),
    },
    {
      title: 'Cliente',
      sorter: (a, b) => customSort(a.companyName, b.companyName),
      render: d => (
        <div>
          <p className="mb-0">{d.companyName}</p>
          {d.companyShortName && d.companyName !== d.companyShortName && (
            <small style={{ color: 'gray' }}>
              <i>{d.companyShortName}</i>
            </small>
          )}
        </div>
      ),
    },
    {
      title: 'Franquia',
      sorter: (a, b) => customSort(a.franchiseeName, b.franchiseeName),
      render: d => d.franchiseeName,
    },
    {
      title: 'Valores',
      key: 'values',
      sorter: (a, b) =>
        (a.proposalType === 2 ? a.locationValue : a.singleTotalAmount) -
        (b.proposalType === 2 ? b.locationValue : b.singleTotalAmount),
      render: d => (
        <Tooltip
          placement="top"
          title={
            <React.Fragment>
              <p className="mb-0">
                {d.proposalType === 2 ? 'Valor locação:' : 'Valor único:'}
                {formatNumber(
                  d.proposalType === 2 ? d.locationValue : d.singleTotalAmount,
                  {
                    style: 'currency',
                    currency: getLocaleCurrency(),
                  },
                )}
              </p>
              <p className="mb-0">
                Recorrência:{' '}
                {formatNumber(d.totalRecurrenceValue, {
                  style: 'currency',
                  currency: getLocaleCurrency(),
                })}
              </p>
            </React.Fragment>
          }
        >
          <p className="mb-0">
            {formatNumber(
              d.proposalType === 2 ? d.locationValue : d.singleTotalAmount,
              {
                style: 'currency',
                currency: getLocaleCurrency(),
              },
            )}
          </p>
          <p className="mb-0">
            {formatNumber(d.totalRecurrenceValue, {
              style: 'currency',
              currency: getLocaleCurrency(),
            })}
          </p>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      sorter: (a, b) =>
        (a.contratoId === null ? 1 : 0) - (b.contratoId === null ? 1 : 0),
      render: d => (
        <Badge
          color={d.contratoId !== null ? 'green' : 'orange'}
          text={d.contratoId !== null ? 'Gerado' : 'Pendente'}
        />
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d => (
        <Tooltip
          placement="top"
          title={d.contratoId !== null ? 'Pesquisar' : 'Gerar contrato'}
        >
          <Button
            onClick={() => handleClickEdit(d)}
            className="iconButton"
            shape="circle"
            type="primary"
            ghost
          >
            {d.contratoId !== null ? (
              <i className="fa fa-search fa-lg" />
            ) : (
              <i className="fa fa-file-text-o fa-lg" />
            )}
          </Button>
        </Tooltip>
      ),
    },
  ]
  const handleClickEdit = record => {
    handleEdit({
      numero: record.number,
      propostaId: record.proposalId,
      contratoId: record.contratoId,
    })
    setTotalRecurrenceValue &&
      setTotalRecurrenceValue(record.totalRecurrenceValue)
  }
  return (
    <DefaultTable
      className="mt-5"
      dataSource={data}
      columns={columns}
      rowKey={record => record.proposalId}
    />
  )
}

ApprovedProposalsContractTable.propTypes = {
  handleEdit: PropTypes.func,
  setTotalRecurrenceValue: PropTypes.func,
}

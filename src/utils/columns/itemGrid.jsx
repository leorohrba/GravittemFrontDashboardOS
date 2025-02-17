import TooltipParagraph from '@components/TooltipParagraph'
import { customSort } from '@utils'
import React from 'react'
import { formatNumber } from 'umi-plugin-react/locale'

export const itemGridColumns = () =>
  Object.freeze([
    {
      title: 'Código',
      nomeColuna: 'Código',
      dataIndex: 'code',
      fixed: 'left',
      width: 100,
      obrigatorio: true,
      padrao: true,
      sorter: (a, b) => customSort(a.code, b.code),
      ellipsis: {
        showTitle: false,
      },
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Nome',
      nomeColuna: 'Nome',
      dataIndex: 'name',
      //   fixed: 'left',
      width: 300,
      obrigatorio: true,
      padrao: true,
      sorter: (a, b) => customSort(a.name, b.name),
      ellipsis: {
        showTitle: false,
      },
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Tipo',
      nomeColuna: 'Tipo',
      dataIndex: 'type',
      width: 100,
      obrigatorio: true,
      padrao: true,
      sorter: (a, b) => customSort(a.type, b.type),
      render: (text, record) =>
        record.type === 'Product' ? 'Produto' : 'Serviço',
    },
    {
      title: 'Categoria',
      nomeColuna: 'Categoria',
      dataIndex: 'materialTypeDescription',
      width: 150,
      obrigatorio: true,
      padrao: true,
      sorter: (a, b) =>
        customSort(a.materialTypeDescription, b.materialTypeDescription),
      ellipsis: {
        showTitle: false,
      },
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Status',
      nomeColuna: 'Status',
      dataIndex: 'isActive',
      sorter: (a, b) => customSort(a.isActive, b.isActive),
      width: 100,
      obrigatorio: true,
      padrao: true,
      render: d => (
        <div>
          <i
            style={{ color: d ? '#4caf50' : 'red' }}
            className="mr-2 fa fa-circle"
          />
          {d ? 'Ativo' : 'Inativo'}
        </div>
      ),
    },
    {
      title: 'Lista de preços',
      nomeColuna: 'Lista de preços',
      dataIndex: 'defaultPriceListName',
      width: 150,
      obrigatorio: false,
      padrao: false,
      ellipsis: {
        showTitle: false,
      },
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Preço',
      nomeColuna: 'Preço',
      dataIndex: 'defaultUnitValue',
      width: 100,
      obrigatorio: false,
      padrao: false,
      render: val => (
        <span>
          {formatNumber(val || 0, {
            style: 'currency',
            currency: 'BRL',
          })}
        </span>
      ),
    },
    {
      title: 'Recorrência',
      nomeColuna: 'Recorrência',
      dataIndex: 'isRecurrence',
      sorter: (a, b) =>
        a.isRecurrence > b.isRecurrence
          ? 1
          : a.isRecurrence < b.isRecurrence
          ? -1
          : 0,
      width: 100,
      obrigatorio: false,
      padrao: false,
      render: (text, record) => (
        <div>{record.isRecurrence ? 'Recorrente' : 'Único'}</div>
      ),
    },
    {
      title: 'Observações',
      nomeColuna: 'Observações',
      dataIndex: 'note',
      width: 100,
      obrigatorio: false,
      padrao: false,
      ellipsis: {
        showTitle: false,
      },
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
  ])

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { DefaultTable, SmallTableFieldDescription } from '@components'
import {
  getLocaleCurrency,
  customSort,
  formatNumber as formatNumber1,
} from '@utils'
import { formatNumber } from 'umi-plugin-react/locale'
import { useGenerateContractContext } from '../context/GenerateContract'

export default function GenerateContractTable() {
  const { editData, type } = useGenerateContractContext()
  const [items, setItems] = useState([])

  useEffect(() => {
    if (editData) {
      generateData()
    }
  }, [editData, type])

  function generateData() {
    let source = []
    if (type === 'Proposta') {
      source = editData.itens
        .filter(
          item =>
            item.identificador && item.identificador.toUpperCase() === 'FR',
        )
        .map((d, index) => ({
          key: index,
          nome: d.itemDescricao,
          tipo: d.tipoItemDescricao,
          identificador: d.identificador,
          quantidade: d.quantidade,
          unidade: d.unidadeMedida,
          valorUnitario: d.valorUnitarioComLucro,
          valorTotal: d.valorTotal,
          desconto: d.percentualDesconto,
          recorrencia: d.recorrencia,
        }))
    } else if (type === 'Contrato') {
      const items = getItems(editData.itens || [], 1)
      const services = getItems(editData.servicos || [], 2)
      items.map(d => source.push(d))
      services.map(d => source.push(d))
    }
    setItems(source)
  }

  const getItems = (items, key) => {
    return items.map((d, index) => ({
      key: key * 1000 + index,
      nome: d.item?.descricao,
      tipo: d.tipoItemDescricao,
      quantidade: d.quantidade,
      unidade: d.item?.unidade,
      valorUnitario: d.valorUnitario,
      valorTotal: d.quantidade * d.valorUnitario,
      recorrencia: d.recorrencia,
    }))
  }

  const nome = {
    title: 'Nome',
    sorter: (a, b) => customSort(a.nome, b.nome),
    render: d => d.nome,
  }

  const valores = {
    title: 'Valores',
    sorter: (a, b) => a.valorTotal - b.valorTotal,
    render: d => (
      <React.Fragment>
        <p className="mb-0">
          {formatNumber(d.valorUnitario || 0, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}
        </p>
        <SmallTableFieldDescription
          label={formatNumber(d.valorTotal || 0, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}
          fontStyle="italic"
          color="gray"
        />
      </React.Fragment>
    ),
  }

  const identificador = {
    title: 'Identificador',
    sorter: (a, b) => customSort(a.identidicador, b.identificador),
    render: d => d.identificador,
  }

  const tipo = {
    title: 'Tipo',
    sorter: (a, b) => customSort(a.tipo, b.tipo),
    render: d => d.tipo,
  }

  const quantidadeComUnidade = {
    title: 'Quantidade',
    sorter: (a, b) => a.quantidade - b.quantidade,
    render: d =>
      d.quantidade !== null &&
      d.quantidade !== undefined &&
      `${d.quantidade} ${d.unidade || ''}`,
  }

  const quantidade = {
    title: 'Quantidade',
    sorter: (a, b) => a.quantidade - b.quantidade,
    render: d => d.quantidade,
  }

  const desconto = {
    title: 'Desconto',
    sorter: (a, b) => (a.desconto || 0) - (b.desconto || 0),
    render: d => !!d.desconto && `${formatNumber1(d.desconto, 2)}%`,
  }

  const recorrencia = {
    title: 'Recorrência',
    sorter: (a, b) => a.recorrencia - b.recorrencia,
    render: d => (d.recorrencia ? 'Recorrente' : 'Único'),
  }

  const proposalColumns = [
    nome,
    identificador,
    tipo,
    quantidadeComUnidade,
    desconto,
    valores,
    recorrencia,
  ]
  const contractColumns = [nome, tipo, quantidade, valores, recorrencia]

  return (
    <DefaultTable
      className="mt-5"
      dataSource={items}
      columns={type === 'Proposta' ? proposalColumns : contractColumns}
      rowKey={record => record.key}
    />
  )
}

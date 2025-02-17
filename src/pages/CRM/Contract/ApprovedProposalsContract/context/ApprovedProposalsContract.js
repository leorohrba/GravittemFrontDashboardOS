/* eslint-disable react-hooks/exhaustive-deps */
import constate from 'constate'
import { useState, useEffect } from 'react'
import { apiCRM } from '@services/api'
import { getPermissions, handleAuthError, setParamValues } from '@utils'
import moment from 'moment'

let params

const searchOptions = [
  {
    value: 'companyName',
    label: 'Cliente',
    placeholder: 'Razão social do cliente',
    type: 'search',
  },
  {
    value: 'ClosedDate',
    label: 'Data de aprovação',
    type: 'rangeDate',
  },
  {
    value: 'proposalType',
    label: 'Tipo de proposta',
    placeholder: 'Tipo da proposta',
    type: 'select',
    options: [{ value: 1, label: 'Venda' }, { value: 2, label: 'Locação' }],
  },
  {
    value: 'temRecorrencia',
    label: 'Tem recorrencia?',
    placeholder: 'Contrato tem recorrências?',
    type: 'select',
    options: [{ value: 1, label: 'Sim' }, { value: 2, label: 'Não' }],
  },
  {
    value: 'franchiseeName',
    label: 'Franqueado',
    placeholder: 'Nome fantasia da franquia',
    type: 'search',
  },
  {
    value: 'CreatedDate',
    label: 'Criação da proposta',
    type: 'rangeDate',
  },
  {
    value: 'number',
    label: 'Negócio',
    placeholder: 'Buscar por negócio',
    type: 'search',
    dataType: 'integer',
  },
  {
    value: 'temContrato',
    label: 'Tem contrato?',
    placeholder: 'Contrato já foi gerado?',
    type: 'select',
    options: [{ value: 1, label: 'Sim' }, { value: 2, label: 'Não' }],
  },
]

function useApprovedProposalsContract() {
  const [tags, setTags] = useState([])
  const [data, setData] = useState([])
  const [dataExport, setDataExport] = useState([])
  const [userPermissions, setUserPermissions] = useState(null)
  const [loading, setLoading] = useState(false)

  const buildParams = () => {
    return { actStatusCode: 'WON' }
  }

  useEffect(() => {
    params = buildParams()
    setPermissions()
    //  getData() removido para evitar a chamada no incio da página
  }, [])

  useEffect(() => {
    const source = [
      {
        columns: [
          'Proposta',
          'Tipo',
          'Data de aprovação',
          'Cliente',
          'Franquia',
          'Valor único',
          'Recorrência',
          'Status',
        ],
        data: [],
      },
    ]

    data.map(d => {
      source[0].data.push([
        d.number,
        d.proposalTypeDescription,
        d.closedDate && moment(d.closedDate).format('MMMM/YYYY'),
        d.companyName,
        d.franchiseeName,
        d.proposalType === 2 ? d.locationValue : d.singleTotalAmount,
        d.contratoId === null ? 'Pendente' : 'Gerado',
      ])
      return true
    })
    setDataExport(source)
  }, [data])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  async function getData() {
    setLoading(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/proposal`,
        params,
      })
      setLoading(false)
      const { data } = response
      setData(data.proposal || [])
    } catch (error) {
      handleAuthError(error)
    }
  }

  const startSearch = () => {
    params = buildParams()
    setParamValues(params, searchOptions, tags)
    getData()
  }

  return {
    tags,
    setTags,
    startSearch,
    data,
    setData,
    userPermissions,
    dataExport,
    loading,
    setLoading,
    searchOptions,
    getData,
  }
}

const [
  ApprovedProposalsContractProvider,
  useApprovedProposalsContractContext,
] = constate(useApprovedProposalsContract)

export {
  ApprovedProposalsContractProvider,
  useApprovedProposalsContractContext,
}

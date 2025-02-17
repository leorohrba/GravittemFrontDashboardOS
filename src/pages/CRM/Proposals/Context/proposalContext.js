/* eslint-disable prefer-const */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable prefer-destructuring */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from 'react'
import constate from 'constate'
import { apiCRM } from '@services/api'
import {
  useGetColumnsConfiguration,
  handleAuthError,
  getPermissions,
} from '@utils'
import { proposalGridColumns } from '@utils/columns/proposalGrid'
import { message } from 'antd'

let params = {
  startSearch: true,
  actStatusId: null,
  franchiseeName: null,
  companyShortName: null,
  funnelStageId: null,
  funnelStageName: null,
  lossReasonId: null,
  sellerName: null,
  startExpectedClosingDate: null,
  endExpectedClosingDate: null,
  startCreatedDate: null,
  endCreatedDate: null,
  startCreatedDate30: null,
  endCreatedDate30: null,
  startCreatedDate90: null,
  endCreatedDate90: null,
  startCreatedDate150: null,
  endCreatedDate150: null,
  startClosedDate: null,
  endClosedDate: null,
  origemContatoId: null,
  qualificacaoId: null,
  areaNegocioId: null,
  segmentoMercadoId: null,
  number: null,
  filterType: 1,
  endActivationDate: null,
  startActivationDate: null,
  startBillingForecastDate: null,
  endBillingForecastDate: null,
}

function proposalContext() {
  const [screen, setScreen] = useState('Proposals')
  const [isGrid, setIsGrid] = useState(true)
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [userPermissions, setUserPermissions] = useState([])

  const [proposalId, setProposalId] = useState(null)

  const [proposals, setProposals] = useState([])
  const [keyTable, setKeyTable] = useState(0)
  const [canDelete, setCanDelete] = useState(true)
  const [canUpdate, setCanUpdate] = useState(true)
  const [canReopen, setCanReopen] = useState(true)

  const [owner, setOwner] = useState(null)
  const [loadingOwnerProfile, setLoadingOwnerProfile] = useState(true)
  const [loadingFunnelStageSummary, setLoadingFunnelStageSummary] = useState(
    false,
  )

  //  states of EditProposalHeader
  const [showNewProposalModal, setShowNewProposalModal] = useState(false)

  const [validateOwner, setValidateOwner] = useState(false)
  const [franchisees, setFranchisees] = useState(null)
  const [sellers, setSellers] = useState(null)
  const [proposalStatuses, setProposalStatuses] = useState([])
  const [lossReasons, setLossReasons] = useState(null)
  const [businessAreas, setBusinessAreas] = useState(null)
  const [contactSources, setContactSources] = useState(null)
  const [qualifications, setQualifications] = useState(null)
  const [marketSegments, setMarketSegments] = useState(null)
  const [funnels, setFunnels] = useState(null)
  const [salesFunnels, setSalesFunnels] = useState(null)
  const [salesFunnelId, setSalesFunnelId] = useState(null)
  const [totalValue, setTotalValue] = useState()

  let ownerProfileSaved = null

  const historyBody = {
    proposalHistories: [
      {
        proposalHistoryId: 0,
        proposalId: undefined,
        type: 'proposalSendDate',
        title: 'Defaul title',
        action: 'Include',
        oldValue: '',
        newValue: 'value',
      },
    ],
  }

  const [
    serverColumns,
    loadingColumns,
    getColumns,
  ] = useGetColumnsConfiguration(apiCRM, `Proposals`, proposalGridColumns())

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
    },
    onSelectAll: selected => onSelectAllProposal(selected),
    selectedRowKeys,
  }

  const onSelectAllProposal = selected => {
    if (selected) {
      setSelectedRowKeys(
        proposals.map(rowData => {
          return rowData.proposalId
        }),
      )
    } else {
      setSelectedRowKeys([])
    }
  }

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  const locationTimeEnum = Object.freeze([
    { value: 1, descricao: '12 Meses' },
    { value: 2, descricao: '24 Meses' },
    { value: 3, descricao: '36 Meses' },
    { value: 4, descricao: '48 Meses' },
    { value: 5, descricao: '60 Meses' },
  ])

  const filterLocationTimeByValue = value => {
    return locationTimeEnum.filter(d => d.value === value)[0]
  }

  const createHistory = async (historyBody, onChange) => {
    try {
      const response = await apiCRM.post(
        '/api/crm/proposalHistory',
        historyBody,
      )

      const { data } = response
      if (!data.isOk) {
        let messageError
        if (data.validationMessageList.length > 0) {
          messageError = data.validationMessageList[0]
        } else {
          messageError = data.message
        }
        message.error(
          <span>
            {messageError}
            <br />
            Atualização não realizada
          </span>,
        )
      } else {
        onChange && onChange()
      }
      return data
    } catch (err) {
      handleAuthError(err)
    }
  }

  const openProposal = proposalId => {
    setProposalId(proposalId)
    setScreen('Proposal')
  }

  const handleCloseProposal = () => {
    setScreen('Proposals')
    getProposals()
    getSalesFunnelSummary()
  }

  const closeNewProposalModal = (refreshData, proposalId) => {
    setShowNewProposalModal(false)
    if (refreshData && proposalId) {
      setProposalId(proposalId)
      setScreen('Proposal')
    }
  }

  async function getProposals() {
    setLoading(true)
    setSelectedRowKeys([])
    setCanDelete(true)
    setCanUpdate(true)
    setCanReopen(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/proposal`,
        params,
      })

      setLoading(false)

      const { data } = response

      if (data.isOk) {
        setProposals(data.proposal)
        setKeyTable(keyTable + 1)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoading(false)
      setKeyTable(keyTable + 1)
      handleAuthError(error)
    }
  }
  async function getOwner() {
    setLoadingOwnerProfile(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/owner`,
      })

      const { data } = response
      setValidateOwner(data)
      if (data.isOk) {
        // eslint-disable-next-line prefer-destructuring
        ownerProfileSaved = data?.ownerProfile
        setOwner(data)
        setLoadingOwnerProfile(false)
      } else {
        message.error(data.message)
        setLoadingOwnerProfile(false)
      }
    } catch (error) {
      setLoadingOwnerProfile(false)
      handleAuthError(error)
    }
  }

  async function getPerson(type) {
    const params = { isActive: true }
    if (type === 'franchisee') {
      params.isFranchisee = true
    }
    if (type === 'seller') {
      params.isSeller = true
      params.isSellerActive = false
    }
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/Person`,
        params,
      })
      const { data } = response
      if (data.isOk && type === 'franchisee') {
        setFranchisees(data.person)
      } else if (data.isOk && type === 'seller') {
        setSellers(data.person)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getProposalStatuses() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/proposalStatus`,
      })

      const { data } = response

      if (data.isOk) {
        setProposalStatuses(data.proposalStatus)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getLossReasons() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/lossReason`,
      })

      const { data } = response

      if (data.isOk) {
        setLossReasons(data.lossReason)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getBusinessAreas() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/AreaNegocio`,
      })
      const { data } = response
      if (data.isOk) {
        setBusinessAreas(data.areaNegocio)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getContactSources() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/OrigemContato`,
      })
      const { data } = response
      if (data.isOk) {
        setContactSources(data.origemContato)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getQualifications() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/Qualificacao`,
      })
      const { data } = response
      if (data.isOk) {
        setQualifications(data.qualificacao)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getMarketSegments() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/SegmentoMercado`,
      })
      const { data } = response
      if (data.isOk) {
        setMarketSegments(data.segmentoMercado)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getFunnels() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/SalesFunnel`,
        params: { useFilterType: true, getFunnelStages: true },
      })
      const { data } = response
      if (data.isOk) {
        setFunnels(data.salesFunnel)
        setSalesFunnels(
          data.salesFunnel.map(d => ({
            salesFunnelId: d.salesFunnelId,
            salesFunnelTitle: d.title,
          })),
        )
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getSalesFunnelSummary() {
    setLoadingFunnelStageSummary(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/salesFunnelSummary`,
        params,
      })

      setLoadingFunnelStageSummary(false)

      const { data } = response
      if (data.isOk) {
        let salesFunnelIdWork = null

        if (
          salesFunnelId &&
          data.salesFunnelSummary.find(x => x.salesFunnelId === salesFunnelId)
        ) {
          salesFunnelIdWork = salesFunnelId
        } else if (data.salesFunnelSummary.length > 0) {
          salesFunnelIdWork = data.salesFunnelSummary[0].salesFunnelId
        }

        setSalesFunnelId(salesFunnelIdWork)
        setSalesFunnels(data.salesFunnelSummary)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoadingFunnelStageSummary(false)
      setKeyTable(keyTable + 1)
      handleAuthError(error)
    }
  }

  function clearParams() {
    params.franchiseeName = null
    params.companyShortName = null
    params.funnelStageId = null
    params.funnelStageName = null
    params.lossReasonId = null
    params.sellerName = null
    params.number = null
    params.startExpectedClosingDate = null
    params.endExpectedClosingDate = null
    params.startCreatedDate = null
    params.endCreatedDate = null
    params.startCreatedDate30 = null
    params.endCreatedDate30 = null
    params.startCreatedDate90 = null
    params.endCreatedDate90 = null
    params.startClosedDate150 = null
    params.endClosedDate150 = null
    params.origemContatoId = null
    params.qualificacaoId = null
    params.areaNegocioId = null
    params.segmentoMercadoId = null
  }

  useEffect(() => {
    params.actStatusId = null
    params.filterType = 1
    clearParams()
    setPermissions()
    getOwner()
    getPerson('franchisee')
    getPerson('seller')
    getProposalStatuses()
    getLossReasons()
    getBusinessAreas()
    getContactSources()
    getQualifications()
    getMarketSegments()
    getFunnels()
  }, [])

  return {
    params,
    totalValue,
    setTotalValue,
    screen,
    setScreen,
    isGrid,
    setIsGrid,
    proposalId,
    setProposalId,
    loading,
    setLoading,
    loadingFunnelStageSummary,
    selectedRowKeys,
    setSelectedRowKeys,
    userPermissions,
    serverColumns,
    loadingColumns,
    getColumns,
    rowSelection,
    proposals,
    setProposals,
    keyTable,
    setKeyTable,
    canDelete,
    setCanDelete,
    canUpdate,
    setCanUpdate,
    canReopen,
    setCanReopen,
    owner,
    loadingOwnerProfile,
    sellers,
    franchisees,
    proposalStatuses,
    setProposalStatuses,
    lossReasons,
    businessAreas,
    contactSources,
    qualifications,
    marketSegments,
    funnels,
    salesFunnels,
    setSalesFunnels,
    salesFunnelId,
    setSalesFunnelId,
    historyBody,
    createHistory,
    locationTimeEnum,
    filterLocationTimeByValue,
    showNewProposalModal,
    setShowNewProposalModal,
    getProposals,
    openProposal,
    handleCloseProposal,
    closeNewProposalModal,
    getSalesFunnelSummary,
    clearParams,
    validateOwner,
  }
}

const [ProposalProvider, useProposalContext] = constate(proposalContext)
export { ProposalProvider, useProposalContext }

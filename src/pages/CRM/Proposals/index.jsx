/**
 * breadcrumb: Negócios
 */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable prefer-const */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
import ConfigurationModal from '@components/modals/ConfigurationModal'
import NewSimpleSearch from '@components/NewSimpleSearch'
import styles from '@pages/CRM/styles.css'
import { apiCRM } from '@services/api'
import {
  getInitialSearch,
  handleAuthError,
  hasPermission,
  setParamValues,
} from '@utils'
import { proposalGridColumns } from '@utils/columns/proposalGrid'
import {
  Button,
  Dropdown,
  Menu,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Tooltip,
} from 'antd'
import Axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import ReactExport from 'react-data-export'
import EditProposalBatch from './components/EditProposal/EditProposalBatch'
import EditProposalHeader from './components/EditProposal/EditProposalHeader'
import ProposalCards from './components/Proposal/ProposalCards'
import ProposalFooter from './components/Proposal/ProposalFooter'
import ProposalGrid from './components/Proposal/ProposalGrid'
import Proposal from './detail/Proposal'
import PrintConfigModal from './modals/printConfigModal'
import StatisticsModal from './statistics/StatisticsModal'
import { ProposalProvider, useProposalContext } from './Context/proposalContext'
import { renderDocument } from '@utils/proposals'
import { getFederativeUnits } from './service'

const { Option } = Select
const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

let ownerProfileSaved = null

function Content({ location }) {
  const defaultSearchOptions = [
    {
      value: 'CreatedDate30',
      label: 'Negócios últimos 30 dias',
      type: 'rangeDate',
      initialValue: [moment().subtract(30, 'days'), moment()],
      target: 1,
    },
    {
      value: 'CreatedDate90',
      label: 'Negócios últimos 90 dias',
      type: 'rangeDate',
      initialValue: [moment().subtract(90, 'days'), moment()],
      target: 1,
    },
    {
      value: 'CreatedDate150',
      label: 'Negócios últimos 150 dias',
      type: 'rangeDate',
      initialValue: [moment().subtract(150, 'days'), moment()],
      target: 1,
    },
    {
      value: 'companyShortName',
      label: 'Organização',
      placeholder: 'Buscar por organização',
      type: 'search',
    },
    {
      value: 'document',
      label: 'Número do documento de origem',
      placeholder: 'Buscar por documento de origem',
      type: 'search',
    },
    {
      value: 'salesFunnelId',
      label: 'Funil',
      placeholder: 'Buscar por funil',
      type: 'select',
      options: [],
    },
    {
      value: 'funnelStageId',
      label: 'Fase',
      placeholder: 'Buscar por fase',
      type: 'select',
      options: [],
    },
    {
      value: 'sellerId',
      label: 'Vendedor',
      placeholder: 'Buscar por vendedor',
      type: 'select',
      options: [],
    },
    {
      value: 'ExpectedClosingDate',
      label: 'Data prevista de fechamento',
      type: 'rangeDate',
    },
    {
      value: 'CreatedDate',
      label: 'Data de criação',
      type: 'rangeDate',
    },
    {
      value: 'lossReasonId',
      label: 'Motivo de perda',
      placeholder: 'Buscar por motivo de perda',
      type: 'select',
      options: [],
    },
    {
      value: 'ClosedDate',
      label: 'Data de fechamento',
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
      value: 'segmentoMercadoId',
      label: 'Segmento mercado',
      placeholder: 'Buscar por segmento mercado',
      type: 'select',
      options: [],
    },
    {
      value: 'state',
      label: 'Estado',
      placeholder: 'Buscar por estados',
      type: 'select',
      options: [],
    },
    {
      value: 'city',
      label: 'Cidade',
      placeholder: 'Buscar por cidade',
      type: 'search',
    },
    {
      value: 'qualificacaoId',
      label: 'Qualificação',
      placeholder: 'Buscar por qualificação',
      type: 'select',
      options: [],
    },
    {
      value: 'origemContatoId',
      label: 'Origem contato',
      placeholder: 'Buscar por origem contato',
      type: 'select',
      options: [],
    },
    {
      value: 'areaNegocioId',
      label: 'Area de negócio',
      placeholder: 'Buscar por area de negócio',
      type: 'select',
      options: [],
    },
    {
      value: 'hasFranchisee',
      label: 'Tem franqueado?',
      placeholder: 'Negócio tem franqueado?',
      type: 'select',
      options: [{ value: 1, label: 'Sim' }, { value: 2, label: 'Não' }],
    },
    {
      value: 'temContrato',
      label: 'Tem contrato?',
      placeholder: 'Contrato já foi gerado?',
      type: 'select',
      options: [{ value: 1, label: 'Sim' }, { value: 2, label: 'Não' }],
    },
    {
      value: 'proposalSendDate',
      label: 'Proposta enviada em',
      type: 'rangeDate',
    },
    {
      value: 'proposalExpirationDate',
      label: 'Proposta expira em',
      type: 'rangeDate',
    },
  ]

  const {
    params,

    screen,
    isGrid,
    setIsGrid,
    loading,
    setLoading,
    loadingFunnelStageSummary,
    selectedRowKeys,
    userPermissions,

    serverColumns,
    getColumns,

    proposals,
    canDelete,
    setCanDelete,
    canUpdate,
    setCanUpdate,
    canReopen,
    setCanReopen,
    owner,
    loadingOwnerProfile,

    franchisees,
    sellers,
    proposalStatuses,
    lossReasons,
    businessAreas,
    contactSources,
    qualifications,
    marketSegments,
    funnels,
    salesFunnels,
    salesFunnelId,
    setSalesFunnelId,

    showNewProposalModal,
    setShowNewProposalModal,

    getProposals,
    openProposal,
    getSalesFunnelSummary,
    clearParams,

    createHistory,
    historyBody,
    closeNewProposalModal,
  } = useProposalContext()

  const [searchOptions, setSearchOptions] = useState(defaultSearchOptions)
  const [showEditProposalBatch, setShowEditProposalBatch] = useState(false)

  const [dataSet, setDataset] = useState([{ columns: [], data: [] }])
  const [statisticsModalVisible, setStatisticsModalVisible] = useState(false)

  const [keyModal, setKeyModal] = useState(0)
  const [keyModalBatch, setKeyModalBatch] = useState(0)

  const [statusId, setStatusId] = useState(null)
  const [filterType, setFilterType] = useState(1)

  const [loadingOptions, setLoadingOptions] = useState(true)

  const [steps, setSteps] = useState([])

  const [printConfigModalVisible, setPrintConfigModalVisible] = useState(false)

  const [tags, setTags] = useState([])

  const [updateColumnsKey, setUpdateColumnsKey] = useState(0)

  let proposalPerformed = []

  useEffect(() => {
    getInitialSearch('Proposals', 'crm', setTags, startSearch, true)
  }, [])

  useEffect(() => {
    const isFromTable =
      new URLSearchParams(location.search).get('fromTable') || 'true'
    const isTrue = isFromTable === 'true'
    setIsGrid(isTrue)
  }, [location.search])

  useEffect(() => {
    const salesFunnel = salesFunnels
      ? salesFunnels.find(x => x.salesFunnelId === salesFunnelId)
      : null

    if (salesFunnel) {
      setSteps(salesFunnel.funnelStages)
    } else {
      setSteps([])
    }
  }, [salesFunnels, salesFunnelId])

  useEffect(() => {
    if (
      (sellers,
      franchisees,
      funnels &&
        contactSources &&
        marketSegments &&
        qualifications &&
        businessAreas &&
        lossReasons &&
        !loadingOwnerProfile)
    ) {
      configureSearchOptions()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sellers,
    franchisees,
    funnels,
    lossReasons,
    marketSegments,
    qualifications,
    businessAreas,
    contactSources,
    loadingOwnerProfile,
  ])

  async function configureSearchOptions() {
    let index

    if (ownerProfileSaved === 'Franchise' || ownerProfileSaved === 'Standard') {
      index = defaultSearchOptions.findIndex(x => x.value === 'franchiseeId')
      if (index >= 0) {
        defaultSearchOptions.splice(index, 1)
      }
    }

    if (owner?.ownerProfile === 'Franchisor') {
      defaultSearchOptions.splice(3, 0, {
        value: 'franchiseeId',
        label: 'Franqueado',
        placeholder: 'Buscar por franqueado',
        type: 'select',
        options: [],
      })
    }

    const response = await getFederativeUnits()

    if (response.data && response.data.results) {
      optionsPopulate(
        defaultSearchOptions,
        response.data.results.sort((a, b) => {
          if (a.siglaEstado > b.siglaEstado) {
            return 1
          }
          if (a.siglaEstado < b.siglaEstado) {
            return -1
          }
          return 0
        }),
        'state',
        'siglaEstado',
        'siglaEstado',
      )
    }
    index = defaultSearchOptions.findIndex(x => x.value === 'lossReasonId')
    if (index >= 0) {
      lossReasons.map(record =>
        defaultSearchOptions[index].options.push({
          value: record.lossReasonId,
          label: record.name,
        }),
      )
    }
    optionsPopulate(
      defaultSearchOptions,
      franchisees,
      'franchiseeId',
      'franchiseeId',
      'shortName',
    )
    optionsPopulate(
      defaultSearchOptions,
      sellers,
      'sellerId',
      'sellerId',
      'name',
    )
    optionsPopulate(
      defaultSearchOptions,
      funnels,
      'salesFunnelId',
      'salesFunnelId',
      'title',
    )
    optionsPopulate(defaultSearchOptions, qualifications, 'qualificacaoId')
    optionsPopulate(defaultSearchOptions, contactSources, 'origemContatoId')
    optionsPopulate(defaultSearchOptions, marketSegments, 'segmentoMercadoId')
    optionsPopulate(defaultSearchOptions, businessAreas, 'areaNegocioId')

    index = defaultSearchOptions.findIndex(x => x.value === 'funnelStageId')
    if (index >= 0) {
      funnels.map(d => {
        d.funnelStage.map(r => {
          defaultSearchOptions[index].options.push({
            value: r.funnelStageId,
            label: r.name,
            render: (
              <Tooltip title={d.title}>
                <span>
                  <i
                    className={`fa ${r.icon} mr-2 fa-lw ${styles.crmColorIconGrid}`}
                  />
                  {r.name}
                </span>
              </Tooltip>
            ),
          })

          return true
        })
        return true
      })
    }

    if (owner?.showCRMActivationDate) {
      defaultSearchOptions.push(
        {
          value: 'ActivationDate',
          label: 'Data de ativação',
          type: 'rangeDate',
        },
        {
          value: 'BillingForecastDate',
          label: 'Previsão de faturamento',
          type: 'rangeDate',
        },
      )
    }

    setSearchOptions(defaultSearchOptions)
    setLoadingOptions(false)
  }

  function optionsPopulate(options, source, field, id, description) {
    const index = options.findIndex(x => x.value === field)
    if (index >= 0 && source && source?.length > 0) {
      source.map(record =>
        options[index].options.push({
          value: record[id || 'id'],
          label: record[description || 'descricao'],
        }),
      )
    }
  }

  function buildDataToExport() {
    const dataSetToExport = [
      {
        columns: serverColumns.map(c => c.nomeColuna),
        data: [],
      },
    ]

    proposals.map(rowData =>
      dataSetToExport[0].data.push(
        serverColumns.map(c =>
          c.dataIndex === 'documents'
            ? renderDocument(rowData.documents)
            : c.dataIndex === 'createDateTime'
            ? rowData.createDateTime
              ? moment(rowData.createDateTime).format('DD/MM/YYYY')
              : ''
            : c.dataIndex === 'expectedClosingDate'
            ? rowData.expectedClosingDate
              ? moment(rowData.expectedClosingDate).format('DD/MM/YYYY')
              : ''
            : c.dataIndex === 'billingForecastDate'
            ? rowData.billingForecastDate
              ? moment(rowData.billingForecastDate).format('DD/MM/YYYY')
              : ''
            : c.dataIndex === 'installDate'
            ? rowData.installDate
              ? moment(rowData.installDate).format('DD/MM/YYYY')
              : ''
            : c.dataIndex === 'closedDate'
            ? rowData.closedDate
              ? moment(rowData.closedDate).format('DD/MM/YYYY')
              : ''
            : c.dataIndex === 'funnelStageOrder'
            ? rowData.funnelStageName
            : rowData[c.dataIndex],
        ),
      ),
    )

    setDataset(dataSetToExport)
  }

  const showNewProposal = () => {
    setKeyModal(keyModal + 1)
    setShowNewProposalModal(true)
  }

  const handleChangeStatus = value => {
    setSearchValues()
    params.actStatusId = value
    setStatusId(value)
    getProposals()
    getSalesFunnelSummary()
  }

  const handleChangeFilterType = value => {
    setSearchValues()
    params.filterType = value
    setFilterType(value)
    getProposals()
    getSalesFunnelSummary()
  }

  const handleRefreshData = () => {
    getProposals()
    getSalesFunnelSummary()
  }

  function startSearch() {
    setSearchValues()
    getProposals()
    getSalesFunnelSummary()
  }

  function setSearchValues() {
    clearParams()
    setParamValues(params, searchOptions, tags)
    if (params.startCreatedDate150) {
      params.startCreatedDate = params.startCreatedDate150
      params.endCreatedDate = params.endCreatedDate150
    }
    if (params.startCreatedDate90) {
      params.startCreatedDate = params.startCreatedDate90
      params.endCreatedDate = params.endCreatedDate90
    }
    if (params.startCreatedDate30) {
      params.startCreatedDate = params.startCreatedDate30
      params.endCreatedDate = params.endCreatedDate30
    }
  }

  function confirmDeleteProposals() {
    if (
      proposals.findIndex(
        d =>
          selectedRowKeys.includes(d.proposalId) && d.actStatusCode !== 'ABRT',
      ) >= 0
    ) {
      message.error('Você não pode excluir negócios que não estejam em aberto!')
      return
    }

    Modal.confirm({
      content:
        selectedRowKeys.length === 1
          ? 'Você tem certeza que deseja excluir o negócio selecionado?'
          : 'Você tem certeza que deseja excluir os negócios selecionados?',
      title: 'Atenção',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteProposals()
      },
    })
  }

  function addProposalPerformed(proposalPerformedId) {
    proposalPerformed.push(proposalPerformedId)

    if (proposalPerformed.length >= selectedRowKeys.length) {
      proposalPerformed = []
      getProposals()
      getSalesFunnelSummary()
    }
  }

  function deleteProposals() {
    setLoading(true)
    proposalPerformed = []

    selectedRowKeys.map(selectedRowKey => deleteProposal(selectedRowKey))
  }

  async function deleteProposal(proposalIdToDelete) {
    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/crm/proposal`,
        params: { proposalId: proposalIdToDelete },
      })

      const { data } = response

      if (!data.isOk) {
        message.error(data.message)
      }
      addProposalPerformed(proposalIdToDelete)
    } catch (error) {
      handleAuthError(error)
      // Adiciona à lista do mesmo jeito
      addProposalPerformed(proposalIdToDelete)
    }
  }

  const closeEditProposalBatch = refreshData => {
    setShowEditProposalBatch(false)
    if (refreshData) {
      getProposals()
      getSalesFunnelSummary()
    }
  }

  const showModalEditBatch = () => {
    if (
      proposals.findIndex(
        d =>
          selectedRowKeys.includes(d.proposalId) && d.actStatusCode !== 'ABRT',
      ) >= 0
    ) {
      message.error('Você não pode alterar negócios que não estejam em aberto!')
    } else {
      setKeyModalBatch(keyModalBatch + 1)
      setShowEditProposalBatch(true)
    }
  }

  const checkProposalCanBeReOpen = async proposal => {
    const responseSalesFunnel = await apiCRM({
      url: '/api/CRM/SalesFunnel',
      params: { salesFunnelId: proposal.salesFunnelId },
    })

    const responseFunnelStage = await apiCRM({
      url: '/api/CRM/FunnelStage',
      params: { funnelStageId: proposal.funnelStageId },
    })

    const responseAreaNegocio = await apiCRM({
      url: '/api/CRM/AreaNegocio',
      params: { id: proposal.areaNegocioId },
    })

    const responseSaller = await apiCRM({
      url: '/api/CRM/Person',
      params: { personId: proposal.sellerPersonId },
    })

    const listResponses = [
      responseSalesFunnel,
      responseFunnelStage,
      responseAreaNegocio,
      responseSaller,
    ]

    let reOpenHistoryBody = historyBody
    reOpenHistoryBody.proposalHistories[0] = {
      proposalHistoryId: 0,
      proposalId: proposal.proposalId,
      type: 'Proposal',
      title: 'Status alterado',
      action: 'Include',
      oldValue: proposal.oldStatusDescription,
      newValue: proposal.actStatusDescription,
    }

    const canBeReOpen = listResponses.every(response => response.data.isOk)
    if (canBeReOpen) {
      createHistory(reOpenHistoryBody)
      proposalUpdate(proposal)
    } else {
      message.warning(
        `Não é possível reabrir propósta de ${proposal.companyShortName}`,
      )
    }

    setTimeout(() => {
      setLoading(false)
      getProposals()
    }, 300)
  }

  const reopenProposal = () => {
    const openStatus = proposalStatuses.find(s => s.description === 'Aberto')
    const filteredProposals = proposals.filter(d =>
      selectedRowKeys.includes(d.proposalId),
    )

    let listToReOpen = filteredProposals

    listToReOpen.map((p, index) => {
      p.actStatusCode = openStatus.code
      p.oldStatusDescription = p.actStatusDescription
      p.actStatusDescription = openStatus.description
      p.actStatusId = openStatus.statusId
      p.closedDate = null
      p.lossReasonId = null
    })

    listToReOpen.forEach(proposal => {
      checkProposalCanBeReOpen(proposal)
    })
  }

  const proposalUpdate = async proposal => {
    try {
      const response = await apiCRM({
        method: 'PUT',
        url: `/api/CRM/ProposalUpdate`,
        data: { proposal },
      })
      const { data } = response

      if (!data.isOk) {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  const handleChangeSalesFunnel = value => {
    setSalesFunnelId(value)
  }

  const [visibleConfigurationModal, setVisibleConfigurationModal] = useState(
    false,
  )
  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          setPrintConfigModalVisible(true)
        }}
      >
        Configurações de impressão
      </Menu.Item>

      <Menu.Item onClick={() => setVisibleConfigurationModal(true)}>
        Configurações
      </Menu.Item>
    </Menu>
  )

  useEffect(() => {
    if (tags.length > 0) {
      startSearch()
    }
  }, [tags])

  useEffect(() => {
    getColumns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateColumnsKey])

  useEffect(() => {
    setCanDelete(
      hasPermission(userPermissions, 'Exclude') &&
        proposals.findIndex(
          d => selectedRowKeys.includes(d.proposalId) && !d.canBeDeleted,
        ) < 0,
    )
    setCanUpdate(
      hasPermission(userPermissions, 'Alter') &&
        proposals.findIndex(
          d => selectedRowKeys.includes(d.proposalId) && !d.canBeUpdated,
        ) < 0,
    )
    setCanReopen(
      hasPermission(userPermissions, 'ReopenProposal') &&
        proposals.findIndex(
          d =>
            selectedRowKeys.includes(d.proposalId) &&
            d.actStatusCode === 'ABRT',
        ) < 0,
    )

    if (hasPermission(userPermissions, 'ExportExcel')) {
      buildDataToExport()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRowKeys, proposals])

  return (
    <React.Fragment>
      {screen === 'Proposal' ? (
        <Proposal />
      ) : (
        <div className="container">
          {visibleConfigurationModal && (
            <ConfigurationModal
              {...{
                visibleConfigurationModal,
                setVisibleConfigurationModal,
                setUpdateColumnsKey,
              }}
              screenName="Proposals"
              tableName="Proposals"
              defaultColumns={proposalGridColumns()}
              microserviceName="crm"
              microserviceOrigin={apiCRM}
              profile={owner?.ownerProfile}
            />
          )}

          {statisticsModalVisible && (
            <StatisticsModal
              statisticsModalVisible={statisticsModalVisible}
              setStatisticsModalVisible={setStatisticsModalVisible}
              proposals={
                !isGrid && salesFunnelId
                  ? proposals.filter(x => x.salesFunnelId === salesFunnelId)
                  : proposals
              }
              userPermissions={userPermissions}
              editProposal={id => openProposal(id)}
              loading={loading}
              ownerProfile={owner?.ownerProfile}
            />
          )}

          {printConfigModalVisible && (
            <PrintConfigModal
              printConfigModalVisible={printConfigModalVisible}
              setPrintConfigModalVisible={setPrintConfigModalVisible}
            />
          )}

          <Row type="flex" className="mb-4">
            <div style={{ marginLeft: 'auto' }}>
              {loadingOptions ? (
                <div className="mb-4 mt-1 mr-2 text-right">
                  <Spin />
                </div>
              ) : (
                <NewSimpleSearch
                  searchOptions={searchOptions}
                  setTags={setTags}
                  tags={tags}
                  startSearch={startSearch}
                  getSelectLabel
                  selectOptionsWidth={260}
                  screenName="Proposals"
                />
              )}
            </div>

            <Row type="flex" style={{ color: '#1976D2' }}>
              {isGrid ? (
                <i
                  className="fa fa-th fa-2x ml-5 cursor-pointer"
                  aria-hidden="true"
                  onClick={() => setIsGrid(false)}
                />
              ) : (
                <i
                  className="fa fa-list fa-2x ml-5 cursor-pointer"
                  aria-hidden="true"
                  onClick={() => setIsGrid(true)}
                />
              )}
            </Row>
          </Row>

          <Row type="flex" className="mb-2">
            {selectedRowKeys.length === 0 && (
              <>
                {hasPermission(userPermissions, 'Include') && (
                  <Button
                    className="mr-5"
                    type="primary"
                    onClick={() => showNewProposal()}
                    disabled={loading}
                  >
                    <i className="fa fa-plus mr-3" />
                    Novo negócio
                  </Button>
                )}
                {hasPermission(userPermissions, 'ExportExcel') && (
                  <ExcelFile
                    filename={`${moment().format('DD_MM_YYYY_HHmm')}_negócios`}
                    element={
                      <Button
                        className="mr-3"
                        disabled={loading}
                        type="outline"
                      >
                        <i
                          className={`fa fa-download mr-3 fa-lg ${styles.crmColorIconEdit}`}
                        />
                        Exportar
                      </Button>
                    }
                  >
                    <ExcelSheet dataSet={dataSet} name="Negócios" />
                  </ExcelFile>
                )}
              </>
            )}
            {selectedRowKeys.length > 0 && (
              <div>
                {1 === 0 && (
                  <Button
                    type="outline"
                    className="mr-3 iconButton"
                    disabled={loading}
                  >
                    <i className="fa fa-envelope fa-lg mr-3" />
                    Enviar email ({selectedRowKeys.length})
                  </Button>
                )}
                {hasPermission(userPermissions, 'Alter') && canUpdate && (
                  <Button
                    type="outline"
                    className="mr-3"
                    disabled={loading || !canUpdate}
                    onClick={() => showModalEditBatch()}
                  >
                    <i className="fa fa-pencil mr-3" />
                    Editar em lote ({selectedRowKeys.length})
                  </Button>
                )}

                {canReopen && (
                  <Button
                    type="outline"
                    className="mr-3"
                    disabled={loading}
                    onClick={() => reopenProposal()}
                  >
                    <i
                      className={`fa fa-folder-open mr-3 fa-lg ${styles.crmColorIconEdit}`}
                    />
                    Reabrir negócio ({selectedRowKeys.length})
                  </Button>
                )}

                {hasPermission(userPermissions, 'Exclude') && canDelete && (
                  <Button
                    type="outline"
                    className="mr-3"
                    disabled={loading || !canDelete}
                    onClick={() => confirmDeleteProposals()}
                  >
                    <i className="fa fa-trash fa-lg mr-3" />
                    Excluir ({selectedRowKeys.length})
                  </Button>
                )}
              </div>
            )}
            <span style={{ marginLeft: 'auto' }}>
              <Button
                size="default"
                disabled={proposals.length === 0}
                onClick={() => setStatisticsModalVisible(true)}
                style={{
                  marginLeft: 'auto',
                }}
                className="ml-2 iconButton"
              >
                <i className="fa fa-bar-chart fa-lg mr-3" />
                Estatísticas
              </Button>

              {!isGrid && (
                <Select
                  className="ml-3"
                  style={{ width: '230px' }}
                  value={salesFunnelId}
                  onChange={handleChangeSalesFunnel}
                >
                  {salesFunnels &&
                    salesFunnels.map(record => (
                      <Option
                        key={record.salesFunnelId}
                        value={record.salesFunnelId}
                      >
                        {record.salesFunnelTitle}
                      </Option>
                    ))}
                </Select>
              )}
              {owner?.ownerProfile === 'Franchisor' && (
                <Select
                  className="ml-3"
                  style={{ width: '235px' }}
                  value={filterType}
                  onChange={handleChangeFilterType}
                >
                  <Option value={1}>Todos os negócios</Option>
                  <Option value={2}>Meus negócios</Option>
                  <Option value={3}>Negócios das franquias</Option>
                </Select>
              )}
              <Select
                value={statusId}
                className="ml-3 mr-3"
                style={{
                  width: 180,
                }}
                onChange={handleChangeStatus}
              >
                <Option value={null}>Todos os status</Option>
                {proposalStatuses.map(record => (
                  <Option value={record.statusId}>{record.description}</Option>
                ))}
              </Select>
              <Dropdown overlay={menu}>
                <Button className="iconButton">
                  <i
                    className="fa fa-ellipsis-v fa-lg"
                    style={{ color: 'gray' }}
                  />
                </Button>
              </Dropdown>
            </span>
          </Row>
          {isGrid ? (
            <ProposalGrid />
          ) : (
            <ProposalCards
              data={proposals}
              loading={loading || loadingFunnelStageSummary}
              steps={steps}
              onChange={handleRefreshData}
              openProposal={openProposal}
            />
          )}

          {isGrid && <ProposalFooter />}

          {showEditProposalBatch && (
            <React.Fragment>
              <EditProposalBatch
                show={showEditProposalBatch}
                closeEditProposalBatch={closeEditProposalBatch}
                key={keyModalBatch}
              />
            </React.Fragment>
          )}

          {showNewProposalModal && (
            <React.Fragment>
              <EditProposalHeader
                proposalId={0}
                show={showNewProposalModal}
                closeEditProposalHeader={closeNewProposalModal}
              />
            </React.Fragment>
          )}
        </div>
      )}
    </React.Fragment>
  )
}

export default function Proposals({ location }) {
  return (
    <React.Fragment>
      <ProposalProvider>
        <Content {...{ location }} />
      </ProposalProvider>
    </React.Fragment>
  )
}

/*
 * breadcrumb: Relatório de comissionamento do franqueado
 */
import { apiCRM } from '@services/api'
import {
  getPermissions,
  handleAuthError,
  hasPermission,
} from '@utils'
import { message, Spin } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import ProposalQueryModal from '../Proposals/modals/ProposalQueryModal/ProposalQueryModal'
import CommissioningFranchiseeReportFooter from './components/CommissioningFranchiseeReportFooter'
import CommissioningFranchiseeReportHeader from './components/CommissioningFranchiseeReportHeader'
import CommissioningFranchiseeReportTable from './components/CommissioningFranchiseeReportTable'

const params = {
  startMonthYearCommission: null,
  endMonthYearCommission: null,
  state: null,
}

const searchOptionsFranchisor = [
  {
    value: 'franchiseeName',
    label: 'Franqueado',
    placeholder: 'Buscar por franqueado',
    type: 'search',
  },
  {
    value: 'royaltyType',
    label: 'Método de cobrança',
    placeholder: 'Selecione o método de cobrança',
    type: 'select',
    options: [
      { label: ' ', value: null },
      { label: 'Percentual sobre venda de produtos', value: 3 },
      { label: 'Comissionamento no total faturado', value: 4 },
      { label: 'Comissionamento nas recorrências', value: 5 },
    ],
  },
  {
    value: 'state',
    label: 'Status',
    placeholder: 'Selecione o status',
    type: 'select',
    options: [
      { label: ' ', value: null },
      { label: 'Pendente', value: 1 },
      { label: 'Pago', value: 2 },
    ],
  },
  {
    value: 'number',
    label: 'Número do negócio',
    placeholder: 'Número do negócio',
    type: 'search',
    dataType: 'integer',
  },
]

const searchOptionsFranchise = [
  {
    value: 'number',
    label: 'Número do negócio',
    placeholder: 'Número do negócio',
    type: 'search',
    dataType: 'integer',
  },
  {
    value: 'state',
    label: 'Status',
    placeholder: 'Selecione o status',
    type: 'select',
    options: [
      { label: ' ', value: null },
      { label: 'Pendente', value: 1 },
      { label: 'Pago', value: 2 },
    ],
  },
]

export default function CommissioningFranchiseeReport() {
  const [searchOptions, setSearchOptions] = useState(searchOptionsFranchise)
  const [keySearchOptions, setKeySearchOptions] = useState(0)
  const [buildingDataExport, setBuildingDataExport] = useState(false)
  const [exportDataSummary, setExportDataSummary] = useState([])
  const [exportDataProposal, setExportDataProposal] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [referenceDate, setReferenceDate] = useState(moment())
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(false)
  const [proposalId, setProposalId] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [ownerProfile, setOwnerProfile] = useState(null)

  useEffect(() => {
    setPermissions()
    getOwnerProfile()
    clearParams()
    const newDate = moment()
    setPeriod(newDate)
    getReportData()
  }, [])

  useEffect(() => {
    setSearchOptions(
      ownerProfile && ownerProfile !== 'Franchise'
        ? searchOptionsFranchisor
        : searchOptionsFranchise,
    )
    setKeySearchOptions(keySearchOptions + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerProfile])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  function setPeriod(newDate) {
    params.startMonthYearCommission = newDate
      .startOf('year')
      .format('YYYY-MM-DD')
    params.endMonthYearCommission = newDate.endOf('year').format('YYYY-MM-DD')
    setReferenceDate(newDate.startOf('year'))
  }

  function clearParams() {
    params.royatType = null
    params.franchiseeId = null
    params.franchiseeName = null
    params.number = null
    params.state = null
  }

  async function getOwnerProfile() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/owner`,
      })

      const { data } = response

      if (data.isOk) {
        setOwnerProfile(data.ownerProfile)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getReportData() {
    setLoading(true)
    setBuildingDataExport(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/franchiseCommissionReport`,
        params,
      })
      setLoading(false)
      const { data } = response

      if (data.isOk) {
        setReportData(data.commissionPeriod)
        if (data.commissionPeriod.length === 0 && params.number) {
          message.info(
            'Negócio não encontrado no período que está selecionado ou não está fechado!',
          )
        }
      } else {
        setBuildingDataExport(false)
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  useEffect(() => {
    if (hasPermission(userPermissions, 'ExportExcel')) {
      buildDataToExport()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportData])

  useEffect(() => {
    setBuildingDataExport(false)
  }, [exportDataProposal])

  function buildDataToExport() {
    const summary = [
      {
        columns: [
          'Período',
          'Método de cobrança',
          'Faturamento bruto',
          'Base cálculo marketing',
          'Marketing',
          '% marketing',
          'Base cálculo comissão',
          'Comissão',
          '% comissão',
          'Status',
        ],
        data: [],
      },
    ]

    const proposals = [
      {
        columns: [
          'Franqueado',
          'Período',
          'Negócio',
          'Data de fechamento',
          'Organização',
          'Valor da recorrência',
          'Número da recorrência',
          'Valor do produto',
          'Valor do serviço',
          'Valor total',
          'Base cálculo marketing',
          '% marketing',
          'Marketing',
          'Base cálculo comissão',
          '% comissão',
          'Comissão',
        ],
        data: [],
      },
    ]

    reportData.map(d => {
      summary[0].data.push([
        d.referenceDate ? moment(d.referenceDate).format('MMMM') : '',
        d.commissionTypeDescription,
        d.grossBilling,
        d.baseMarketingValue,
        d.marketingValue,
        d.marketingValue ? d.marketingPercentage : '',
        d.baseCommissionValue,
        d.commissionValue,
        d.commissionValue ? d.commissionPercentage : '',
        d.state === 1 ? 'Pendente' : d.state === 2 ? 'Pago' : '',
      ])

      d.proposalCommission.map(p =>
        proposals[0].data.push([
          p.franchiseeShortName,
          p.referenceDate ? moment(p.referenceDate).format('MMMM') : '',
          p.number,
          p.closedDate ? moment(p.closedDate).format('DD/MM/YYYY') : '',
          p.companyShortName,
          p.recurrenceValue,
          p.recurrenceNumber,
          p.productValue,
          p.serviceValue,
          p.totalValue,
          p.baseMarketingValue,
          p.marketingValue ? p.marketingPercentage : '',
          p.marketingValue,
          p.baseCommissionValue,
          p.commissionValue ? p.commissionPercentage : '',
          p.commissionValue,
        ]),
      )

      return true
    })

    setExportDataSummary(summary)
    setExportDataProposal(proposals)
  }

  const onChangeReferenceDate = value => {
    setPeriod(value)
    getReportData()
  }

  function startSearch(fieldName, searchFieldValue) {
    setSearchValues(fieldName, searchFieldValue)
    getReportData()
  }

  function setSearchValues(fieldName, searchFieldValue) {
    clearParams()
  
    if (!searchFieldValue) {
      return
    }      
  
    if (fieldName === 'franchiseeName') {
      params.franchiseeName = `%${searchFieldValue}%`
    } else if (fieldName === 'number') {
      if (searchFieldValue) {
        params.number = parseInt(searchFieldValue, 10)
      }
    } else if (fieldName === 'royaltyType') {
      params.royaltyType = searchFieldValue
    } else if (fieldName === 'state') {
      params.state = searchFieldValue
    }
  }

  const getProposal = id => {
    setProposalId(id)
    setModalVisible(true)
  }

  const toogleModalVisible = () => {
    setModalVisible(false)
  }

  return (
    <div className="container">
      <ProposalQueryModal
        proposalId={proposalId}
        visible={modalVisible}
        toogleModalVisible={toogleModalVisible}
        userPermissions={userPermissions}
        ownerProfile={ownerProfile}
      />
      <Spin size="large" spinning={loading}>
        <CommissioningFranchiseeReportHeader
          referenceDate={referenceDate}
          onChangeReferenceDate={onChangeReferenceDate}
          searchOptions={searchOptions}
          startSearch={startSearch}
          setSearchValues={setSearchValues}
          userPermissions={userPermissions}
          exportDataProposal={exportDataProposal}
          exportDataSummary={exportDataSummary}
          buildingDataExport={buildingDataExport}
          keySearchOptions={keySearchOptions}
        />
        <CommissioningFranchiseeReportTable
          reportData={reportData}
          getProposal={getProposal}
        />
        <CommissioningFranchiseeReportFooter reportData={reportData} />
      </Spin>
    </div>
  )
}

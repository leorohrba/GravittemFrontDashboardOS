/*
 * breadcrumb: Relatório de comissionamento de franqueador
 */
import { apiCRM } from '@services/api'
import {
  getPermissions,
  handleAuthError,
  hasPermission,
  setParamValues,
} from '@utils'
import { Alert, message, Spin } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import ProposalQueryModal from '../Proposals/modals/ProposalQueryModal/ProposalQueryModal'
import CommissioningFranchisorReportFooter from './components/CommissioningFranchisorReportFooter'
import CommissioningFranchisorReportHeader from './components/CommissioningFranchisorReportHeader'
import CommissioningFranchisorReportTable from './components/CommissioningFranchisorReportTable'

let params = {}

const options = [
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
      { label: 'Percentual sobre venda de produtos', value: 3 },
      { label: 'Comissionamento no total faturado', value: 4 },
      { label: 'Comissionamento nas recorrências', value: 5 },
    ],
  },
  /*
  {
    value: 'state',
    label: 'Status',
    placeholder: 'Selecione o status',
    type: 'select',
    options: [
      { label: 'Pendente', value: 1 },
      { label: 'Pago', value: 2 },
    ],
  },
  */
  {
    value: 'number',
    label: 'Número do negócio',
    placeholder: 'Número do negócio',
    type: 'search',
    dataType: 'integer',
  },
  {
    value: 'billingForecastDate',
    label: 'Previsão de faturamento',
    type: 'rangeDate',
  },
  {
    value: 'activationDate',
    label: 'Data de ativação',
    type: 'rangeDate',
  },
  {
    value: 'salesFunnelId',
    label: 'Funil de vendas',
    placeholder: 'Selecione o funil',
    type: 'select',
    options: [
    ],
  },
]

export default function CommissioningFranchisorReport() {
  const [searchOptions, setSearchOptions] = useState(options)
  const [buildingDataExport, setBuildingDataExport] = useState(false)
  const [exportDataSummary, setExportDataSummary] = useState([])
  const [exportDataProposal, setExportDataProposal] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [referenceDateInitial, setReferenceDateInitial] = useState(moment())
  const [referenceDateFinal, setReferenceDateFinal] = useState(moment())
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(false)
  const [proposalId, setProposalId] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [ownerProfile, setOwnerProfile] = useState(null)
  const [alertMessages, setAlertMessages] = useState([])
  const [tags, setTags] = useState([])
  const [keyTable, setKeyTable] = useState(0)
  const [
    changeCommissionStateDisabled,
    setChangeCommissionStateDisabled,
  ] = useState(false)

  useEffect(() => {
    setPermissions()
    getOwnerProfile()
    clearParams()
    const newDate = moment()
    setPeriod(newDate, newDate)
    getSalesFunnels()
  }, [])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  function setPeriod(start, end) {
    params.startMonthYearCommission = start
      .startOf('month')
      .format('YYYY-MM-DD')
    params.endMonthYearCommission = end
      .startOf('month')
      .format('YYYY-MM-DD')
    
    setReferenceDateInitial(start.startOf('month'))
    setReferenceDateFinal(end.startOf('month'))
  }

  function clearParams() {
    const startMonthYearCommission = params.startMonthYearCommission
    const endMonthYearCommission = params.endMonthYearCommission
    params = {
      startMonthYearCommission,
      endMonthYearCommission,
    }
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

  async function getSalesFunnels() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/salesfunnel`,
        params: { getFunnelStages: false }
      })
      const { data } = response
      if (data.isOk) {
        const i = options.findIndex(x => x.value === 'salesFunnelId') 
        i >= 0 && data.salesFunnel.map(d => {
          options[i].options.push({
            label:  d.title,
            value: d.salesFunnelId,
          })
          return true;
        })
        setSearchOptions([...options])
      } else {
        message.error(data.message)
      }
    } catch (error) {
      console.log(error)
      handleAuthError(error)
    }
  }

  async function getReportData() {
    setLoading(true)
    setAlertMessages([])
    setBuildingDataExport(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/franchisorCommissionReport`,
        params,
      })
      setLoading(false)
      const { data } = response

      if (data.isOk) {
        setReportData(data.commissionFranchisee)
        setKeyTable(keyTable + 1)
        if (data.commissionFranchisee.length === 0 && params.number) {
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
    const startReferenceDate = params.startMonthYearCommission
      ? moment(params.startMonthYearCommission)
      : moment()

    const endReferenceDate = params.endMonthYearCommission
      ? moment(params.endMonthYearCommission)
      : moment()

    setChangeCommissionStateDisabled(
      !!params.number || 
      !!params.salesFunnelId ||
      !!params.expectedClosingDate ||
      !!params.activationDate ||
      startReferenceDate > moment() ||
      endReferenceDate > moment() ||
      params.startMonthYearCommission !==  params.endMonthYearCommission
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportData])

  useEffect(() => {
    setBuildingDataExport(false)
  }, [exportDataProposal])

  function buildDataToExport() {
    const summary = [
      {
        columns: [
          'Franqueado',
          'Método de cobrança',
          'Faturamento bruto',
          'Recorrência',
          'Base cálculo marketing',
          'Marketing',
          '% marketing',
          'Base cálculo rebate',
          'Rebate',
          '% rebate',
          'Recorrência líquida',
          'Status',
        ],
        data: [],
      },
    ]

    const proposals = [
      {
        columns: [
          'Franqueado',
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
          'Base cálculo rebate',
          '% rebate',
          'Rebate',
          'Recorrência líquida'
        ],
        data: [],
      },
    ]

    reportData.map(d => {
      summary[0].data.push([
        d.franchiseeName,
        d.commissionTypeDescription,
        d.grossBilling,
        d.recurrenceValue,
        d.baseMarketingValue,
        d.marketingValue,
        d.marketingValue ? d.marketingPercentage : '',
        d.baseCommissionValue,
        d.commissionValue,
        d.commissionValue ? d.commissionPercentage : '',
        d.finalRecurrenceValue,
        d.state === 1 ? 'Pendente' : d.state === 2 ? 'Pago' : '',
      ])

      d.proposalCommission.map(p =>
        proposals[0].data.push([
          p.franchiseeShortName,
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
          p.finalRecurrenceValue,
        ]),
      )

      return true
    })

    setExportDataSummary(summary)
    setExportDataProposal(proposals)
  }

  const onChangeReferenceDate = (start, end) => {
    setPeriod(start, end)
    // getReportData()
  }

  function startSearch() {
    setSearchValues()
    getReportData()
  }

  function setSearchValues() {
    clearParams()
    setParamValues(params, searchOptions, tags)
  }

  const getProposal = id => {
    setProposalId(id)
    setModalVisible(true)
  }

  const toogleModalVisible = () => {
    setModalVisible(false)
  }

  async function setCommissionState(franchiseeId, state) {
    setAlertMessages([])
    setLoading(true)

    const body = {
      commissionState: {
        monthYearCommission: referenceDateInitial.format('YYYY-MM-DD'),
        franchiseeId,
        state: state === 1 ? 2 : 1,
      },
    }

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/commissionState`,
        data: body,
        headers: { 'Content-Type': 'application/json' },
      })

      setLoading(false)

      const { data } = response

      if (data.isOk) {
        getReportData()
      } else {
        if (data.validationMessageList.length > 0) {
          setAlertMessages(data.validationMessageList)
        }

        message.error(data.message)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
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
        <CommissioningFranchisorReportHeader
          referenceDateInitial={referenceDateInitial}
          referenceDateFinal={referenceDateFinal}
          onChangeReferenceDate={onChangeReferenceDate}
          searchOptions={searchOptions}
          startSearch={startSearch}
          setSearchValues={setSearchValues}
          userPermissions={userPermissions}
          exportDataProposal={exportDataProposal}
          exportDataSummary={exportDataSummary}
          buildingDataExport={buildingDataExport}
          tags={tags}
          setTags={setTags}
        />

        {alertMessages.length > 0 && (
          <div className="mt-2">
            {alertMessages.map((message, index) => (
              <Alert
                type="error"
                message={message}
                key={index}
                showIcon
                className="mb-2"
              />
            ))}
          </div>
        )}

        <CommissioningFranchisorReportTable
          reportData={reportData}
          getProposal={getProposal}
          userPermissions={userPermissions}
          setCommissionState={setCommissionState}
          ownerProfile={ownerProfile}
          keyTable={keyTable}
          changeCommissionStateDisabled={changeCommissionStateDisabled}
        />
        <CommissioningFranchisorReportFooter reportData={reportData} />
      </Spin>
    </div>
  )
}

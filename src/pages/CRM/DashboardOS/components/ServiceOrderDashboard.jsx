/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { apiCRM, apiServices, apiChecklist, apiContract } from '@services/api' // Assuming you have a separate API service for service orders
import { Spin, Row, Col } from 'antd'
import PropTypes from 'prop-types'
import { handleAuthError } from '@utils'
import DashboardHeader from './DashboardHeader'
import ServiceOrderStateCard from './ServiceOrderStateCard' // Assuming you have a new component for service order states
import ServiceOrderGraphCard from './ServiceOrderGraphCard' // Assuming you have a new component for service order funnel
import ServiceOrderRankingCard from './ServiceOrderRankingCard' // Assuming you have a new component for service order ranking
import ServiceOrderDetailModal from '../modals/ServiceOrderDetailModal'
import AtendimentoRankingCard from './AtendimentoRankingCard' // Assuming you have a new component for service order ranking
import DashboardFooter from './DashboardFooter'
import moment from 'moment/moment'

const gutter = 18

export default function ServiceOrderDashboard({ userPermissions }) {
  const [viewOptionId, setViewOptionId] = useState(1)
  const [rangeDate, setRangeDate] = useState([
    moment().subtract(1, 'months').startOf('month'),
    moment().subtract(1, 'months').endOf('month'),
  ])
  const [loading, setLoading] = useState(true)

  const [atendimentoRankingData, setAtendimentoRankingData] = useState([])
  const [servicoRankingData, setServicoRankingData] = useState([])
  const [collaboratorData, setCollaboratorData] = useState([])
  const [servicoData, setServicoData] = useState([])
  const [classificacaoOSData, setClassificacaoOSData] = useState([])
  const [tipoOSData, setTipoOSData] = useState([])
  const [qtOSCriadas, setQtOSCriadas] = useState(0)
  const [qtOSLiquidadas, setQtOSLiquidadas] = useState(0)
  const [qtOSAguardando, setQtOSAguardando] = useState(0)
  const [qtOSCanceladas, setQtOSCanceladas] = useState(0)

  const [type, setType] = useState("")

  const [serviceOrderDetail, setServiceOrderDetail] = useState([])
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [serviceOrderDetailVisible, setServiceOrderDetailVisible] = useState(
    false,
  )
  const [serviceOrderDetailType, setServiceOrderDetailType] = useState("")
  const [serviceOrderDetailParams, setServiceOrderDetailParams] = useState(null)

  const [filterClients, setFilterClients] = useState([])
  const [filterServices, setFilterServices] = useState([])
  const [filterTypes, setFilterTypes] = useState([])
  const [filterClassOS, setFilterClassOS] = useState([])

  // In ServiceOrderDashboard.jsx, add this near other state declarations
  const [filterParams, setFilterParams] = useState({
    tipoOSId: [],
    colaboradorId: [],
    classificacaoOsId: [],
    pessoaId: [],
    serviceOrderId: '',
    selectedPeriod: 'PeriodoCriacaoOs',
    rangeDate: [
      moment().subtract(1, 'months').startOf('month'),
      moment().subtract(1, 'months').endOf('month')
    ]
  });

  const [filterTipoOSId, setFilterTipoOSId] = useState([])
  const [filterColaboradorId, setFilterColaboradorId] = useState([])
  const [filterClassificacaoOsId, setFilterClassificacaoOsId] = useState([])
  const [filterPessoaId, setFilterPessoaId] = useState([])
  const [filterServiceOrderId, setFilterServiceOrderId] = useState([])

  const [selectedPeriod, setSelectedPeriod] = useState('PeriodoCriacaoOs')

  useEffect(() => {
    const fetchProfileAndData = async () => {
      await fetchData()
    }
    fetchProfileAndData()
  }, [filterParams])

  function getParams(selectedPeriod, rangeDate) {
    const params = {
      TipoOSId: filterParams.tipoOSId || [], // Add default empty array
      ColaboradorId: filterParams.colaboradorId || [],
      ClassificacaoOsId: filterParams.classificacaoOsId || [],
      PessoaId: filterParams.pessoaId || [],
      ServiceOrderId: filterParams.serviceOrderId || [],
      ServicoId: filterParams.servicoId || [] // Add ServicoId parameter
    }

    // Only add date range if we have valid dates
    if (rangeDate && rangeDate[0] && rangeDate[1]) {
      const formattedDates = `${rangeDate[0].format('YYYY-MM-DDT00:00:00')}|${rangeDate[1].format('YYYY-MM-DDT23:59:59')}`

      switch (selectedPeriod) {
        case 'periodoApontamento':
          params.PeriodoApontamento = formattedDates
          break
        case 'PeriodoCriacaoOs':
          params.PeriodoCriacaoOs = formattedDates
          break
        case 'PeriodoLiquidaOs':
          params.PeriodoLiquidaOs = formattedDates
          break
        case 'PeriodoCancelaOs':
          params.PeriodoCancelaOs = formattedDates
          break
      }
    }

    return params
  }

  async function openServiceOrderDetail(type, id, source) {
    setLoadingDetail(true)
    setServiceOrderDetailVisible(true)

    try {
      const params = getParams(selectedPeriod, rangeDate)
      if (params.PeriodoCriacaoOs) {
        params.PeriodoAbertura = params.PeriodoCriacaoOs
        delete params.PeriodoCriacaoOs
      }
      if (params.PeriodoLiquidaOs) {
        params.PeriodoLiquidacao = params.PeriodoLiquidaOs
        delete params.PeriodoLiquidaOs
      }
      if (params.PeriodoCancelaOs) {
        params.PeriodoCancelamento = params.PeriodoCancelaOs
        delete params.PeriodoCancelaOs
      }
      if (source === 'serviceOrderRankingService') {
        const service = servicoData.find(service => service.descricao === id)
        params.ServicoId = service ? service.servicoId : id
      }
      if (source === 'serviceOrderRankingClass') {
        const classifOS = classificacaoOSData.find(classOs => classOs.descricao === id)
        params.ClassificacaoOSId = classifOS ? classifOS.classificacaoOsId : id
      }
      if (source === 'typeOSGraph') {
        const tipoOS = tipoOSData.find(tipo => tipo.descricao === id)
        params.TipoOSId = tipoOS ? tipoOS.tipoOSId : id
      }
      if (source === 'collaboratorGraph') {
        const collab = collaboratorData.find(tipo => tipo.descricao === id)
        params.ColaboradorId = collab ? collab.colaboradorId : id
      }
      if (source === 'atendimentoRanking') {
        const collab = atendimentoRankingData.find(tipo => tipo.id === id)
        params.ColaboradorId = collab ? collab.id : id
      }
      const response = await apiServices.get('/api/BuscarHorasApontadasView', {
        params,
      })

      let detailData = response.data

      if (source === 'serviceOrderStateWaitingLiq') {
        detailData = detailData.filter(item => item.dataLiquidacaoOs === null)
      } else if (source === 'serviceOrderStateLiq') {
        detailData = detailData.filter(item => moment(item.dataLiquidacaoOs, moment.ISO_8601, true).isValid())
      } else if (source === 'serviceOrderStateCancel') {
        detailData = detailData.filter(item => moment(item.dataCancelamentoOs, moment.ISO_8601, true).isValid())
      } else if (source === 'serviceOrderRankingService') {
        detailData = detailData.filter(item => item.descricao === id)
      } else if (source === 'serviceOrderRankingClass') {
        detailData = detailData.filter(item => item.descricao === id)
      }

      setServiceOrderDetail(detailData)
      setServiceOrderDetailType(type)
      setServiceOrderDetailParams({ type, id, source })
    } catch (error) {
      console.error('Error fetching detail data:', error)
    } finally {
      setLoadingDetail(false)
    }
  }

  async function getServices() {
    try {
      const response = await apiCRM.get(
        '/api/CRM/Item?type=Service&queryOperator=like&status=1&getPriceList=true',
      )
      setFilterServices(
        response.data.item?.map(c => ({ label: c.name, value: c.code })),
      )
    } catch (error) {
      console.error('Error fetching horas apontadas data:', error)
    }
  }

  async function getClassOS() {
    try {
      const response = await apiContract.get(
        '/api/Manufacturer/SOClassificationByOwner'
      )
      setFilterClassOS(
        response.data.sOClassifications?.map(c => ({ label: c.serviceOrderClassificationDescription, value: c.serviceOrderClassificationId })),
      )
    } catch (error) {
      console.error('Error fetching horas apontadas data:', error)
    }
  }

  async function getClients() {
    try {
      const response = await apiCRM.get(
        '/api/crm/person?personType=&addressType=&name=&shortName=moacir&responsibleFranchiseeName=&cityName=&stateAbbreviation=&cnpj=&cpf=&queryOperator=like&qualificacaoId=&origemContatoId=&segmentoMercadoId=&areaNegocioId=&userName=&status=&hasTasks=&attribute=&email=&getPersonDetails=true',
      )
      setFilterClients(
        response.data.person?.map(c => ({ label: c.name, value: c.personId })),
      )
    } catch (error) {
      console.error('Error fetching horas apontadas data:', error)
    }
  }

  async function getTypes() {
    try {
      const response = await apiChecklist.get(
        '/API/BusinessDocument/ServiceOrderTypesByOwner',
      )
      setFilterTypes(
        response.data.ServiceOrderTypes?.map(c => ({ label: `${c.Code} - ${c.Description}`, value: c.ServiceOrderTypeId })),
      )
    } catch (error) {
      console.error('Error fetching horas apontadas data:', error)
    }
  }

  async function getColaboradores() {
    try {
      // const params = getParams()
      const response = await apiCRM.get(
        '/api/CRM/Person?isSellerActive=false&isCollaborator=true&queryOperator=like&onlyMyOwnerId=false&getDeletedPerson=false&getPersonDetails=false',
      )
      // setServicoData(response.data.item)
      // setHorasApontadas(response.data)
    } catch (error) {
      console.error('Error fetching horas apontadas data:', error)
    }
  }

  async function fetchData() {
    setLoading(true)
    try {
      const params = getParams(selectedPeriod, rangeDate)
      await fetchOS(params)
      // await getColaboradores()
      await fetchAtendimentoRanking(params)
      await fetchServicoRanking(params)
      await fetchFilters()
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchFilters() {
    await getTypes()
    await getClients()
    await getServices()
    await getClassOS()
  }

  async function fetchOS(params) {
    try {
      const response = await apiServices.get('/api/TotalHorasApontadas', { params })
      setQtOSCriadas(response.data.osCriadas)
      setQtOSLiquidadas(response.data.osLiquidadas)
      setQtOSAguardando(qtOSCriadas - qtOSLiquidadas)
      setQtOSCanceladas(response.data.osCanceladas)

      setClassificacaoOSData(response.data.classificacaoOS)
      setTipoOSData(response.data.tipoOS)
      setServicoData(response.data.servico)
      setCollaboratorData(response.data.colaborador)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  async function fetchAtendimentoRanking(params) {
    try {
      const response = await apiServices.get('/api/RankingColaboradores', { params })
      const formattedData = response.data.colaborador.map(item => ({
        id: item.colaboradorId,
        name: item.colaborador,
        hours: item.totalHorasTrabalhadas,
        orders: item.qtOS,
        totalHorasTrabalhadas: item.totalHorasTrabalhadas,
        totalHorasDeslocamento: item.totalHorasDeslocamento,
        totalHorasCobranca: item.totalHorasCobranca,
        cor: item.cor,
      }))
      setAtendimentoRankingData(formattedData)
    } catch (error) {
      console.error('Error fetching atendimento ranking data:', error)
    }
  }

  async function fetchServicoRanking(params) {
    try {
      const response = await apiServices.get("/api/RankingServicos", { params },)
      const formattedData = response.data.map(item => ({
        id: item.serviceOrderId,
        name: item.servico, // Will show in "Serviço" column
        hours: item.totalHorasCobranca, // Will show in "Horas atendimento" column
        orders: item.qtOS, // Will show in "Ordens de serviço" column
        // Keep additional data for reference
        totalHorasTrabalhadas: item.totalHorasTrabalhadas,
        totalHorasDeslocamento: item.totalHorasDeslocamento,
        totalHorasCobranca: item.totalHorasCobranca
      }))
      setServicoRankingData(formattedData)
    } catch (error) {
      console.error('Error fetching atendimento ranking data:', error)
    }
  }

  return (
    <React.Fragment>
      <ServiceOrderDetailModal
        loading={loadingDetail}
        visible={serviceOrderDetailVisible}
        setVisible={setServiceOrderDetailVisible}
        serviceOrderDetail={serviceOrderDetail}
        serviceOrderDetailType={serviceOrderDetailType}
        serviceOrderDetailParams={serviceOrderDetailParams}
      />
      <Spin size="large" spinning={loading}>
        <DashboardHeader
          {...{
            viewOptionId,
            setViewOptionId,
            filterClients,
            filterTypes,
            filterServices,
            filterClassOS,
            setFilterParams,
            filterParams,
            rangeDate,
            setRangeDate,
            setFilterTypes,
            setFilterClients,
            setFilterServices,
            setFilterClassOS,
            setFilterTipoOSId,
            setFilterColaboradorId,
            setFilterClassificacaoOsId,
            setFilterPessoaId,
            setFilterServiceOrderId,
            fetchData,
            selectedPeriod,
            setSelectedPeriod,
          }}
        />
        <Row type="flex" gutter={gutter}>
          <Col span={12}>
            <Row className="mb-2" type="flex" gutter={gutter}>
              <Col span={12}>
                <ServiceOrderStateCard
                  type={1}
                  loading={false}
                  qtOSCriadas={qtOSCriadas}
                  qtOSLiquidadas={qtOSLiquidadas}
                  qtOSAguardando={qtOSAguardando}
                  qtOSCanceladas={qtOSCanceladas}
                  openServiceOrderDetail={(type, id) =>
                    openServiceOrderDetail(type, id, 'serviceOrderState')
                  }
                />
              </Col>
              <Col span={12}>
                <ServiceOrderStateCard
                  type={2}
                  loading={false}
                  qtOSCriadas={qtOSCriadas}
                  qtOSLiquidadas={qtOSLiquidadas}
                  qtOSAguardando={qtOSAguardando}
                  qtOSCanceladas={qtOSCanceladas}
                  openServiceOrderDetail={(type, id) =>
                    openServiceOrderDetail(type, id, 'serviceOrderStateLiq')
                  }
                />
              </Col>
            </Row>
            <Row className="mb-2" type="flex" gutter={gutter}>
              <Col span={12}>
                <ServiceOrderStateCard
                  type={3}
                  loading={false}
                  qtOSCriadas={qtOSCriadas}
                  qtOSLiquidadas={qtOSLiquidadas}
                  qtOSAguardando={qtOSAguardando}
                  qtOSCanceladas={qtOSCanceladas}
                  openServiceOrderDetail={(type, id) =>
                    openServiceOrderDetail(type, id, 'serviceOrderStateWaitingLiq')
                  }
                />
              </Col>
              <Col span={12}>
                <ServiceOrderStateCard
                  type={4}
                  loading={false}
                  qtOSCriadas={qtOSCriadas}
                  qtOSLiquidadas={qtOSLiquidadas}
                  qtOSAguardando={qtOSAguardando}
                  qtOSCanceladas={qtOSCanceladas}
                  openServiceOrderDetail={(type, id) =>
                    openServiceOrderDetail(type, id, 'serviceOrderStateCancel')
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row className="mb-2" type="flex" gutter={gutter}>
              <Col span={12}>
                <ServiceOrderRankingCard
                  data={servicoData}
                  loading={false}
                  type={1}
                  openServiceOrderDetail={(type, id) =>
                    openServiceOrderDetail(type, id, 'serviceOrderRankingService')
                  }
                />
              </Col>
              <Col span={12}>
                <ServiceOrderRankingCard
                  data={classificacaoOSData}
                  loading={false}
                  type={2}
                  openServiceOrderDetail={(type, id) =>
                    openServiceOrderDetail(type, id, 'serviceOrderRankingClass')
                  }
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mb-2" type="flex" gutter={gutter}>
          <Col span={8}>
            <ServiceOrderGraphCard
              title="Tipo de ordem de serviço"
              type={1}
              data={tipoOSData}
              salesFunnelName="Mock Funnel"
              chartHeight={280}
              openProposalDetail={(type, id) =>
                openServiceOrderDetail(type, id, 'typeOSGraph')
              }
              loading={false}
            />
          </Col>
          <Col span={8}>
            <ServiceOrderGraphCard
              title="Colaboradores"
              type={2}
              data={collaboratorData}
              openProposalDetail={(type, id) =>
                openServiceOrderDetail(type, id, 'collaboratorGraph')
              }
              salesFunnelName="Mock Funnel"
              chartHeight={280}
              loading={false}
            />
          </Col>
          <Col span={8}>
            <AtendimentoRankingCard
              data={atendimentoRankingData}
              serviceData={servicoRankingData}
              loading={false}
              openServiceOrderDetail={(type, id) =>
                openServiceOrderDetail(type, id, 'atendimentoRanking')
              }
              type={type}
              setType={setType}
            />
          </Col>
        </Row>
        <DashboardFooter
          loading={false}
          setLoading={setLoading}
          userPermissions={userPermissions}
        />
      </Spin>
    </React.Fragment>
  )
}

ServiceOrderDashboard.propTypes = {
  userPermissions: PropTypes.array,
}

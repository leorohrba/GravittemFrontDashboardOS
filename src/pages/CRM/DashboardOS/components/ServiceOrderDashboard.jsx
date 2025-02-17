/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { apiCRM, apiServices, apiChecklist, apiContract } from '@services/api' // Assuming you have a separate API service for service orders
import { message, Spin, Row, Col } from 'antd'
import PropTypes from 'prop-types'
import { getColor } from '@utils/dashboard'
import { handleAuthError } from '@utils'
import DashboardHeader from './DashboardHeader'
import ServiceOrderStateCard from './ServiceOrderStateCard' // Assuming you have a new component for service order states
import AverageTimeCard from './AverageTicketCard' // Assuming you have a new component for average time
import ServiceOrderGraphCard from './ServiceOrderGraphCard' // Assuming you have a new component for service order funnel
import ServiceOrderRankingCard from './ServiceOrderRankingCard' // Assuming you have a new component for service order ranking
import ServiceOrderDetailModal from '../modals/ServiceOrderDetailModal'
import AtendimentoRankingCard from './AtendimentoRankingCard' // Assuming you have a new component for service order ranking
import TasksCard from './TasksCard'
// import ServiceOrderDetailModal from '../modals/ProposalDetailModal' // Assuming you have a new modal for service order details
import TaskDetailModal from '../modals/TaskDetailModal'
import DashboardFooter from './DashboardFooter'

import moment from 'moment/moment'
import debounce from 'lodash/debounce'
import { get } from 'http'

const gutter = 18

export default function ServiceOrderDashboard({ userPermissions }) {
  const [profile, setProfile] = useState(null)
  const [companyId, setCompanyId] = useState(null)
  const [viewOptionId, setViewOptionId] = useState(1)
  const [viewOptions, setViewOptions] = useState([
    { id: 1, name: 'Meus ordens de serviço' },
  ])
  const [serviceOrderType, setServiceOrderType] = useState(undefined)
  const [serviceOrderFunnelId, setServiceOrderFunnelId] = useState(undefined)
  const [rangeDate, setRangeDate] = useState([
    moment().startOf('month'),
    moment().startOf('month'),
  ])
  const [loading, setLoading] = useState(true)
  const [serviceOrderFunnels, setServiceOrderFunnels] = useState([])
  const [franchisees, setFranchisees] = useState([])
  const [franchiseeId, setFranchiseeId] = useState(undefined)
  const [serviceOrderStates, setServiceOrderStates] = useState([])
  const [keyServiceOrderRanking, setKeyServiceOrderRanking] = useState(0)
  const [isOnline, setIsOnline] = useState(false)
  const [logs, setLogs] = useState([])
  const [businessAreaId, setBusinessAreaId] = useState(null)
  const [businessAreas, setBusinessAreas] = useState([])
  const [sellerId, setSellerId] = useState(null)
  const [serviceOrderRankingType, setServiceOrderRankingType] = useState(null)
  const [taskSummaryType, setTaskSummaryType] = useState(null)

  const [atendimentoRankingData, setAtendimentoRankingData] = useState([])
  const [collaboratorData, setCollaboratorData] = useState([])
  const [servicoData, setServicoData] = useState([])
  const [classificacaoOSData, setClassificacaoOSData] = useState([])
  const [tipoOSData, setTipoOSData] = useState([])
  const [qtOSCriadas, setQtOSCriadas] = useState(0)
  const [qtOSLiquidadas, setQtOSLiquidadas] = useState(0)
  const [qtOSAguardando, setQtOSAguardando] = useState(0)
  const [qtOSCanceladas, setQtOSCanceladas] = useState(0)

  const [serviceOrderDetail, setServiceOrderDetail] = useState([])
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [serviceOrderDetailVisible, setServiceOrderDetailVisible] = useState(
    false,
  )
  const [serviceOrderDetailType, setServiceOrderDetailType] = useState("")
  const [serviceOrderDetailParams, setServiceOrderDetailParams] = useState(null)

  const [classificacaoOSDataDetail, setClassificacaoOSDataDetail] = useState([])
  const [horasApontadas, setHorasApontadas] = useState([])

  const [filterClients, setFilterClients] = useState([])
  const [filterServices, setFilterServices] = useState([])
  const [filterTypes, setFilterTypes] = useState([])
  const [filterClassOS, setFilterClassOS] = useState([])

  const [allServiceOrderDetails, setAllServiceOrderDetails] = useState([])

  //   useEffect(() => {
  //     getProfile().then(() => {
  //       fetchData(companyId)
  //     })
  //   }, [])

  useEffect(() => {
    const fetchProfileAndData = async () => {
      await getProfile()
      if (companyId) {
        fetchData()
      }
    }
    fetchProfileAndData()
  }, [companyId])

  async function loadModalData() {
    setLoading(true)
    try {
      const params = getParams()
      const response = await apiServices.get('/api/BuscarHorasApontadasView', {
        params,
      })
      setAllServiceOrderDetails(response.data)
    } catch (error) {
      console.error('Error fetching service order details:', error)
    } finally {
      setLoading(false)
    }
  }

  async function openServiceOrderDetail(type, id, source) {
    setLoadingDetail(true)
    setServiceOrderDetailVisible(true)

    try {
      console.log("collaboratorData", collaboratorData)
      const params = getParams()
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
      } else if (source === 'horasApontadas') {
        detailData = detailData.filter(item => item.source === 'horasApontadas')
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

  async function getProfile() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/Owner`,
      })
      const { data } = response
      if (data.isOk) {
        setProfile(data)
        setCompanyId(data.companyId)
        if (data.ownerProfile === 'Franchisor') {
          viewOptions.push({ id: 2, name: 'Todas as unidades' })
          viewOptions.push({ id: 3, name: 'Unidade específica' })
          setViewOptionId(2)
          setViewOptions([...viewOptions])
        }
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function getParams() {
    const params = {
      empresaId: '2',
      //   empresaId: companyId,
      periodoApontamento: '2018-01-01T00:00:00|2026-02-01T23:59:59',
      //   periodoAbertura: '2018-01-01T00:00:00|2026-02-01T23:59:59',
      //   periodoLiquidacao: '2018-01-01T00:00:00|2026-02-01T23:59:59',
      //   periodoCancelamento: '2018-01-01T00:00:00|2026-02-01T23:59:59',
      //   periodoLiquidacaoServico: '2018-01-01T00:00:00|2026-02-01T23:59:59',
    }
    return params
  }

  async function getServices() {
    try {
      // const params = getParams()
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
      // const params = getParams()
      const response = await apiContract.get(
        '/api/Manufacturer/SOClassificationByOwner',
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
      // const params = getParams()
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
      // const params = getParams()
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

  async function getOSNumber() {
    try {
      // const params = getParams()
      const response = await apiServices.get(
        '/api/OrdemServico?OrdemServicoNumero=102',
      )
      // setServicoData(response.data.item)
      // setHorasApontadas(response.data)
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

  async function getCampos() {
    try {
      const params = getParams()
      const response = await apiServices.get(
        '/api/BuscarHorasApontadasView/campos',
        {
          params,
        },
      )
      // setServicoData(response.data.item)
      // setHorasApontadas(response.data)
    } catch (error) {
      console.error('Error fetching horas apontadas data:', error)
    }
  }

  async function fetchData() {
    setLoading(false)
    await fetchOS()
    await getClassificacaoDetail()
    // await getHorasApontadas()
    await fetchAtendimentoRanking()
    await getCampos()
    await getColaboradores()
    await getClients()
    await getTypes()
    await getServices()
    await getClassOS()
  }

  async function getClassificacaoDetail() {
    try {
      const response = await apiServices.get(
        'Gravittem/contract/api/Manufacturer/SOClassificationByOwner',
      )
      setClassificacaoOSDataDetail(response.data)
    } catch (error) {
      console.error('Error fetching classificacao data:', error)
    }
  }

  async function fetchOS() {
    try {
      const response = await apiServices.get('/api/TotalHorasApontadas')
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

  async function fetchAtendimentoRanking() {
    try {
      const response = await apiServices.get('/api/RankingColaboradores')
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

  return (
    <React.Fragment>
      <ServiceOrderDetailModal
        loading={loadingDetail}
        visible={serviceOrderDetailVisible}
        setVisible={setServiceOrderDetailVisible}
        serviceOrderDetail={serviceOrderDetail}
        serviceOrderDetailType={serviceOrderDetailType}
        serviceOrderDetailParams={serviceOrderDetailParams}
        profile={profile}
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
            rangeDate,
            setRangeDate,
            profile,
            setBusinessAreaId,
            sellerId,
            // setSalesRankingType,
            setTaskSummaryType,
            setFilterTypes,
            setFilterClients,
            setFilterServices,
            setFilterClassOS,
          }}
        />
        <Row type="flex" gutter={gutter}>
          <Col span={12}>
            <Row className="mb-2" type="flex" gutter={gutter}>
              <Col span={12}>
                <ServiceOrderStateCard
                  type={1}
                  //   loading={loadingServiceOrderState}
                  loading={false}
                  serviceOrderState={serviceOrderStates.find(x => x.type === 1)}
                  qtOSCriadas={qtOSCriadas}
                  qtOSLiquidadas={qtOSLiquidadas}
                  qtOSAguardando={qtOSAguardando}
                  qtOSCanceladas={qtOSCanceladas}
                  openServiceOrderDetail={(type, id) =>
                    openServiceOrderDetail(type, id, 'serviceOrderState')
                  }
                // openServiceOrderDetail={openServiceOrderDetail}
                />
              </Col>
              <Col span={12}>
                <ServiceOrderStateCard
                  type={2}
                  //   loading={loadingServiceOrderState}
                  loading={false}
                  serviceOrderState={serviceOrderStates.find(x => x.type === 2)}
                  qtOSCriadas={qtOSCriadas}
                  qtOSLiquidadas={qtOSLiquidadas}
                  qtOSAguardando={qtOSAguardando}
                  qtOSCanceladas={qtOSCanceladas}
                  openServiceOrderDetail={(type, id) =>
                    openServiceOrderDetail(type, id, 'serviceOrderStateLiq')
                  }
                //   openServiceOrderDetail={(type, id) => openServiceOrderDetail(type, id, 'serviceOrderState')}
                />
              </Col>
            </Row>
            <Row className="mb-2" type="flex" gutter={gutter}>
              <Col span={12}>
                <ServiceOrderStateCard
                  type={3}
                  //   loading={loadingServiceOrderState}
                  loading={false}
                  serviceOrderState={serviceOrderStates.find(x => x.type === 3)}
                  qtOSCriadas={qtOSCriadas}
                  qtOSLiquidadas={qtOSLiquidadas}
                  qtOSAguardando={qtOSAguardando}
                  qtOSCanceladas={qtOSCanceladas}
                  openServiceOrderDetail={(type, id) =>
                    openServiceOrderDetail(type, id, 'serviceOrderStateWaitingLiq')
                  }
                //   openServiceOrderDetail={(type, id) => openServiceOrderDetail(type, id, 'serviceOrderState')}
                />
              </Col>
              <Col span={12}>
                <ServiceOrderStateCard
                  type={4}
                  //   loading={loadingServiceOrderState}
                  loading={false}
                  serviceOrderState={serviceOrderStates.find(x => x.type === 4)}
                  qtOSCriadas={qtOSCriadas}
                  qtOSLiquidadas={qtOSLiquidadas}
                  qtOSAguardando={qtOSAguardando}
                  qtOSCanceladas={qtOSCanceladas}
                  openServiceOrderDetail={(type, id) =>
                    openServiceOrderDetail(type, id, 'serviceOrderStateCancel')
                  }
                //   openServiceOrderDetail={openServiceOrderDetail}
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row className="mb-2" type="flex" gutter={gutter}>
              <Col span={12}>
                <ServiceOrderRankingCard
                  data={servicoData}
                  //   loading={loadingRanking}
                  loading={false}
                  type={1}
                  setType={setServiceOrderRankingType}
                  key={keyServiceOrderRanking}
                  openServiceOrderDetail={(type, id) =>
                    openServiceOrderDetail(type, id, 'serviceOrderRankingService')
                  }
                  //   openServiceOrderDetail={openServiceOrderDetail}
                  profile={profile}
                />
              </Col>
              <Col span={12}>
                <ServiceOrderRankingCard
                  data={classificacaoOSData}
                  //   loading={loadingRanking}
                  loading={false}
                  type={2}
                  setType={setServiceOrderRankingType}
                  openServiceOrderDetail={(type, id) =>
                    openServiceOrderDetail(type, id, 'serviceOrderRankingClass')
                  }
                  key={keyServiceOrderRanking}
                  //   openServiceOrderDetail={openServiceOrderDetail}
                  profile={profile}
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
            // openProposalDetail={(type, id) =>
            //   console.log(`Open detail for ${type} with id ${id}`)
            // }
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
            // openProposalDetail={(type, id) =>
            //   console.log(`Open detail for ${type} with id ${id}`)
            // }
            />
          </Col>
          <Col span={8}>
            <AtendimentoRankingCard
              data={atendimentoRankingData}
              //   loading={loadingRanking}
              loading={false}
              openServiceOrderDetail={(type, id) =>
                openServiceOrderDetail(type, id, 'atendimentoRanking')
              }
              setType={setServiceOrderRankingType}
              key={keyServiceOrderRanking}
              profile={profile}
            />
          </Col>
        </Row>
        <DashboardFooter
          logs={logs}
          //   loading={loading}
          loading={false}
          setLoading={setLoading}
          //   fetchData={fetchData}
          userPermissions={userPermissions}
        />
      </Spin>
    </React.Fragment>
  )
}

ServiceOrderDashboard.propTypes = {
  userPermissions: PropTypes.array,
}

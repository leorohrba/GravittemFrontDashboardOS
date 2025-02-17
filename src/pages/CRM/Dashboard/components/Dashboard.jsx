/* eslint-disable react-hooks/exhaustive-deps  */
import React, { useState, useEffect } from 'react'
import { apiCRM } from '@services/api'
import { message, Spin, Row, Col } from 'antd'
import PropTypes from 'prop-types'
import { getColor } from '@utils/dashboard'
import { handleAuthError } from '@utils'
import DashboardHeader from './DashboardHeader'
import ProposalStateCard from './ProposalStateCard'
import AverageTicketCard from './AverageTicketCard'
import AverageCycleCard from './AverageCycleCard'
import ConversionRateCard from './ConversionRateCard'
import LossReasonCard from './LossReasonCard'
import SalesFunnelCard from './SalesFunnelCard'
import SalesRankingCard from './SalesRankingCard'
import TasksCard from './TasksCard'
import ProposalDetailModal from '../modals/ProposalDetailModal'
import TaskDetailModal from '../modals/TaskDetailModal'
import DashboardFooter from './DashboardFooter'

import moment from 'moment'

let salesFunnelOk = false

const gutter = 18

export default function Dashboard({ userPermissions }) {
  const [profile, setProfile] = useState(null)
  const [viewOptionId, setViewOptionId] = useState(1)
  const [viewOptions, setViewOptions] = useState([
    { id: 1, name: 'Meus negócios' },
  ])
  const [proposalType, setProposalType] = useState(undefined)
  const [salesFunnelId, setSalesFunnelId] = useState(undefined)
  const [rangeDate, setRangeDate] = useState([
    moment().startOf('month'),
    moment().startOf('month'),
  ]) // [moment('2019-10-01'), moment('2019-10-01')]
  const [loading, setLoading] = useState(true)
  const [salesFunnels, setSalesFunnels] = useState([])
  const [franchisees, setFranchisees] = useState([])
  const [franchiseeId, setFranchiseeId] = useState(undefined)
  const [loadingProposalState, setLoadingProposalState] = useState(true)
  const [proposalStates, setProposalStates] = useState([])
  const [proposalAverageCycle, setProposalAverageCycle] = useState(null)
  const [
    loadingProposalAverageCycle,
    setLoadingProposalAverageCycle,
  ] = useState(true)
  const [proposalConversionRate, setProposalConversionRate] = useState(null)
  const [
    loadingProposalConversionRate,
    setLoadingProposalConversionRate,
  ] = useState(true)
  const [proposalLossReason, setProposalLossReason] = useState(null)
  const [loadingProposalLossReason, setLoadingProposalLossReason] = useState(
    true,
  )
  const [stages, setStages] = useState([])
  const [loadingStage, setLoadingStage] = useState(true)
  const [rankingData, setRankingData] = useState([])
  const [loadingRanking, setLoadingRanking] = useState(true)
  const [keySalesRanking, setKeySalesRanking] = useState(0)
  const [tasks, setTasks] = useState([])
  const [loadingTask, setLoadingTask] = useState(true)
  const [proposalDetail, setProposalDetail] = useState([])
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [proposalDetailVisible, setProposalDetailVisible] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [proposalDetailType, setProposalDetailType] = useState(null)
  const [proposalDetailParams, setProposalDetailParams] = useState(null)
  const [taskDetail, setTaskDetail] = useState([])
  const [taskDetailVisible, setTaskDetailVisible] = useState(false)
  const [taskDetailParams, setTaskDetailParams] = useState(null)
  const [logs, setLogs] = useState([])
  const [businessAreaId, setBusinessAreaId] = useState(null)
  const [businessAreas, setBusinessAreas] = useState([])
  const [sellerId, setSellerId] = useState(null)
  const [salesRankingType, setSalesRankingType] = useState(null)
  const [taskSummaryType, setTaskSummaryType] = useState(null)
  const [salesFunnelCardType, setSalesFunnelCardType] = useState('salesFunnel')
  const [salesFunnelName, setSalesFunnelName] = useState(null)

  useEffect(() => {
    getProfile()
    getBusinessAreas()
  }, [])

  useEffect(() => {
    if (salesFunnelOk) {
      fetchData()
    }
  }, [
    viewOptionId,
    salesFunnelId,
    rangeDate,
    proposalType,
    franchiseeId,
    businessAreaId,
    sellerId,
  ])

  useEffect(() => {
    if (salesRankingType && salesFunnelOk) {
      getSalesRankingByType()
    }
  }, [salesRankingType])

  useEffect(() => {
    if (taskSummaryType && salesFunnelOk) {
      getTaskSummaryByType()
    }
  }, [taskSummaryType])

  function fetchData() {
    setLoading(false)
    getProposalState()
    getProposalAverageCycle()
    getProposalConversionRate()
    getProposalLossReason()
    if (salesFunnelId) {
      getProposalFunnelStage(salesFunnelId)
    } else {
      getProposalSalesFunnel()
    }

    getSalesRankingByType()
    getTaskSummaryByType()

    getLogProcessBI()
  }

  function getSalesRankingByType() {
    if (salesRankingType === 'franchisee') {
      getSalesRanking('franchiseSalesRanking')
    } else if (salesRankingType === 'seller') {
      getSalesRanking('sellerSalesRanking')
    } else if (salesRankingType === 'businessArea') {
      getSalesRanking('businessAreaSalesRanking')
    }
  }

  function getTaskSummaryByType() {
    if (taskSummaryType === 'franchisee') {
      getTaskSummary('franchiseTaskSummary')
    } else if (taskSummaryType === 'seller') {
      getTaskSummary('sellerTaskSummary')
    }
  }

  function getParams() {
    const option =
      profile && profile.ownerProfile === 'Franchisor' && viewOptionId === 1
        ? true
        : profile.ownerProfile === 'Franchise'
        ? false
        : null
    const params = {
      startMonthYear: rangeDate[0].startOf('month').format('YYYY-MM-DD'),
      endMonthYear: rangeDate[1].startOf('month').format('YYYY-MM-DD'),
      franchiseeId: viewOptionId === 3 ? franchiseeId : null,
      isFranchiseSales: option,
      isFranchiseTask: option,
      salesFunnelId,
      proposalType,
      sellerId,
      businessAreaId,
    }
    return params
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
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getTaskSummary(endpoint) {
    setLoadingTask(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/BI/${endpoint}`,
        params: getParams(),
      })
      setLoadingTask(false)
      const { data } = response
      if (data.isOk) {
        setTasks(data.taskSummary)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getSalesRanking(endpoint) {
    setLoadingRanking(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/BI/${endpoint}`,
        params: getParams(),
      })
      setLoadingRanking(false)
      const { data } = response
      if (data.isOk) {
        setRankingData(data.salesRanking)
        setKeySalesRanking(keySalesRanking + 1)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getProposalFunnelStage(id) {
    setLoadingStage(true)
    const params = getParams()
    if (id) {
      params.salesFunnelId = id
    }
    setSalesFunnelCardType('funnelStage')
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/BI/ProposalFunnelStage`,
        params,
      })
      setLoadingStage(false)
      const { data } = response

      if (data.isOk) {
        const source = []
        let name = null
        let more = false
        data.proposalFunnelStage.map((d, index) => {
          more = name && name !== d.salesFunnelName ? true : more
          name = d.salesFunnelName
          source.push({
            id: d.funnelStageId,
            description: d.funnelStageName,
            icon: d.funnelStageIcon,
            quantity: d.quantity,
            uniqueValue: d.uniqueValue,
            recurrenceValue: d.recurrenceValue,
            locationValue: d.locationValue,
            color: getColor(index),
          })
          return true
        })
        setSalesFunnelName(more ? 'Vários' : name)
        setStages(source)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getProposalSalesFunnel() {
    setLoadingStage(true)
    setSalesFunnelCardType('salesFunnel')
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/BI/ProposalSalesFunnel`,
        params: getParams(),
      })
      setLoadingStage(false)
      const { data } = response
      if (data.isOk) {
        if (data.proposalSalesFunnel.length === 1) {
          getProposalFunnelStage(data.proposalSalesFunnel[0].salesFunnelId)
          return
        }
        const source = data.proposalSalesFunnel.map((d, index) => ({
          id: d.salesFunnelId,
          description: d.salesFunnelName,
          quantity: d.quantity,
          uniqueValue: d.uniqueValue,
          recurrenceValue: d.recurrenceValue,
          locationValue: d.locationValue,
          color: getColor(index),
        }))
        setStages(source)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getProposalState() {
    setLoadingProposalState(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/BI/ProposalState`,
        params: getParams(),
      })
      setLoadingProposalState(false)
      const { data } = response
      if (data.isOk) {
        setProposalStates(data.proposalState)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getProposalAverageCycle() {
    setLoadingProposalAverageCycle(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/BI/ProposalAverageCycle`,
        params: getParams(),
      })
      setLoadingProposalAverageCycle(false)
      const { data } = response
      if (data.isOk) {
        setProposalAverageCycle(data.proposalAverageCycle)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }
  async function getProposalConversionRate() {
    setLoadingProposalConversionRate(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/BI/ProposalConversionRate`,
        params: getParams(),
      })
      setLoadingProposalConversionRate(false)
      const { data } = response
      if (data.isOk) {
        setProposalConversionRate(data.proposalConversionRate)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getProposalLossReason() {
    setLoadingProposalLossReason(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/BI/ProposalLossReason`,
        params: getParams(),
      })
      setLoadingProposalLossReason(false)
      const { data } = response
      if (data.isOk) {
        setProposalLossReason(data.proposalLossReason)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getSalesFunnels(userProfile) {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/SalesFunnel`,
        params: { useFilterType: userProfile.ownerProfile === 'Franchise' },
      })
      salesFunnelOk = true
      const { data } = response
      if (data.isOk) {
        setSalesFunnels(data.salesFunnel)
        setSalesFunnelId(
          data.salesFunnel.length > 0
            ? data.salesFunnel[0].salesFunnelId
            : undefined,
        )
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getFranchisees() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/person`,
        params: { isFranchisee: true, isActive: true },
      })
      const { data } = response
      if (data.isOk) {
        setFranchisees(data.person)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getLogProcessBI() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/BI/LogProcessBI`,
        params: { type: 1, status: 2, limitRecord: 1 },
      })
      const { data } = response
      if (data.isOk) {
        setLogs(data.logProcessBI)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
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

        if (data.ownerProfile === 'Franchisor') {
          viewOptions.push({ id: 2, name: 'Todas as unidades' })
          viewOptions.push({ id: 3, name: 'Unidade específica' })
          setViewOptionId(2)
          setViewOptions([...viewOptions])
          getFranchisees()
        }

        const type =
          data?.ownerProfile === 'Standard' ||
          data?.ownerProfile === 'Franchise' ||
          (data?.ownerProfile === 'Franchisor' && viewOptionId === 3)
            ? 'seller'
            : 'franchisee'

        setSalesRankingType(type)
        setTaskSummaryType(type)

        getSalesFunnels(data)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function getProposalDetailParams(type, id) {
    const params = getParams()
    setIsOnline(!!(type === 'salesFunnel' || type === 'funnelStage'))
    setProposalDetailType(type)

    if (type === 'proposalState' && (id === 1 || id === 2)) {
      params.startMonthYearClosed = params?.startMonthYear
      params.endMonthYearClosed = params?.endMonthYear
      params.actStatusCode = id === 1 ? 'WON' : 'LOST'
    }
    if (type === 'averageTicket') {
      params.startMonthYearClosed = params?.startMonthYear
      params.endMonthYearClosed = params?.endMonthYear
      params.actStatusCode = 'WON'
    } else if (type === 'proposalState' && id === 3) {
      params.startMonthYearCreate = params?.startMonthYear
      params.endMonthYearCreate = params?.endMonthYear
    } else if (type === 'averageCycle') {
      params.startMonthYearClosed = params?.startMonthYear
      params.endMonthYearClosed = params?.endMonthYear
      params.actStatusCode = 'WON'
    } else if (type === 'conversionRate') {
      params.startMonthYearClosed = params?.startMonthYear
      params.endMonthYearClosed = params?.endMonthYear
      params.startMonthYearCreate = params?.startMonthYear
      params.endMonthYearCreate = params?.endMonthYear
    } else if (type === 'lossReason') {
      params.startMonthYearClosed = params?.startMonthYear
      params.endMonthYearClosed = params?.endMonthYear
      params.actStatusCode = 'LOST'
      params.lossReasonId = id
    } else if (type === 'salesFunnel') {
      params.startMonthYearCreate = params?.startMonthYear
      params.endMonthYearCreate = params?.endMonthYear
      params.salesFunnelId = id
    } else if (type === 'funnelStage') {
      params.startMonthYearCreate = params?.startMonthYear
      params.endMonthYearCreate = params?.endMonthYear
      params.funnelStageId = id
    } else if (type === 'salesRankingFranchisee') {
      params.startMonthYearClosed = params?.startMonthYear
      params.endMonthYearClosed = params?.endMonthYear
      params.isClosed = true
      params.franchiseeId = id
    } else if (type === 'salesRankingSeller') {
      params.startMonthYearClosed = params?.startMonthYear
      params.endMonthYearClosed = params?.endMonthYear
      params.isClosed = true
      params.sellerId = id
    } else if (type === 'salesRankingBusinessArea') {
      params.startMonthYearClosed = params?.startMonthYear
      params.endMonthYearClosed = params?.endMonthYear
      params.isClosed = true
      params.businessAreaId = id
      if (!id) {
        params.isBusinessAreaIdNull = true
      }
    }
    setProposalDetailParams(params)
    return params
  }

  async function openProposalDetail(type, id) {
    setLoadingDetail(true)
    setProposalDetailVisible(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url:
          type === 'salesFunnel' || type === 'funnelStage'
            ? `/api/CRM/BI/OnlineProposalDetail`
            : `/api/CRM/BI/ProposalDetail`,
        params: getProposalDetailParams(type, id),
      })
      setLoadingDetail(false)
      const { data } = response
      if (data.isOk) {
        setProposalDetail(data.proposalDetail)
      } else {
        setProposalDetailVisible(false)
        message.error(data.message)
      }
    } catch (error) {
      setProposalDetailVisible(false)
      handleAuthError(error)
    }
  }

  function getTaskDetailParams(type, taskTypeId, id) {
    const params = getParams()
    params.startMonthYearClosed = params?.startMonthYear
    params.endMonthYearClosed = params?.endMonthYear
    params.startMonthYearCreate = params?.startMonthYear
    params.endMonthYearCreate = params?.endMonthYear
    params.taskTypeId = taskTypeId
    if (type === 'franchisee') {
      params.franchiseeId = id
      params.hasFranchisee = id ? null : false
    } else {
      params.sellerId = id
    }
    setTaskDetailParams(params)
    return params
  }

  async function openTaskDetail(type, taskTypeId, id) {
    setLoadingDetail(true)
    setTaskDetailVisible(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/BI/taskDetail`,
        params: getTaskDetailParams(type, taskTypeId, id),
      })
      setLoadingDetail(false)
      const { data } = response
      if (data.isOk) {
        setTaskDetail(data.taskDetail)
      } else {
        setTaskDetailVisible(false)
        message.error(data.message)
      }
    } catch (error) {
      setTaskDetailVisible(false)
      handleAuthError(error)
    }
  }

  return (
    <React.Fragment>
      <ProposalDetailModal
        loading={loadingDetail}
        visible={proposalDetailVisible}
        setVisible={setProposalDetailVisible}
        proposalDetail={proposalDetail}
        isOnline={isOnline}
        proposalDetailType={proposalDetailType}
        proposalDetailParams={proposalDetailParams}
        profile={profile}
      />
      <TaskDetailModal
        loading={loadingDetail}
        visible={taskDetailVisible}
        setVisible={setTaskDetailVisible}
        taskDetail={taskDetail}
        taskDetailParams={taskDetailParams}
        profile={profile}
      />
      <Spin size="large" spinning={loading}>
        <DashboardHeader
          {...{
            viewOptionId,
            setViewOptionId,
            viewOptions,
            rangeDate,
            setRangeDate,
            proposalType,
            setProposalType,
            salesFunnelId,
            setSalesFunnelId,
            salesFunnels,
            franchisees,
            franchiseeId,
            setFranchiseeId,
            fetchData,
            profile,
            businessAreaId,
            setBusinessAreaId,
            businessAreas,
            sellerId,
            setSellerId,
            setSalesRankingType,
            setTaskSummaryType,
          }}
        />
        <Row type="flex" gutter={gutter}>
          <Col span={17}>
            <Row className="mb-2" type="flex" gutter={gutter}>
              <Col span={8}>
                <ProposalStateCard
                  type={1}
                  loading={loadingProposalState}
                  proposalState={proposalStates.find(x => x.type === 1)}
                  openProposalDetail={openProposalDetail}
                />
              </Col>
              <Col span={8}>
                <ProposalStateCard
                  type={2}
                  loading={loadingProposalState}
                  proposalState={proposalStates.find(x => x.type === 2)}
                  openProposalDetail={openProposalDetail}
                />
              </Col>
              <Col span={8}>
                <ProposalStateCard
                  type={3}
                  loading={loadingProposalState}
                  proposalState={proposalStates.find(x => x.type === 3)}
                  openProposalDetail={openProposalDetail}
                />
              </Col>
            </Row>
            <Row className="mb-2" type="flex" gutter={gutter}>
              <Col span={8}>
                <AverageTicketCard
                  loading={loadingProposalState}
                  proposalState={proposalStates.find(x => x.type === 1)}
                  openProposalDetail={openProposalDetail}
                />
              </Col>
              <Col span={8}>
                <AverageCycleCard
                  loading={loadingProposalAverageCycle}
                  proposalAverageCycle={proposalAverageCycle}
                  openProposalDetail={openProposalDetail}
                />
              </Col>
              <Col span={8}>
                <ConversionRateCard
                  loading={loadingProposalConversionRate}
                  proposalConversionRate={proposalConversionRate}
                  openProposalDetail={openProposalDetail}
                />
              </Col>
            </Row>
          </Col>
          <Col span={7}>
            <LossReasonCard
              loading={loadingProposalLossReason}
              proposalLossReason={proposalLossReason}
              openProposalDetail={openProposalDetail}
            />
          </Col>
        </Row>
        <Row className="mb-2" type="flex" gutter={gutter}>
          <Col span={12}>
            <SalesFunnelCard
              data={stages}
              loading={loadingStage}
              type={salesFunnelCardType}
              salesFunnelName={salesFunnelName}
              chartHeight={280}
              openProposalDetail={openProposalDetail}
            />
          </Col>
          <Col span={12}>
            <SalesRankingCard
              data={rankingData}
              loading={loadingRanking}
              type={salesRankingType}
              setType={setSalesRankingType}
              key={keySalesRanking}
              openProposalDetail={openProposalDetail}
              profile={profile}
            />
          </Col>
        </Row>
        <Row>
          <div className="w-full mb-2">
            <TasksCard
              data={tasks}
              loading={loadingTask}
              type={taskSummaryType}
              setType={setTaskSummaryType}
              openTaskDetail={openTaskDetail}
              profile={profile}
            />
          </div>
        </Row>
        <DashboardFooter
          logs={logs}
          loading={loading}
          setLoading={setLoading}
          fetchData={fetchData}
          userPermissions={userPermissions}
        />
      </Spin>
    </React.Fragment>
  )
}

Dashboard.propTypes = {
  userPermissions: PropTypes.array,
}

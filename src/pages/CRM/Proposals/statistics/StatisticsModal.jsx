import {
  Popover,
  Modal,
  Spin,
  Row,
  Button,
  Skeleton,
  Tabs,
  Col,
  Tooltip,
} from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { getColor } from '@utils/dashboard'
import { customSort, hasPermission, buildAddressLine1 } from '@utils'
import moment from 'moment'
import ReactExport from 'react-data-export'
import StatisticsContent from './StatisticsContent'
import StatisticsTable from './StatisticsTable'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile
const { TabPane } = Tabs

// const defaultColor = '#63b3ed'

let models = [
  {
    title: 'Vendedor',
    id: 'sellerId',
    description: 'sellerName',
    noDescription: 'Sem vendedor',
    chartDescription: 'Negócios por vendedor',
  },
  {
    title: 'Franquia',
    id: 'franchiseeId',
    description: 'franchiseeName',
    noDescription: 'Sem franquia',
    chartDescription: 'Negócios por franquia',
  },
  {
    title: 'Status',
    id: 'actStatusId',
    description: 'actStatusDescription',
    chartDescription: 'Negócios por status',
  },
  {
    title: 'Cidade',
    id: 'cityId',
    description: 'cityName',
    noDescription: 'Sem cidade',
    chartDescription: 'Negócios por cidade',
  },
  {
    title: 'Estado',
    id: 'stateId',
    description: 'stateAbbreviation',
    noDescription: 'Sem estado',
    chartDescription: 'Negócios por estado',
  },
  {
    title: 'Tipo',
    id: 'proposalType',
    description: 'proposalTypeDescription',
    noDescription: 'Sem tipo',
    chartDescription: 'Negócios por tipo',
  },
  {
    title: 'Funil de vendas',
    id: 'salesFunnelId',
    description: 'salesFunnelTitle',
    noDescription: 'Sem funil',
    chartDescription: 'Negócios por funil de vendas',
  },
  {
    title: 'Fase',
    id: 'funnelStageId',
    description: 'funnelStageName',
    noDescription: 'Sem fase',
    chartDescription: 'Negócios por fase',
  },
  {
    title: 'Mês inclusão',
    id: 'createDateTime',
    description: 'createDateTime',
    type: 'moment',
    idFormat: 'YYYY-MM',
    descriptionFormat: 'MMM/YYYY',
    chartDescription: 'Negócios por mês/ano de inclusão',
    noDescription: 'Sem data',
  },
  {
    title: 'Mês encerramento',
    id: 'closedDate',
    description: 'closedDate',
    type: 'moment',
    idFormat: 'YYYY-MM',
    descriptionFormat: 'MMM/YYYY',
    chartDescription: 'Negócios por mês/ano de encerramento',
    noDescription: 'Sem data',
  },
]

function StatisticsModal(props) {
  const {
    proposals,
    statisticsModalVisible,
    setStatisticsModalVisible,
    editProposal,
    userPermissions,
    loading,
    ownerProfile,
  } = props

  const [preparing, setPreparing] = useState(true)
  const [data, setData] = useState([])
  const [chartType, setChartType] = useState('VB')
  const [popoverVisible, setPopoverVisible] = useState(false)
  const [proposalsFiltered, setProposalsFiltered] = useState([])
  const [activeTabKey, setActiveTabKey] = useState('0')
  const [dataExport, setDataExport] = useState([])
  const [valueType, setValueType] = useState('quantity')

  useEffect(() => {
    if (ownerProfile && ownerProfile === 'Standard') {
      models = models.filter(
        x => !(x.id === 'franchiseeId' || x.id === 'proposalType'),
      )
    }
  }, [ownerProfile])

  useEffect(() => {
    if (statisticsModalVisible) {
      prepareData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statisticsModalVisible, proposals])

  useEffect(() => {
    if (!statisticsModalVisible) {
      setPopoverVisible(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statisticsModalVisible])

  function prepareData() {
    setPreparing(true)
    const dataSource = []

    models.map((m, index) => {
      dataSource.push({
        title: m.title,
        chartDescription: m.chartDescription,
        hasColor: true,
        quantity: proposals.length,
        singleTotalAmount: proposals.reduce(
          (sum, { singleTotalAmount }) => sum + singleTotalAmount,
          0,
        ),
        recurringValue: proposals.reduce(
          (sum, { recurringValue }) => sum + recurringValue,
          0,
        ),
        index,
        data: [],
      })
      return true
    })

    proposals.map(d => {
      models.map((m, i) => {
        const { typeId } = m
        let targetId = m.id
        const type = typeId ? d[typeId] : null

        if (typeId && m.ids && m.ids.length <= type) {
          targetId = m.ids[type - 1]
        }

        const id =
          m.type !== 'moment'
            ? d[targetId]
            : d[targetId]
            ? moment(d[targetId]).format(m.idFormat)
            : null

        const index = dataSource[i].data.findIndex(
          x =>
            (!id && !x.id) ||
            (id && x.id === id && (!type || (type && x.type === type))),
        )

        if (index > -1) {
          dataSource[i].data[index].quantity++
          dataSource[i].data[index].singleTotalAmount += d.singleTotalAmount
          dataSource[i].data[index].recurringValue += d.recurringValue
          dataSource[i].data[index].quantityPercent =
            dataSource[i].data[index].quantity / dataSource[i].quantity
          dataSource[i].data[index].singleTotalAmountPercent =
            dataSource[i].data[index].singleTotalAmount /
            dataSource[i].singleTotalAmount
          dataSource[i].data[index].recurringValuePercent =
            dataSource[i].data[index].recurringValue /
            dataSource[i].recurringValue
        } else {
          let description =
            m.type !== 'moment'
              ? d[m.description]
              : d[m.description]
              ? moment(d[m.description]).format(m.descriptionFormat)
              : null

          let sort = description || `zz${m.noDescription}` // para colocar os noDescription por ultimo
          if (m.type === 'moment') {
            sort = description ? id : sort
          }

          if (!description) {
            description = m.noDescription
          }

          const color = m.color
            ? d[m.color] || getColor(dataSource[i].data.length)
            : getColor(dataSource[i].data.length)

          dataSource[i].data.push({
            id,
            type,
            description,
            color,
            sort,
            quantity: 1,
            singleTotalAmount: d.singleTotalAmount,
            recurringValue: d.recurringValue,
            quantityPercent: 1 / dataSource[i].quantity,
            singleTotalAmountPercent:
              d.singleTotalAmount / dataSource[i].singleTotalAmount,
            recurringValuePercent:
              d.recurringValue / dataSource[i].recurringValue,
          })
        }
        return true
      })
      return true
    })

    models.map((m, i) => {
      dataSource[i].data.sort((a, b) => customSort(a.sort, b.sort))
      return true
    })
    setData(dataSource)
    setPreparing(false)
  }

  useEffect(() => {
    setDataExport(buildDataToExport())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalsFiltered])

  const handlePopoverVisible = visible => {
    if (!visible) {
      setPopoverVisible(visible)
    }
  }

  function buildDataToExport() {
    const dataSetToExport = [
      {
        columns: [
          'Negócio',
          'Status',
          'Organização',
          'Contato',
          'Endereço',
          'Cidade',
          'Estado',
          'Franqueado',
          'Vendedor',
          'Funil',
          'Fase',
          'Dias sem interação',
          'Atividades agendadas',
          'Valor único',
          'Valor recorrência',
          'Data de criação',
          'Data prevista de fechamento',
          'Data de fechamento',
          'Motivo de perda',
        ],
        data: [],
      },
    ]

    proposalsFiltered.map(d =>
      dataSetToExport[0].data.push([
        d.number,
        d.actStatusDescription,
        d.companyShortName,
        d.personContactName,
        buildAddressLine1(d.addressName, d.addressNumber, d.neighborhood),
        d.cityName,
        d.stateAbbreviation,
        d.franchiseeName,
        d.sellerName,
        d.salesFunnelTitle,
        d.funnelStageName,
        d.daysNotInteraction,
        d.scheduledActivities || '',
        d.singleTotalAmount,
        d.recurringValue,
        d.createDateTime
          ? moment(d.createDateTime).format('DD/MM/YYYY HH:mm:ss')
          : '',
        d.expectedClosingDate
          ? moment(d.expectedClosingDate).format('DD/MM/YYYY')
          : '',
        d.closedDate ? moment(d.closedDate).format('DD/MM/YYYY HH:mm:ss') : '',
        d.lossReasonName,
      ]),
    )

    return dataSetToExport
  }

  const contentPopover = (
    <div
      className="mb-2"
      style={{ width: '600px', maxHeight: '450px', overflowY: 'auto' }}
    >
      <div style={{ paddingRight: '5px' }}>
        <StatisticsTable
          ownerProfile={ownerProfile}
          data={proposalsFiltered}
          editProposal={id => {
            setPopoverVisible(false)
            if (editProposal !== undefined) {
              editProposal(id)
            }
          }}
          userPermissions={userPermissions}
        />
      </div>
    </div>
  )

  const popoverTitle = (
    <Row type="flex" className="w-full" align="middle">
      <Col>
        <span className="align-middle">
          <h3>Negócios</h3>
        </span>
      </Col>
      <Col style={{ marginLeft: 'auto' }}>
        <Row type="flex" className="w-full">
          {hasPermission(userPermissions, 'ExportExcel') && (
            <Col>
              <ExcelFile
                filename={`Negócios_${moment().format('DD_MM_YYYY_HH_mm')}`}
                element={
                  <Tooltip title="Exportar dados">
                    <i
                      className="fa fa-download fa-lg mr-4 cursor-pointer"
                      style={{ color: 'gray' }}
                    />
                  </Tooltip>
                }
              >
                <ExcelSheet dataSet={dataExport} name="Negócios" />
              </ExcelFile>
            </Col>
          )}
          <Col>
            <i
              className="fa fa-times fa-lg cursor-pointer"
              style={{ color: 'gray' }}
              role="button"
              onClick={() => setPopoverVisible(false)}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  )

  const modalTitle = (
    <Popover
      title={popoverTitle}
      visible={popoverVisible}
      content={contentPopover}
      onVisibleChange={visible => handlePopoverVisible(visible)}
    >
      <Row className="w-full">Estatística de Negócios</Row>
    </Popover>
  )

  const openProposals = (index, id, type) => {
    if (models[index].type !== 'moment') {
      if (!models[index].typeId) {
        setProposalsFiltered(
          proposals.filter(
            x =>
              (!id && !x[models[index].id]) ||
              (id && x[models[index].id] === id),
          ),
        )
      } else {
        setProposalsFiltered(
          proposals.filter(
            x =>
              (!type && !x[models[index].typeId]) ||
              (id && x[models[index].ids[type - 1]] === id),
          ),
        )
      }
    } else {
      setProposalsFiltered(
        proposals.filter(
          x =>
            (!id && !x[models[index].id]) ||
            (id &&
              x[models[index].id] &&
              moment(x[models[index].id]).format(models[index].idFormat) ===
                id),
        ),
      )
    }
    setPopoverVisible(true)
  }

  return (
    <Modal
      title={modalTitle}
      visible={statisticsModalVisible}
      centered
      width="95%"
      destroyOnClose
      onCancel={() => setStatisticsModalVisible(false)}
      footer={
        <Row type="flex">
          <Button
            onClick={() => setStatisticsModalVisible(false)}
            type="secondary"
            style={{
              marginLeft: 'auto',
            }}
          >
            Fechar
          </Button>
        </Row>
      }
    >
      <Spin spinning={loading || preparing} size="large">
        <Skeleton loading={preparing} paragraph={{ rows: 13 }} active>
          <Tabs
            type="card"
            activeKey={activeTabKey}
            onChange={activeKey => setActiveTabKey(activeKey)}
          >
            {data.map((d, index) => (
              <TabPane
                tab={`${d.title} (${d.data.length})`}
                key={index.toString()}
              >
                <StatisticsContent
                  data={d}
                  chartType={chartType}
                  setChartType={setChartType}
                  valueType={valueType}
                  setValueType={setValueType}
                  openProposals={openProposals}
                />
              </TabPane>
            ))}
          </Tabs>
        </Skeleton>
      </Spin>
    </Modal>
  )
}

StatisticsModal.propTypes = {
  proposals: PropTypes.array,
  statisticsModalVisible: PropTypes.bool,
  setStatisticsModalVisible: PropTypes.func,
  editProposal: PropTypes.func,
  userPermissions: PropTypes.array,
  loading: PropTypes.bool,
  ownerProfile: PropTypes.string,
}

export default StatisticsModal

import { Button, Modal, Row, Skeleton, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import DefaultTable from '@components/DefaultTable'
import { customSort, addBrlCurrencyToNumber } from '@utils'
import ProposalDetailModalFooter from './ProposalDetailModalFooter'
import ProposalQueryModal from '../../Proposals/modals/ProposalQueryModal/ProposalQueryModal'
import moment from 'moment'
import ReactExport from 'react-data-export'
import PropTypes from 'prop-types'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

export default function ProposalDetailModal({
  visible,
  setVisible,
  proposalDetail,
  loading,
  isOnline,
  proposalDetailType,
  proposalDetailParams,
  profile,
}) {
  const [dataExport, setDataExport] = useState([])
  const [proposalModalVisible, setProposalModalVisible] = useState(false)
  const [proposalId, setProposalId] = useState(0)

  useEffect(() => {
    const proposals = [
      {
        columns: [
          'Negócio',
          'Organização',
          'Franquia',
          'Vendedor',
          'Área de negócio',
          'Funil',
          'Fase',
          'Tipo proposta',
          'Valor único',
          'Valor recorrente',
          'Valor locação',
          'Data criação',
          'Data fechamento',
          'Dias em aberto após finalização',
          'Situação',
          'Motivo perda',
        ],
        data: [],
      },
    ]

    if (proposalDetail && proposalDetail.length > 0) {
      proposalDetail.map(p =>
        proposals[0].data.push([
          p.number,
          p.companyName,
          p.franchiseeName,
          p.sellerName,
          p.businessAreaDescription,
          p.salesFunnelName,
          p.funnelStageName,
          p.proposalType === 1 ? 'Venda' : p.proposalType === 2 ? 'Locação' : '',
          p.uniqueValue,
          p.recurrenceValue,
          p.locationValue,
          p.createDate ? moment(p.createDate).format('DD/MM/YYYY HH:mm') : '',
          p.closedDate ? moment(p.closedDate).format('DD/MM/YYYY HH:mm') : '',
          p.quantityDaysFinish,
          p.actStatusCode === 'ABRT'
            ? 'Aberto'
            : p.actStatusCode === 'WON'
            ? 'Ganho'
            : p.actStatusCode === 'LOST'
            ? 'Perdido'
            : '',
          p.lossReasonName,
        ]),
      )
    }

    setDataExport(proposals)
  }, [proposalDetail])

  function getColor(type, actStatusCode, date) {
    let color = 'black'
    if (proposalDetailType === 'conversionRate' && type === 'Closed') {
      color =
        date?.substr(0, 10) >= proposalDetailParams?.startMonthYearClosed &&
        date?.substr(0, 10) <= proposalDetailParams?.endMonthYearClosed &&
        actStatusCode === 'WON'
          ? 'black'
          : 'gray'
    } else if (proposalDetailType === 'conversionRate' && type === 'Created') {
      color =
        date?.substr(0, 10) >= proposalDetailParams?.startMonthYearCreate &&
        date?.substr(0, 10) <= proposalDetailParams?.endMonthYearCreate
          ? 'black'
          : 'gray'
    }
    return color
  }

  const columns = [
    {
      title: 'Número',
      dataIndex: 'number',
      sorter: (a, b) => a.number - b.number,
      render: (text, d) => (
        <span
          role="button"
          className="primary-color cursor-pointer"
          onClick={() => openProposal(d.proposalId)}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Organização',
      dataIndex: 'companyName',
      sorter: (a, b) => customSort(a.companyName, b.companyName),
    },
    {
      title: 'Vendedor',
      dataIndex: 'sellerName',
      sorter: (a, b) => customSort(a.sellerName, b.sellerName),
    },
    {
      title: 'Fase',
      dataIndex: 'funnelStageOrder',
      sorter: (a, b) => a.funnelStageOrder - b.funnelStageOrder,
      render: (text, record) => (
        <span>
          <i
            className={`fa ${record.funnelStageIcon} fa-lg mr-3`}
            aria-hidden="true"
            style={{ color: '#1976D2' }}
          />
          {record.funnelStageName}
        </span>
      ),
    },
    {
      title: 'Valores',
      dataIndex: 'uniqueValue',
      sorter: (a, b) => a.uniqueValue - b.uniqueValue,
      render: (text, record) => (
        <span>
          <p className="mb-0">
            {`Valor único: ${addBrlCurrencyToNumber(record.uniqueValue)}`}
          </p>
          <small style={{ color: 'gray', fontStyle: 'italic' }}>
            {`Recorrente: ${addBrlCurrencyToNumber(record.recurrenceValue)}`}
          </small>
        </span>
      ),
    },
    {
      title: 'Criação',
      dataIndex: 'createDate',
      sorter: (a, b) => customSort(a.createDate, b.createDate),
      render: (text, d) => (
        <div>
          <small
            style={{
              color: getColor('Created', d.actStatusCode, d.monthYearCreate),
            }}
          >
            {d.createDate ? moment(d.createDate).format('DD/MM/YY HH:mm') : ''}
          </small>
        </div>
      ),
    },
    {
      title: 'Fechamento',
      dataIndex: 'closedDate',
      sorter: (a, b) => customSort(a.closedDate, b.closedDate),
      render: (text, d) => (
        <React.Fragment>
          {text && (
            <div>
              <small
                style={{
                  color: getColor('Closed', d.actStatusCode, d.monthYearClosed),
                }}
              >
                {moment(text).format('DD/MM/YY HH:mm')}
                <span className="ml-2">
                  {`(${d.quantityDaysFinish} ${
                    d.quantityDaysFinish === 1 ? 'dia' : 'dias'
                  })`}
                </span>
              </small>
              <i
                className={`ml-2 fa ${
                  d.actStatusCode === 'WON' ? 'fa-check' : 'fa-times'
                }`}
                style={{ color: d.actStatusCode === 'WON' ? '#4caf50' : 'red' }}
              />
              {d.lossReasonId && (
                <small className="truncate">
                  <br />
                  {d.lossReasonName}
                </small>
              )}
            </div>
          )}
        </React.Fragment>
      ),
    },
  ]

  profile?.ownerProfile === 'Franchise' &&
    columns.splice(2, 0, {
      title: 'Franquia',
      dataIndex: 'franchiseeName',
      sorter: (a, b) => customSort(a.franchiseeName, b.franchiseeName),
    })

  const openProposal = id => {
    setProposalId(id)
    setProposalModalVisible(true)
  }

  const toogleModalVisible = () => {
    setProposalModalVisible(false)
  }

  return (
    <React.Fragment>
      <ProposalQueryModal
        proposalId={proposalId}
        visible={proposalModalVisible}
        toogleModalVisible={toogleModalVisible}
        userPermissions={[]}
        ownerProfile={profile?.ownerProfile}
      />
      <Modal
        visible={visible}
        title={`Listagem de Negócios ${isOnline ? '(em tempo real)' : ''}`}
        onCancel={() => setVisible(false)}
        centered
        destroyOnClose
        width="95%"
        footer={
          <Row type="flex">
            <ExcelFile
              filename={`Negócios_${moment().format('DD_MM_YYYY_HHmm')}`}
              element={
                <Button type="outline">
                  <i
                    className="fa fa-download mr-3 fa-lg"
                    style={{ color: 'gray' }}
                  />
                  Exportar
                </Button>
              }
            >
              <ExcelSheet dataSet={dataExport} name="Negócios" />
            </ExcelFile>

            <Button
              type="secondary"
              style={{ marginLeft: 'auto' }}
              onClick={() => setVisible(false)}
            >
              Fechar
            </Button>
          </Row>
        }
      >
        <Spin size="large" spinning={loading}>
          <Skeleton loading={loading} paragraph={{ rows: 13 }} active>
            <DefaultTable
              size="small"
              rowKey={record => record.proposalId}
              columns={columns}
              dataSource={proposalDetail}
            />
            <ProposalDetailModalFooter
              proposalDetail={proposalDetail}
              proposalDetailType={proposalDetailType}
              proposalDetailParams={proposalDetailParams}
            />
          </Skeleton>
        </Spin>
      </Modal>
    </React.Fragment>
  )
}

ProposalDetailModal.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  proposalDetail: PropTypes.array,
  loading: PropTypes.bool,
  isOnline: PropTypes.bool,
  proposalDetailType: PropTypes.string,
  proposalDetailParams: PropTypes.any,
  profile: PropTypes.any,
}

import React, { useState, useEffect } from 'react'
import { Button, Modal, Row, Skeleton, Spin } from 'antd'
import DefaultTable from '@components/DefaultTable'
import { customSort, formatNumber } from '@utils'
import moment from 'moment'
import ReactExport from 'react-data-export'
import PropTypes from 'prop-types'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

const ServiceOrderDetailModal = ({
  loading,
  visible,
  setVisible,
  serviceOrderDetail,
  isOnline,
  serviceOrderDetailType,
  serviceOrderDetailParams,
  profile,
}) => {
  const [dataExport, setDataExport] = useState([])

  useEffect(() => {
    let exportData = []

    // if (serviceOrderDetailType === 'atendimentoRanking') {
    //   exportData = [
    //     {
    //       columns: [
    //         'Colaborador',
    //         'Total Horas Trabalhadas',
    //         'Total Horas Deslocamento',
    //         'Total Horas Cobrança',
    //         'Quantidade de OS',
    //       ],
    //       data: Array.isArray(serviceOrderDetail)
    //         ? serviceOrderDetail.map(item => [
    //             item.colaborador,
    //             item.totalHorasTrabalhadas,
    //             item.totalHorasDeslocamento,
    //             item.totalHorasCobranca,
    //             item.qtOS,
    //           ])
    //         : [],
    //     },
    //   ]
    // } else {
    exportData = [
      {
        columns: [
          'Número OS',
          'Colaborador',
          'Tipo Hora Apontada',
          'Cliente',
          'Serviço',
          'Status Serviço',
          'Status OS',
          'Data Apontamento',
          'Data Criação OS',
          'Hora Início',
          'Hora Final',
          'Horas Trabalhadas',
          'Horas Deslocamento',
          'Horas Cobrança',
        ],
        data: Array.isArray(serviceOrderDetail)
          ? serviceOrderDetail.map(order => [
            order.numeroOs,
            order.colaborador,
            order.tipoHoraApontada,
            order.cliente,
            order.servico,
            order.statusServico,
            order.statusOs,
            order.dataApontamento
              ? moment(order.dataApontamento).format('DD/MM/YYYY')
              : '',
            order.dataCriacaoOs
              ? moment(order.dataCriacaoOs).format('DD/MM/YYYY')
              : '',
            order.horaInicio,
            order.horaFinal,
            order.horasTrabalhadas,
            order.horasDeslocamento,
            order.horasCobranca,
          ])
          : [],
      },
    ]

    setDataExport(exportData)
  }, [serviceOrderDetail, serviceOrderDetailType])

  const columns2 = [
    {
      title: 'Colaborador',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Horas atendimento',
      dataIndex: 'hours',
      key: 'hours',
      sorter: (a, b) => a.hours - b.hours,
      render: (text, d) => (
        <React.Fragment>
          <span>{d.hours}</span>
        </React.Fragment>
      ),
    },
    {
      title: 'Ordens de serviço',
      dataIndex: 'orders',
      key: 'orders',
      sorter: (a, b) => a.orders - b.orders,
      render: (text, d) => (
        <React.Fragment>
          <span>{d.orders}</span>
        </React.Fragment>
      ),
    },
  ]

  const columns =
    serviceOrderDetailType === 'atendimentoRanking'
      ? [
        {
          title: 'Colaborador',
          dataIndex: 'colaborador',
          sorter: (a, b) => customSort(a.colaborador, b.colaborador),
        },
        {
          title: 'Total Horas Trabalhadas',
          dataIndex: 'totalHorasTrabalhadas',
          sorter: (a, b) => a.totalHorasTrabalhadas - b.totalHorasTrabalhadas,
        },
        {
          title: 'Total Horas Deslocamento',
          dataIndex: 'totalHorasDeslocamento',
          sorter: (a, b) =>
            a.totalHorasDeslocamento - b.totalHorasDeslocamento,
        },
        {
          title: 'Total Horas Cobrança',
          dataIndex: 'totalHorasCobranca',
          sorter: (a, b) => a.totalHorasCobranca - b.totalHorasCobranca,
        },
        {
          title: 'Quantidade de OS',
          dataIndex: 'qtOS',
          sorter: (a, b) => a.qtOS - b.qtOS,
        },
      ]
      : [
        {
          title: 'Número OS',
          dataIndex: 'numeroOs',
          sorter: (a, b) => a.numeroOs - b.numeroOs,
        },
        {
          title: 'Colaborador',
          dataIndex: 'colaborador',
          sorter: (a, b) => customSort(a.colaborador, b.colaborador),
        },
        {
          title: 'Tipo Hora Apontada',
          dataIndex: 'tipoHoraApontada',
          sorter: (a, b) =>
            customSort(a.tipoHoraApontada, b.tipoHoraApontada),
        },
        {
          title: 'Cliente',
          dataIndex: 'cliente',
          sorter: (a, b) => customSort(a.cliente, b.cliente),
        },
        {
          title: 'Serviço',
          dataIndex: 'servico',
          sorter: (a, b) => customSort(a.servico, b.servico),
        },
        {
          title: 'Status Serviço',
          dataIndex: 'statusServico',
          sorter: (a, b) => customSort(a.statusServico, b.statusServico),
        },
        {
          title: 'Status OS',
          dataIndex: 'statusOs',
          sorter: (a, b) => customSort(a.statusOs, b.statusOs),
        },
        {
          title: 'Data Apontamento',
          dataIndex: 'dataApontamento',
          sorter: (a, b) => customSort(a.dataApontamento, b.dataApontamento),
          render: text => (text ? moment(text).format('DD/MM/YYYY') : ''),
        },
        {
          title: 'Data Criação OS',
          dataIndex: 'dataCriacaoOs',
          sorter: (a, b) => customSort(a.dataCriacaoOs, b.dataCriacaoOs),
          render: text => (text ? moment(text).format('DD/MM/YYYY') : ''),
        },
        {
          title: 'Hora Início',
          dataIndex: 'horaInicio',
          sorter: (a, b) => customSort(a.horaInicio, b.horaInicio),
        },
        {
          title: 'Hora Final',
          dataIndex: 'horaFinal',
          sorter: (a, b) => customSort(a.horaFinal, b.horaFinal),
        },
        {
          title: 'Horas Trabalhadas',
          dataIndex: 'horasTrabalhadas',
          sorter: (a, b) =>
            customSort(a.horasTrabalhadas, b.horasTrabalhadas),
        },
        {
          title: 'Horas Deslocamento',
          dataIndex: 'horasDeslocamento',
          sorter: (a, b) =>
            customSort(a.horasDeslocamento, b.horasDeslocamento),
        },
        {
          title: 'Horas Cobrança',
          dataIndex: 'horasCobranca',
          sorter: (a, b) => customSort(a.horasCobranca, b.horasCobranca),
        },
      ]

  return (
    <React.Fragment>
      <Modal
        visible={visible}
        title={`Detalhes da Ordem de Serviço ${isOnline ? '(em tempo real)' : ''
          }`}
        onCancel={() => setVisible(false)}
        centered
        destroyOnClose
        width="95%"
        footer={
          <Row type="flex">
            <ExcelFile
              filename={`OrdensDeServico_${moment().format('DD_MM_YYYY_HHmm')}`}
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
              <ExcelSheet dataSet={dataExport} name="Ordens de Serviço" />
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
              rowKey={record => record.numeroOs || record.colaborador}
              columns={columns}
              dataSource={
                Array.isArray(serviceOrderDetail) ? serviceOrderDetail : []
              }
            />
            <div style={{ display: "flex", justifyContent: "end" }}>
              <DefaultTable
                size="small"
                style={{ width: '30%' }}
                rowKey={record => record.id}
                columns={columns2}
                // dataSource={data}
                pagination={false}
              />
            </div>
          </Skeleton>
        </Spin>
      </Modal>
    </React.Fragment>
  )
}

ServiceOrderDetailModal.propTypes = {
  loading: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  serviceOrderDetail: PropTypes.array.isRequired,
  isOnline: PropTypes.bool.isRequired,
  serviceOrderDetailType: PropTypes.string,
  serviceOrderDetailParams: PropTypes.object,
  profile: PropTypes.object,
}

export default ServiceOrderDetailModal

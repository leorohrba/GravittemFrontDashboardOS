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
  const [colaboradorData, setColaboradorData] = useState([])

  useEffect(() => {
    let exportData = []

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

    // Calculate total hours for each colaborador
    const colaboradorMap = new Map()
    if (Array.isArray(serviceOrderDetail)) {
      serviceOrderDetail.forEach(order => {
        const { colaborador, horaInicio, horaFinal, horasTrabalhadas } = order
        if (!colaboradorMap.has(colaborador)) {
          colaboradorMap.set(colaborador, { totalWorkedSeconds: 0, totalStoppedSeconds: 0 })
        }
        const workedSeconds = moment(horaFinal, 'HH:mm:ss').diff(moment(horaInicio, 'HH:mm:ss'), 'seconds')
        const workedDuration = moment.duration(workedSeconds, 'seconds')
        const workedHours = workedDuration.asHours()
        const workedMinutes = workedDuration.minutes()
        const workedSecondsFormatted = workedDuration.seconds()
        const totalWorkedSeconds = colaboradorMap.get(colaborador).totalWorkedSeconds + workedSeconds
        const totalStoppedSeconds = colaboradorMap.get(colaborador).totalStoppedSeconds + (workedSeconds - moment.duration(horasTrabalhadas).asSeconds())
        colaboradorMap.set(colaborador, { totalWorkedSeconds, totalStoppedSeconds })
      })
    }

    // Format the total hours in HH:MM:SS
    const colaboradorData = Array.from(colaboradorMap.entries()).map(([name, { totalWorkedSeconds, totalStoppedSeconds }]) => {
      const workedDuration = moment.duration(totalWorkedSeconds, 'seconds')
      const workedHours = Math.floor(workedDuration.asHours())
      const workedMinutes = workedDuration.minutes()
      const workedSeconds = workedDuration.seconds()
      const stoppedDuration = moment.duration(totalStoppedSeconds, 'seconds')
      const stoppedHours = Math.floor(stoppedDuration.asHours())
      const stoppedMinutes = stoppedDuration.minutes()
      const stoppedSeconds = stoppedDuration.seconds()
      return {
        name,
        hours: `${workedHours.toString().padStart(2, '0')}:${workedMinutes.toString().padStart(2, '0')}:${workedSeconds.toString().padStart(2, '0')}`,
        orders: `${stoppedHours.toString().padStart(2, '0')}:${stoppedMinutes.toString().padStart(2, '0')}:${stoppedSeconds.toString().padStart(2, '0')}`,
      }
    })

    setColaboradorData(colaboradorData)

  }, [serviceOrderDetail, serviceOrderDetailType])

  const columns2 = [
    {
      title: 'Colaborador',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Horas apontadas',
      dataIndex: 'hours',
      key: 'hours',
      sorter: (a, b) => a.hours.localeCompare(b.hours),
      render: (text, d) => (
        <React.Fragment>
          <span>{d.hours}</span>
        </React.Fragment>
      ),
    },
    {
      title: 'Horas paradas',
      dataIndex: 'orders',
      key: 'orders',
      sorter: (a, b) => a.orders.localeCompare(b.orders),
      render: (text, d) => (
        <React.Fragment>
          <span>{d.orders}</span>
        </React.Fragment>
      ),
    },
  ]

  const columns = [
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
                dataSource={colaboradorData}
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

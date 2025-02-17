/* eslint-disable react-hooks/exhaustive-deps  */
import { Button, Modal, Row, Skeleton, Spin, Col, Tooltip } from 'antd'
import React, { useState, useEffect } from 'react'
import DefaultTable from '@components/DefaultTable'
import { customSort, formatNumber, formatTaskDuration } from '@utils'
import moment from 'moment'
import ReactExport from 'react-data-export'
import PropTypes from 'prop-types'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

export default function TaskDetailModal({
  visible,
  setVisible,
  taskDetail,
  loading,
  taskDetailParams,
  profile,
}) {
  
  const [dataExport, setDataExport] = useState([])
  const [quantity, setQuantity] = useState( { created: 0, closed: 0, percent: 0 } )

  useEffect(() => {
    let source = taskDetail.filter(x => x.monthYearCreate?.substr(0,10) >= taskDetailParams.startMonthYearCreate && x.monthYearCreate?.substr(0,10) <= taskDetailParams.endMonthYearCreate)
    const quantityCreated = source.length   
    source = taskDetail.filter(x => x.monthYearClosed?.substr(0,10) >= taskDetailParams.startMonthYearClosed && x.monthYearClosed?.substr(0,10) <= taskDetailParams.endMonthYearClosed)
    const quantityClosed = source.length 
    const percent = quantityClosed !== 0 ? 100 * quantityCreated / quantityClosed : 0
    setQuantity( { created: quantityCreated, closed: quantityClosed, percent, } )
    
  },[taskDetail])  
  
  useEffect(() => {

    const tasks = [
      {
        columns: [
          'Tipo de tarefa',
          'Organização',
          'Assunto',
          'Franquia',
          'Vendedor',
          'Criado em',
          'Data agenda',
          'Finalizado em',
          'Dias em aberto após finalização',
        ],
        data: [],
      },
    ]

    taskDetail.map(p =>
      tasks[0].data.push([
        p.taskTypeName,
        p.companyName,
        p.subject,
        p.franchiseeName,
        p.sellerName,
        p.createDate ? moment(p.createDate).format('DD/MM/YYYY HH:mm') : '',
        p.expectedDateTime ? moment(p.expectedDateTime).format('DD/MM/YYYY HH:mm') : '',
        p.realizedDate ? moment(p.realizedDate).format('DD/MM/YYYY HH:mm') : '',
        p.quantityDaysFinish,
      ]),
    )
    
    setDataExport(tasks)
  }, [taskDetail])
  
  const columns = [
    {
      title: 'Tipo da tarefa',
      dataIndex: 'taskTypeName',
      sorter: (a, b) => customSort(a.taskTypeName, b.taskTypeName),
      render: (text, record) => (
        <span>
          <i
            className={`fa ${record.taskTypeIcon} fa-lg mr-3`}
            aria-hidden="true"
            style={{ color: '#1976D2' }}
          />
          <Tooltip title={`Tarefa número ${record.taskId}`}>
            {record.taskTypeName}
          </Tooltip>  
        </span>
      ),
    },
    {
      title: 'Organização',
      dataIndex: 'companyName',
      sorter: (a, b) => customSort(a.companyName, b.companyName),
    },
    {
      title: 'Assunto',
      dataIndex: 'subject',
      sorter: (a, b) => customSort(a.subject, b.subject),
    },
    {
      title: 'Franquia',
      dataIndex: 'franchiseeName',
      sorter: (a, b) => customSort(a.franchiseeName, b.franchiseeName),
    },
    {
      title: 'Vendedor',
      dataIndex: 'sellerName',
      sorter: (a, b) => customSort(a.sellerName, b.sellerName),
    },
    {
      title: 'Criado em',
      dataIndex: 'createDate',
      sorter: (a, b) => customSort(a.createDate, b.createDate),
      render: (text, d) => (<small>{text ? moment(text).format('DD/MM/YY HH:mm') : ''}</small>),
    },
    {
      title: 'Data agenda',
      dataIndex: 'expectedDateTime',
      sorter: (a, b) => customSort(a.expectedDateTime, b.expectedDateTime),
      render: (text, record) => (
        <span>
          {text && (
            <p className="m-0">
             <small>{moment(text).format(record.isAllDay ? 'DD/MM/YY' : 'DD/MM/YY HH:mm')}</small>
            </p>
          )}
          <p
            className="m-0"
            style={{
              fontSize: 'small',
              color: 'gray',
              fontStyle: 'italic',
            }}
          >
            <small>{`(${formatTaskDuration(record.expectedDuration)})`}</small>
          </p>
        </span>
      ),
      width: '15%',
    },    
    {
      title: 'Concluido em',
      dataIndex: 'realizedDate',
      sorter: (a, b) => customSort(a.realizedDate, b.realizedDate),
      render: (text, d) => (
         <React.Fragment>
          {text && (
             <div>
               <small>
                {moment(text).format('DD/MM/YY HH:mm')}
                <span className="ml-2">
                  {`(${d.quantityDaysFinish} ${d.quantityDaysFinish === 1 ? 'dia' : 'dias'})`}
                </span>
               </small>
             </div>
          )}
        </React.Fragment>  
        ),
    },
  ] 
  
  const standardColumns = columns.map(a => {
    const newObject = {}
    Object.keys(a).forEach(propertyKey => {
      newObject[propertyKey] = a[propertyKey]
    })
    return newObject
  })

  for (let i = 0; i < standardColumns.length; i++) {
    if (standardColumns[i].dataIndex === 'franchiseeName') {
      standardColumns.splice(i, 1)
      break
    }
  }
  
  return (
  <React.Fragment>  
    <Modal
      visible={visible}
      title="Listagem de tarefas"
      onCancel={() => setVisible(false)}
      centered
      destroyOnClose
      width="90%"
      footer={
        <Row type="flex">
          <ExcelFile
            filename={`Tarefas_${moment().format('DD_MM_YYYY_HHmm')}`}
            element={
              <Button
                type="outline"
              >
                <i
                  className="fa fa-download mr-3 fa-lg"
                  style={{ color: 'gray' }}
                />
                Exportar
              </Button>
            }
          >
            <ExcelSheet dataSet={dataExport} name="Tarefas" />
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
            rowKey={record => record.taskId}
            columns={profile?.ownerProfile === 'Standard' ? standardColumns : columns}
            dataSource={taskDetail}
          />
          <Row type="flex" className="mt-2 mb-2">
            <Col className="ml-auto">
              <b className="mr-2">Quantidade de tarefas criadas:</b>
              {quantity?.created || 0}
            </Col>
          </Row>  
          <Row type="flex" className="mb-2">
            <Col className="ml-auto">
              <b className="ml-2 mr-2">Quantidade de tarefas finalizadas:</b>
              {quantity?.closed || 0}
            </Col>
          </Row>  
          <Row type="flex">
            <Col className="ml-auto">
              <b className="ml-2 mr-2">% Tarefas criadas / finalizadas:</b>
              {`${formatNumber(quantity?.percent || 0,2)}%`}
            </Col>
          </Row>
        </Skeleton>  
      </Spin>
    </Modal>
  </React.Fragment>  
  )
}

TaskDetailModal.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  taskDetail: PropTypes.array,
  loading: PropTypes.bool,
  taskDetailParams: PropTypes.any,
  profile: PropTypes.any,
}



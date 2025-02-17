import { apiAttendance } from '@services/api'
import DefaultTable from '@components/DefaultTable'
import { Button, Modal, Row, message, Select, Col } from 'antd'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  handleAuthError,
  customSort,
} from '@utils'

const { Option } = Select 

export default function LogImportDetailModal({
  visibleModal,
  setVisibleModal,
  id,
  type,
  setType,
}) {
  
  const [loading, setLoading] = useState(true)
  const [log, setLog]  = useState([])
  
  useEffect(() => {
    if (visibleModal) {
      getLog()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps   
  }, [visibleModal, type, id])
  
  const columns = [
    {
      title: 'Nº linha',
      dataIndex: 'nrLinhaArquivo',
      sorter: (a, b) => a.nrLinhaArquivo - b.nrLinhaArquivo,
    },
    {
      title: 'Mensagem',
      sorter: (a, b) => customSort(a.mensagem, b.mensagem),
      render: (text, d) => (
                    <div>
                     <p className="mb-0">{d.mensagem}</p>
                     {!!d.numeroGerado && (<span style={{ color: 'gray' }}>{`Número gerado: ${d.numeroGerado}`}</span>)}
                    </div>),
    },
  ]
  
  async function getLog() {
    setLoading(true)
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/importacao/log`,
        params: { idArquivoImportacao: id, tipoLog: type } ,
      })
      
      setLoading(false)
      const { data } = response

      if (data.isOk) {
        setLog(data.log)
      } else {
        message.error(data.mensagem)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  return (
  <React.Fragment>  
    <Modal
      visible={visibleModal}
      title="Log de importação"
      onCancel={() => setVisibleModal(false)}
      centered
      width="60%"
      footer={
        <Row type="flex">
          <Button
            type="secondary"
            style={{ marginLeft: 'auto' }}
            onClick={() => setVisibleModal(false)}
          >
            Fechar
          </Button>
        </Row>
      }
    >
      <Row className="mb-2"> 
        <Col style={{ width: '200px' }}>      
          <Select
            showSearch
            className="w-full"
            value={type}
            onChange={(value) => setType(value)}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value={1}>Importado com sucesso</Option>
            <Option value={2}>Erros de importação</Option>
          </Select>
        </Col> 
      </Row>    
      <DefaultTable
        rowKey={record => record.id}
        loading={loading}
        columns={columns}
        dataSource={log}
      />
    </Modal>
  </React.Fragment>  
  )
}

LogImportDetailModal.propTypes = {
  visibleModal: PropTypes.bool,
  setVisibleModal: PropTypes.func,
  id: PropTypes.string,
  type: PropTypes.number,
  setType: PropTypes.func,
}



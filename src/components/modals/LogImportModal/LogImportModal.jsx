import { apiAttendance } from '@services/api'
import DefaultTable from '@components/DefaultTable'
import { Button, Modal, Row, message } from 'antd'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import LogImportDetailModal from './LogImportDetailModal'
import {
  formatNumber,
  handleAuthError,
  customSort,
} from '@utils'

export default function LogImportModal({
  visibleModal,
  setVisibleModal,
  document,
}) {
  
  const [visibleLogModal, setVisibleLogModal] = useState(false)
  const [id, setId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [history, setHistory]  = useState([])
  const [type, setType] = useState(2)
  
  const openLog = (idValue, typeValue) => {
    setId(idValue)
    setType(typeValue)
    setVisibleLogModal(true)
  }
  
  useEffect(() => {
    if (visibleModal) {
      getHistory()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps   
  }, [visibleModal, document])
  
  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => customSort(a.descricaoStatus, b.descricaoStatus),
      render: (text, d) => (
        <div>
          <i 
            className="fa fa-circle mr-2" 
            style={{ color: d.status === 3 ? 
                            '#4caf50' : 
                            d.status === 4 && d.registrosImportados > 0 ?
                            'yellow' :
                            d.status === 5 || d.status === 4 ?
                            'red' : 
                            'blue'
                  }}
          />
          <span
            role="button"
            className="cursor-pointer"
            onClick={() => openLog(d.idArquivoImportacao, d.status === 3 ? 1 : 2)}
          >
            {d.descricaoStatus}
          </span>  
          {d.mensagem && (
            <div><br /><small style={{ color: 'gray'}}>{d.mensagem}</small></div>
          )}
        </div>
      ),
    },
    {
      title: 'Arquivo',
      dataIndex: 'nomeArquivo',
      sorter: (a, b) => customSort(a.nomeArquivo, b.nomeArquivo),
      render: (text, d) => (
         <div>
           <span>{d.nomeArquivo}</span>
           <div><small style={{ color: 'gray'}}>{`${formatNumber(d.tamanhoArquivoKB,2)}KB`}</small></div>
         </div>
      ),
    },
    {
      title: 'Data',
      dataIndex: 'dataProcessamento',
      sorter: (a, b) => customSort(a.dataProcessamento, b.dataProcessamento),
      render: (text, d) => (
            <div>
              <p className="mb-0">
                {d.dataProcessamento ? moment(d.dataProcessamento).format('DD/MM/YYYY HH:mm') : null}
              </p>
              {!!d.minutosProcessamento && (
                 <small style={{ color: 'gray'}}>{`${formatNumber(d.minutosProcessamento,0)} min`}</small>
              )}
            </div>)  
    },
    {
      title: 'Registros',
      sorter: (a, b) => a.registrosImportados - b.registrosImportados,
      render: (text, d) => (
         <div>
          <span
            role="button"
            className="cursor-pointer"
            onClick={() => openLog(d.idArquivoImportacao, 1)}
          >
           <b className="mr-2">{d.registrosImportados}</b>registro(s) importado(s)
          </span>
           {!!d.registrosNaoImportados && (
             <div>
              <span
                role="button"
                className="cursor-pointer"
                onClick={() => openLog(d.idArquivoImportacao, 2)}
                style={{ color: 'red'}}
              >
                <b className="mr-2">{d.registrosNaoImportados}</b>registro(s) não importado(s)
              </span>
             </div>
           )}
         </div>  
      )
    },
  ]
  
  async function getHistory() {
    
    setLoading(true)
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/importacao/historico`,
        params: { documento: document, status: '3|4|5' } ,
      })
      
      setLoading(false)
      const { data } = response

      if (data.isOk) {
        setHistory(data.historico)
      } else {
        message.error(data.mensagem)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  return (
  <React.Fragment>  
    <LogImportDetailModal
      id={id}
      type={type}
      setType={setType}
      visibleModal={visibleLogModal}
      setVisibleModal={setVisibleLogModal}
    />
    <Modal
      visible={visibleModal}
      title="Histórico de importação"
      onCancel={() => setVisibleModal(false)}
      centered
      width="70%"
      footer={
        <Row type="flex">
          <Button
            type="secondary"
            onClick={() => getHistory()}
          >
            <i className="mr-2 fa fa-repeat" style={{ color: 'gray' }} />
              Atualizar
          </Button>
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
      <DefaultTable
        rowKey={record => record.idArquivoImportacao}
        loading={loading}
        columns={columns}
        dataSource={history}
      />
    </Modal>
  </React.Fragment>  
  )
}

LogImportModal.propTypes = {
  visibleModal: PropTypes.bool,
  setVisibleModal: PropTypes.func,
  document: PropTypes.number,
}



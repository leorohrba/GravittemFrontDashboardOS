/* eslint-disable react-hooks/exhaustive-deps  */
import { apiRegion } from '@services/api'
import { handleAuthError, setParamValues, showApiMessages } from '@utils'
import { Button, Modal, Row, Spin, message, Alert } from 'antd'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { formatMessage } from 'umi-plugin-react/locale'
import NewRegionZipCodeHeader from './components/NewRegionZipCodeHeader'
import NewRegionZipCodeTable from './components/NewRegionZipCodeTable'

const params = {}

const initialOptions = [
    {
      value: 'municipio',
      label: 'Município',
      type: 'search',
      placeholder: 'Nome do município',
    },
    {
      value: 'estadoSigla',
      label: 'Estado',
      placeholder: 'Selecione o estado',
      type: 'select',
      options: [],
    },
    {
      value: 'rua',
      label: 'Rua',
      type: 'search',
      placeholder: 'Nome da rua',
    },
    {
      value: 'bairro',
      label: 'Bairro',
      type: 'search',
      placeholder: 'Bairro vinculado a região',
    },
    {
      value: 'cep',
      label: 'Cep',
      type: 'search',
      placeholder: 'Informe o cep',
    },
  ]
  
export default function NewRegionZipCodeModal({
  visible,
  setVisible,
  existingZipCodes,
  regionId,
  refreshData,
}) {
  
  const [searchOptions, setSearchOptions] = useState(initialOptions)
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false)
  const [keyTable, setKeyTable] = useState(0)
  const [selectedRows, setSelectedRows] = useState([])
  const [data, setData] = useState([])
  const [alertMessages, setAlertMessages] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [hasExistingZipCodes, setHasExistingZipCodes] = useState(false)
  const ref = React.useRef()

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
    selectedRowKeys: selectedRows.map(record => record.cepId),
    onSelectAll: (selected, selectedRows, changeRows) => {
      message.info(`Todos itens desta página foram ${selected ? 'marcados' : 'desmarcados'}!`)
    }
  }
  
  useEffect(() => {
    const source = data.filter(x => existingZipCodes.map(y => y.cepId).includes(x.cepId))
    setSelectedRows(source) 
    setHasExistingZipCodes(source.length > 0)
  },[existingZipCodes, data])
  
  useEffect(() => {
    setAlertMessages([])
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [visible])
  
  useEffect(() => {
    getStates()
    clearParams()
    setAlertMessages([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function clearParams() {
    params.municipio = []
    params.bairro = []
    params.cep = []
    params.estadoSigla = []
    params.rua = []
  }

  async function getStates() {
    try {
      const response = await apiRegion({
        method: 'GET',
        url: `/api/Estado`,
        params: { paisId: 1 },
      })
      const { data } = response
      if (data.isOk) {
        const states = data.estado.map(d => ({ label: d.nome, value: d.sigla }))
        const index = searchOptions.findIndex(x => x.value === 'estadoSigla')
        if (index > -1) {
          searchOptions[index].options = states
          setSearchOptions([...searchOptions])
        }

      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }
  
  async function deleteRegionZipCode(closeModal) {

    const items = existingZipCodes.filter(x => data.map(y => y.cepId).includes(x.cepId)) 
    const itemsToDelete = items.filter(x => !selectedRows.map(y => y.cepId).includes(x.cepId))
    if (itemsToDelete.length === 0) {
      saveRegionZipCode(closeModal)
      return
    }

    setIsSaving(true)
    setLoading(true)

    try {
      const response = await apiRegion({
        method: 'DELETE',
        url: `/api/RegiaoCep`,
        data: { regiaoCepIds: itemsToDelete.map(x => x.regiaoCepId) },
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)
      setLoading(false)

      const { data } = response

      if (data.isOk) {
        saveRegionZipCode(closeModal)
      } else {
        setAlertMessages(data.notificacoes)
        showApiMessages(data)
        if (ref.current) {
          ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }
    } catch (error) {
      setIsSaving(false)
      setLoading(false)
      handleAuthError(error)
    }
  }  

  async function saveRegionZipCode(closeModal) {
    
    if (selectedRows.length === 0) {
      if (refreshData !== undefined) {
        refreshData()
      }
      
      if (closeModal) {
        setVisible(false)
      }
      return
    }

    setIsSaving(true)
    setLoading(true)
    
    const body = {
      regiaoId: regionId,
      cepIds: selectedRows.map(d => d.cepId)
    }

    try {
      const response = await apiRegion({
        method: 'POST',
        url: `/api/RegiaoCep`,
        data: body,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)
      setLoading(false)

      const { data } = response

      if (data.isOk) {

        if (refreshData !== undefined) {
          refreshData()
        }
        
        if (closeModal) {
          setVisible(false)
        }

        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )
      } else {
        setAlertMessages(data.notificacoes)
        showApiMessages(data)
        if (ref.current) {
          ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }
    } catch (error) {
      setIsSaving(false)
      setLoading(false)
      handleAuthError(error)
    }
  }  
  
  const handleSave = (closeModal) => {
    // Primeiro se deleta os registros que foram desmarcados, e depois a função abaixo invoca o método para salvar os registros marcados
    deleteRegionZipCode(closeModal)
  }

  async function getData() {
    setLoading(true)
    setSelectedRows([])
    try {
      const response = await apiRegion({
        method: 'POST',
        url: `/api/Cep/Select`,
        data: params,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        setData(data.cep)
        setKeyTable(keyTable + 1)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function startSearch() {
    if (tags.length === 0) {
      message.error('É necessário que se faça algum filtro antes de processsar a pesquisa!')
      return
    }
    clearParams()
    setParamValues(params, searchOptions, tags)
    getData()
  }

  return (
  <React.Fragment>  
    <Modal
      visible={visible}
      title="Pesquisar CEP"
      onCancel={() => setVisible(false)}
      centered
      width="1000px"
      footer={
        <Row type="flex">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            loading={isSaving}
            onClick={() => handleSave(false)}
            disabled={!(selectedRows.length > 0 || hasExistingZipCodes)}
          >
            {formatMessage({
              id: 'saveButton',
            })}
          </Button>
          <Button
            className="ml-2"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            loading={isSaving}
            disabled={!(selectedRows.length > 0 || hasExistingZipCodes)}
            onClick={() => handleSave(true)}
          >
            Salvar e fechar
          </Button>
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

        <NewRegionZipCodeHeader
          startSearch={startSearch}
          tags={tags}
          setTags={setTags}
          searchOptions={searchOptions}
        />

        <div ref={ref}>
          {alertMessages.map((message, index) => (
            <Alert
              type="error"
              message={message.mensagem}
              key={index}
              showIcon
              className="mb-2"
            />
          ))}
        </div>

        <NewRegionZipCodeTable
          data={data}
          keyTable={keyTable}
          rowSelection={rowSelection}
        />

      </Spin>
      
    </Modal>
  </React.Fragment>  
  )
}

NewRegionZipCodeModal.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  existingZipCodes: PropTypes.array,
  regionId: PropTypes.string,
  refreshData: PropTypes.func,
}



/* eslint-disable react-hooks/exhaustive-deps  */
import { apiRegion } from '@services/api'
import { handleAuthError, setParamValues, showApiMessages } from '@utils'
import { Button, Modal, Row, Spin, message, Alert } from 'antd'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { formatMessage } from 'umi-plugin-react/locale'
import NewRegionNeighborhoodHeader from './components/NewRegionNeighborhoodHeader'
import NewRegionNeighborhoodTable from './components/NewRegionNeighborhoodTable'

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
  
export default function NewRegionNeighborhoodModal({
  visible,
  setVisible,
  existingNeighborhoods,
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
  const [hasExistingNeighborhoods, setHasExistingNeighborhoods] = useState(false)
  const ref = React.useRef()

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
    selectedRowKeys: selectedRows.map(record => record.key),
    onSelectAll: (selected, selectedRows, changeRows) => {
      message.info(`Todos itens desta página foram ${selected ? 'marcados' : 'desmarcados'}!`)
    }
  }
  
  useEffect(() => {
    const source = []
    data.map(x => {
      if (existingNeighborhoods
            .find(y => y.municipioId === x.municipioId &&
                  ((y.bairro?.toLowerCase() === x.bairro?.toLowerCase()) || (!y.bairro && !x.bairro))
            )) {
        source.push(x)
      }
      return true
    })
    setSelectedRows(source)
    setHasExistingNeighborhoods(source.length > 0)
  },[existingNeighborhoods, data])
  
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
    params.estadoSigla = []
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
  
  async function deleteRegionNeighborhood(closeModal) {

    const items = []
    data.map(x => {
      const findItem = existingNeighborhoods
                      .find(y => y.municipioId === x.municipioId &&
                                ((y.bairro?.toLowerCase() === x.bairro?.toLowerCase()) || (!y.bairro && !x.bairro))
                      )
      if (findItem) {
        items.push(findItem)
      }
      return true
    })
    
    const itemsToDelete = []
    items.map(x => {
      if (!selectedRows
          .find(y => y.municipioId === x.municipioId &&
                     ((y.bairro?.toLowerCase() === x.bairro?.toLowerCase()) || (!y.bairro && !x.bairro))
          )) {
        itemsToDelete.push(x)
      }
      return true
    })
        

    if (itemsToDelete.length === 0) {
      saveRegionNeighborhood(closeModal)
      return
    }
    
    setIsSaving(true)
    setLoading(true)

    try {
      const response = await apiRegion({
        method: 'DELETE',
        url: `/api/RegiaoBairro`,
        data: { regiaoBairroIds: itemsToDelete.map(x => x.regiaoBairroId) },
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)
      setLoading(false)

      const { data } = response

      if (data.isOk) {
        saveRegionNeighborhood(closeModal)
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

  async function saveRegionNeighborhood(closeModal) {
    
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
      bairrosMunicipios: selectedRows.map(d => ({ bairro: d.bairro, municipioId: d.municipioId }))
    }

    try {
      const response = await apiRegion({
        method: 'POST',
        url: `/api/RegiaoBairro`,
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
    deleteRegionNeighborhood(closeModal)
  }

  async function getData() {
    setLoading(true)
    setSelectedRows([])
    try {
      const response = await apiRegion({
        method: 'POST',
        url: `/api/BairroMunicipio/Select`,
        data: params,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        setData(
           data.bairroMunicipio.map((x, index) => (
              {
                bairro: x.bairro, 
                municipioId : x.municipioId,
                municipioNome: x.municipioNome,
                estadoId: x.estadoId,
                estadoSigla: x.estadoSigla,
                estadoNome: x.estadoNome,
                key: index,
              }
            ))
        )    
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
      title="Pesquisar bairro/município"
      onCancel={() => setVisible(false)}
      centered
      width="700px"
      footer={
        <Row type="flex">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            loading={isSaving}
            onClick={() => handleSave(false)}
            disabled={!(selectedRows.length > 0 || hasExistingNeighborhoods)}
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
            disabled={!(selectedRows.length > 0 || hasExistingNeighborhoods)}
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

        <NewRegionNeighborhoodHeader
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

        <NewRegionNeighborhoodTable
          data={data}
          keyTable={keyTable}
          rowSelection={rowSelection}
        />

      </Spin>
      
    </Modal>
  </React.Fragment>  
  )
}

NewRegionNeighborhoodModal.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  existingNeighborhoods: PropTypes.array,
  regionId: PropTypes.string,
  refreshData: PropTypes.func,
}



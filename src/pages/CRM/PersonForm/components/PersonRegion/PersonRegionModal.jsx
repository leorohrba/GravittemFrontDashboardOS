/* eslint-disable react-hooks/exhaustive-deps  */
import { apiRegion } from '@services/api'
import { handleAuthError, showApiMessages } from '@utils'
import { Button, Modal, Row, Spin, message, Alert, Skeleton } from 'antd'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { formatMessage } from 'umi-plugin-react/locale'
import PersonRegionModalForm from './PersonRegionModalForm'
  
let oldWeekData
let oldUniqueData
      
export default function PersonRegionModal({
  visible,
  setVisible,
  collaboratorId,
  canBeUpdated,
}) {
  
  const dataWeekTemplate =  
      [ 
         { 
           label: 'Segunda-feira',
           dayOfWeek: 2,
           regionId: null,
           regionSource: []
         },
         { 
           label: 'Terça-feira',
           dayOfWeek: 3,
           regionId: null,
           regionSource: []
         },
         { 
           label: 'Quarta-feira',
           dayOfWeek: 4,
           regionId: null,
           regionSource: []
         },
         { 
           label: 'Quinta-feira',
           dayOfWeek: 5,
           regionId: null,
           regionSource: []
         },
         { 
           label: 'Sexta-feira',
           dayOfWeek: 6,
           regionId: null,
           regionSource: []
         },
         { 
           label: 'Sábado',
           dayOfWeek: 7,
           regionId: null,
           regionSource: []
         },
         { 
           label: 'Domingo',
           dayOfWeek: 1,
           regionId: null,
           regionSource: []
         },
      ]
    
  const dataUniqueTemplate =  
      [ 
         { 
           label: 'Única',
           dayOfWeek: null,
           regionId: null,
           regionSource: []
         }
      ]  
  
  const [loading, setLoading] = useState(true)
  const [editData, setEditData] = useState(dataUniqueTemplate)
  const [alertMessages, setAlertMessages] = useState([])
  const [type, setType] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  
  const ref = React.useRef()
  const alertRef = React.useRef()
  
  useEffect(() => {
    setAlertMessages([])
    if (visible) {
      getData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [visible])
  
  async function getData() {
    setLoading(true)
    try {
      const response = await apiRegion({
        method: 'GET',
        url: `/api/pessoaRegiao`,
        params: { colaboradorId: collaboratorId },
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        
        const type = data?.tipoVinculo || 1
        const newData = type === 1 ? dataUniqueTemplate : dataWeekTemplate
        const source = data.pessoaRegiao.filter(x => (type === 1 && !x.diaSemana) || (type === 2 && x.diaSemana))
        if (type === 1) {
          if (source.length > 0) {
            newData[0].regionId = source[0].regiaoId
            newData[0].regionSource = [buildRegionItemSource(source[0])]
          }
          oldUniqueData = newData
          oldWeekData = dataWeekTemplate
        }
        else {
          newData.map((d, index) => {
             const region = source.find(x => x.diaSemana === d.dayOfWeek)
             if (region) {
                newData[index].regionId = region.regiaoId
                newData[index].regionSource = [buildRegionItemSource(region)]
             }
             return true
          })
          oldUniqueData = dataUniqueTemplate
          oldWeekData = newData
        }
        setType(type)
        setEditData([...newData])
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      console.log(error)
      handleAuthError(error)
    }
  }
  
  const onChangeType = (type) => {
    if (type === 1) {
      oldWeekData = editData
      setEditData([...oldUniqueData])
    }
    else {
      oldUniqueData = editData
      setEditData([...oldWeekData])
    }
    setType(type)
  }
  
  const buildRegionItemSource = (region) => {
    const result = {
                     regionId: region.regiaoId,
                     regionName: region.regiaoNome,
                     regionDescription: region.regiaoDescricao,
                     regionStatus: region.regiaoStatus,
                   }
    return result               
  }
  
  async function savePersonRegion() {
    
    setIsSaving(true)
    
    const body = {
      colaboradorId: collaboratorId,
      regioes: editData.filter(x=> x.regionId).map(d => ( { diaSemana: d.dayOfWeek, regiaoId: d.regionId } )),
    }

    try {
      const response = await apiRegion({
        method: 'POST',
        url: `/api/PessoaRegiao`,
        data: body,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        setVisible(false)
        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )
      } else {
        setAlertMessages(data.notificacoes)
        showApiMessages(data)
        if (alertRef.current) {
          alertRef.current.scrollIntoView({
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
  
  const handleSave = () => {
    savePersonRegion()
  }

  return (
  <React.Fragment>  
    <Modal
      visible={visible}
      title="Regiões"
      onCancel={() => setVisible(false)}
      centered
      width="400px"
      footer={
        <Row type="flex">
          {canBeUpdated && (
            <Button
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
              }}
              loading={isSaving}
              onClick={() => handleSave()}
            >
              {formatMessage({
                id: 'saveButton',
              })}
            </Button>
          )}
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
      
      <Spin size="large" spinning={loading || isSaving}>

        <Skeleton
          loading={loading}
          paragraph={{ rows: 5 }}
          active
        />

        <div style={{ display: loading ? 'none' : 'block'}}>
          <div ref={alertRef}>
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
          
          <PersonRegionModalForm
            editData={editData}
            canBeUpdated={canBeUpdated}
            onChangeType={onChangeType}
            setEditData={setEditData}
            ref={ref}
            visible={visible}
            loading={loading}
            type={type}
          />
          
        </div>
        
      </Spin>
      
    </Modal>
  </React.Fragment>  
  )
}

PersonRegionModal.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  canBeUpdated: PropTypes.bool,
  collaboratorId: PropTypes.number,
}





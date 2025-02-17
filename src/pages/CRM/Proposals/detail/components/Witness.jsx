/* eslint-disable no-param-reassign */
import { Form } from '@ant-design/compatible'
import { Button, Modal, Row, Col, Input, Alert, message, Spin } from 'antd'
import InputMask from 'react-input-mask'
import PropTypes from 'prop-types'
import { hasPermission, validateByMask, removeMask, handleAuthError } from '@utils'
import React, { useState, useEffect } from 'react'
import { apiCRM } from '@services/api'

function Witness({
  setVisible,
  visible,
  proposalId,
  number,
  userPermissions,
  form,
  onChange,
}) {
  
  const witness = { id: null, name: '', cpf: '' }
  
  const [canBeUpdated, setCanBeUpdated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [alertMessages, setAlertMessages] = useState([])
  const [witnesses, setWitnesses] = useState([])
  const refAlert = React.useRef()
  
  const { getFieldDecorator } = form
  
  useEffect(() => {
    setCanBeUpdated(hasPermission(userPermissions, 'Include'))   
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  },[userPermissions])

  useEffect(() => {
    form.resetFields()   
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  },[witnesses])
  
  useEffect(() => {
    if (visible) {
      getWitness()
    }
   // eslint-disable-next-line react-hooks/exhaustive-deps
  },[visible])
  
  async function getWitness() {
    setLoading(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/proposalWitness`,
        params: { proposalId },
      })

      const { data } = response
      setLoading(false)

      if (data.isOk) {
        setWitnesses(data.witnesses)
      } else {
        message.error(data.message)
        setVisible(false)
      }
    } catch (error) {
      handleAuthError(error)
      setVisible(false)
    }
  }  
  
  const handleSubmit = (e) => {
    e && e.preventDefault()
    setAlertMessages([])

    if (!canBeUpdated) {
      message.error('Você não pode atualizar as testemunhas do negócio!')
      return
    }

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        saveWitness()
      }
    })
    
  }
  
  async function saveWitness() {
    
    const body = {
      proposalId,
      witnesses: [],
    }
    
    witnesses.map((d, index) => {
       body.witnesses.push( {
         id: d.id || 0,
         name: form.getFieldValue(`name_${index}`),
         cpf: removeMask(form.getFieldValue(`cpf_${index}`)), 
         order: index + 1,         
       })
       return false
    })
    
    setIsSaving(true)

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/proposalWitness`,
        data: body,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response
      
      if (data.isOk) {
        message.success('Salvo com sucesso!')
        if (onChange !== undefined) {
          onChange(proposalId)
        }
        setVisible(false)
      }        
      else {
        setAlertMessages(data.validationMessageList)
        if (refAlert.current) {
          refAlert.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }  
  
  const cpfValidate = (rule, value, callback) => {
    if (removeMask(value) && !validateByMask(value)) {
      callback('CPF incompleto!')
    } else {
      callback()
    }
  }
  
  const addWitness = () => {
    saveList()
    witnesses.push(witness)
    setWitnesses([...witnesses])
  }
  
  const removeWitness = (index) => {
    saveList()
    witnesses.splice(index, 1)
    setWitnesses([...witnesses])
  }
  
  const saveList = () => {
    witnesses.map((d, index) => {
       d.name = form.getFieldValue(`name_${index}`)
       d.cpf = form.getFieldValue(`cpf_${index}`)
       return false
    })
  }

  return (
    <Modal
      title={`Cadastro de testemunhas do negócio ${number}`}
      visible={visible}
      width="570px"
      centered
      destroyOnClose
      onOk={e => handleSubmit(e)}
      onCancel={() => setVisible(false)}
      footer={
        <Row type="flex">
          {canBeUpdated && !loading && (
            <Button
              className="formButton"
              htmlType="submit"
              onClick={handleSubmit}
              loading={isSaving}
            >
              Salvar
            </Button>
          )}
          <Button
            type="secondary"
            style={{ marginLeft: 'auto' }}
            onClick={() => setVisible(false)}
          >
            Cancelar
          </Button>
        </Row>
      }
    >
      <Form layout="vertical" onSubmit={handleSubmit}>

        <div ref={refAlert}>
          {alertMessages.map((message, index) => (
            <Alert
              type="error"
              message={message}
              key={index}
              showIcon
              className="mb-2"
            />
          ))}
        </div>
        
        <Spin spinning={loading} size="large" style={{ position: 'absolute', left: '50%', marginTop: '5px'}} />
        
        {witnesses.length === 0 && !loading && (
            <div className="text-center" style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
              <i
                className="fa fa-exclamation-circle fa-3x m-5"
                aria-hidden="true"
              />
              <h3>
                Não há dados aqui.
                {canBeUpdated && (
                  <span className="ml-2">Para cadastrar clique em <b>Adicionar testemunha</b></span>
                )}
              </h3>
            </div>
        )}
        
        {witnesses.map((d, index) => (
          <Row type="flex" gutter={12}>        
            <Col style={{ width: '360px' }}>
              <Form.Item label={`Testemunha ${index + 1}`}>
                {getFieldDecorator(`name_${index}`, {
                  initialValue: d.name,
                  rules: [
                    { required: true, message: 'Campo obrigatório!' },
                  ],
                })(
                  <Input
                    placeholder="Nome da testemunha"
                    disabled={!canBeUpdated}
                    autoFocus
                  />,
                )}
              </Form.Item>
            </Col>  
            <Col style={{ width: '150px' }}>
              <Form.Item label="CPF">
                {getFieldDecorator(`cpf_${index}`, {
                  initialValue: d.cpf || '',
                  rules: [
                    { validator: cpfValidate } ,
                    { required: true, message: 'Campo obrigatório!' } ,
                  ],
                })(
                  <InputMask
                    mask="999.999.999-99"
                    maskChar="_"
                    disabled={!canBeUpdated}
                    className="ant-input"
                  />,
                )}
                </Form.Item>
            </Col> 

            {canBeUpdated && (
              <Col>
                <i
                  className="fa fa-times fa-lg mt-12 cursor-pointer"
                  style={{ color: 'gray' }}
                  aria-hidden="true"
                  onClick={() => removeWitness(index)}
                />
              </Col>
            )} 
            
          </Row>
        ))}

        {canBeUpdated && (
          <div className="flex justify-end">
           <Button className="mt-4 cursor-pointer" onClick={() => addWitness()}>
             Adicionar testemunha
           </Button>
          </div>
        )}
      
        <input type="submit" id="submit-form" className="hidden" />
      </Form>
      
    </Modal>
  )
}

Witness.propTypes = {
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
  proposalId: PropTypes.number,
  userPermissions: PropTypes.array,
  onChange: PropTypes.func,
  form: PropTypes.any,
  number: PropTypes.number,
}

const WrappedWitness = Form.create()(
  Witness,
)
export default WrappedWitness


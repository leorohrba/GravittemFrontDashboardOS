/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Input, message, Button, Row, Col  } from 'antd'
import React, { useEffect, useState } from 'react'
import { Form } from '@ant-design/compatible'
import { fieldsValidationToast } from '@utils'
import { ShowDocumentNewWindow } from './ShowDocumentNewWindow'
import ShowDocument from './ShowDocument'

const ShowDocumentModal = ({ form, visible, setVisible, modelDocument, title, onShowDocument, onClose, setLoadingDocument }) => {

  const { getFieldDecorator } = form
  const [showDocument, setShowDocument] = useState(false)
  const [parameters, setParameters] = useState(null)
  const [isHtml, setIsHtml] = useState(false)

  const ref =  React.useRef()

  const handleShowDocument = (modelDocumentParameter, parameters, isHtml) => {
    setShowDocument(true)
    setVisible(false)
    const modeloDocumento = modelDocumentParameter || null
    const parametros = parameters?.parametros?.length > 0 ? parameters.parametros.join('|') : null
    const valores =  parameters?.valores?.length > 0 ? parameters.valores.join('|') : null
    !isHtml && ShowDocumentNewWindow ({
      modeloDocumentoId: modelDocument?.modeloDocumentoId,
      modeloDocumento,
      parametros,
      valores,
      setLoadingDocument,
    })
    isHtml && onShowDocument && onShowDocument()
  }

  useEffect(() => {
    if (visible) {  
      form.resetFields()
      setShowDocument(false)
      if (ref.current) {
          try { ref.current.focus() } catch {}
      }
    }
  },[modelDocument, visible])

  const handlePrint = (e, isHtml) => {
    e && e.preventDefault()
    setIsHtml(isHtml)
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        fieldsValidationToast()
      } else {
        print(isHtml)
      }
    })
  }

  const print = (isHtml) => {
    const parametros = { parametros: [], valores: [] }
    modelDocument?.tipoDocumento && modelDocument.tipoDocumento.parametrosApi.map((d) => {
       const value = form.getFieldValue(d.nome)
       if (!(value === null || value === undefined || value === '')) {
         parametros.parametros.push(d.nome)
         parametros.valores.push(value)
       }   
       return true
    })
    if (parametros.parametros.length === 0 && modelDocument?.tipoDocumento?.parametrosApi?.length > 0){
      handleShowDocument(modelDocument, null, isHtml)
      setParameters(null)
      message.info('Nenhum parametro informado! - Relatório será impresso sem a substituição das variáveis') 
    } 
    else {
      handleShowDocument(null, parametros, isHtml)
      setParameters(parametros)
    }
  }

 const getValue = (nome) => {
    if (!parameters?.parametros) {
        return null
    }
    const i = parameters.parametros.findIndex(x => x === nome)
    if (i > -1 && i < parameters.valores?.length) {
       return parameters.valores[i]
    }
    return null
 } 

 const handleClose = () => {
    setShowDocument(false)
    onClose && onClose()
 }

 return (
  <>  
    <Modal
      visible={visible && modelDocument && !showDocument}
      centered
      destroyOnClose
      onCancel={() => setVisible(false)}
      title={`Imprimir ${modelDocument?.nome}`}
      footer={
        <Row type="flex" gutter={12} justify="right">
          <Col className="ml-auto">
            <Button
              type="primary"
              onClick={(e) => handlePrint(e, true)}
            >
              <i className="fa fa-html5 mr-2" />
              Imprimir em html
            </Button>  
          </Col>  
          <Col>
            <Button
              type="primary"
              className="formButton"
              onClick={(e) => handlePrint(e, false)}
            >
              <i className="fa fa-file-pdf-o mr-2" />
              Imprimir em pdf
            </Button>  
          </Col>  
          <Col>
            <Button
              type="secondary"
              onClick={() => setVisible(false)}
            >
              Cancelar
            </Button>
          </Col>
        </Row>
      }      
    >
      <Form layout="vertical">
        {modelDocument && modelDocument.tipoDocumento.parametrosApi.map((d, index) => (
          <Form.Item className="mb-1" label={d.descricao}>
            {getFieldDecorator(d.nome, {
            initialValue: getValue(d.nome),
            })(<Input ref={index === 0 ? ref : undefined} autoFocus={index === 0} />)}
          </Form.Item>
        ))}  
      </Form>
    </Modal>

    {showDocument && isHtml && (
      <ShowDocument
        modeloDocumentoId={modelDocument?.modeloDocumentoId}
        modeloDocumento={parameters?.parametros?.length > 0 ? null : modelDocument}
        parametros={parameters?.parametros?.length > 0 ? parameters.parametros.join('|') : null}
        valores={parameters?.valores?.length > 0 ? parameters.valores.join('|') : null}
        titulo1={title}
        titulo2={modelDocument?.nome || 'Impressão modelo de documento'}
        onClose={handleClose}
        html={isHtml}
      /> 
    )}
  </>  
  )
}

const WrappedForm = Form.create()(ShowDocumentModal)

export default WrappedForm

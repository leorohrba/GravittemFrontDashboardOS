/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-template-curly-in-string */
import { getData, getParameter, PdfMakeConfig, ShowHtml } from './functions'
import { Spin, message, Row } from 'antd'
import React, { useState, useEffect } from 'react'

const ShowDocument = ({ html, modeloDocumentoId, parametros, valores, modeloDocumento, titulo1, titulo2, modal, callback, width, height, onClose }) => {
  const modelDocumentId = modeloDocumentoId || getParameter('modeloDocumentoId')
  const parameters = parametros || getParameter('parametros')
  const values = valores || getParameter('valores')
  const title1 = titulo1 || getParameter('titulo1')
  const title2 = titulo2 || getParameter('titulo2')

  function getIsModal()  {
    let result = getParameter('modal')
    result = (result && result.toLowerCase()) || 'false'
    return result === 'true'
  }
  const isModal = (!(modal === null || modal === undefined) && modal) || getIsModal()

  function getIsHtml()  {
    let result = getParameter('html')
    result = (result && result.toLowerCase()) || 'false'
    return result === 'true'
  }
  const isHtml = (!(html === null || html === undefined) && html) || getIsHtml()

  const [loadingDocument, setLoadingDocument] = useState(true)
  const [content, setContent] = useState(null)

  useEffect(() => {
    if (modeloDocumento) {
      setContent(modeloDocumento)
    } else if (modelDocumentId) {
      getData(modelDocumentId, parameters, values, handleCallback)
    } else {
      message.error('Nenhum parametro informado!')
      setLoadingDocument(false)
    }
   },[modeloDocumento, modelDocumentId, parameters, values])

   useEffect(() => {
    if (content) {
      setLoadingDocument(false)
    }
  }, [content])

  const handleCallback = (document) => {
    if (document) {
      setContent(document)
    } else {
      onClose && onClose()
    }
  }
  if (loadingDocument) {
    return (
      <div className="flex justify-center mt-24">
        <Spin spinning={loadingDocument} size="large" />
      </div>
    )
  }

  return (
    <div className={!isModal ? "container" : ""}>
      {!isModal && (title1 || title2 ) && (
        <Row className="mb-5" align="middle">
          {title1 && (
            <span
              style={onClose && {
                color: '#1976D2',
                cursor: 'pointer',
              }}
              onClick={e => onClose && onClose()}
              role="button"
            >
              {title1}
            </span>
          )}
          {title1 && title2 && (<i className="mx-3 fa fa-angle-right" />)}
          {title2 && (<b>{title2}</b>)}
        </Row>
      )}
      {!isHtml ? (
        <div id="pdfMakeReport" className={!isModal ? "mt-5" : ""} style={{ minHeight: isModal ? '1000px' : ''}}>
          <PdfMakeConfig
            documentContent={content}
            type="show"
            callback={callback}
            width={width || (isModal ? "94%" : "95%")}
            height={height || (isModal ? '73%' : '90%')}
          />
        </div>
      ) : (<ShowHtml content={content} replaceFields={!!modeloDocumento} />)}
    </div>      
  )  
}

export default ShowDocument

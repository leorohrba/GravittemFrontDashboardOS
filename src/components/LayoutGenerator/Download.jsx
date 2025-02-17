/* eslint-disable react-hooks/exhaustive-deps */
import { getData, getParameter, PdfMakeConfig } from './functions'
import { Spin, message } from 'antd'
import React, { useState, useEffect } from 'react'

const Download = ({ modeloDocumentoId, parametros, valores, modeloDocumento }) => {

  const modelDocumentId = modeloDocumentoId || getParameter('modeloDocumentoId')
  const parameters = parametros || getParameter('parametros')
  const values = valores || getParameter('valores')
  const [loadingDocument, setLoadingDocument] = useState(true)

  useEffect(() => {
    if (modeloDocumento) {
      PdfMakeConfig({ document: modeloDocumento, type: 'download', callback: handleLoadingOff })
    } else if (modelDocumentId) {
      getData(modelDocumentId, parameters, values, handleCallback)
    } else {
      message.error('Nenhum parametro informado!')
      setLoadingDocument(false)
    }
  },[modeloDocumento, modelDocumentId, parameters, values])

  const handleCallback = (document) => {
    PdfMakeConfig({ documentContent: document, type: 'download', callback: handleLoadingOff })
  }

  const handleLoadingOff = () => {
    setLoadingDocument(false)
  }

  return loadingDocument ? (
    <div className="flex justify-center mt-24">
      <Spin spinning={loadingDocument} size="large" />
    </div> ) : null
}

export default Download

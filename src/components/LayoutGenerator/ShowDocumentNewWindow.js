/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-template-curly-in-string */
import { getData, getParameter, PdfMakeConfig } from './functions'
import { message } from 'antd'

export function ShowDocumentNewWindow({ modeloDocumentoId, parametros, valores, modeloDocumento, setLoadingDocument })  {
  const modelDocumentId = modeloDocumentoId || getParameter('modeloDocumentoId')
  const parameters = parametros || getParameter('parametros')
  const values = valores || getParameter('valores')
  setLoadingDocument(true)
   
  if (modeloDocumento) {
    handleCallback(modeloDocumento, setLoadingDocument)
  } else if (modelDocumentId) {
      getData(modelDocumentId, parameters, values, handleCallback, setLoadingDocument)
  } else {
    message.error('Nenhum parametro informado!')
    setLoadingDocument(false)
  }  
}

const handleCallback = (document, setLoadingDocument) => {
  setLoadingDocument(false)
  PdfMakeConfig({ documentContent: document,
    type: 'show',
    newWindow: true,
  })
}


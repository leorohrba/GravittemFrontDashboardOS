import { getData, PdfMakeConfig } from './functions'

const FileGenerate = ({ modeloDocumentoId, parametros, valores, modeloDocumento, callback }) => {

  const handleCallback = (document) => {
    PdfMakeConfig({ documentContent: document, type: 'blob', callback })
  }

  if (modeloDocumento) {
      PdfMakeConfig({ documentContent: modeloDocumento, type: 'blob', callback})
  } else {
    getData(modeloDocumentoId, parametros, valores, handleCallback)
  }

}

export default FileGenerate

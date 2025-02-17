import React from 'react'
import { Button, Spin } from 'antd'
import PropTypes from 'prop-types'

function ImportExcelStep1({downloadFile, isDownloading}) {
  return (
    <Spin spinning={isDownloading}>
      <div className="text-center">
        <h3>
          Baixe o arquivo modelo e preencha com os dados para importação. 
        </h3>
        <h3>
          Siga as instruções do arquivo.
        </h3>
        <Button onClick={() => downloadFile()} className="mt-5">
          <i className="fa fa-download mr-3" aria-hidden="true" />
          Baixar modelo
        </Button>
      </div>
    </Spin>
  )
}

ImportExcelStep1.propTypes = {
  isDownloading: PropTypes.bool,
  downloadFile: PropTypes.func,
}

export default ImportExcelStep1

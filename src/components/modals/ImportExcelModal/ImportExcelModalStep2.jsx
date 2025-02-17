/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import { Alert, Icon, Row, Upload, message } from 'antd';
import PropTypes from 'prop-types'

const { Dragger } = Upload

const fileLimitSizeForUpload = 28 // (em MB)

function ImportExcelStep2({
  replaceFile,
  setReplaceFile,
  fileList,
  setFileList,
}) {

  const [temporaryFile, setTemporaryFile] = useState()

  const prop = {
    accept: '.xls,.xlsx,.csv',
    onRemove(file) {
      const index = fileList.findIndex(x => x === file)
      if (index > -1) {
         fileList.splice(index,1)
         setFileList([...fileList])
      }
    },
    beforeUpload(file, list) {
      const isBig = file.size / 1024 / 1024 > fileLimitSizeForUpload
      if (isBig) {
        message.error(`Arquivo deve ser menor que ${fileLimitSizeForUpload}MB!`)
        return false
      }
      if (fileList.length > 0) {
        setReplaceFile(true)
        setTemporaryFile(file)
        return false
      }
      setFileList(list)
      return false
    },
    fileList,
  }
  return (
    <div>
      <small>
        Somente arquivos .xls e .csv podem ser importados
      </small>
      <Dragger {...prop}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">
          Clique ou arraste o arquivo para essa área
        </p>
      </Dragger>
      {replaceFile && (
        <Alert
          className="mt-4"
          type="warning"
          message={
            <Row type="flex">
              <div className="w-2/3">
                {`O arquivo "${fileList[0].name}" será substituído pelo arquivo "${temporaryFile.name}". Deseja continuar?`}
              </div>
              <div style={{ margin: 'auto' }}>
                <span onClick={() => setReplaceFile(false)}>
                  <b style={{ color: 'red', cursor: 'pointer' }}>
                    Não{' '}
                    <i className="fa fa-times fa-lg" aria-hidden="true" />
                  </b>
                </span>
                <span
                  onClick={() => {
                    setFileList([temporaryFile])
                    setReplaceFile(false)
                  }}
                >
                  <b
                    className="ml-5"
                    style={{ color: 'green', cursor: 'pointer' }}
                  >
                    Sim{' '}
                    <i className="fa fa-check fa-lg" aria-hidden="true" />
                  </b>
                </span>
              </div>
            </Row>
          }
        />
      )}
    </div>
  );
}

ImportExcelStep2.propTypes = {
  fileList: PropTypes.array,
  setFileList: PropTypes.any,
  replaceFile: PropTypes.bool,
  setReplaceFile: PropTypes.any,
}

export default ImportExcelStep2

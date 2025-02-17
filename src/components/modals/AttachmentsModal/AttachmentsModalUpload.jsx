import { Button, message, Upload } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

const fileLimiteSizeForUpload = 50

const beforeUpload = file => {
  const isBig = file.size / 1024 / 1024 > fileLimiteSizeForUpload
  if (isBig) {
    message.error(`Arquivo deve ser menor que ${fileLimiteSizeForUpload}MB!`)
  }
  return !isBig
}

export function AttachmentsModalUpload({
  getAttachments,
  setFileList,
  proposalId,
  token,
  uploadConfig,
  fileList,
  signature,
}) {
  const [uploadingFile, setUploadingFile] = useState(false)
  const onChangeFile = info => {
    const { file } = info
    let removeFile = false

    if (file.response && file.response.isOk) {
      removeFile = true
      getAttachments()
      setUploadingFile(false)
    } else if (
      file.status === 'removed' ||
      file.status === null ||
      file.status === undefined
    ) {
      removeFile = true
      setUploadingFile(false)
    } else if (file.status === 'uploading') {
      setUploadingFile(true)
    } else {
      message.error('Ocorreu algum erro ao efetuar o upload!')
      setUploadingFile(false)
    }

    if (removeFile) {
      setFileList([])
    } else {
      setFileList([file])
    }
  }
  return (
    <Upload
      headers={{
        Authorization: token,
      }}
	  data={{ assinatura: !!signature }}
      onChange={onChangeFile}
      fileList={fileList}
      beforeUpload={beforeUpload}
      {...uploadConfig}
    >
      <Button disabled={uploadingFile}>
        <i
          className="fa fa-upload fa-lg mr-3"
          style={{
            color: 'gray',
          }}
          aria-hidden="true"
        />
        Anexar arquivo
      </Button>
    </Upload>
  )
}

AttachmentsModalUpload.propTypes = {
  fileList: PropTypes.array,
  getAttachments: PropTypes.func,
  uploadingFile: PropTypes.bool,
  proposalId: PropTypes.string,
  setFileList: PropTypes.func,
  setUploadingFile: PropTypes.func,
  token: PropTypes.string,
  uploadConfig: PropTypes.object,
  signature: PropTypes.bool
}

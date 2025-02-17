/* eslint-disable react/button-has-type */
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import {
  Button,
  Col,
  message,
  Modal,
  Row,
  Skeleton,
  Spin,
  Tooltip,
  Upload,
} from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

const fileLimitSizeForUpload = 28 // (em MB)

export default function MaterialsAttachments(props) {
  const { libraryId, loading, attachments, onChange, canBeUpdated } = props
  const [fileList, setFileList] = useState([])
  const [token, setToken] = useState(null)
  const [idInProcess, setIdInProcess] = useState(0)
  const [isInProcess, setIsInProcess] = useState(false)

  useEffect(() => {
    getTokenForUpload()
  }, [])

  function getTokenForUpload() {
    const tokenData =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('token')
        : null

    const authTokenData =
      tokenData !== null ? tokenData : localStorage.getItem('token')

    localStorage.setItem('token', authTokenData)

    setToken(authTokenData)
  }

  const onChangeFile = info => {
    const { file } = info

    let removeFile = false

    if (file.status === 'done' && file.response) {
      if (file.response.isOk) {
        removeFile = true
      } else {
        file.status = 'error'
        message.error('Ocorreu algum erro ao efetuar o upload!')
      }
    } else if (file.status === 'done' && !file.response) {
      file.status = 'error'
      message.error('Ocorreu algum erro ao efetuar o upload!')
    } else if (file.status === 'error') {
      message.error('Ocorreu algum erro ao efetuar o upload!')
    } else if (
      file.status === 'removed' ||
      file.status === null ||
      file.status === undefined
    ) {
      removeFile = true
    }

    if (removeFile) {
      setFileList([])
    } else {
      setFileList([file])
    }

    if (file.status === 'done') {
      onChange()
    }
  }

  const downloadFile = (id, fileName) => {
    setIdInProcess(id)
    setIsInProcess(true)
    apiCRM({
      url: `/api/crm/downloadLibraryAttach`,
      method: 'GET',
      params: { libraryAttachId: id },
      responseType: 'blob', // important
    })
      .then(response => {
        setIsInProcess(false)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
      })
      .catch(function abort(error) {
        // handle error
        setIsInProcess(false)
        handleAuthError(error)
      })
  }

  const confirmDeleteFile = (id, fileName) => {
    Modal.confirm({
      content: `Tem certeza que deseja excluir o arquivo ${fileName}?`,
      title: 'Atenção',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteFile(id)
      },
    })
  }

  async function deleteFile(id) {
    setIsInProcess(true)
    setIdInProcess(id)

    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/crm/deleteLibraryAttach`,
        params: { libraryAttachId: id },
      })

      setIsInProcess(false)

      const { data } = response

      if (data.isOk) {
        onChange()
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setIsInProcess(false)
      handleAuthError(error)
    }
  }

  const beforeUpload = file => {
    const isBig = file.size / 1024 / 1024 > fileLimitSizeForUpload
    if (isBig) {
      message.error(`Arquivo deve ser menor que ${fileLimitSizeForUpload}MB!`)
    }
    return !isBig
  }

  return (
    <div className={libraryId > 0 ? 'mt-2' : ''}>
      {canBeUpdated && !loading && libraryId > 0 && (
        <div className={attachments.length > 0 ? 'mb-2' : ''}>
          <Upload
            accept="video/*,image/*,.pdf,.doc,.docx,.xls,.xlsx"
            action={`${process.env.UMI_API_HOST_CRM}/api/crm/insertLibraryAttach`}
            data={{ libraryId }}
            headers={{ Authorization: token }}
            onChange={onChangeFile}
            fileList={fileList}
            beforeUpload={beforeUpload}
          >
            <Button>
              <i
                className="fa fa-upload fa-lg mr-3"
                style={{ color: 'gray' }}
                aria-hidden="true"
              />
              Anexar arquivo
            </Button>
          </Upload>
        </div>
      )}

      <Spin spinning={loading}>
        <Skeleton loading={loading} paragraph={{ rows: 1 }} active>
          {attachments.map(record => (
            <Row type="flex" className="py-1">
              <Col>
                <i
                  className="fa fa-paperclip mr-2"
                  style={{ color: 'gray' }}
                  aria-hidden="true"
                />
              </Col>
              <Col>
                <Row className="w-full">
                  <span
                    className="linkButton"
                    onClick={() =>
                      downloadFile(record.libraryAttachId, record.fileName)
                    }
                    role="button"
                  >
                    <Row type="flex" align="middle">
                      <Col className="truncate">{record.fileName}</Col>
                      <Col>
                        <div
                          className="ml-2 mt-1"
                          style={{
                            display:
                              isInProcess &&
                              record.libraryAttachId === idInProcess
                                ? 'block'
                                : 'none',
                          }}
                        >
                          <Spin size="small" style={{ marginTop: '-3px' }} />
                        </div>
                      </Col>
                    </Row>
                  </span>
                </Row>
              </Col>
              {canBeUpdated && (
                <Col>
                  <button
                    disabled={!canBeUpdated}
                    className="linkButton"
                    onClick={e => {
                      e.preventDefault()
                      confirmDeleteFile(record.libraryAttachId, record.fileName)
                    }}
                  >
                    <Tooltip title="Excluir anexo">
                      <i
                        className="fa fa-trash-o mt-1 ml-1"
                        style={{ color: 'gray' }}
                        aria-hidden="true"
                      />
                    </Tooltip>
                  </button>
                </Col>
              )}
            </Row>
          ))}
        </Skeleton>
      </Spin>
    </div>
  )
}

MaterialsAttachments.propTypes = {
  libraryId: PropTypes.number,
  loading: PropTypes.bool,
  attachments: PropTypes.array,
  onChange: PropTypes.func,
  canBeUpdated: PropTypes.bool,
}

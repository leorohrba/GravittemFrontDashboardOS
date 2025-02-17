/* eslint-disable react/button-has-type */
import { apiCRM } from '@services/api'
import { customDateTimeFormat, handleAuthError } from '@utils'
import {
  Button,
  Card,
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

const fileLimiteSizeForUpload = 28 // (em MB)

export default function LeftBarAttachments(props) {
  const { proposalId, loading, attachments, onChange, canBeUpdated } = props
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

    if (file.status === 'done') {
      if (file.response) {
        if (file.response.isOk) {
          removeFile = true
        } else {
          file.status = 'error'
          message.error('Ocorreu algum erro ao efetuar o upload!')
        }
      } else {
        file.status = 'error'
        message.error('Ocorreu algum erro ao efetuar o upload!')
      }
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
      url: `/api/crm/downloadProposalAttach`,
      method: 'GET',
      params: { proposalAttachId: id },
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
        url: `/api/crm/deleteProposalAttach`,
        params: { proposalAttachId: id },
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
      message.error('Não foi possível excluir o arquivo')
    }
  }

  const beforeUpload = file => {
    const isBig = file.size / 1024 / 1024 > fileLimiteSizeForUpload
    if (isBig) {
      message.error(`Arquivo deve ser menor que ${fileLimiteSizeForUpload}MB!`)
    }
    return !isBig
  }

  return (
    <div>
      <Card className="mt-5 relative" bodyStyle={{ padding: 0 }}>
        <div className="primary-background-color h-12" />
        <h3
          className="absolute text-white"
          style={{ top: '10px', left: '20px' }}
        >
          Anexos
        </h3>
        {canBeUpdated && !loading && (
          <div className="ml-3 mr-3 mt-3 mb-2">
            <Upload
              action={`${process.env.UMI_API_HOST_CRM}/api/crm/insertProposalAttach`}
              data={{ proposalId }}
              headers={{ Authorization: token }}
              onChange={onChangeFile}
              fileList={fileList}
              beforeUpload={beforeUpload}
            >
              <Button style={{ width: '18vw' }}>
                <i
                  className="fa fa-upload fa-lg mr-3"
                  style={{ color: 'gray' }}
                  aria-hidden="true"
                />
                Selecionar arquivo
              </Button>
            </Upload>
          </div>
        )}

        <div className="ml-3 mt-2 mb-2">
          <Skeleton
            className="px-4"
            loading={loading}
            paragraph={{ rows: 5 }}
            active
          >
            {attachments.map((record, index) => (
              <React.Fragment key={index}>
                <Row type="flex" className="w-full py-1">
                  <Col style={{ width: '8%' }}>
                    <i
                      className="fa fa-paperclip mr-2"
                      style={{ color: 'gray' }}
                      aria-hidden="true"
                    />
                  </Col>
                  <Col style={{ width: '77%' }}>
                    <Row className="w-full">
                      <span
                        className="linkButton"
                        data-testid="downloadButton"
                        onClick={() =>
                          downloadFile(record.proposalAttachId, record.fileName)
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
                                  record.proposalAttachId === idInProcess
                                    ? 'block'
                                    : 'none',
                              }}
                            >
                              <Spin size="small" />
                            </div>
                          </Col>
                        </Row>
                      </span>
                      <p
                        className="m-0"
                        style={{
                          fontSize: 'small',
                          color: 'gray',
                          fontStyle: 'italic',
                        }}
                      >
                        Enviado por {record.createUserName} em{' '}
                        {customDateTimeFormat(
                          record.createDateTime,
                          'DD/MM/YY HH:mm',
                        )}
                      </p>
                    </Row>
                  </Col>
                  {canBeUpdated && (
                    <Col style={{ width: '8%' }}>
                      <button
                        disabled={!canBeUpdated}
                        className="linkButton"
                        data-testid="deleteFileButton"
                        onClick={() =>
                          confirmDeleteFile(
                            record.proposalAttachId,
                            record.fileName,
                          )
                        }
                      >
                        <Tooltip title="Excluir anexo">
                          <i
                            className="fa fa-trash-o mt-1"
                            style={{ color: 'gray' }}
                            aria-hidden="true"
                          />
                        </Tooltip>
                      </button>
                    </Col>
                  )}
                </Row>
              </React.Fragment>
            ))}
          </Skeleton>
        </div>
      </Card>
    </div>
  )
}

LeftBarAttachments.propTypes = {
  proposalId: PropTypes.number,
  loading: PropTypes.bool,
  attachments: PropTypes.array,
  onChange: PropTypes.func,
  canBeUpdated: PropTypes.bool,
}

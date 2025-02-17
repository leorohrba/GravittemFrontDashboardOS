import { customDateTimeFormat, handleAuthError, iconFile } from '@utils'
import { Col, message, Modal, Row, Spin, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { apiAttachment } from '../../../services/api'

export function AttachmentsModalItems({ record, getAttachments, entityId }) {
  const [idInProcess, setIdInProcess] = useState(0)
  const [isInProcess, setIsInProcess] = useState(false)

  const fileNameParsed = record.nome.split('.')

  function getTokenForUpload() {
    const tokenData =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('token')
        : null

    const authTokenData =
      tokenData !== null ? tokenData : localStorage.getItem('token')

    return authTokenData
  }

  const downloadFile = async (fileId, fileName) => {
    setIsInProcess(true)
    setIdInProcess(fileId)
    try {
      const response = await apiAttachment({
        url: `/api/Anexo/${entityId}/${fileId}`,
        method: 'GET',
        responseType: 'blob', // important
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      setIsInProcess(false)
    } catch (error) {
      setIsInProcess(false)
      handleAuthError(error)
    }
  }

  const confirmDeleteFile = (fileId, fileName) => {
    Modal.confirm({
      content: `Tem certeza que deseja excluir o arquivo ${fileName}?`,
      title: 'Atenção',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteFile(fileId)
      },
    })
  }

  async function deleteFile(fileId) {
    setIsInProcess(true)
    setIdInProcess(fileId)

    try {
      const response = await apiAttachment({
        url: `/api/Anexo/${entityId}/${fileId}`,
        method: 'DELETE',
      })

      setIsInProcess(false)

      const { data } = response

      if (data.isOk) {
        getAttachments()
        message.success('Anexo excluído com sucesso')
      }
    } catch (error) {
      setIsInProcess(false)
      handleAuthError(error)
      message.error('Arquivo não encontrado')
    }
  }

  return (
    <React.Fragment key={record.id}>
      <Row type="flex" className="w-full py-1">
        <Col
          className="mr-4"
          style={{
            width: '64px',
            textAlign: 'center',
            marginTop: '7px',
          }}
        >
          {iconFile(
            `${process.env.UMI_API_HOST_ATTACHMENT}/api/Anexo/${entityId}/${
              record.id
            }/icone?access_token=${getTokenForUpload()}`,
            fileNameParsed[0],
            `.${fileNameParsed[1]}`,
          )}
        </Col>
        <Col>
          <Row className="w-full mt-2">
            <Row type="flex" align="middle">
              <span
                className="linkButton"
                data-testid="downloadButton"
                onClick={() =>
                  isInProcess && record.id === idInProcess
                    ? null
                    : downloadFile(record.id, record.nome)
                }
                role="button"
              >
                <Col className="truncate" style={{ width: '20vw' }}>
                  <Tooltip title={record.nome} mouseEnterDelay={0.5}>
                    {record.nome}
                  </Tooltip>
                </Col>
              </span>
              <Col className="ml-5">
                <Spin
                  size="small"
                  style={{
                    display:
                      isInProcess && record.id === idInProcess
                        ? 'contents'
                        : 'none',
                  }}
                />
              </Col>
            </Row>

            <p
              className="m-0"
              style={{
                fontSize: 'small',
                color: 'gray',
                fontStyle: 'italic',
              }}
            >
              Enviado por {record.usuarioNome} em{' '}
              {customDateTimeFormat(record.dataEnvio, 'DD/MM/YYYY HH:mm')}
            </p>
          </Row>
        </Col>
        <Col>
          <button
            className="linkButton"
            type="button"
            data-testid="deleteFileButton"
            onClick={() => confirmDeleteFile(record.id, record.nome)}
            style={{
              display:
                isInProcess && record.id === idInProcess ? 'none' : 'contents',
            }}
          >
            <Tooltip title="Excluir anexo">
              <i
                className="fa fa-times fa-lg mt-3"
                style={{
                  color: 'gray',
                }}
                aria-hidden="true"
              />
            </Tooltip>
          </button>
        </Col>
      </Row>
    </React.Fragment>
  )
}

AttachmentsModalItems.propTypes = {
  entityId: PropTypes.string,
  getAttachments: PropTypes.array,
  record: PropTypes.any,
}

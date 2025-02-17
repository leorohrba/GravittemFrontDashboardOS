import Button from '@components/Button'
import { apiAttachment } from '@services/api'
import { getAuthToken, handleAuthError } from '@utils'
import { message } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import AttachmentsModal from './AttachmentsModal'
import { AttachmentsModalContent } from './AttachmentsModalContent'

const AttachmentsModalConfig = ({
  entityId,
  hideModal,
  attachments,
  buttonClassName,
  setAttachments,
  signature,
}) => {
  const [fileList, setFileList] = useState([])
  const [attachmentsModalVisible, setAttachmentsModalVisible] = useState(false)
  const [loadingAttachments, setLoadingAttachments] = useState(true)
  const uploadConfig = {
    action: `${process.env.UMI_API_HOST_ATTACHMENT}/api/Anexo/${entityId}`,
  }
  useEffect(() => {
    if (entityId) {
      getAuthToken()
      getAttachments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const getAttachments = async () => {
    setLoadingAttachments(true)
    try {
      const response = await apiAttachment.get(!!signature ? `/api/Anexo/Assinatura/${entityId}` : `/api/Anexo/${entityId}`)
      const { data } = response
      setAttachments(data.arquivos)
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível obter os anexos')
    }
    setLoadingAttachments(false)
  }
  return (
    <React.Fragment>
      {hideModal ? (
        <AttachmentsModalContent
          {...{
            uploadConfig,
            getAttachments,
            loadingAttachments,
            attachmentsModalVisible,
            setAttachmentsModalVisible,
            fileList,
            setFileList,
            attachments,
            entityId,
            setAttachments,
			signature,
          }}
        />
      ) : (
        <React.Fragment>
          <Button
            disabled={!entityId}
            className={buttonClassName}
            onClick={() => setAttachmentsModalVisible(true)}
            quantity={attachments.length}
          >
            <i className={`fa fa-${!!signature ? 'check' : 'paperclip'} fa-lg mr-3`} />
		    {signature ? 'Assinaturas' : 'Anexos'}
          </Button>
          <AttachmentsModal
            {...{
              uploadConfig,
              attachmentsModalVisible,
              setAttachmentsModalVisible,
              fileList,
              setFileList,
              attachments,
              getAttachments,
              loadingAttachments,
              setLoadingAttachments,
              setAttachments,
              entityId,
			  signature,
            }}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

AttachmentsModalConfig.propTypes = {
  attachments: PropTypes.array,
  buttonClassName: PropTypes.string,
  entityId: PropTypes.string,
  fileList: PropTypes.array,
  hideModal: PropTypes.bool,
  setAttachments: PropTypes.func,
  setFileList: PropTypes.func,
  setVisibleAttachmentsModal: PropTypes.func,
  visibleAttachmentsModal: PropTypes.bool,
  signature: PropTypes.bool,
}

export default AttachmentsModalConfig

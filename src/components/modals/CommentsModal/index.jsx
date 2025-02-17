import Button from '@components/Button'
import { apiComments } from '@services/api'
import { getAuthToken, handleAuthError } from '@utils'
import { message } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import CommentsModal from './CommentsModal'
import CommentsModalHeader from './CommentsModalHeader'
import CommentsModalList from './CommentsModalList'

export default function CommentsModalConfig({
  entityId,
  commentsData,
  setCommentsData,
  hideModal,
  buttonClassName,
}) {
  const [commentsModalVisible, setCommentsModalVisible] = useState(false)

  useEffect(() => {
    if (entityId) {
      getAuthToken()
      getComments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function getComments() {
    try {
      const response = await apiComments.get(`/api/Comentario/${entityId}`)
      setCommentsData(response.data)
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível obter os comentários')
    }
  }
  return hideModal ? (
    <React.Fragment>
      <CommentsModalHeader
        {...{
          commentsData,
          setCommentsData,
          getComments,
          entityId,
        }}
      />
      <CommentsModalList {...{ commentsData }} />
    </React.Fragment>
  ) : (
    <React.Fragment>
      <Button
        onClick={() => setCommentsModalVisible(true)}
        quantity={commentsData.comentarios.length}
        disabled={!entityId}
        className={buttonClassName}
      >
        <i className="fa fa-comment fa-lg mr-3" />
        Comentários
      </Button>
      <CommentsModal
        {...{
          commentsModalVisible,
          setCommentsModalVisible,
          getComments,
          entityId,
          commentsData,
          setCommentsData,
        }}
      />
    </React.Fragment>
  )
}

CommentsModalConfig.propTypes = {
  buttonClassName: PropTypes.string,
  commentsData: PropTypes.array,
  entityId: PropTypes.string,
  hideModal: PropTypes.bool,
  setCommentsData: PropTypes.func,
}

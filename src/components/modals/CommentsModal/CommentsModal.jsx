/* eslint-disable react/no-unused-prop-types */
import { Button, Modal, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import CommentsModalHeader from './CommentsModalHeader'
import CommentsModalList from './CommentsModalList'

export default function CommentsModal({
  commentsModalVisible,
  setCommentsModalVisible,
  entityId,
  commentsData,
  setCommentsData,
  getComments,
}) {
  return (
    <React.Fragment>
      <Modal
        okButtonProps={{ hidden: true }}
        footer={
          <Row type="flex" justify="space-between" align="middle">
            <Button
              id="button-cancel-attachment"
              type="secondary"
              onClick={() => setCommentsModalVisible(false)}
            >
              Voltar
            </Button>
            <p className="mb-0">
              {`${commentsData.comentarios.length} comentário(s)`}
            </p>
          </Row>
        }
        visible={commentsModalVisible}
        title="Comentários"
        cancelText="Voltar"
        onCancel={() => setCommentsModalVisible(false)}
      >
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
      </Modal>
    </React.Fragment>
  )
}
CommentsModal.propTypes = {
  commentsData: PropTypes.array,
  commentsModalVisible: PropTypes.bool,
  setCommentsModalVisible: PropTypes.func,
  setCommentsData: PropTypes.any,
  entityId: PropTypes.any,
  getComments: PropTypes.func,
  saveComment: PropTypes.func,
  setUser: PropTypes.func,
}

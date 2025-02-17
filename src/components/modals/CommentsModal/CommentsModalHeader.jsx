import { apiComments } from '@services/api'
import { handleAuthError } from '@utils/index'
import { Avatar, Button, Col, Form, Input, message, Row } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

export default function CommentsModalHeader({
  entityId,
  commentsData,
  setCommentsData,
  getComments,
}) {
  const { TextArea } = Input
  async function handleClick(e) {
    e.preventDefault()
    if (commentInput.length > 0) {
      const newComment = {
        nomeUsuario: user.name,
        data: moment().format(),
        texto: `${commentInput}`,
        entidadeId: entityId,
      }
      setCommentInput('')
      saveComment(newComment)
    } else {
      message.error('Preencha o campo comentário.')
    }
  }
  const [commentInput, setCommentInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState('')
  useEffect(() => {
    setUser({ name: commentsData.nomeUsuario })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  async function saveComment(comment) {
    setIsSaving(true)
    try {
      await apiComments.post('/api/Comentario', {
        data: comment.data,
        texto: comment.texto,
        entidadeId: comment.entidadeId,
      })
      setIsSaving(false)
      getComments()
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível adicionar o comentário')
    }
  }

  return (
    <React.Fragment>
      <Form onSubmit={handleClick}>
        <Row type="flex">
          <Col>
            <Avatar className="mr-4" />
          </Col>
          <Col span={21}>
            <TextArea
              autoFocus
              autoSize={{ minRows: 3, maxRows: 5 }}
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
            />
            <br />
            <Button loading={isSaving} onClick={handleClick} htmlType="submit" type="primary">
              Adicionar comentário
            </Button>
          </Col>
        </Row>
      </Form>
    </React.Fragment>
  )
}

CommentsModalHeader.propTypes = {
  commentsData: PropTypes.array,
  entityId: PropTypes.string,
  getComments: PropTypes.func,
  setCommentsData: PropTypes.func,
}

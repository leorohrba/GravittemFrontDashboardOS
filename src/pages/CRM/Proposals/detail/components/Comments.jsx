import Button from '@components/Button'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Input, message } from 'antd'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'

const { TextArea } = Input

export default function Comments(props) {
  const { proposalId, onChange } = props
  const [comment, setComment] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const commentInput = useRef(null)

  async function saveComment() {
    if (commentInput.current) {
      commentInput.current.focus()
    }

    if (!comment) {
      message.error('Preencha o campo comentário antes de adicionar!')
      return
    }

    const historyBody = {
      proposalHistories: [
        {
          proposalHistoryId: 0,
          proposalId,
          type: 'Comment',
          title: 'Comentário adicionado',
          action: 'Include',
          oldValue: '',
          newValue: comment,
        },
      ],
    }

    setIsSaving(true)

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/proposalHistory`,
        data: historyBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (!data.isOk) {
        let messageError
        if (data.validationMessageList.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          messageError = data.validationMessageList[0]
        } else {
          messageError = data.message
        }
        message.error(
          <span>
            {messageError}
            <br />
            Atualização não realizada
          </span>,
        )
      } else {
        setComment('')
        onChange()
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  return (
    <div className="my-10">
      <TextArea
        rows={3}
        placeholder="Adicionar comentários"
        value={comment}
        onChange={e => setComment(e.target.value)}
        ref={commentInput}
      />
      <Button
        type="primary"
        loading={isSaving}
        className="mt-5"
        onClick={() => saveComment()}
      >
        Adicionar
      </Button>
    </div>
  )
}

Comments.propTypes = {
  proposalId: PropTypes.number,
  onChange: PropTypes.func,
}

import TextEditor from '@components/TextEditor'
import { Form } from '@ant-design/compatible'
import { Input } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import CommunicationInputRecipient from './CommunicationInputRecipient'

export default function CommunicationHeaderModalForm({
  handleSubmit,
  form,
  textContent,
  onEditorStateChange,
  recipientSource,
  setRecipientSource,
  editData,
  canBeUpdated,
  canBeSent,
}) {

  const { getFieldDecorator } = form
  
  return (
    <Form layout="vertical" onSubmit={handleSubmit} className="login-form">
      <CommunicationInputRecipient
        form={form}
        editData={editData}
        recipientSource={recipientSource}
        setRecipientSource={setRecipientSource}
        canBeUpdated={canBeSent}
      />  
      <Form.Item label="Título" style={{marginTop: '-2px'}}>
        {getFieldDecorator('title', 
              {
                  initialValue: editData ? editData?.title : null,
                  rules: [
                  {
                    required: true,
                    message: 'Campo obrigatório',
                  }],
              })(
          <Input placeholder="Digite o título do comunicado" readOnly={!canBeUpdated} />,
        )}
      </Form.Item>
      <TextEditor
        onEditorStateChange={onEditorStateChange}
        textContent={textContent}
      />
      <input type="submit" id="submit-form" className="hidden" />
    </Form>
  )
}

CommunicationHeaderModalForm.propTypes = {
  form: PropTypes.object,
  handleSubmit: PropTypes.func,
  onEditorStateChange: PropTypes.func,
  recipientSource: PropTypes.array,
  setRecipientSource: PropTypes.func,
  textContent: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  canBeUpdated: PropTypes.bool,
  canBeSent: PropTypes.bool,
  editData: PropTypes.any,
}

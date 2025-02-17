import TextEditor from '@components/TextEditor'
import { Form } from '@ant-design/compatible'
import { Input, Select, Row, Col, Button } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import MaterialsInputRecipient from './MaterialsInputRecipient'
import MaterialsAttachments from './MaterialsAttachments'

const { Option } = Select

export default function MaterialsHeaderModalForm({
  handleSubmit,
  form,
  textContent,
  onEditorStateChange,
  recipientSource,
  setRecipientSource,
  canBeUpdated,
  canBeSent,
  onChangeAttachments,
  loadingAttachments,
  attachments,
  libraryId,
  isSavingForAttachment,
  editData,
}) {

  const { getFieldDecorator } = form
  
  return (
    <Form layout="vertical" onSubmit={(e) => handleSubmit(e, true)} className="login-form">
      <MaterialsInputRecipient
        form={form}
        recipientSource={recipientSource}
        setRecipientSource={setRecipientSource}
        editData={editData}
        canBeUpdated={canBeSent}
      />  
      <Row type="flex" gutter={24}>
        <Col style={{width: '70%'}}>
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
              <Input placeholder="Digite o título do material" readOnly={!canBeUpdated} />,
            )}
          </Form.Item>
        </Col>
        <Col style={{width: '30%'}}>
          <Form.Item label="Tipo" style={{marginTop: '-2px'}}>
            {getFieldDecorator('type', 
                  {
                      initialValue: editData ? editData?.type : null,
                      rules: [
                      {
                        required: true,
                        message: 'Campo obrigatório',
                      }],
                  })(
                      <Select
                        showSearch
                        disabled={!canBeUpdated}
                        placeholder="Selecione o tipo de material"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option value="Marketing">Marketing</Option>
                        <Option value="Manual">Manual</Option>
                        <Option value="Institutional">Institucional</Option>
                      </Select>
            )}
          </Form.Item>
        </Col>
      </Row>   
      <TextEditor
        onEditorStateChange={onEditorStateChange}
        textContent={textContent}
      />
      {libraryId === 0 && canBeSent && (
        <Button
          type="secondary"
          htmlType="submit"
          className="mt-2"
          onClick={(e) => handleSubmit(e, false)}
          loading={isSavingForAttachment}
        >
          Salvar para inserir anexos
        </Button>
      )}       
      <MaterialsAttachments
        libraryId={libraryId}
        loading={loadingAttachments}
        onChange={onChangeAttachments}
        attachments={attachments}
        canBeUpdated={canBeUpdated}
      />  
      <input type="submit" id="submit-form" className="hidden" />
    </Form>
  )
}

MaterialsHeaderModalForm.propTypes = {
  form: PropTypes.object,
  handleSubmit: PropTypes.func,
  onEditorStateChange: PropTypes.func,
  recipientSource: PropTypes.array,
  setRecipientSource: PropTypes.func,
  editData: PropTypes.any,
  textContent: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  canBeUpdated: PropTypes.bool,
  canBeSent: PropTypes.bool,
  onChangeAttachments: PropTypes.func,
  loadingAttachments: PropTypes.bool,
  attachments: PropTypes.array,
  libraryId: PropTypes.number,
  isSavingForAttachment: PropTypes.bool,
}

import TextEditor from '@components/TextEditor'
import { Form } from '@ant-design/compatible'
import { Col, Input, Row, Select, Alert, Checkbox } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import htmlToDraft from 'html-to-draftjs'
import { formatMessage } from 'umi-plugin-react/locale'
import { ContentState, EditorState } from 'draft-js'
import ToolbarModelObjects from './ToolbarModelObjects'
import ToolbarModelHtml from './ToolbarModelHtml'

const { Option } = Select

export default function AddMessageModalForm({
  form,
  folders,
  textContent,
  onEditorStateChange,
  editData,
  alertMessages,
  visibleMessageModal,
  canBeUpdated,
  setTextContent,
  handleSubmit,
  modelObjects,
  ownerProfile,
}) {
  const { getFieldDecorator } = form
  const refAlert = React.useRef()
  
  useEffect(() => {
    if (visibleMessageModal) {
      form.resetFields()
      if (editData?.body) {
        const contentBlock = htmlToDraft(editData?.body)
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks,
          )
          const editorState = EditorState.createWithContent(contentState)
          setTextContent(editorState)
        }
        else {
          setTextContent(EditorState.createEmpty())
        }
      }
      else {
        setTextContent(EditorState.createEmpty())
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  }, [visibleMessageModal, editData])
  
  useEffect(() => {
    if (alertMessages.length > 0) {
      if (refAlert.current) {
        refAlert.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps      
  }, [alertMessages])    
  
  return (
    <Form layout="vertical" onSubmit={handleSubmit}>

      <div ref={refAlert}>
        {alertMessages.map((message, index) => (
          <Alert
            type="error"
            message={message}
            key={index}
            showIcon
            className="mb-2"
          />
        ))}
      </div>
    
      <Row type="flex" gutter={16}>
        <Col span={16}>
          <Form.Item label="Nome do modelo">
            {getFieldDecorator('name', {
              initialValue: editData?.name,
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'requiredFieldMessage',
                  }),
                },
              ],
            })(<Input autoFocus readOnly={!canBeUpdated} placeholder="Digite o nome do modelo" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Pasta do modelo">
            {getFieldDecorator('folder', {
              initialValue: editData?.messageModelFolderEmailId || undefined,
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'requiredFieldMessage',
                  }),
                },
              ],
            })(
              <Select
                showSearch
                size="default"
                disabled={!canBeUpdated}
                optionFilterProp="children"
                filterOption={(input, option) =>
                              {
                                 let checkFilter = -1;
                                 try {
                                  checkFilter = option.props.label
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase())
                                 }
                                 catch {checkFilter = -1}
                                 return checkFilter >= 0;
                              }
                             } 
              >
                {folders.map(f => (
                  <Option value={f.messageModelFolderEmailId}>{f.name}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16} align="middle">
        <Col span={16}>
          <Form.Item label="Assunto">
            {getFieldDecorator('subject', {
              initialValue: editData?.subject,
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'requiredFieldMessage',
                  }),
                },
              ],
            })(<Input readOnly={!canBeUpdated} placeholder="Assunto do e-mail" />)}
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label="Opções">
            {getFieldDecorator('addProposalPrint', {
              valuePropName: 'checked',
              initialValue: editData?.addProposalPrint || false,
            })(
              <Checkbox disabled={!canBeUpdated}>
                Incluir como anexo a impressão do negócio
              </Checkbox>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <TextEditor
        onEditorStateChange={onEditorStateChange}
        textContent={textContent}
        toolbarCustomButtons={[<ToolbarModelObjects modelObjects={modelObjects} />, <ToolbarModelHtml />]}
      />
    </Form>
  )
}

AddMessageModalForm.propTypes = {
  folders: PropTypes.array,
  form: PropTypes.any,
  onEditorStateChange: PropTypes.any,
  textContent: PropTypes.any,
  visibleMessageModal: PropTypes.bool,
  canBeUpdated: PropTypes.bool,
  setTextContent: PropTypes.func,
  handleSubmit: PropTypes.func,
  modelObjects: PropTypes.array,
  editData: PropTypes.any,
  alertMessages: PropTypes.array,
  ownerProfile: PropTypes.string,
}

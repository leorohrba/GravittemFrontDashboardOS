import { Form} from '@ant-design/compatible'
import { Input } from 'antd'
import PropTypes from 'prop-types'
import { hasPermission } from '@utils'
import React, { useEffect } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

export default function AddFolderModalForm({ form, editData, visibleFolderModal, userPermissions, handleSubmit }) {
  const { getFieldDecorator } = form
  
  useEffect(() =>  {
    if (visibleFolderModal) {
      form.resetFields()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  },[visibleFolderModal, editData])
  
  const canBeUpdated = hasPermission(userPermissions,'Alter')
  
  return (
    <Form layout="vertical" onSubmit={handleSubmit}>
      <Form.Item label="Título da pasta">
        {getFieldDecorator('name', {
          initialValue: editData ? editData.name : null,
          rules: [
            {
              required: true,
              message: formatMessage({
                id: 'requiredFieldMessage',
              }),
            },
          ],
        })(<Input autoFocus disabled={!canBeUpdated} placeholder="Digite o título da pasta" />)}
      </Form.Item>
    </Form>
  )
}

AddFolderModalForm.propTypes = {
  form: PropTypes.any,
  visibleFolderModal: PropTypes.bool,
  editData: PropTypes.any,
  userPermissions: PropTypes.array,
  handleSubmit: PropTypes.func,
}

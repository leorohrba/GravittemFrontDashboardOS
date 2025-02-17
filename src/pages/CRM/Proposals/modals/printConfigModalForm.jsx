import React from 'react'
// import { Form } from '@ant-design/compatible'
import { Form, Input, Skeleton, Spin } from 'antd'
import PropTypes from 'prop-types'

export default function PrintConfigModalForm({
  loadingData,
  form,
  handleSubmit,
}) {

  return (
    <Spin spinning={loadingData}>
      <Skeleton
        loading={loadingData}
        paragraph={{
          rows: 4,
        }}
        active
      >
        <Form form={form} onSubmit={handleSubmit} layout="vertical">
          <Form.Item
            label="Título"
            name="title"
            initialValue=""
            rules={[
              {
                required: true,
                message: 'Campo obrigatório',
              },
            ]}
          >
            <Input placeholder="Inserir título" />
          </Form.Item>
          <Form.Item label="Descrição" name="description" initialValue=''>
            <Input.TextArea autoSize />
          </Form.Item>
          <input type="submit" id="submit-form" className="hidden" />
        </Form>
      </Skeleton>
    </Spin>
  )
}

PrintConfigModalForm.propTypes = {
  handleSubmit: PropTypes.func,
  loadingData: PropTypes.bool,
}

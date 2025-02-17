import React from 'react'
import { Row, Col, Form, Select } from 'antd'
import { useProposalContext } from '../../Context/proposalContext'

const { Option } = Select

const EditProposalHeaderProposalType = ({
  form,
  editData,
  canBeUpdated,
  onChangeProposalType,
  rateLocation,
}) => {
  const {locationTimeEnum} = useProposalContext()

  return (
    <React.Fragment>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label="Tipo do negócio"
            name="proposalType"
            initialValue={editData?.proposalType ? editData.proposalType : 1}
            rules={[{ required: true, message: 'Campo obrigatório!' }]}
          >
            <Select
              showSearch
              onChange={onChangeProposalType}
              disabled={!canBeUpdated}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value={1}>Vendas</Option>
              <Option value={2}>Locação</Option>
            </Select>
          </Form.Item>
        </Col>

        {form.getFieldValue('proposalType') === 2 && (
          <Col span={8}>
            <Form.Item label=" " name="locationTime">
              <Select disabled={!canBeUpdated}>
                {locationTimeEnum.map(d => (
                  <Option value={d.value}> {d.descricao} </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        )}
      </Row>
    </React.Fragment>
  )
}
export default EditProposalHeaderProposalType

import { Col, Form, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import InputPersonRegion from './InputPersonRegion'

const { Option } = Select

const PersonRegionModalForm = React.forwardRef((props, ref) => {
  const {
    canBeUpdated,
    editData,
    onChangeType,
    setEditData,
    visible,
    loading,
    type,
  } = props

  useEffect(() => {
    if (visible && !loading && ref.current) {
      try { ref.current.focus() } catch {}
    }
  }, [loading, visible, ref])
  
  const handleChangeRegion = (index, region) => {
    editData[index].regionId = region?.regionId || null
    setEditData([...editData])
  }

  const handleChangeRegionSource = (index, source) => {
    editData[index].regionSource = source
    setEditData([...editData])
  }

  return (
    <Form layout="vertical">
      <Row className="w-full" type="flex">
        <Col className="w-full">
          <Form.Item label="Vincular região">  
            <Select
              showSearch
              autoFocus
              ref={ref}
              size="default"
              onChange={(value) => onChangeType(value)}
              value={type}
              disabled={!canBeUpdated}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value={1}>Única</Option>
              <Option value={2}>Por dia de semana</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {editData.map((d, index) => (
        <Row>
          <InputPersonRegion
            regionSource={d.regionSource}
            setRegionSource={(source) => handleChangeRegionSource(index, source)}
            canBeUpdated={canBeUpdated}
            value={d.regionId}
            label={d.label}
            onChange={(region) => handleChangeRegion(index, region)}
          />
        </Row>
      ))}
    </Form>
  )
})

PersonRegionModalForm.propTypes = {
  canBeUpdated: PropTypes.bool,
  editData: PropTypes.object,
  onChangeType: PropTypes.func,
  setEditData: PropTypes.func,
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  type: PropTypes.number,
}

export default PersonRegionModalForm

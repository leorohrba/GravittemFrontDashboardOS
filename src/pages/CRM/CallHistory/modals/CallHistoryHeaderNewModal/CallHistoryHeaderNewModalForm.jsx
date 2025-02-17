import {
  Alert,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Skeleton,
  TimePicker,
} from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import CallHistoryInputFranchisee from '../../components/CallHistoryInputFranchisee'
import CallHistoryInputRequester from '../../components/CallHistoryInputRequester'
import CallHistoryInputResponsible from '../../components/CallHistoryInputResponsible'

const { TextArea } = Input
const { Option } = Select
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const CallHistoryHeaderNewModalForm = React.forwardRef((props, ref) => {
  const {
    handleSubmit,
    form,
    callId,
    callTypes,
    callStatus,
    alertMessages,
    canBeUpdated,
    franchiseeSource,
    setFranchiseeSource,
    requesterSource,
    setRequesterSource,
    responsibleSource,
    setResponsibleSource,
    loading,
    ownerProfile,
    editData,
  } = props

  useEffect(() => {
    if (alertMessages && alertMessages.length > 0 && refAlert.current) {
      refAlert.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  },[alertMessages])
  
  const { getFieldDecorator } = form
  const refAlert = React.useRef()
  
  const handleChangeFranchisee = selectedValue => {
    setRequesterSource([])
    form.setFieldsValue({ requesterId: null })
  }
 
  return (
  <React.Fragment>  
    <Skeleton loading={loading} paragraph={{ rows: 11 }} active />
    <div style={{ display: loading ? 'none' : 'block' }}>
      <Form layout="vertical" onSubmit={e => handleSubmit(e, false)} className="login-form">
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
        <Row type="flex" gutter={12}>
          <Col style={{ width: '110px' }}>
            <Form.Item label="Número">
              <Input
                value={callId === 0 ? null : editData?.number || ''}
                readOnly
                disabled={!canBeUpdated}
              />
            </Form.Item>
          </Col>

          <Col style={{ width: '160px' }}>
            <Form.Item label="Data">
              {getFieldDecorator('callDate', {
                initialValue: editData?.callDate ? moment(editData.callDate) : moment(),
                rules: [
                  {
                    required: true,
                    message: 'Campo obrigatório',
                  },
                ],
              })(<DatePicker disabled={!canBeUpdated} format="DD/MM/YYYY" />)}
            </Form.Item>
          </Col>

          <Col style={{ width: '130px' }}>
            <Form.Item label="Hora">
              {getFieldDecorator('callTime', {
                initialValue: editData?.callDate ? moment(editData.callDate) : moment(),
                rules: [
                  {
                    required: true,
                    message: 'Campo obrigatório',
                  },
                ],
              })(
                <TimePicker
                  disabled={!canBeUpdated}
                  format="HH:mm"
                  className="w-full"
                />,
              )}
            </Form.Item>
          </Col>

          <Col style={{ width: '260px' }}>
            <Form.Item label="Tipo de chamado">
              {getFieldDecorator('callTypeId', {
                initialValue: editData ? editData.callTypeId : null,
                rules: [
                  {
                    required: true,
                    message: 'Campo obrigatório',
                  },
                ],
              })(
                <Select
                  showSearch
                  autoFocus
                  disabled={!canBeUpdated}
                  ref={ref}
                  placeholder="Selecionar"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {callTypes.map(d => (
                    <Option value={d.callTypeId} key={d.callTypeId}>
                      {d.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" gutter={36}>
          <Col style={{ width: '320px' }}>
            <CallHistoryInputFranchisee
              canBeUpdated={canBeUpdated && ownerProfile !== 'Franchise'}
              form={form}
              onChange={handleChangeFranchisee}
              setFranchiseeSource={setFranchiseeSource}
              franchiseeSource={franchiseeSource}
              editData={editData}
            />
          </Col>

          <Col style={{ width: '365px' }}>
            <CallHistoryInputRequester
              canBeUpdated={canBeUpdated}
              form={form}
              setRequesterSource={setRequesterSource}
              requesterSource={requesterSource}
              editData={editData}
            />
          </Col>
        </Row>

        <Row type="flex" gutter={36}>
          <Col style={{ width: '320px' }}>
            <CallHistoryInputResponsible
              canBeUpdated={canBeUpdated && ownerProfile !== 'Franchise'}
              setResponsibleSource={setResponsibleSource}
              responsibleSource={responsibleSource}
              form={form}
              editData={editData}
            />
          </Col>
          <Col style={{ width: '300px' }}>
            <Form.Item label="Status">
              {getFieldDecorator('status', {
                initialValue: editData ? editData?.actStatusId : null,
                rules: [
                  {
                    required: true,
                    message: 'Campo obrigatório',
                  },
                ],
              })(
                <Select
                  showSearch
                  placeholder="Selecionar"
                  disabled={!canBeUpdated || ownerProfile === 'Franchise'}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {callStatus.map(d => (
                    <Option value={d.statusId} key={d.statusId}>
                      {d.description}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Título">
          {getFieldDecorator('title', {
            initialValue: editData ? editData?.title : null,
            rules: [
              {
                required: true,
                message: 'Campo obrigatório',
              },
            ],
          })(<Input disabled={!canBeUpdated} />)}
        </Form.Item>
        <Form.Item label="Descrição">
          {getFieldDecorator('description', {
            initialValue: editData ? editData?.description : null,
            rules: [
              {
                required: true,
                message: 'Campo obrigatório',
              },
            ],
          })(<TextArea disabled={!canBeUpdated} autoSize={{ minRows: 3 }} />)}
        </Form.Item>
        <Row type="flex">
          <Col>
            <Form.Item label="Prioridade">
              {getFieldDecorator('priority', {
                initialValue: editData ? editData?.priority : null,
                rules: [
                  {
                    required: true,
                    message: 'Campo obrigatório',
                  },
                ],
              })(
                <RadioGroup disabled={!canBeUpdated}>
                  <RadioButton value="Low">Baixo</RadioButton>
                  <RadioButton value="Medium">Médio</RadioButton>
                  <RadioButton value="High">Alto</RadioButton>
                </RadioGroup>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <input type="submit" id="submit-form" className="hidden" />
      </Form>
    </div>
  </React.Fragment>  
  )
})

CallHistoryHeaderNewModalForm.propTypes = {
  form: PropTypes.object,
  handleSubmit: PropTypes.func,
  callId: PropTypes.number,
  callTypes: PropTypes.array,
  callStatus: PropTypes.array,
  alertMessages: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  franchiseeSource: PropTypes.array,
  setFranchiseeSource: PropTypes.func,
  requesterSource: PropTypes.array,
  setRequesterSource: PropTypes.func,
  responsibleSource: PropTypes.array,
  setResponsibleSource: PropTypes.func,
  loading: PropTypes.bool,
  ownerProfile: PropTypes.string,
  editData: PropTypes.any,
}

export default CallHistoryHeaderNewModalForm

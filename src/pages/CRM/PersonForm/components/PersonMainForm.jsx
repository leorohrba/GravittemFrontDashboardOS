/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-bind */
import { Form, Col, Input, Row, Select, Radio, message, Modal } from 'antd'
import { apiCRM } from '@services/api'
import { handleAuthError, validateByMask, removeMask } from '@utils'
import router from 'umi/router'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import PersonMainFisicaForm from './PersonMainFisicaForm'
import PersonMainJuridicaForm from './PersonMainJuridicaForm'
import PersonMainFranchiseeForm from './PersonMainFranchiseeForm'
import PersonMainContactForm from './PersonMainContactForm'
import PersonUserSupervisorForm from './PersonUserSupervisorForm'

const { TextArea } = Input
const { Option } = Select

const PersonMainForm = React.forwardRef((props, ref) => {
  const {
    form,
    canBeUpdated,
    personId,
    ownerProfile,
    editData,
    regionSource,
    setRegionSource,
    setPersonId,
    getPerson,
    qualificationSource,
    contactSourceSource,
    marketSegmentSource,
    businessAreaSource,
    setIsSeller
  } = props

  const [isSearchingPerson, setIsSearchingPerson] = useState(false)
  const [key, setKey] = useState(0) 

  async function searchPersonByDocument() {
    if (
      (form.getFieldValue('personType') === 1 &&
        (!validateByMask(form.getFieldValue('cpf')) ||
          form.getFieldValue('cpf') === null ||
          form.getFieldValue('cpf') === undefined ||
          form.getFieldValue('cpf') === '')) ||
      (form.getFieldValue('personType') === 2 &&
        !validateByMask(
          form.getFieldValue('cnpj') ||
            form.getFieldValue('cnpj') === null ||
            form.getFieldValue('cnpj') === undefined ||
            form.getFieldValue('cnpj') === '',
        ))
    ) {
      message.error(
        'Você deve informar o número do documento corretamente antes de fazer a busca!',
      )
      return
    }

    const params = {
      cpf:
        form.getFieldValue('personType') === 1
          ? removeMask(form.getFieldValue('cpf'))
          : null,
      cnpj:
        form.getFieldValue('personType') === 2
          ? removeMask(form.getFieldValue('cnpj'))
          : null,
      queryOperator: '=',
      getPersonDetails: false,
      getDeletedPerson: true,
    }

    setIsSearchingPerson(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `${process.env.UMI_API_HOST_CRM}/api/crm/person`,
        params,
      })

      const { data } = response

      setIsSearchingPerson(false)

      if (data.isOk) {
        if (data.person.length === 0) {
          message.error('Não foi encontrado pessoa pelo documento informado!')
        } else {
          const person = data.person[0]

          if (person.isDeleted) {
            Modal.confirm({
              content: 'Esta pessoa está excluida. Deseja reativa-la?',
              title: 'Atenção',
              okText: 'Sim',
              cancelText: 'Não',
              onOk: () => {
                const id = person.personId
                router.push(`/crm/PersonForm/${id}`)
                setPersonId(id)
                getPerson(id, true)
              },
            })
          } else {
            const id = person.personId
            router.push(`/crm/PersonForm/${id}`)
            setPersonId(id)
            getPerson(id, false)
          }
        }
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setIsSearchingPerson(false)

      handleAuthError(error)
    }
  }

  return (
    <Form form={form} layout="vertical">
      <Row type="flex" gutter={20}>
        <Col style={{ width: '400px' }}>
          <Form.Item
            label="Nome"
            name="name"
            initialValue={editData?.name || null}
            rules={[
              {
                required: true,
                message: 'Informe o nome da pessoa',
              },
            ]}
          >
            <Input
              placeholder="Digite o nome da pessoa"
              ref={ref}
              disabled={!canBeUpdated}
              autoFocus
            />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item
            label="Tipo de pessoa"
            name="personType"
            initialValue={editData?.personType || 1}
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              disabled={!canBeUpdated}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              onChange={() => setKey(key + 1)}
            >
              <Option value={1}>Física</Option>
              <Option value={2}>Jurídica</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col
          style={{
            width: '270px',
            display: form.getFieldValue('isCollaborator') ? 'none' : 'block',
          }}
        >
          <Form.Item
            label="Qualificação"
            name="qualificationId"
            initialValue={editData?.qualificationId || undefined}
          >
            <Select
              showSearch
              allowClear={canBeUpdated}
              disabled={!canBeUpdated}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {qualificationSource.map(d => (
                <Option value={d.id}>{d.descricao}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="Status"
            name="isActive"
            initialValue={editData ? editData.isActive : true}
            rules={[{ required: true, message: 'Informe o status da pessoa!' }]}
          >
            <Radio.Group buttonStyle="solid" disabled={!canBeUpdated}>
              <Radio.Button style={{ fontWeight: 'normal' }} value>
                Ativo
              </Radio.Button>
              <Radio.Button style={{ fontWeight: 'normal' }} value={false}>
                Inativo
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>

      <PersonMainFisicaForm
        switchKey={key}
        setSwitchKey={setKey}
        form={form}
        canBeUpdated={canBeUpdated}
        personId={personId}
        editData={editData}
        isSearchingPerson={isSearchingPerson}
        searchPersonByDocument={searchPersonByDocument}
        marketSegmentSource={marketSegmentSource}
        ownerProfile={ownerProfile}
        setIsSeller={setIsSeller}
      />

      <PersonMainJuridicaForm
        switchKey={key}
        setSwitchKey={setKey}
        form={form}
        canBeUpdated={canBeUpdated}
        personId={personId}
        ownerProfile={ownerProfile}
        isSearchingPerson={isSearchingPerson}
        searchPersonByDocument={searchPersonByDocument}
        editData={editData}
        marketSegmentSource={marketSegmentSource}
      />

      <PersonMainContactForm
        form={form}
        canBeUpdated={canBeUpdated}
        editData={editData}
        contactSourceSource={contactSourceSource}
        businessAreaSource={businessAreaSource}
      />
      {form.getFieldValue('isCollaborator') && (
        <PersonUserSupervisorForm
          form={form}
          canBeUpdated={canBeUpdated}
          editData={editData}
          contactSourceSource={contactSourceSource}
          businessAreaSource={businessAreaSource}
        />
      )}
      <PersonMainFranchiseeForm
        form={form}
        canBeUpdated={canBeUpdated}
        editData={editData}
        regionSource={regionSource}
        setRegionSource={setRegionSource}
      />

      <Row type="flex" gutter={20}>
        <Col style={{ width: '450px' }}>
          <Form.Item
            label="Observações"
            name="observation"
            initialValue={editData?.observation || null}
          >
            <TextArea
              rows={1}
              placeholder="Inserir observações"
              disabled={!canBeUpdated}
              autoSize={{
                minRows: 1,
                maxRows: 6,
              }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
})

PersonMainForm.propTypes = {
  form: PropTypes.any,
  canBeUpdated: PropTypes.bool,
  personId: PropTypes.number,
  editData: PropTypes.any,
  ownerProfile: PropTypes.string,
  regionSource: PropTypes.array,
  setRegionSource: PropTypes.func,
  setPersonId: PropTypes.number,
  getPerson: PropTypes.func,
  qualificationSource: PropTypes.array,
  contactSourceSource: PropTypes.array,
  marketSegmentSource: PropTypes.array,
  businessAreaSource: PropTypes.array,
}

export default PersonMainForm

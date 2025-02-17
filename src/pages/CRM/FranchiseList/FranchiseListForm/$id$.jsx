/**
 * breadcrumb: Nova lista
 * hide: true
 */
import { Form } from '@ant-design/compatible'
import Button from '@components/Button'
import { apiCRM } from '@services/api'
import { getPermissions, handleAuthError, hasPermission } from '@utils'
import { Alert, Input, message, Row, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import router from 'umi/router'
import FranchiseListFormTree from './components/FranchiseListFormTree'

function FranchiseListForm({ form, match }) {
  let franchiseListId = match.params.id || 0
  const [userPermissions, setUserPermissions] = useState([])
  const [franchiseData, setFranchiseData] = useState([])
  const [franchiseIds, setFranchiseIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [alertMessages, setAlertMessages] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    setPermissions()
    clearForm()
    getFranchiseData()
    if (franchiseListId > 0) {
      getFranchiseList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  function clearForm() {
    form.resetFields()
    setFranchiseIds([])
  }

  function goFranchiseList(e) {
    e.preventDefault()
    router.push(`/CRM/FranchiseList`)
  }

  async function getFranchiseList() {
    setLoading(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/franchiseList`,
        params: { franchiseListId },
      })

      setLoading(false)

      const { data } = response

      if (data.isOk) {
        if (data.franchiseList.length > 0) {
          form.setFieldsValue({ name: data.franchiseList[0].name })
          setFranchiseIds(data.franchiseList[0].franchiseIds)
        } else {
          message.error('Lista não encontrada!')
          router.push(`/CRM/FranchiseList`)
        }
      } else {
        message.error(data.message)
        router.push(`/CRM/FranchiseList`)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
      router.push(`/CRM/FranchiseList`)
    }
  }

  useEffect(() => {
    if (inputRef.current != null) {
      try {
        inputRef.current.focus()
      } catch (error) {
        console.log(error)
      }
    }
  }, [franchiseData, franchiseIds])

  async function getFranchiseData() {
    setLoadingData(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/person`,
        params: { isFranchisee: true, isActive: true },
      })

      setLoadingData(false)

      const { data } = response

      if (data.isOk) {
        const franchiseDataWork = []

        data.person.map(record =>
          franchiseDataWork.push({
            key: record.franchiseeId,
            name: record.shortName,
            city: record.cityName,
            state: record.stateName,
          }),
        )

        setFranchiseData(franchiseDataWork)
      } else {
        message.error(data.message)
        router.push(`/CRM/FranchiseList`)
      }
    } catch (error) {
      setLoadingData(false)
      handleAuthError(error)
      router.push(`/CRM/FranchiseList`)
    }
  }

  const { getFieldDecorator } = form

  const handleSubmit = (e, insertAnother = false) => {
    e.preventDefault()
    setAlertMessages([])
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        saveFranchiseList(insertAnother)
      }
    })
  }

  async function saveFranchiseList(insertAnother) {
    setIsSaving(true)

    const franchiseListBody = {
      franchiseList: {
        franchiseListId,
        name: form.getFieldValue('name'),
        franchiseIds: form.getFieldValue('franchiseIds'),
      },
    }

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/franchiseList`,
        data: franchiseListBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        if (insertAnother) {
          clearForm()
          franchiseListId = 0
          router.push(`/CRM/FranchiseList/FranchiseListForm`)

          if (inputRef.current != null) {
            inputRef.current.focus()
          }
        } else {
          router.push(`/CRM/FranchiseList`)
        }
      } else {
        if (inputRef.current != null) {
          inputRef.current.focus()
        }

        if (data.validationMessageList.length > 0) {
          setAlertMessages(data.validationMessageList)
        }

        message.error(data.message)
      }
    } catch (error) {
      setIsSaving(false)

      handleAuthError(error)
    }
  }

  return (
    <div className="container">
      <Row className="mb-4">
        <span
          className="mr-2"
          style={{ color: '#1976D2', cursor: 'pointer' }}
          onClick={e => goFranchiseList(e)}
          role="button"
        >
          Lista de franquias
        </span>
        <i className="fa fa-angle-right" />
        <span className="ml-2">
          {franchiseListId === 0
            ? 'Nova lista'
            : hasPermission(userPermissions, 'Alter')
            ? 'Editar lista'
            : 'Consultar lista'}
        </span>
      </Row>

      <Spin size="large" spinning={loading || loadingData}>
        <Form layout="vertical" onSubmit={handleSubmit}>
          {alertMessages.map((message, index) => (
            <Alert
              type="error"
              message={message}
              key={index}
              showIcon
              className="mb-2"
            />
          ))}

          <Form.Item label="Nome da lista" className="w-1/3">
            {getFieldDecorator('name', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: 'Campo obrigatório',
                },
              ],
            })(
              <Input
                autoFocus
                disabled={
                  !(
                    (hasPermission(userPermissions, 'Include') &&
                      franchiseListId === 0) ||
                    (hasPermission(userPermissions, 'Alter') &&
                      franchiseListId > 0)
                  )
                }
                placeholder="Digite um nome para a lista"
                ref={inputRef}
              />,
            )}
          </Form.Item>
          <FranchiseListFormTree
            form={form}
            franchiseData={franchiseData}
            initialFranchiseIds={franchiseIds}
            disabled={
              !(
                (hasPermission(userPermissions, 'Include') &&
                  franchiseListId === 0) ||
                (hasPermission(userPermissions, 'Alter') && franchiseListId > 0)
              )
            }
          />
          <Row type="flex">
            {((hasPermission(userPermissions, 'Include') &&
              franchiseListId === 0) ||
              (hasPermission(userPermissions, 'Alter') &&
                franchiseListId > 0)) && (
              <React.Fragment>
                <Button
                  type="primary"
                  className="formButton mr-3"
                  loading={isSaving}
                  onClick={e => handleSubmit(e, false)}
                >
                  Salvar
                </Button>
                <Button
                  type="primary"
                  loading={isSaving}
                  onClick={e => handleSubmit(e, true)}
                  className="formOutlineButton mr-3"
                >
                  Salvar e adicionar outro
                </Button>
              </React.Fragment>
            )}
            <Button
              type="secondary"
              onClick={() => router.push(`/CRM/FranchiseList`)}
            >
              Cancelar
            </Button>
          </Row>
          <input type="submit" id="submit-form" className="hidden" />
        </Form>
      </Spin>
    </div>
  )
}

FranchiseListForm.propTypes = {
  form: PropTypes.object,
  match: PropTypes.object,
}

const WrappedFranchiseListForm = Form.create({ name: 'Franchise-list-form' })(
  FranchiseListForm,
)
export default WrappedFranchiseListForm

import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { apiSearch } from '@services/api'
import { getLocaleDateFormat, handleAuthError } from '@utils/index'
import {
  Alert,
  Button,
  Checkbox,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Spin,
} from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

export function NewSimpleSearchDropdownModalForm({
  editSearchModalVisible,
  setEditSearchModalVisible,
  getFieldDecorator,
  formItems,
  add,
  editSearchData,
  form,
  searchOptions,
  tags,
  updateTags,
  loadingSavedSearchFields,
  screenName,
  setTags,
  deleteSavedSearch,
  loadingDeleteSearch,
  startSearch,
  customDefaultSearchId,
}) {
  const [formFeedbackMessage, setFormFeedbackMessage] = useState('')
  const [loadingSaveSearch, setLoadingSaveSearch] = useState(false)
  const [updateSearchKey, setUpdateSearchKey] = useState(0)
  const [fields, setFields] = useState([])

  useEffect(() => {
    // eslint-disable-next-line array-callback-return
    fields.map(field => {
      // eslint-disable-next-line guard-for-in
      for (const propName in field) {
        updateTags(propName, field[propName])
      }
      setFields(fields.filter(fi => fi !== field))
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields])

  useEffect(() => {
    if (fields.length === 0 && updateSearchKey > 0) {
      startSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSearchKey, fields])

  const handleSearch = e => {
    e.preventDefault()
    setFormFeedbackMessage('')
    form.validateFields((err, values) => {
      if (!err) {
        try {
          const fields = []
          Object.entries(values).forEach(([key, value]) => {
            const splittedString = key.split('_')
            if (splittedString.length > 1) {
              if (splittedString[0] === 'fieldName') {
                fields.push({
                  [value]: values[`searchBox_${splittedString[1]}`],
                })
              }
            }
          })
          setTags([])
          setFields(fields)
          setUpdateSearchKey(updateSearchKey => updateSearchKey + 1)
          setEditSearchModalVisible(false)

          message.success('Filtro realizado com sucesso')
        } catch (error) {
          message.error(
            'Não foi possível salvar a pesquisa, tente novamente mais tarde',
          )
        }
      }
    })
  }
  const handleSaveSearch = e => {
    e.preventDefault()
    setFormFeedbackMessage('')
    form.validateFields((err, values) => {
      if (!err) {
        try {
          const fields = []
          Object.entries(values).forEach(([key, value]) => {
            const splittedString = key.split('_')
            if (splittedString.length > 1) {
              if (splittedString[0] === 'fieldName') {
                const field = searchOptions.find(s => s.value === value)
                const fieldValue = values[`searchBox_${splittedString[1]}`]
                if (field.type === 'rangeDate') {
                  const dateStringValue = `${fieldValue[0].format(
                    getLocaleDateFormat(),
                  )}~${fieldValue[1].format(getLocaleDateFormat())}`
                  const dateStringKey = `${moment(
                    fieldValue[0],
                    'DD/MM/YYYY',
                  ).format('YYYY-MM-DD')}|${moment(fieldValue[1], 'DD/MM/YYYY')
                    .add(1, 'day')
                    .format('YYYY-MM-DD')}`
                  fields.push({
                    propriedade: value,
                    valor: dateStringValue.toString(),
                    tipo: 'rangeDate',
                    chave: dateStringKey.toString(),
                    descricao: field.label,
                  })
                } else if (field.type === 'select') {
                  const option =
                    field.options.find(s => s.value === fieldValue) ??
                    field.options.find(s => s.label === fieldValue)
                  fields.push({
                    propriedade: value,
                    valor: option.label.toString(),
                    tipo: 'select',
                    chave: option.value.toString(),
                    descricao: field.label,
                  })
                } else {
                  fields.push({
                    propriedade: value,
                    valor: fieldValue.toString(),
                    tipo: 'search',
                    chave: fieldValue.toString(),
                    descricao: field.label,
                  })
                }
              }
            }
          })
          saveSearchInServer(fields)
        } catch (error) {
          handleAuthError(error)
          message.error(
            'Não foi possível salvar a pesquisa, tente novamente mais tarde',
          )
        }
      }
    })
  }
  const saveSearchInServer = async fields => {
    setLoadingSaveSearch(true)
    const requestBodyInsert = {
      condicoes: fields,
      titulo: form.getFieldValue('modalTitle'),
      compartilhado: form.getFieldValue('allUsersCanSearch'),
    }
    const idObj = { id: editSearchData.id }
    const shouldUpdate = !editSearchData.id
    const requestBodyUpdate = { ...requestBodyInsert, ...idObj }
    try {
      const response = await apiSearch.post(
        `/api/Pesquisa/${screenName}`,
        shouldUpdate ? requestBodyInsert : requestBodyUpdate,
      )
      response.data.isOk && message.success('Pesquisa salva com sucesso')
      setEditSearchModalVisible(false)
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível salvar a pesquisa')
    }
    setLoadingSaveSearch(false)

    setEditSearchModalVisible(false)
  }

  return (
    <Modal
      maskClosable
      width="50%"
      bodyStyle={{
        minHeight: '300px',
        padding: 0,
      }}
      visible={editSearchModalVisible}
      onCancel={() => setEditSearchModalVisible(false)}
      footer={
        <Row type="flex">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={handleSearch}
          >
            Pesquisar
          </Button>
          <Button
            type="secondary"
            loading={loadingSaveSearch}
            className="mr-auto"
            onClick={handleSaveSearch}
          >
            Salvar
          </Button>
          <Popconfirm
            placement="top"
            onConfirm={() =>
              editSearchData.id
                ? deleteSavedSearch(editSearchData.id)
                : setEditSearchModalVisible(false)
            }
            onCancel={event => event.stopPropagation()}
            title={
              customDefaultSearchId === editSearchData.id ? (
                <div>
                  Não é possível excluir a pesquisa configurada como pesquisa
                  personalizada!
                  <br />
                  Por favor, remover a pesquisa da configuração de pesquisa
                  personalizada para prosseguir com a exclusão.
                </div>
              ) : (
                'Deseja mesmo excluir essa pesquisa salva？'
              )
            }
            okText="Excluir"
            cancelText="Cancelar"
            okButtonProps={
              customDefaultSearchId === editSearchData.id
                ? { disabled: true }
                : ''
            }
          >
            <Button
              type="outline"
              ghost
              style={{
                color: '#D32F2F',
                border: '1px solid #D32F2F',
              }}
              loading={loadingDeleteSearch}
              disabled={customDefaultSearchId === editSearchData.id}
            >
              Excluir
            </Button>
          </Popconfirm>
        </Row>
      }
    >
      <div
        className="ant-modal-title mt-3"
        id="rcDialogTitle6"
        style={{
          padding: '0 24px',
        }}
      >
        <Form layout="inline">
          <Form.Item label="Nome da pesquisa">
            {getFieldDecorator('modalTitle', {
              initialValue: editSearchData.titulo,
            })(
              <Input
                style={{
                  width: '28vw',
                  fontSize: '16px',
                }}
                className="mt-1"
              />,
            )}
          </Form.Item>
        </Form>
      </div>
      <hr />
      {formFeedbackMessage && (
        <Alert
          message={formFeedbackMessage}
          type="warning"
          className="mt-3"
          closable
        />
      )}

      <Form
        className="mt-5"
        style={{
          padding: '0 24px',
        }}
        // onSubmit={add}
      >
        <Spin spinning={loadingSavedSearchFields}>{formItems}</Spin>
        <Form.Item>
          {getFieldDecorator('allUsersCanSearch', {
            valuePropName: 'checked',
            initialValue: editSearchData.compartilhado,
          })(
            <Checkbox className="mt-3">
              Todos os usuários podem usar essa busca
            </Checkbox>,
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

NewSimpleSearchDropdownModalForm.propTypes = {
  add: PropTypes.func,
  deleteSavedSearch: PropTypes.func,
  editSearchData: PropTypes.object,
  editSearchModalVisible: PropTypes.bool,
  form: PropTypes.object,
  formItems: PropTypes.array,
  getFieldDecorator: PropTypes.func,
  loadingDeleteSearch: PropTypes.bool,
  loadingSavedSearchFields: PropTypes.bool,
  screenName: PropTypes.string,
  searchOptions: PropTypes.array,
  setEditSearchModalVisible: PropTypes.func,
  setTags: PropTypes.func,
  startSearch: PropTypes.func,
  tags: PropTypes.array,
  updateTags: PropTypes.func,
}

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { apiCRM } from '@services/api'
import {
  getPermissions,
  handleAuthError,
  hasPermission,
  removeNumberFormatting,
} from '@utils'
import {
  Form,
  Alert,
  Button,
  Col,
  Input,
  message,
  Radio,
  Row,
  Spin,
  Switch,
  Select as SelectAntd,
} from 'antd'
import NumberFormat from 'react-number-format'
import Select from 'react-select'
import MeasurementUnit from '../../components/MeasurementUnit'

const { TextArea } = Input
const { Option } = SelectAntd

const scrollToRef = ref => window.scrollTo(0, ref.current.offsetTop)

const customSelectStyles = {
  control: base => ({
    ...base,
    minHeight: 32,
    height: 32,
    lineHeight: 1.2,
  }),
  dropdownIndicator: base => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  clearIndicator: base => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  container: base => ({
    ...base,
    lineHeight: 1.0,
  }),
}

function ItemForm(props) {
  const homeRef = useRef(null)
  const executeScroll = () => scrollToRef(homeRef)
  const priceListItemNew = {
    priceListItem: { value: null, label: null },
    unitValue: null,
  }
  const { form, setScreen, editData, setEditData, reloadTableKey, setReloadTableKey } = props

  const [itemSource, setItemSource] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [gettingPermissions, setGettingPermissions] = useState(true)
  const [gettingItem, setGettingItem] = useState(true)
  const [alertMessages, setAlertMessages] = useState([])
  const itemNameInput = useRef(null)
  const [priceListOptions, setPriceListOptions] = useState([])
  const [loadingForm, setLoadingForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  // const [itemType, setItemType] = useState('')
  const [priceList, setPriceList] = useState([priceListItemNew])
  const [keyComponent, setKeyComponent] = useState(0)
  const [itemId, setItemId] = useState(editData?.itemId)
  const [typeButtonSave, setTypeButtonSave] = useState(1)
  const [canBeUpdated, setCanBeUpdated] = useState(true)
  const [materialTypes, setMaterialTypes] = useState([])
  const [key, setKey] = useState(0)

  if (itemId === undefined || itemId === null) {
    setItemId(0)
  }

  useEffect(() => {
    getMaterialTypes()
    setPermissions()
    getPriceList()
  }, [])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
    setGettingPermissions(false)
  }

  async function getMaterialTypes() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/materialtype`,
        params: { status: 1 },
      })
      const { data } = response
      if (data.isOk) {
        setMaterialTypes(data.materialTypes)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  useEffect(() => {
    if (
      editData?.materialTypeId &&
      !materialTypes.find(x => x.id === editData?.materialTypeId)
    ) {
      materialTypes.push({
        id: editData.materialTypeId,
        description: editData.materialTypeDescription,
        isProduct: editData.materialTypeIsProduct,
      })

      form.setFieldsValue({ materialTypeId: editData?.materialTypeId })
      setMaterialTypes([...materialTypes])
      setKey(key + 1)
    }

    if (editData?.unMedidaId) {
      const record = {
        label: `${editData.unMedida} - ${editData.descricaoMedida}`,
        value: editData?.unMedidaId,
      }
      form.setFieldsValue({ unMedidaId: editData?.unMedidaId })
      setItemSource([record])
    }

    if (editData?.priceList.length > 0) {
      const priceListItemWork = []
      editData.priceList.map(priceListItem => {
        priceListItemWork.push({
          priceListItem: {
            value: priceListItem.priceListId,
            label: priceListItem.priceListName,
          },
          unitValue: priceListItem.unitValue,
        })
      })
      setPriceList(priceListItemWork)
    }
  }, [editData, materialTypes])

  useEffect(() => {
    if (
      itemId === 0 &&
      !gettingPermissions &&
      !hasPermission(userPermissions, 'Include')
    ) {
      exitPage()
      message.error('Você não tem acesso para incluir itens!')
    }
  }, [userPermissions, gettingPermissions, itemId])

  useEffect(() => {
    if (
      itemId > 0 &&
      !gettingPermissions &&
      !gettingItem &&
      !hasPermission(userPermissions, 'Alter')
    ) {
      setCanBeUpdated(false)
    }
  }, [itemId, gettingPermissions, gettingItem, userPermissions])

  const handleSubmit = (e, addItem) => {
    e.preventDefault()

    if (!canBeUpdated) {
      return
    }

    form.validateFields().then(value => {
      if (priceListValidate()) {
        saveItem(addItem)
      }
    })
  }

  const handleCancel = e => {
    e.preventDefault()
    exitPage()
  }

  function priceListValidate() {
    setAlertMessages([])
    const messages = []

    priceList.map((priceItem, i) => {
      if (
        priceItem.priceListItem.value === null ||
        priceItem.priceListItem.value === undefined ||
        priceItem.priceListItem.value === 0
      ) {
        if (priceList.length === 1) {
          messages.push('Não foi informada a tabela de preços!')
        } else {
          messages.push(
            `Não foi informada a tabela de preços para o preço nº ${i + 1}`,
          )
        }
      }
      return true
    })

    setAlertMessages(messages)

    if (messages.length > 0) {
      executeScroll()
    }

    return messages.length === 0
  }

  function exitPage() {
    setScreen('Grid')
  }

  async function getPriceList() {
    setLoadingForm(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/pricelist`,
      })

      setLoadingForm(false)

      const { data } = response

      if (data.isOk) {
        if (data.priceList.length === 0) {
          message.error('Não existem lista de preços!')
        } else {
          const priceListOptionsWork = []

          data.priceList.map(priceListItem =>
            priceListOptionsWork.push({
              value: priceListItem.priceListId,
              label: priceListItem.name,
            }),
          )

          setPriceListOptions(priceListOptionsWork)
        }

        if (itemNameInput.current != null) {
          try {
            itemNameInput.current.focus()
          } catch (error) {
            console.log(error)
          }
        }
      } else {
        exitPage()
        message.error(data.message)
      }

      if (itemId > 0) {
        // getItem()
      }
    } catch (error) {
      exitPage()
      handleAuthError(error)
    }
  }

  function clearForm() {
    // setItemType('')
    setCanBeUpdated(true)
    if (editData == null) {
      form.resetFields()
    } else {
      setEditData(null)
    }
    setPriceList([priceListItemNew])
    setKeyComponent(keyComponent + 1)
  }

  async function saveItem(addItem) {
    setTypeButtonSave(addItem ? 2 : 1)
    setIsSaving(true)

    setAlertMessages([])

    const itemBody = {
      item: {
        type: form.getFieldValue('type'),
        itemId,
        code: form.getFieldValue('code'),
        name: form.getFieldValue('name'),
        isRecurrence: form.getFieldValue('isRecurrence'),
        note: form.getFieldValue('note'),
        materialTypeId: form.getFieldValue('materialTypeId'),
        isActive: form.getFieldValue('status') === 1,
        unMedidaId: form.getFieldValue('unMedidaId'),
        priceList: [],
        canDecimal: form.getFieldValue('canDecimal'),
      },
    }

    priceList.map(priceListItem => {
      let { unitValue } = priceListItem
      unitValue = removeNumberFormatting(unitValue)
      if (unitValue === null || unitValue === undefined || unitValue === '') {
        unitValue = 0
      }
      itemBody.item.priceList.push({
        priceListId: priceListItem.priceListItem.value,
        unitValue,
      })
      return true
    })
    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/item`,
        data: itemBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)
      setReloadTableKey(reloadTableKey+1)
      const { data } = response

      if (data.isOk) {
        if (addItem) {
          if (itemId > 0) {
            setScreen('Grid')
          }

          setItemId(0)
          clearForm()
          if (itemNameInput.current != null) {
            itemNameInput.current.focus()
          }
        } else {
          exitPage()
        }
      } else {
        if (data.validationMessageList.length > 0) {
          setAlertMessages(data.validationMessageList)
          executeScroll()
        }

        if (itemNameInput.current != null) {
          itemNameInput.current.focus()
        }

        message.error(data.message)
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  function addPriceListItem() {
    setPriceList(array => array.concat(priceListItemNew))
  }

  function removePriceListItem(index) {
    const priceListCopy = priceList.slice(0)

    priceListCopy.splice(index, 1)

    setPriceList(priceListCopy)

    if (priceListCopy.length === 0) {
      addPriceListItem()
    }
  }

  const changePriceItem = (e, index) => {
    e.preventDefault()
    const priceListCopy = priceList.slice(0)
    priceListCopy[index].unitValue = e.target.value
    setPriceList(priceListCopy)
  }

  const changePriceList = (optionSelected, index) => {
    const priceListCopy = priceList.slice(0)
    priceListCopy[index].priceListItem = optionSelected
    setPriceList(priceListCopy)
  }

  const checkItemType = (rule, value, callback) => {
    if ( editData?.itemId && value !== editData?.type ) {
      callback('Tipo não pode ser alterado!')
    }
    callback()
  }

  return (
    <div className="container" ref={homeRef}>
      <Row className="mb-10">
        <span
          style={{ color: '#1976D2', cursor: 'pointer' }}
          onClick={e => handleCancel(e)}
          role="button"
        >
          Produtos e Serviços
        </span>
        &nbsp;&nbsp;&nbsp;
        <i className="fa fa-angle-right fa-lg mt-1" />
        &nbsp;&nbsp;&nbsp;
        {loadingForm
          ? 'Carregando...'
          : itemId === 0
          ? 'Criar novo produto ou serviço'
          : canBeUpdated
          ? 'Alterar produto ou serviço'
          : 'Consulta produto ou serviço'}
      </Row>

      <h2>
        {loadingForm
          ? 'Carregando...'
          : itemId === 0
          ? 'Novo produto ou serviço'
          : canBeUpdated
          ? 'Alteração de produto ou serviço'
          : 'Consulta produto ou serviço'}
      </h2>
      <hr />

      <div
        className="w-full text-center pt-10"
        style={{ display: loadingForm ? 'block' : 'none' }}
      >
        <Spin size="large" />
      </div>

      <div style={{ display: loadingForm ? 'none' : 'block' }}>
        {alertMessages.map((message, index) => (
          <Alert
            type="error"
            message={message}
            key={index}
            showIcon
            className="mb-2"
          />
        ))}

        <Form
          layout="vertical"
          form={form}
          onSubmit={e => handleSubmit(e, false)}
        >
          <Row type="flex" gutter={20}>
            <Col style={{ width: '195px' }}>
              <Form.Item
                label="Tipo"
                name="type"
                initialValue={editData?.type || undefined}
                rules={[
                  { required: true, message: 'Escolha o tipo do item!' },
                  { validator: checkItemType },
                ]}
                onChange={() => setKey(key + 1)}
              >
                <Radio.Group
                  onChange={() => form.setFieldsValue({ materialTypeId: null })}
                  buttonStyle="outline"
                  disabled={!canBeUpdated}
                >
                  <Radio.Button
                    style={{ fontWeight: 'normal' }}
                    value="Product"
                  >
                    Produto
                  </Radio.Button>
                  <Radio.Button
                    style={{ fontWeight: 'normal' }}
                    value="Service"
                  >
                    Serviço
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label="Código"
                name="code"
                initialValue={editData?.code}
              >
                <Input placeholder="Digite o código" disabled={!canBeUpdated} />
              </Form.Item>
            </Col>

            <Col style={{ width: '500px' }}>
              <Form.Item
                label="Nome do produto ou serviço"
                name="name"
                initialValue={editData?.name}
                rules={[
                  {
                    required: true,
                    message: 'Informe o nome do produto ou serviço',
                  },
                ]}
              >
                <Input
                  placeholder="Digite o nome do produto ou serviço"
                  ref={itemNameInput}
                  disabled={!canBeUpdated}
                  autoFocus
                />
              </Form.Item>
            </Col>
          </Row>

          <Row type="flex" gutter={20}>
            <Col span={8}>
              <Form.Item
                label="Categoria"
                name="materialTypeId"
                rules={[
                  {
                    required: true,
                    message: 'Campo obrigatório',
                  },
                ]}
                // initialValue={editData?.materialTypeId}
              >
                <SelectAntd
                  showSearch
                  className="w-full"
                  size="default"
                  placeholder="Escolha uma categoria"
                  allowClear
                  disabled={!canBeUpdated}
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    let checkFilter = -1
                    try {
                      checkFilter = option.props.search
                        .toLowerCase()
                        .indexOf(input.toLowerCase())
                    } catch {
                      checkFilter = -1
                    }
                    return checkFilter >= 0
                  }}
                >
                  {materialTypes &&
                    materialTypes
                      .filter(
                        x =>
                          x.isProduct ===
                          (form.getFieldValue('type') === 'Product'),
                      )
                      .map(record => (
                        <Option search={record.description} value={record.id}>
                          {record.description}
                        </Option>
                      ))}
                </SelectAntd>
              </Form.Item>
            </Col>
            <Col span={4}>
              <MeasurementUnit
                {...{
                  form,
                  itemSource,
                  setItemSource,
                  editData,
                  canBeUpdated,
                }}
              />
            </Col>

            <Col span={4}>
              <Form.Item
                label="Status"
                name="status"
                initialValue={editData ? (editData?.isActive ? 1 : 2) : 1}
                rules={[
                  {
                    required: true,
                    message: 'Campo obrigatório',
                  },
                ]}
              >
                <SelectAntd
                  placeholder="Escolha um status"
                  disabled={!canBeUpdated}
                  className="w-full"
                >
                  <Option value={1}>
                    <i
                      className="mr-2 fa fa-circle"
                      style={{ color: '#4caf50' }}
                    />{' '}
                    Ativo
                  </Option>
                  <Option value={2}>
                    {' '}
                    <i
                      className="mr-2 fa fa-circle"
                      style={{ color: 'red' }}
                    />{' '}
                    Inativo
                  </Option>
                </SelectAntd>
              </Form.Item>
            </Col>
          </Row>

          {priceList.map((priceListItem, index) => (
            <Row key={index} align="middle" type="flex" gutter={20}>
              <Col lg={6} xs={24}>
                <Form.Item label="Lista de preços" key={index}>
                  <Select
                    key={index}
                    placeholder="Selecione uma lista de preço"
                    options={priceListOptions}
                    value={priceList[index].priceListItem}
                    onChange={optionSelected =>
                      changePriceList(optionSelected, index)
                    }
                    isDisabled={!canBeUpdated}
                    styles={customSelectStyles}
                  />
                </Form.Item>
              </Col>

              <Col lg={4} xs={24}>
                <Form.Item label="Preço" key={index}>
                  <NumberFormat
                    className="ant-input"
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    thousandSeparator="."
                    decimalSeparator=","
                    value={priceList[index].unitValue}
                    onChange={e => changePriceItem(e, index)}
                    disabled={!canBeUpdated}
                    prefix="R$ "
                    key={keyComponent * 100 + index}
                  />
                </Form.Item>
              </Col>

              <Col
                style={{
                  display:
                    index === priceList.length - 1 && canBeUpdated
                      ? 'block'
                      : 'none',
                  paddingTop: '12px',
                }}
              >
                <span
                  key={index}
                  style={{ color: '#1976D2', cursor: 'pointer' }}
                  onClick={e => addPriceListItem()}
                  role="button"
                >
                  Adicionar novo preço
                </span>
              </Col>

              <Col
                style={{
                  display: canBeUpdated ? 'block' : 'none',
                  paddingTop: '12px',
                }}
              >
                <span
                  key={index}
                  style={{ color: '#1976D2', cursor: 'pointer' }}
                  onClick={e => removePriceListItem(index)}
                  role="button"
                >
                  Remover preço
                </span>
              </Col>
            </Row>
          ))}

          <Row type="flex" align="middle">
            <Col style={{ width: '150px' }}>
              <Form.Item
                label="Recorrência"
                name="isRecurrence"
                initialValue={editData ? editData.isRecurrence : false}
                valuePropName="checked"
              >
                <Switch disabled={!canBeUpdated} />
              </Form.Item>
            </Col>
            <Col style={{ width: '300px' }}>
              <Form.Item
                label="Permite quantidade fracionada"
                name="canDecimal"
                initialValue={editData ? editData.canDecimal : false}
                valuePropName="checked"
              >
                <Switch disabled={!canBeUpdated} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col style={{ width: '400px' }}>
              <Form.Item
                label="Observações"
                name="note"
                initialValue={editData?.note}
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

          <Row type="flex" gutter={12}>
            {canBeUpdated && (
              <Col>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="formButton"
                    onClick={e => handleSubmit(e, false)}
                    loading={isSaving && typeButtonSave === 1}
                    disabled={isSaving && typeButtonSave !== 1}
                  >
                    Salvar
                  </Button>
                </Form.Item>
              </Col>
            )}
            {canBeUpdated &&
              ((hasPermission(userPermissions, 'Alter') && itemId > 0) ||
                (hasPermission(userPermissions, 'Include') &&
                  itemId === 0)) && (
                <Col style={{ display: itemId === 0 ? 'block' : 'none' }}>
                  <Form.Item>
                    <Button
                      type="primary"
                      className="formButton"
                      onClick={e => handleSubmit(e, true)}
                      loading={isSaving && typeButtonSave === 2}
                      disabled={isSaving && typeButtonSave !== 2}
                    >
                      Salvar e adicionar outro
                    </Button>
                  </Form.Item>
                </Col>
              )}
            <Col>
              <Form.Item>
                <Button type="outline" onClick={e => handleCancel(e)}>
                  {canBeUpdated ? 'Cancelar' : 'Retornar'}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  )
}

export default ItemForm

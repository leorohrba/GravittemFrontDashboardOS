/* eslint-disable react-hooks/exhaustive-deps */
import Button from '@components/Button'
import { apiCRM } from '@services/api'
import {
  addBrlCurrencyToNumber,
  getLocalePrefix,
  handleAuthError,
  hasPermission,
  removeNumberFormatting,
  formatNumber,
} from '@utils'
import {
  Form,
  Alert,
  Col,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Skeleton,
  Spin,
  Switch,
  Select,
} from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import NumberFormat from 'react-number-format'
import ProductAndServicesInputItem from './ProductAndServicesInputItem'
import ProductAndServicesInputPriceList from './ProductAndServicesInputPriceList'
import CategoriesInputItem from './CategoriesInputItem'
import {
  notificationWarning,
  validDiscount,
  notificationError,
} from '../../../Utils/index'
import { getService } from '../../../service'
import { useDetailProposalContext } from '../../context/DetailProposalContext'

const { TextArea } = Input
const Decimal = require('decimal.js')

const ProductsAndServicesModalForm = props => {
  const {
    toogleModalVisible,
    addOtherProposalItem,
    refreshData,
    isModalVisible,
    proposalId,
    proposalItemId,
    singleTotalAmount,
    recurringValue,
    userPermissions,
    profitPercent,
    proposalCanBeUpdate,
    proposals,
    createHistory,
    onChange,
  } = props
  const { formatPercent, parsePercent } = useDetailProposalContext()

  const [canDecimal, setCanDecimal] = useState(false)
  const [unit, setUnit] = useState()
  const [canBeUpdated, setCanBeUpdated] = useState(true)
  const [alertMessages, setAlertMessages] = useState([])
  const [loadingForm, setLoadingForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [itemSource, setItemSource] = useState([])
  const [materialType, setMaterialType] = useState([])
  const [Owner, setOwner] = useState([])

  const itemInput = useRef(null)
  const [priceListSource, setPriceListSource] = useState([])
  const [loadingPriceList, setLoadingPriceList] = useState(false)
  const [totalItem, setTotalItem] = useState(0)
  const [singleTotalAmountSimulated, setSingleTotalAmountSimulated] = useState(
    singleTotalAmount,
  )
  const [recurringValueSimulated, setRecurringValueSimulated] = useState(
    recurringValue,
  )
  const [originalTotalItem, setOriginalTotalItem] = useState(0)
  const [
    originalTotalItemIsRecurrence,
    setOriginalTotalItemIsRecurrence,
  ] = useState(false)

  const [editData, setEditData] = useState(null)
  const [percentDiscount, setPercentDiscount] = useState(
    editData?.percentDiscount,
  )
  const [discountValue, setDiscountValue] = useState(editData?.discountValue)
  const [percentProfitForm, setPercentProfitForm] = useState(
    editData?.profitPercentItem,
  )
  const [profitValue, setProfitValue] = useState(editData?.profitValueItem)
  const [key, setKey] = useState(0)
  const [form] = Form.useForm()
  useEffect(() => {
    form.resetFields()
    if (editData) {
      setDiscountValue(editData?.discountValue)
      setPercentDiscount(editData?.percentDiscount)
      setPercentProfitForm(editData?.profitPercentItem)
      setProfitValue(editData?.profitValueItem)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])

  useEffect(() => {
    if (!loadingForm && itemInput.current) {
      try {
        itemInput.current.focus()
        // eslint-disable-next-line no-console
      } catch (error) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingForm])

  useEffect(() => {
    if (isModalVisible) {
      clearForm()

      if (proposalItemId > 0) {
        getProposalItem()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalVisible])

  function clearForm() {
    setCanBeUpdated(
      proposalCanBeUpdate && hasPermission(userPermissions, 'Include'),
    )
    setAlertMessages([])
    setTotalItem(0)
    setSingleTotalAmountSimulated(singleTotalAmount)
    setRecurringValueSimulated(recurringValue)
    setOriginalTotalItem(0)
    setOriginalTotalItemIsRecurrence(false)

    setItemSource([])
    setPriceListSource([])
    if (editData === null) {
      form.resetFields()
    } else {
      setEditData(null)
    }

    calculateTotal(null, null, null, false, null)
  }

  async function getProposalItem() {
    setLoadingForm(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/ItemsByProposalId`,
        params: { proposalItemId },
      })

      // setLoadingForm(false) // esse comando é dado no getPriceList

      const { data } = response

      if (data.isOk) {
        if (data.proposalItem.length === 0) {
          message.error(
            'Item do negócio não existe ou você não tem acesso a ele!',
          )
          toogleModalVisible()
        } else {
          const proposalItem = data.proposalItem[0]

          setOriginalTotalItem(proposalItem.totalValue)
          setOriginalTotalItemIsRecurrence(proposalItem.isRecurrence)
          setItemSource([
            {
              label: proposalItem.itemName,
              value: proposalItem.itemId,
              defaultPriceListId: proposalItem.priceListId,
              defaultUnitValue: null,
              unitValue: proposalItem.unitValue,
              type: proposalItem.type,
              isRecurrence: proposalItem.isRecurrence,
              note: proposalItem.note,
            },
          ])

          const priceListWork = {
            label: proposalItem.priceListName,
            value: proposalItem.priceListId,
            unitValue: null,
          }

          setPriceListSource(proposalItem.priceListId ? [priceListWork] : [])

          getPriceList(
            proposalItem.itemId,
            proposalItem.priceListId ? priceListWork : null,
          )

          setEditData(proposalItem)

          setCanBeUpdated(
            proposalCanBeUpdate &&
              proposalItem.canBeUpdated &&
              hasPermission(userPermissions, 'Alter'),
          )
        }
      } else {
        message.error(data.message)
        toogleModalVisible()
      }
    } catch (error) {
      handleAuthError(error)
      toogleModalVisible()
    }
  }

  const checkAndNotify = async (value, message, listPrice, jsonPercent) => {
    if (!value || value === 0) return false

    if (Owner?.sellerId === null) {
      notificationWarning(
        'Vendedor sem vínculo do usuário. Ajustar cadastro de pessoa!',
      )
      return true
    }

    const [isValidDiscount, discountList] = await validDiscount(
      value,
      Owner,
      listPrice,
      jsonPercent,
    )

    if (discountList.length === 0) {
      notificationError(
        'Não possui alçada de desconto e acréscimo definidos. Entrar em contato com responsável.',
      )
      return true
    }

    if (isValidDiscount) {
      notificationWarning(message)
      return true
    }

    return false
  }

  const handleSubmit = async (e, addOther) => {
    e.preventDefault()

    setAlertMessages([])

    if (!canBeUpdated) {
      message.error('Você não pode atualizar o produto ou serviço do negócio!')
      return
    }

    await form.validateFields().then(async values => {
      const listPrice = form.getFieldValue('priceListId')
      if (
        await checkAndNotify(
          percentDiscount,
          'Porcentagem de desconto informada maior do que o máximo permitido!',
          listPrice,
          'percentualDsctoMaximo',
        )
      ) {
        return
      }

      if (
        await checkAndNotify(
          percentProfitForm,
          'Porcentagem de margem informada maior do que o máximo permitido!',
          listPrice,
          'percentualAcrescimoMaximo',
        )
      ) {
        return
      }

      saveProposalItem(addOther)
    })
  }

  useEffect(() => {
    getService('/api/CRM/Owner', setOwner)
  }, [])

  useEffect(() => {
    calculateTotal(
      removeNumberFormatting(form.getFieldValue('quantity')) || 0,
      removeNumberFormatting(form.getFieldValue('unitValue')) || 0,
      percentDiscount || 0,
      form.getFieldValue('isRecurrence'),
      form.getFieldValue('type'),
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    form.getFieldValue('quantity'),
    form.getFieldValue('unitValue'),
    percentDiscount,
    form.getFieldValue('isRecurrence'),
    form.getFieldValue('type'),
    originalTotalItem,
    originalTotalItemIsRecurrence,
    singleTotalAmount,
    recurringValue,
    percentProfitForm,
  ])

  const calculateTotal = (
    quantity,
    unitValue,
    percentDiscount,
    isRecurrence,
    type,
  ) => {
    const profitPercentWork = percentProfitForm || 0
    let totalItemWork =
      quantity *
      unitValue *
      (1 - percentDiscount / 100) *
      (1 + (profitPercentWork || 0) / 100)
    totalItemWork = parseFloat(totalItemWork.toFixed(2))
    setTotalItem(totalItemWork)

    let singleValueWork = singleTotalAmount
    let recurringValueWork = recurringValue

    if (!originalTotalItemIsRecurrence) {
      singleValueWork -= originalTotalItem
    } else {
      recurringValueWork -= originalTotalItem
    }

    if (!isRecurrence) {
      singleValueWork += totalItemWork
    } else {
      recurringValueWork += totalItemWork
    }

    // alert(originalTotalItem + '/' + totalItemWork + '/' + recurringValueWork)

    setSingleTotalAmountSimulated(singleValueWork)
    setRecurringValueSimulated(recurringValueWork)
  }

  const createProposalHistory = (proposalId, title, oldValue, newValue) => ({
    proposalHistoryId: 0,
    proposalId,
    type: 'Proposal',
    title,
    action: 'Alter',
    oldValue: oldValue ? `${oldValue.toFixed(2)}%` : '00,00%',
    newValue: newValue ? `${newValue.toFixed(2)}%` : '00,00%',
  })
  const profitOrDiscountChanged = txt => {
    return `${txt}${
      editData?.priceListName ? ` - ${editData.priceListName}` : ''
    } alterado`
  }

  // Criação dos objetos usando a função auxiliar
  const dateHistoryBody = {
    proposalHistories: [
      createProposalHistory(
        proposalId,
        profitOrDiscountChanged('Valor do desconto'),

        editData?.percentDiscount,
        percentDiscount,
      ),
    ],
  }

  const dateHistoryBodyMargem = {
    proposalHistories: [
      createProposalHistory(
        proposalId,
        profitOrDiscountChanged('Percentual de lucro'),
        editData?.profitPercentItem,
        percentProfitForm,
      ),
    ],
  }

  async function saveProposalItem(addOther) {
    let unitValue = removeNumberFormatting(form.getFieldValue('unitValue'))
    let quantity = removeNumberFormatting(form.getFieldValue('quantity'))
    quantity = quantity || 0
    unitValue = unitValue || 0

    const proposalItemBody = {
      proposalItem: [
        {
          proposalId,
          proposalItemId,
          type: form.getFieldValue('type'),
          itemId: form.getFieldValue('itemId'),
          priceListId: form.getFieldValue('priceListId'),
          unitValue,
          quantity,
          percentDiscount: percentDiscount || 0,
          isRecurrence: form.getFieldValue('isRecurrence'),
          note: form.getFieldValue('note'),
          measuringUnitId: 1,
          ProfitValueItem: percentProfitForm || 0,
        },
      ],
    }

    setIsSaving(true)

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/proposalItem`,
        data: proposalItemBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        const promises = []

        if (editData?.percentDiscount !== percentDiscount) {
          promises.push(createHistory(dateHistoryBody, onChange))
        }

        if (editData?.profitPercentItem !== percentProfitForm) {
          promises.push(createHistory(dateHistoryBodyMargem, onChange))
        }

        // Aguarda que todas as promessas sejam concluídas antes de chamar refreshData
        await Promise.all(promises)
        await refreshData()

        if (addOther) {
          addOtherProposalItem()

          clearForm()
          if (itemInput.current) {
            itemInput.current.focus()
          }
        } else {
          toogleModalVisible()
        }
      } else {
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

  const changeItem = selectedValue => {
    setPriceListSource([])
    form.setFieldsValue({
      priceListId: null,
      materialTypeDescription: selectedValue?.materialTypeDescription,
    })

    if (selectedValue) {
      const priceListId = selectedValue.defaultPriceListId
      form.setFieldsValue({
        isRecurrence: selectedValue.isRecurrence,
        type: selectedValue.type,
        unitValue: selectedValue.unitValue,
        note: selectedValue.note,
      })
      setUnit(selectedValue.unMedida)

      getPriceList(selectedValue.value, null, priceListId)
    }
  }

  async function getPriceList(itemId, existingPriceList, priceListId) {
    setLoadingPriceList(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/item`,
        params: { itemId, getPriceList: true },
      })

      setLoadingForm(false)

      const { data } = response

      if (data.isOk) {
        const priceListWork = []
        let recordExists = false
        if (data.item.length > 0) {
          setCanDecimal(data.item[0].canDecimal)
          data.item[0].priceList.map(record => {
            if (
              existingPriceList &&
              existingPriceList.value === record.priceListId
            ) {
              recordExists = true
            }
            priceListWork.push({
              label: record.priceListName,
              value: record.priceListId,
              unitValue: record.unitValue,
            })
            return true
          })
        }
        if (!recordExists && existingPriceList) {
          priceListWork.push(existingPriceList)
        }

        setPriceListSource(priceListWork)
        setLoadingPriceList(false)

        if (priceListId) {
          const priceListItem = priceListWork.find(x => x.value === priceListId)
          if (priceListItem) {
            form.setFieldsValue({ priceListId })
            handleUnitValueByPriceList(priceListId, priceListWork)
          }
        }
      } else {
        setLoadingPriceList(false)
        message.error(data.message)
      }
    } catch (error) {
      setLoadingForm(false)
      setLoadingPriceList(false)
      handleAuthError(error)
    }
  }

  const handleUnitValueByPriceList = (value, source) => {
    const priceListItem = source.find(x => x.value === value)
    if (priceListItem) {
      form.setFieldsValue({ unitValue: priceListItem?.unitValue || null })
    }
  }

  const quantityValidate = (rule, value, callback) => {
    if (value || value === 0) {
      const number = removeNumberFormatting(value)
      if (!number || number === 0 || isNaN(value)) {
        callback('Quantidade inválida!')
      } else if (number - Math.floor(number) > 0 && !canDecimal) {
        callback('Quantidade deve ser inteira!')
      } else {
        callback()
      }
    } else {
      callback()
    }
  }

  const setFocusItem = e => {
    e.preventDefault()
    if (itemInput.current) {
      itemInput.current.focus()
    }
  }

  const calculatePercent = value => {
    const unitValue = form.getFieldValue('unitValue')
    const calculateDecimal = decimalValue => {
      return decimalValue != null ? new Decimal(decimalValue) : new Decimal(0)
    }
    const decimalUnitValue = calculateDecimal(unitValue)
    const decimalValue = calculateDecimal(value)

    const result =
      value != null
        ? decimalValue.div(100).mul(decimalUnitValue)
        : new Decimal(0)

    return result
  }

  return (
    <Modal
      onCancel={toogleModalVisible}
      onOk={e => handleSubmit(e, false)}
      centered
      destroyOnClose
      title={
        <Row align="middle" type="flex">
          <Col>
            {loadingForm
              ? 'Carregando...'
              : !canBeUpdated
              ? 'Consultar produto ou serviço'
              : proposalItemId > 0
              ? 'Editar produto ou serviço'
              : 'Novo produto ou serviço'}
          </Col>
          <Col style={{ display: loadingForm || isSaving ? 'block' : 'none' }}>
            <div style={{ marginLeft: '10px', marginTop: '5px' }}>
              <Spin size="small" />
            </div>
          </Col>
        </Row>
      }
      visible={isModalVisible}
      width="770px"
      footer={
        <Row type="flex">
          {canBeUpdated && !loadingForm && (
            <React.Fragment>
              <Button
                type="primary"
                className="formButton"
                loading={isSaving}
                onClick={e => handleSubmit(e, false)}
              >
                Salvar
              </Button>
              <Button
                type="primary"
                loading={isSaving}
                onClick={e => handleSubmit(e, true)}
                className="formOutlineButton"
              >
                Salvar e adicionar outro
              </Button>
            </React.Fragment>
          )}
          <Button
            type="secondary"
            style={{ marginLeft: 'auto' }}
            onClick={toogleModalVisible}
          >
            Cancelar
          </Button>
        </Row>
      }
    >
      <Skeleton loading={loadingForm} paragraph={{ rows: 11 }} active />

      <div style={{ display: loadingForm ? 'none' : 'block' }}>
        <Form
          layout="vertical"
          form={form}
          onSubmit={e => handleSubmit(e, false)}
        >
          {alertMessages.map((message, index) => (
            <Alert
              type="error"
              message={message}
              key={index}
              showIcon
              className="mb-2"
            />
          ))}

          <Row type="flex" gutter={24}>
            <Col span={8}>
              <Form.Item
                label="Tipo"
                name="type"
                initialValue={editData ? editData?.type : null}
                rules={[{ required: true, message: 'Campo obrigatório!' }]}
              >
                <Radio.Group onChange={setFocusItem} disabled={!canBeUpdated}>
                  <Radio.Button value="Product">Produto</Radio.Button>
                  <Radio.Button value="Service">Serviço</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={16}>
              <CategoriesInputItem
                form={form}
                editData={editData}
                canBeUpdated={canBeUpdated}
                setMaterialType={setMaterialType}
                setItemSource={setItemSource}
                autoFocus
                ref={itemInput}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <ProductAndServicesInputItem
                form={form}
                editData={editData}
                canBeUpdated={canBeUpdated}
                materialType={materialType}
                itemSource={itemSource}
                setItemSource={setItemSource}
                onChange={changeItem}
                autoFocus
                ref={itemInput}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={16}>
              <ProductAndServicesInputPriceList
                form={form}
                editData={editData}
                canBeUpdated={canBeUpdated}
                priceListSource={priceListSource}
                loading={loadingPriceList}
                handleUnitValueByPriceList={handleUnitValueByPriceList}
                rules={proposals?.franchiseeId}
              />
            </Col>
            <Col span={8}>
              <Form.Item
                label="Preço"
                name="unitValue"
                initialValue={editData ? editData?.unitValue : null}
                // className="w-full ml-5"
              >
                <NumberFormat
                  id="input-account-plan-value"
                  className="ant-input"
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  thousandSeparator="."
                  decimalSeparator=","
                  disabled={true}
                  prefix={getLocalePrefix()}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" gutter={24}>
            <Col span={7}>
              <Form.Item
                label="Quantidade"
                name="quantity"
                initialValue={editData ? editData?.quantity : 1}
                rules={[
                  { required: true, message: 'Campo obrigatório!' },
                  { validator: quantityValidate },
                ]}
              >
                <InputNumber
                  className="w-full"
                  min={1}
                  disabled={!canBeUpdated}
                  decimalSeparator=","
                />
              </Form.Item>
            </Col>
            <Col className="mt-8" span={2}>
              {unit ?? editData?.unMedida}
            </Col>
            <Col span={7}>
              <Form.Item
                label="% de Desconto"
                name="percentDiscount"
                initialValue={editData ? editData?.percentDiscount : null}
                className="w-full"
              >
                <Spin spinning={isSaving}>
                  <InputNumber
                    className="w-full"
                    id="input-account-plan-value"
                    precision={2}
                    fixedDecimalScale
                    allowNegative={false}
                    decimalSeparator=","
                    formatter={formatPercent}
                    parser={parsePercent}
                    disabled={!canBeUpdated}
                    value={percentDiscount}
                    onChange={value => {
                      const result = calculatePercent(value)
                      setPercentDiscount(value)
                      setDiscountValue(result)
                    }}
                  />
                </Spin>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Valor do desconto"
                name="discountValue"
                initialValue={editData ? editData?.discountValue : null}
              >
                <Spin spinning={isSaving}>
                  <InputNumber
                    id="input-account-plan-value"
                    className="w-full"
                    precision={2}
                    fixedDecimalScale
                    allowNegative={false}
                    decimalSeparator=","
                    parser={removeNumberFormatting}
                    disabled={!canBeUpdated}
                    value={discountValue}
                    onChange={value => {
                      setDiscountValue(value)
                      setPercentDiscount(
                        (value / (form.getFieldValue('unitValue') ?? 0)) * 100,
                      )
                    }}
                    formatter={value => {
                      if (value) {
                        const [integer, decimal] = value.toString().split('.')
                        return `R$ ${integer.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          '.',
                        )}${decimal ? ',' + decimal : ''}`
                      }
                      return ''
                    }}
                  />
                </Spin>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={9}>
              <Form.Item
                label="Recorrência"
                name="isRecurrence"
                initialValue={
                  editData &&
                  editData?.isRecurrence !== null &&
                  editData?.isRecurrence !== undefined
                    ? editData?.isRecurrence
                    : false
                }
                valuePropName="checked"
              >
                <Switch
                  disabled={!canBeUpdated}
                  defaultChecked={
                    editData &&
                    editData?.isRecurrence !== null &&
                    editData?.isRecurrence !== undefined
                      ? editData?.isRecurrence
                      : false
                  }
                  onChange={e => {
                    form.setFieldsValue({ isRecurrence: e })
                    setKey(key + 1)
                  }}
                />
                <span className="ml-2">
                  {form.getFieldValue('isRecurrence')
                    ? 'Este é um valor recorrente'
                    : 'Este é um valor único'}
                </span>
              </Form.Item>
            </Col>

            <Col span={7}>
              <Form.Item
                label="% de margem"
                name="percentProfit"
                className="w-full"
              >
                <Spin spinning={isSaving}>
                  <InputNumber
                    className="w-full"
                    id="input-account-plan-value"
                    precision={2}
                    fixedDecimalScale
                    allowNegative={false}
                    decimalSeparator=","
                    formatter={formatPercent}
                    parser={parsePercent}
                    disabled={!canBeUpdated}
                    value={percentProfitForm}
                    onChange={value => {
                      const result = calculatePercent(value)
                      setPercentProfitForm(value)
                      setProfitValue(result)
                    }}
                  />
                </Spin>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Valor da margem" name="profitValue">
                <Spin spinning={isSaving}>
                  <InputNumber
                    id="input-account-plan-value"
                    className="w-full"
                    precision={2}
                    fixedDecimalScale
                    allowNegative={false}
                    decimalSeparator=","
                    parser={removeNumberFormatting}
                    disabled={!canBeUpdated}
                    value={profitValue}
                    onChange={value => {
                      setProfitValue(value)
                      setPercentProfitForm(
                        (value / (form.getFieldValue('unitValue') ?? 0)) * 100,
                      )
                    }}
                    formatter={value => {
                      if (value) {
                        const [integer, decimal] = value.toString().split('.')
                        return `R$ ${integer.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          '.',
                        )}${decimal ? ',' + decimal : ''}`
                      }
                      return ''
                    }}
                  />
                </Spin>
              </Form.Item>
            </Col>
          </Row>
          <Row className="mb-2" type="flex" gutter={24}>
            <Col span={8}>
              <div className="mb-1">
                Total item
                <div className="w-full" style={{ backgroundColor: 'red' }}>
                  {percentProfitForm > 0 && (
                    <span className="ml-2" style={{ color: 'gray' }}>
                      {`(${formatNumber(percentProfitForm)}% de lucro)`}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <Alert
                  message={
                    loadingForm || loadingPriceList ? (
                      <Spin size="small" />
                    ) : (
                      <b>{addBrlCurrencyToNumber(totalItem)}</b>
                    )
                  }
                />
              </div>
            </Col>
            <Col span={8}>
              <div className="mb-1">Total de recorrência</div>
              <div>
                <Alert
                  message={
                    loadingForm || loadingPriceList ? (
                      <Spin size="small" />
                    ) : (
                      <b>{addBrlCurrencyToNumber(recurringValueSimulated)}</b>
                    )
                  }
                />
              </div>
            </Col>
            <Col span={8}>
              <div className="mb-1">Total único</div>
              <div>
                <Alert
                  message={
                    loadingForm || loadingPriceList ? (
                      <Spin size="small" />
                    ) : (
                      <b>
                        {addBrlCurrencyToNumber(singleTotalAmountSimulated)}
                      </b>
                    )
                  }
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                label="Observação"
                name="note"
                initialValue={editData ? editData?.note : null}
              >
                <TextArea
                  rows={1}
                  disabled={!canBeUpdated}
                  placeholder="Incluir observação"
                  autoSize={{
                    minRows: 1,
                    maxRows: 6,
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  )
}

ProductsAndServicesModalForm.propTypes = {
  isModalVisible: PropTypes.bool,
  toogleModalVisible: PropTypes.func,
  refreshData: PropTypes.func,
  proposalId: PropTypes.number,
  proposalItemId: PropTypes.number,
  recurringValue: PropTypes.number,
  singleTotalAmount: PropTypes.number,
  addOtherProposalItem: PropTypes.func,
  userPermissions: PropTypes.object,
  profitPercent: PropTypes.number,
}

export default ProductsAndServicesModalForm

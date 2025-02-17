/* eslint-disable react/jsx-no-bind */
import { handleAuthError, hasPermission, removeNumberFormatting } from '@utils'
import { Modal, message } from 'antd'

import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import { apiCRM } from '@services/api'
import ProductsAndServicesHeader from './ProductsAndServicesHeader'
import ProductsAndServicesModalForm from './ProductsAndServicesModalForm'
import ProductsAndServicesTable from './ProductsAndServicesTable'
import {
  notificationWarning,
  validDiscount,
  notificationError,
} from '../../../Utils/index'
import { getService } from '../../../service'
import ProductsAndServicesTotalizer from './ProductsAndServicesTotalizer'
import { updatePriceProposalItems } from '../../../service'

export default function ProductsAndServices(props) {
  const {
    number,
    owner,
    proposalId,
    proposalCanBeUpdate,
    userPermissions,
    onChange,
    proposalType,
    currentProfitPercent,
    setCurrentProfitPercent,
    currentDiscountPercent,
    setCurrentDiscountPercent,
    currentDiscountValue,
    setCurrentDiscountValue,
    onChangeProposal,
    proposal,
    totalValue,
    createHistory,
  } = props

  const [tableSelectedRowKeys, setTableSelectedRowKeys] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [productsAndServicesData, setProductsAndServicesData] = useState([])
  const [recurringValue, setRecurringValue] = useState(0)
  const [singleTotalAmount, setSingleTotalAmount] = useState(0)
  const [profitSingleValue, setProfitSingleValue] = useState(0)
  const [profitRecurringValue, setProfitRecurringValue] = useState(0)
  const [locationValue, setLocationValue] = useState(0)
  const [proposalItemId, setProposalItemId] = useState(0)
  const [keyModal, setKeyModal] = useState(0)
  const [profitPercent, setProfitPercent] = useState(null)
  const [discountPercent, setDiscountPercent] = useState(null)
  const [discountValue, setDiscountValue] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [dataExport, setDataExport] = useState([])
  const [Owner, setOwner] = useState([])
  const [priceListValue, setPriceListValue] = useState(null)

  useEffect(() => {
    const source = [
      {
        columns: [
          'Produto ou serviço',
          'Identificador',
          'Tipo',
          'Quantidade',
          '% Desconto',
          'Valor de desconto',
          'Valor unitário',
          'Valor total',
          'Lucro',
          'Recorrência',
          'Comentário',
        ],
        data: [],
      },
    ]

    productsAndServicesData
      .filter(x => tableSelectedRowKeys.includes(x.proposalItemId))
      .map(d => {
        source[0].data.push([
          d.itemName,
          d.identifier,
          d.type === 'Product' ? 'Produto' : 'Serviço',
          d.quantity,
          d.percentDiscount || null,
          d.discountValue || null,
          d.unitValue,
          d.totalValue,
          d.profitValue,
          d.isRecurrence === true ? 'Recorrente' : 'Único',
          d.note,
        ])
        return true
      })
    setDataExport(source)
  }, [productsAndServicesData, tableSelectedRowKeys])

  useEffect(() => {
    getProposalItems()
    getService('/api/CRM/Owner', setOwner)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setDiscountValue(currentDiscountValue)
  }, [currentDiscountValue])

  const rowSelection = {
    selectedRowKeys: tableSelectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setTableSelectedRowKeys(selectedRowKeys)
    },
  }

  const toogleModalVisible = () => {
    setIsModalVisible(false)
  }

  const addOtherProposalItem = () => {
    setProposalItemId(0)
  }

  const editItem = id => {
    setProposalItemId(id)
    setKeyModal(keyModal + 1)
    setIsModalVisible(true)
  }

  const refreshData = () => {
    onChange()
    getProposalItems()
  }

  useEffect(() => {
    calculateTotal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsAndServicesData])

  const calculateTotal = () => {
    let recurringValueWork = 0
    let singleTotalAmountWork = 0
    let locationValueWork = 0
    let profitSingleValueWork = 0
    let profitRecurringValueWork = 0
    productsAndServicesData.map(record => {
      if (record.isRecurrence) {
        recurringValueWork += record.totalValue
        profitRecurringValueWork += record.profitValue
      } else {
        singleTotalAmountWork += record.totalValue
        profitSingleValueWork += record.profitValue
      }
      locationValueWork += record.locationValue

      return true
    })

    setRecurringValue(recurringValueWork)
    setSingleTotalAmount(singleTotalAmountWork)
    setLocationValue(parseFloat(locationValueWork.toFixed(2)))
    setProfitSingleValue(parseFloat(profitSingleValueWork.toFixed(2)))
    setProfitRecurringValue(parseFloat(profitRecurringValueWork.toFixed(2)))
  }

  function confirmDeleteProposalItems() {
    Modal.confirm({
      content:
        tableSelectedRowKeys.length === 1
          ? 'Você tem certeza que deseja excluir o item selecionado?'
          : 'Você tem certeza que deseja excluir os itens selecionados?',
      title: 'Atenção',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteProposalItems()
      },
    })
  }

  function confirmUpdatePriceItems() {
    Modal.confirm({
      content:
        tableSelectedRowKeys.length === 1
          ? 'Você tem certeza que deseja atualizar o preço do item selecionado?'
          : 'Você tem certeza que deseja atualizar o preço dos itens selecionados?',
      title: 'Atenção',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        updatePriceProposalItems(
          proposalId,
          tableSelectedRowKeys,
          refreshData,
          setLoading,
          createHistory,
          onChange,
        )
      },
    })
  }

  async function deleteProposalItems() {
    setLoading(true)
    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/crm/proposalItem`,
        data: { proposalId, proposalItemId: tableSelectedRowKeys },
      })
      setLoading(false)

      const { data } = response

      if (!data.isOk) {
        message.error(data.message)
      }

      refreshData()
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getProposalItems() {
    setLoading(true)
    setTableSelectedRowKeys([])
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/ItemsByProposalId`,
        params: { proposalId },
      })

      setLoading(false)

      const { data } = response
      if (data.isOk) {
        setProductsAndServicesData(data.proposalItem)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  async function updateProposalProfit() {
    if (priceListValue?.priceListId == null) {
      notificationWarning('Por favor, selecione uma lista de preços!')
      return
    }
    if (Owner?.sellerId === null) {
      notificationWarning(
        'Vendedor sem vínculo do usuário. Ajustar cadastro de pessoa!',
      )
      return
    }
    const returnValidDiscount = await validDiscount(
      profitPercent,
      Owner,
      priceListValue?.priceListId,
      'percentualAcrescimoMaximo',
    )

    if (returnValidDiscount[1].length === 0) {
      notificationError(
        'Não possui alçada de desconto e acréscimo definidos. Entrar em contato com responsável.',
      )
      return
    }
    if (returnValidDiscount[0]) {
      notificationWarning(
        'Porcentagem de margem informada é maior do que o máximo permitido',
      )
      return
    }

    setIsSaving(true)

    let value = removeNumberFormatting(profitPercent)
    value = value === '' || value === null ? null : parseFloat(value)
    try {
      const response = await apiCRM({
        method: 'PUT',
        url: `/api/crm/proposalUpdateProfitPercent`,
        data: {
          proposalId,
          profitPercent: value ?? 0,
          priceListId: priceListValue?.priceListId,
          priceListName: `Percentual de lucro  ${
            priceListValue?.name ? ` - ${priceListValue?.name} ` : ''
          }alterado`,
        },
      })

      const { data } = response
      setIsSaving(false)
      if (!data.isOk) {
        message.error(data.message)
      } else {
        setCurrentProfitPercent(value)
        onChangeProposal(proposalId)
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  async function updateProposalDiscountPercent() {
    if (priceListValue?.priceListId == null) {
      notificationWarning('Por favor, selecione uma lista de preços!')
      return
    }
    if (Owner?.sellerId === null) {
      notificationWarning(
        'Vendedor sem vínculo do usuário. Ajustar cadastro de pessoa!',
      )
      return
    }
    const returnValidDiscount = await validDiscount(
      discountPercent,
      Owner,
      priceListValue?.priceListId,
      'percentualDsctoMaximo',
    )
    if (returnValidDiscount[1].length === 0) {
      notificationError(
        'Não possui alçada de desconto e acréscimo definidos. Entrar em contato com responsável.',
      )
      return
    }
    if (returnValidDiscount[0]) {
      notificationWarning(
        'Porcentagem de desconto informada maior do que o máximo permitido!',
      )
      return
    }

    setIsSaving(true)

    let value = removeNumberFormatting(discountPercent)
    value = value === '' || value === null ? null : parseFloat(value)

    const dateHistoryBody = {
      proposalHistories: [
        {
          proposalHistoryId: 0,
          proposalId,
          type: 'Proposal',
          title: `Valor do desconto ${
            priceListValue?.name ? ` - ${priceListValue?.name} ` : ''
          }alterado`,
          action: 'Alter',
          oldValue: currentDiscountPercent
            ? `${currentDiscountPercent.toFixed(2)}%`
            : '00,00%',
          newValue: value ? `${value.toFixed(2)}%` : '00,00%',
        },
      ],
    }

    await createHistory(dateHistoryBody)

    try {
      const response = await apiCRM({
        method: 'PUT',
        url: `/api/crm/proposalUpdateDiscountPercent`,
        data: {
          proposalId,
          percentDiscount: value ?? 0,
          priceListId: priceListValue?.priceListId,
        },
      })

      const { data } = response
      setIsSaving(false)
      if (!data.isOk) {
        message.error(data.message)
      } else {
        setCurrentDiscountPercent(value)
        onChangeProposal(proposalId)
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  async function updateProposalDiscountValue() {
    setIsSaving(true)

    let value = removeNumberFormatting(discountValue)
    value = value === '' || value === null ? null : parseFloat(value)

    try {
      const response = await apiCRM({
        method: 'PUT',
        url: `/api/crm/proposalUpdateDiscountValue`,
        data: { proposalId, discountValue: value ?? 0 },
      })

      const { data } = response
      setIsSaving(false)
      if (!data.isOk) {
        message.error(data.message)
      } else {
        setCurrentDiscountValue(value)
        onChangeProposal(proposalId)
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  return (
    <div>
      <ProductsAndServicesHeader
        isSaving={isSaving}
        currentDiscountPercent={currentDiscountPercent}
        setDiscountPercent={setDiscountPercent}
        discountPercent={discountPercent}
        currentDiscountValue={currentDiscountValue}
        setDiscountValue={setDiscountValue}
        discountValue={discountValue}
        currentProfitPercent={currentProfitPercent}
        profitPercent={profitPercent}
        setProfitPercent={setProfitPercent}
        onApplyProfitPercent={updateProposalProfit}
        onApplyDiscountPercent={updateProposalDiscountPercent}
        onApplyDiscountValue={updateProposalDiscountValue}
        tableSelectedRowKeys={tableSelectedRowKeys}
        dataExport={dataExport}
        confirmDeleteProposalItems={confirmDeleteProposalItems}
        confirmUpdatePriceItems={confirmUpdatePriceItems}
        loading={loading}
        userPermissions={userPermissions}
        canInclude={
          hasPermission(userPermissions, 'Include') &&
          proposalCanBeUpdate &&
          proposal.actStatusCode !== 'WON'
        }
        editItem={editItem}
        number={number}
        setPriceListValue={setPriceListValue}
        proposalId={proposalId}
      />

      <ProductsAndServicesTable
        rowSelection={proposalCanBeUpdate ? rowSelection : undefined}
        productsAndServicesData={productsAndServicesData}
        loading={loading}
        owner={owner}
        userPermissions={userPermissions}
        canAlter={
          hasPermission(userPermissions, 'Alter') &&
          proposalCanBeUpdate &&
          proposal.actStatusCode !== 'WON'
        }
        editItem={editItem}
        profitPercent={currentProfitPercent}
      />

      <ProductsAndServicesTotalizer
        dataSource={totalValue}
        proposalType={proposalType}
        profitPercent={profitPercent}
        owner={owner}
      ></ProductsAndServicesTotalizer>

      <ProductsAndServicesModalForm
        isModalVisible={isModalVisible}
        proposalId={proposalId}
        proposalCanBeUpdate={
          proposalCanBeUpdate && proposal.actStatusCode !== 'WON'
        }
        proposalItemId={proposalItemId}
        toogleModalVisible={toogleModalVisible}
        refreshData={refreshData}
        recurringValue={recurringValue}
        singleTotalAmount={singleTotalAmount}
        addOtherProposalItem={addOtherProposalItem}
        key={keyModal}
        userPermissions={userPermissions}
        profitPercent={currentProfitPercent}
        setProfitPercent={setCurrentProfitPercent}
        proposals={proposal}
        createHistory={createHistory}
        onChange={onChange}
      />
    </div>
  )
}

ProductsAndServices.propTypes = {
  proposalId: PropTypes.number,
  proposalCanBeUpdate: PropTypes.bool,
  userPermissions: PropTypes.array,
  onChange: PropTypes.func,
  proposalType: PropTypes.number,
  currentProfitPercent: PropTypes.number,
  onChangeProposal: PropTypes.func,
  setCurrentProfitPercent: PropTypes.func,
  setCurrentDiscountPercent: PropTypes.func,
  setCurrentDiscountValue: PropTypes.func,
  owner: PropTypes.any,
  number: PropTypes.number,
}

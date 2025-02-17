import React from 'react'
import { Modal, Button } from 'antd'
import SetDiscountAllowanceModalForm from './SetDiscountAllowanceModalForm'
import { handleUpdate } from '../utils'
import { useDiscountAllowanceContext } from '../context/DiscountAllowanceContext'

export default function SetDiscountAllowanceModal() {
  const {
    visibleSetDiscountAllowanceModal,
    setVisibleSetDiscountAllowanceModal,
    priceList,
    formSetDiscountModal,
    ownerId,
    selectedRow,
    setSelectedRow,
  } = useDiscountAllowanceContext()

  const clickUpdate = () => {
    handleUpdate(
      formSetDiscountModal,
      ownerId,
      setVisibleSetDiscountAllowanceModal,
      selectedRow,
    ),
      setSelectedRow([])
  }

  const clickCancel = () => {
    formSetDiscountModal.resetFields()
    setVisibleSetDiscountAllowanceModal(false)
    setSelectedRow([])
  }

  const modalFooter = (
    <div>
      <Button onClick={() => clickCancel()}>Cancelar</Button>
      <Button
        onClick={() => clickUpdate()}
        style={{ backgroundColor: '#4CAF50', color: 'white' }}
      >
        Atualizar
      </Button>
    </div>
  )

  return (
    <Modal
      title="Definir alçada de desconto e acréscimo"
      width="25rem"
      open={visibleSetDiscountAllowanceModal}
      onCancel={() => clickCancel()}
      destroyOnClose
      footer={modalFooter}
    >
      <SetDiscountAllowanceModalForm
        form={formSetDiscountModal}
        priceList={priceList}
        ownerId={ownerId}
      />
    </Modal>
  )
}

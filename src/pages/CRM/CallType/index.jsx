/**
 * breadcrumb: Cadastro de tipo de chamado
 */

import { apiCRM } from '@services/api'
import { getPermissions, handleAuthError } from '@utils'
import { message, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import CallTypeHeader from './components/CallTypeHeader'
import CallTypeTable from './components/CallTypeTable'
import CallTypeHeaderModalForm from './modals/CallTypeHeaderModalForm'

export default function CallType() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [callTypeId, setCallTypeId] = useState(0)
  const [callTypes, setCallTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [keyForm, setKeyForm] = useState(0)
  const [keyTable, setKeyTable] = useState(0)

  let callTypePerformed = []

  useEffect(() => {
    setPermissions()
    getCallTypes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  async function getCallTypes() {
    setLoading(true)
    setSelectedRowKeys([])
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/callType`,
      })

      const { data } = response

      if (data.isOk) {
        setCallTypes(data.callType)
        setKeyTable(keyTable + 1)
        setLoading(false)
      } else {
        setKeyTable(keyTable + 1)
        message.error(data.message)
      }
    } catch (error) {
      setKeyTable(keyTable + 1)
      handleAuthError(error)
    }
  }

  function confirmDeleteCallTypes() {
    Modal.confirm({
      content:
        selectedRowKeys.length === 1
          ? 'Você tem certeza que deseja excluir o tipo de chamado selecionado?'
          : 'Você tem certeza que deseja excluir os tipos de chamados selecionados?',
      title: 'Atenção',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteCallTypes()
      },
    })
  }

  function addCallTypePerformed(id) {
    callTypePerformed.push(id)

    if (callTypePerformed.length >= selectedRowKeys.length) {
      callTypePerformed = []
      getCallTypes()
    }
  }

  function deleteCallTypes() {
    setLoading(true)
    callTypePerformed = []

    for (let i = 0; i < selectedRowKeys.length; i++) {
      deleteCallType(selectedRowKeys[i])
    }
  }

  async function deleteCallType(id) {
    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/crm/callType`,
        params: { callTypeId: id },
      })

      const { data } = response

      if (!data.isOk) {
        message.error(data.message)
      }

      addCallTypePerformed(id)
    } catch (error) {
      handleAuthError(error)
      addCallTypePerformed(id)
    }
  }

  const toogleModalVisible = () => {
    setModalVisible(false)
  }

  const editCallType = id => {
    setCallTypeId(id)
    setKeyForm(keyForm + 1)
    setModalVisible(true)
  }

  const addOtherCallType = () => {
    setCallTypeId(0)
    setModalVisible(true)
  }

  const refreshGrid = () => {
    getCallTypes()
  }

  return (
    <div className="w-full container">
      <CallTypeHeader
        {...{
          selectedRowKeys,
          userPermissions,
          editCallType,
          confirmDeleteCallTypes,
        }}
      />
      <CallTypeTable
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        userPermissions={userPermissions}
        callTypes={callTypes}
        loading={loading}
        editCallType={editCallType}
        keyTable={keyTable}
      />
      <CallTypeHeaderModalForm
        modalVisible={modalVisible}
        toogleModalVisible={toogleModalVisible}
        addOtherCallType={addOtherCallType}
        refreshGrid={refreshGrid}
        callTypeId={callTypeId}
        key={keyForm}
      />
    </div>
  )
}

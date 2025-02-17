/**
 * breadcrumb: Lista de franquias
 */
import { apiCRM } from '@services/api'
import { getPermissions, handleAuthError } from '@utils'
import { message, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import FranchiseListHeader from './components/FranchiseListHeader'
import FranchiseListTable from './components/FranchiseListTable'

export default function FranchiseList() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [franchiseLists, setFranchiseLists] = useState([])
  const [loading, setLoading] = useState(false)
  const [keyTable, setKeyTable] = useState(0)
  let franchiseListPerformed = []

  useEffect(() => {
    setPermissions()
    getFranchiseLists()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  async function getFranchiseLists() {
    setLoading(true)
    setSelectedRowKeys([])

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/franchiseList`,
      })

      const { data } = response

      if (data.isOk) {
        setFranchiseLists(data.franchiseList)
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

  function confirmDeleteFranchiseLists() {
    Modal.confirm({
      content:
        selectedRowKeys.length === 1
          ? 'Você tem certeza que deseja excluir a lista selecionada?'
          : 'Você tem certeza que deseja excluir as listas selecionadas?',
      title: 'Atenção',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteFranchiseLists()
      },
    })
  }

  function addFranchiseListPerformed(id) {
    franchiseListPerformed.push(id)

    if (franchiseListPerformed.length >= selectedRowKeys.length) {
      franchiseListPerformed = []
      getFranchiseLists()
    }
  }

  function deleteFranchiseLists() {
    setLoading(true)
    franchiseListPerformed = []

    for (let i = 0; i < selectedRowKeys.length; i++) {
      deleteFranchiseList(selectedRowKeys[i])
    }
  }

  async function deleteFranchiseList(id) {
    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/crm/franchiseList`,
        params: { franchiseListId: id },
      })

      const { data } = response

      if (!data.isOk) {
        message.error(data.message)
      }

      addFranchiseListPerformed(id)
    } catch (error) {
      handleAuthError(error)
      addFranchiseListPerformed(id)
    }
  }

  return (
    <div className="w-full container">
      <FranchiseListHeader
        selectedRowKeys={selectedRowKeys}
        setLectedRowKeys={setSelectedRowKeys}
        userPermissions={userPermissions}
        confirmDeleteFranchiseLists={confirmDeleteFranchiseLists}
      />
      <FranchiseListTable
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        keyTable={keyTable}
        franchiseLists={franchiseLists}
        userPermissions={userPermissions}
        loading={loading}
      />
    </div>
  )
}

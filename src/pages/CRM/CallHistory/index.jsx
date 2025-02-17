/**
 * breadcrumb: Controle de chamados
 */

import { apiCRM } from '@services/api'
import { getPermissions, handleAuthError } from '@utils'
import { message } from 'antd'
import React, { useEffect, useState } from 'react'
import CallHistoryHeader from './components/CallHistoryHeader'
import CallHistoryTable from './components/CallHistoryTable'
import CallHistoryHeaderNewModal from './modals/CallHistoryHeaderNewModal/CallHistoryHeaderNewModal'

const params = {
  callId: null,
  number: null,
  searchType: 1,
  franchiseeName: null,
  requesterName: null,
  responsibleName: null,
  callTypeName: null,
  actStatusId: null,
  priority: null,
  startCallDate: null,
  endCallDate: null,
}

const defaultSearchOptions = [
  {
    value: 'franchiseeName',
    label: 'Franqueado',
    placeholder: 'Buscar por franqueado',
    type: 'search',
  },
  {
    value: 'responsibleName',
    label: 'Responsável',
    placeholder: 'Buscar por responsável',
    type: 'search',
  },
  {
    value: 'requesterName',
    label: 'Solicitante',
    placeholder: 'Buscar por solicitante',
    type: 'search',
  },
  {
    value: 'number',
    label: 'Número',
    placeholder: 'Número do chamado',
    type: 'search',
    dataType: 'integer',
  },
  {
    value: 'callTypeName',
    label: 'Tipo de chamado',
    placeholder: 'Buscar por tipo de chamado',
    type: 'search',
  },
  {
    value: 'callDate',
    label: 'Data de abertura',
    placeholder: '',
    type: 'rangeDate',
  },
  {
    value: 'priority',
    label: 'Prioridade',
    placeholder: 'Buscar por prioridade',
    type: 'select',
    options: [
      { label: ' ', value: null },
      { label: 'Baixa', value: 'Low' },
      { label: 'Média', value: 'Medium' },
      { label: 'Alta', value: 'High' },
    ],
  },
]

export default function CallHistory() {
  const [ownerProfile, setOwnerProfile] = useState(null)
  const [franchiseeId, setFranchiseeId] = useState(null)
  const [ownerShortName, setOwnerShortName] = useState(null)
  const [loadingOwnerProfile, setLoadingOwnerProfile] = useState(true)
  const [userPermissions, setUserPermissions] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectValue, setSelectValue] = useState(1)
  const [data, setData] = useState([])
  const [keyTable, setKeyTable] = useState(0)
  const [keyModal, setKeyModal] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [callId, setCallId] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [searchOptions, setSearchOptions] = useState(defaultSearchOptions)

  useEffect(() => {
    clearParams()
    params.searchType = 1
    getOwnerProfile()
    setPermissions()
    getCalls()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function clearParams() {
    params.callId = null
    params.number = null
    params.franchiseeName = null
    params.requesterName = null
    params.responsibleName = null
    params.callTypeName = null
    params.actStatusId = null
    params.priority = null
    params.startCallDate = null
    params.endCallDate = null
  }

  useEffect(() => {
    if (!loadingOwnerProfile) {
      configureSearchOptions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingOwnerProfile])

  function configureSearchOptions() {
    let index

    if (ownerProfile === 'Franchise') {
      index = defaultSearchOptions.findIndex(x => x.value === 'franchiseeName')
      if (index >= 0) {
        defaultSearchOptions.splice(index, 1)
      }
    }

    setSearchOptions(defaultSearchOptions)
    setLoadingOptions(false)
  }

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  async function getOwnerProfile() {
    setLoadingOwnerProfile(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/owner`,
      })

      const { data } = response

      if (data.isOk) {
        setOwnerProfile(data.ownerProfile)
        setOwnerShortName(data.ownerShortName)
        setFranchiseeId(data.franchiseeId)

        setLoadingOwnerProfile(false)
      } else {
        message.error(data.message)
        setLoadingOwnerProfile(false)
      }
    } catch (error) {
      setLoadingOwnerProfile(false)
      handleAuthError(error)
    }
  }

  async function getCalls() {
    setLoading(true)
    setSelectedRowKeys([])

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/call`,
        params,
      })

      setLoading(false)

      const { data } = response

      if (data.isOk) {
        setData(data.call)
        setKeyTable(keyTable + 1)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoading(false)
      setKeyTable(keyTable + 1)
      handleAuthError(error)
    }
  }

  const handleSelectChange = value => {
    setSelectValue(value)
    params.searchType = value
    getCalls()
  }

  const toogleModalVisible = () => {
    setModalVisible(false)
  }

  const refreshGrid = () => {
    getCalls()
  }

  const editCall = id => {
    setCallId(id)
    setKeyModal(keyModal + 1)
    setModalVisible(true)
  }

  const addOtherCall = () => {
    setCallId(0)
  }

  function startSearch(fieldName, searchFieldValue) {
    setSearchValues(fieldName, searchFieldValue)
    getCalls()
  }

  function setSearchValues(fieldName, searchFieldValue) {
    clearParams()
    if (!searchFieldValue) {
      return
    }
    if (fieldName === 'franchiseeName') {
      params.franchiseeName = `%${searchFieldValue}%`
    } else if (fieldName === 'requesterName') {
      params.requesterName = `%${searchFieldValue}%`
    } else if (fieldName === 'responsibleName') {
      params.responsibleName = `%${searchFieldValue}%`
    } else if (fieldName === 'callTypeName') {
      params.callTypeName = `%${searchFieldValue}%`
    } else if (fieldName === 'priority') {
      params.priority = searchFieldValue
    } else if (fieldName === 'number') {
      if (searchFieldValue) {
        params.number = parseInt(searchFieldValue, 10)
      }
    } else if (fieldName === 'callDate') {
      if (searchFieldValue.length > 1) {
        params.startCallDate = searchFieldValue[0]
          ? searchFieldValue[0].format('YYYY-MM-DDTHH:mm:ss.SSS')
          : null
        params.endCallDate = searchFieldValue[1]
          ? searchFieldValue[1].format('YYYY-MM-DDTHH:mm:ss.SSS')
          : null
      }
    }
  }

  return (
    <div className="w-full container">
      <CallHistoryHeader
        selectedRowKeys={selectedRowKeys}
        handleSelectChange={handleSelectChange}
        selectValue={selectValue}
        loading={loading || loadingOwnerProfile}
        userPermissions={userPermissions}
        editCall={editCall}
        loadingOptions={loadingOptions}
        searchOptions={searchOptions}
        startSearch={startSearch}
        setSearchValues={setSearchValues}
        onChange={refreshGrid}
      />
      <CallHistoryTable
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        data={data}
        selectValue={selectValue}
        userPermissions={userPermissions}
        loading={loading || loadingOwnerProfile}
        keyTable={keyTable}
        editCall={editCall}
        ownerProfile={ownerProfile}
      />
      <React.Fragment>
        <CallHistoryHeaderNewModal
          modalVisible={modalVisible}
          toogleModalVisible={toogleModalVisible}
          key={keyModal}
          refreshGrid={refreshGrid}
          callId={callId}
          setCallId={setCallId}
          addOtherCall={addOtherCall}
          userPermissions={userPermissions}
          ownerProfile={ownerProfile}
          ownerShortName={ownerShortName}
          franchiseeId={franchiseeId}
        />
      </React.Fragment>
    </div>
  )
}

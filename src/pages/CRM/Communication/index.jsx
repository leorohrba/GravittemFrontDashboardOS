/**
 * breadcrumb: Comunicados
 */

import { apiCRM } from '@services/api'
import { getPermissions, handleAuthError } from '@utils'
import { message, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import CommunicationCollapse from './components/CommunicationCollapse'
import CommunicationHeader from './components/CommunicationHeader'
import CommunicationHeaderModal from './modals/CommunicationHeaderModal/CommunicationHeaderModal'

let ownerProfileSaved = null

const params = {
  title: null,
  details: null,
  startSendDate: null,
  endSendDate: null,
  isRead: null,
  getCommunicationDetails: false,
}

export default function Communication() {
  const defaultSearchOptions = [
    {
      value: 'title',
      label: 'Título',
      placeholder: 'Buscar por título',
      type: 'search',
    },
    {
      value: 'details',
      label: 'Descrição',
      placeholder: 'Buscar por descrição',
      type: 'search',
    },
    {
      value: 'sendDate',
      label: 'Data de envio',
      type: 'rangeDate',
    },
    {
      value: 'isRead',
      label: 'Lido',
      placeholder: 'Lido (sim/não)',
      type: 'select',
      options: [
        { label: ' ', value: null },
        { label: 'Sim', value: 1 },
        { label: 'Não', value: 2 },
      ],
    },
  ]

  const [searchOptions, setSearchOptions] = useState(defaultSearchOptions)
  const [userPermissions, setUserPermissions] = useState([])
  const [ownerProfile, setOwnerProfile] = useState(null)
  const [communicationData, setCommunicationData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [keyModal, setKeyModal] = useState(0)
  const [communicationId, setCommunicationId] = useState(0)

  useEffect(() => {
    clearParams()
    getOwnerProfile()
    setPermissions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function clearParams() {
    params.title = null
    params.details = null
    params.startSendDate = null
    params.endSendDate = null
    params.isRead = null
    params.getCommunicationDetails = false
  }

  function configureSearchOptions() {
    if (ownerProfileSaved !== 'Franchise') {
      const index = defaultSearchOptions.findIndex(x => x.value === 'isRead')
      if (index >= 0) {
        defaultSearchOptions.splice(index, 1)
      }
      setSearchOptions(defaultSearchOptions)
    }
  }

  async function getOwnerProfile() {
    setLoading(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/owner`,
      })

      const { data } = response

      if (data.isOk) {
        ownerProfileSaved = data.ownerProfile
        setOwnerProfile(ownerProfileSaved)
        configureSearchOptions()
        getCommunications()
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  const toogleModalVisible = () => {
    setModalVisible(false)
  }

  const editCommunication = id => {
    setCommunicationId(id)
    setKeyModal(keyModal + 1)
    setModalVisible(true)
  }

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  async function getCommunications() {
    setLoading(true)
    params.getCommunicationDetails = ownerProfileSaved === 'Franchise'

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/communication`,
        params,
      })

      const { data } = response
      setLoading(false)

      if (data.isOk) {
        setCommunicationData(data.communication)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  function confirmDelete(id) {
    Modal.confirm({
      content: 'Confirma exclusão do comunicado?',
      title: 'Atenção',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteCommunication(id)
      },
    })
  }

  async function deleteCommunication(id) {
    setLoading(true)

    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/crm/communication`,
        params: { communicationId: id },
      })

      const { data } = response

      if (!data.isOk) {
        setLoading(false)
        message.error(data.message)
      } else {
        getCommunications()
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  async function setCommunicationRead(id, readDate) {
    setLoading(true)

    const communicationBody = {
      communicationId: id,
      isRead: !readDate,
    }

    try {
      const response = await apiCRM({
        method: 'PUT',
        url: `/api/crm/communicationRead`,
        data: communicationBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setLoading(false)

      const { data } = response

      if (data.isOk) {
        getCommunications()
      } else if (data.validationMessageList.length > 0) {
        message.error(data.validationMessageList[0])
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  const refreshCollapse = () => {
    getCommunications()
  }

  function startSearch(fieldName, searchFieldValue) {
    setSearchValues(fieldName, searchFieldValue)
    getCommunications()
  }

  function setSearchValues(fieldName, searchFieldValue) {
    clearParams()
    if (!searchFieldValue) {
      return
    }
    if (fieldName === 'title') {
      params.title = `%${searchFieldValue}%`
    } else if (fieldName === 'details') {
      params.details = `%${searchFieldValue}%`
    } else if (fieldName === 'isRead') {
      if (searchFieldValue === 1) {
        params.isRead = true
      } else if (searchFieldValue === 2) {
        params.isRead = false
      }
    } else if (fieldName === 'sendDate') {
      if (searchFieldValue.length > 1) {
        params.startSendDate = searchFieldValue[0]
          ? searchFieldValue[0].format('YYYY-MM-DDTHH:mm:ss.SSS')
          : null
        params.endSendDate = searchFieldValue[1]
          ? searchFieldValue[1].format('YYYY-MM-DDTHH:mm:ss.SSS')
          : null
      }
    }
  }

  return (
    <div className="w-full container">
      <CommunicationHeader
        editCommunication={editCommunication}
        ownerProfile={ownerProfile}
        userPermissions={userPermissions}
        startSearch={startSearch}
        setSearchValues={setSearchValues}
        searchOptions={searchOptions}
      />

      <CommunicationCollapse
        communicationData={communicationData}
        loading={loading}
        confirmDelete={confirmDelete}
        editCommunication={editCommunication}
        ownerProfile={ownerProfile}
        userPermissions={userPermissions}
        setCommunicationRead={setCommunicationRead}
      />

      <CommunicationHeaderModal
        modalVisible={modalVisible}
        toogleModalVisible={toogleModalVisible}
        communicationId={communicationId}
        key={keyModal}
        refreshCollapse={refreshCollapse}
        userPermissions={userPermissions}
      />
    </div>
  )
}

/**
 * breadcrumb: Materiais
 */
import { apiCRM } from '@services/api'
import { getPermissions, handleAuthError } from '@utils'
import { message, Modal, Spin, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import MaterialsCollapse from './components/MaterialsCollapse'
import MaterialsHeader from './components/MaterialsHeader'
import MaterialsHeaderModal from './modals/MaterialsHeader/MaterialsHeaderModal'

const { TabPane } = Tabs

let ownerProfileSaved = null

const params = {
  title: null,
  details: null,
  startSendDate: null,
  endSendDate: null,
  isRead: null,
  getLibraryDetails: true,
}

export default function Materials() {
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
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [keyModal, setKeyModal] = useState(0)
  const [libraryId, setLibraryId] = useState(0)
  const [marketingLibraryData, setMarketingLibraryData] = useState([])
  const [manualLibraryData, setManualLibraryData] = useState([])
  const [institutionalLibraryData, setInstitutionalLibraryData] = useState([])

  useEffect(() => {
    clearParams()
    getOwnerProfile()
    getLibraries()
    setPermissions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function clearParams() {
    params.title = null
    params.details = null
    params.startSendDate = null
    params.endSendDate = null
    params.isRead = null
    params.getLibraryDetails = true
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

  const editLibrary = id => {
    setLibraryId(id)
    setKeyModal(keyModal + 1)
    setModalVisible(true)
  }

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  async function getLibraries() {
    setLoading(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/library`,
        params,
      })

      const { data } = response
      setLoading(false)

      if (data.isOk) {
        setMarketingLibraryData(
          data.library.filter(mat => mat.type === 'Marketing'),
        )
        setManualLibraryData(data.library.filter(mat => mat.type === 'Manual'))
        setInstitutionalLibraryData(
          data.library.filter(mat => mat.type === 'Institutional'),
        )
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
      content: 'Confirma exclusão da biblioteca?',
      title: 'Atenção',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteLibrary(id)
      },
    })
  }

  async function deleteLibrary(id) {
    setLoading(true)

    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/crm/library`,
        params: { libraryId: id },
      })

      const { data } = response

      if (!data.isOk) {
        setLoading(false)
        message.error(data.message)
      } else {
        getLibraries()
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  async function setLibraryRead(id, readDate) {
    setLoading(true)

    const libraryBody = {
      libraryId: id,
      isRead: !readDate,
    }

    try {
      const response = await apiCRM({
        method: 'PUT',
        url: `/api/crm/libraryRead`,
        data: libraryBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setLoading(false)

      const { data } = response

      if (data.isOk) {
        getLibraries()
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
    getLibraries()
  }

  function startSearch(fieldName, searchFieldValue) {
    setSearchValues(fieldName, searchFieldValue)
    getLibraries()
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
      <MaterialsHeader
        editLibrary={editLibrary}
        ownerProfile={ownerProfile}
        userPermissions={userPermissions}
        startSearch={startSearch}
        setSearchValues={setSearchValues}
        searchOptions={searchOptions}
      />
      <Spin size="large" spinning={loading}>
        <Tabs defaultActiveKey="1" size="large" className="materials-tab mt-5">
          <TabPane
            tab={
              <span>
                <i className="fa fa-tag fa-lg mr-3" aria-hidden="true" />
                Marketing
              </span>
            }
            key="1"
          >
            <MaterialsCollapse
              libraryData={marketingLibraryData}
              loading={loading}
              confirmDelete={confirmDelete}
              editLibrary={editLibrary}
              ownerProfile={ownerProfile}
              userPermissions={userPermissions}
              setLibraryRead={setLibraryRead}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <i className="fa fa-bookmark fa-lg mr-3" aria-hidden="true" />
                Manuais
              </span>
            }
            key="2"
          >
            <MaterialsCollapse
              libraryData={manualLibraryData}
              loading={loading}
              confirmDelete={confirmDelete}
              editLibrary={editLibrary}
              ownerProfile={ownerProfile}
              userPermissions={userPermissions}
              setLibraryRead={setLibraryRead}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <i className="fa fa-bank fa-lg mr-3" aria-hidden="true" />
                Institucionais
              </span>
            }
            key="3"
          >
            <MaterialsCollapse
              libraryData={institutionalLibraryData}
              loading={loading}
              confirmDelete={confirmDelete}
              editLibrary={editLibrary}
              ownerProfile={ownerProfile}
              userPermissions={userPermissions}
              setLibraryRead={setLibraryRead}
            />
          </TabPane>
        </Tabs>
      </Spin>
      <MaterialsHeaderModal
        modalVisible={modalVisible}
        toogleModalVisible={toogleModalVisible}
        libraryId={libraryId}
        key={keyModal}
        refreshCollapse={refreshCollapse}
        userPermissions={userPermissions}
        setLibraryId={setLibraryId}
      />
    </div>
  )
}

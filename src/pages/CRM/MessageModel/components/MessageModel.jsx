import { apiCRM } from '@services/api'
import { handleAuthError, hasPermission } from '@utils'
import { Button, Modal, message, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import MessageModelTabs from './MessageModelTabs'
import AddFolderModal from '../modals/AddFolderModal'
import AddMessageModal from '../modals/AddMessageModal'

function MessageModel({ userPermissions, onSelectModel }) {

  const [selectedRows, setSelectedRows] = useState([])
  const [visibleFolderModal, setVisibleFolderModal] = useState(false)
  const [visibleMessageModal, setVisibleMessageModal] = useState(false)
  const [keyTable, setKeyTable] = useState(0)
  const [loading, setLoading] = useState(false)
  const [folders, setFolders] = useState([])
  const [editData, setEditData] = useState(null)
  const [modelObjects, setModelObjects] = useState([])
  const [ownerProfile, setOwnerProfile] = useState(null)
  
  useEffect(() => {
    getData()
    getOwner()
    getObjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  async function getData() {
    setLoading(true)
    setSelectedRows([])
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/messageModelEmail`,
        params: { getItems: true },
      })
      const { data } = response
      setLoading(false)
      if (data.isOk) {
        setFolders(data.messageModelFolderEmail)
        setKeyTable(keyTable + 1)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  async function getObjects() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/messageModelObject`,
        params: { processId: 706 },
      })
      const { data } = response
      if (data.isOk) {
        setModelObjects(data.messageModelObject)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getOwner() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/owner`,
      })
      const { data } = response
      if (data.isOk) {
        setOwnerProfile(data.ownerProfile)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }
  
  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }
  
  function confirmDeleteFolder(id) {
    const record = folders.find(x => x.messageModelFolderEmailId === id)
    if (record) {
      Modal.confirm({
        content: `Confirma exclusão da pasta ${record.name}?`,
        title: 'Atenção',
        okText: 'Sim',
        okType: 'danger',
        cancelText: 'Não',
        onOk: () => {
          deleteFolder(id)
        },
      })
    }
  }
  
  const editFolder = (id) => {
    setEditData(id ? folders.find(x => x.messageModelFolderEmailId === id) : null)
    setVisibleFolderModal(true)
  }

  const editModel = (folderId, id) => {
    const findFolder = folders.find(x => x.messageModelFolderEmailId === folderId)
    if (findFolder) {
      let edit = id ? findFolder.items.find(x => x.messageModelItemEmailId === id) : null
      if (!id) {
        edit = { messageModelFolderEmailId: folderId }
      }
      setEditData(edit)
      setVisibleMessageModal(true)
    }
  }

  async function deleteFolder(id) {
    setLoading(true)
    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/crm/messageModelFolderEmail`,
        params: { messageModelFolderEmailId: id },
      })
      setLoading(false)
      const { data } = response
      if (!data.isOk) {
        message.error(data.message)
      } else {
        getData()
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }
  
  function confirmDeleteModels() {
      Modal.confirm({
        content: selectedRows.length === 1 ? `Confirma exclusão do modelo selecionado?` : `Confirma exclusão dos modelos selecionados?`,
        title: 'Atenção',
        okText: 'Sim',
        okType: 'danger',
        cancelText: 'Não',
        onOk: () => {
          deleteModels()
        },
      })
  }

  async function deleteModels() {
    setLoading(true)
    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/crm/messageModelItemEmail`,
        data: { messageModelItemEmailId: selectedRows.map((record) => record.messageModelItemEmailId) },
        headers: { 'Content-Type': 'application/json' },
      })
      setLoading(false)
      const { data } = response
      if (!data.isOk) {
        message.error(data.message)
      } else {
        getData()
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  return (
    <Spin size="large" spinning={loading}>
      <AddFolderModal
        {...{ visibleFolderModal, setVisibleFolderModal, editData, getData, userPermissions }}
      />
      <AddMessageModal
        visibleMessageModal={visibleMessageModal}
        setVisibleMessageModal={setVisibleMessageModal}
        folders={folders.map(record => ({ messageModelFolderEmailId: record.messageModelFolderEmailId, name: record.name }))}
        editData={editData}
        userPermissions={userPermissions}
        getData={getData}   
        modelObjects={modelObjects}   
        ownerProfile={ownerProfile}        
      />
      {hasPermission(userPermissions, 'Include') && (
        <Button type="primary" onClick={() => editFolder(0)}>
          <i className="fa fa-folder fa-lg mr-3" />
          Adicionar nova pasta
        </Button>
      )}
      <MessageModelTabs
        {...{
          folders,
          rowSelection,
          userPermissions,
          selectedRows,
          editFolder,
          editModel,
          confirmDeleteFolder,
          confirmDeleteModels,
          keyTable,
          onSelectModel,
        }}
      />
    </Spin>
  )
}
MessageModel.propTypes = {
  userPermissions: PropTypes.array,
  onSelectModel: PropTypes.func,
}

export default MessageModel

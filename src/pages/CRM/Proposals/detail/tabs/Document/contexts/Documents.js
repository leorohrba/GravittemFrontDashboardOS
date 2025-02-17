import constate from 'constate'
import { useState } from 'react'

function useDocuments() {
  const [selectedRows, setSelectedRows] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [editData, setEditData] = useState({})
  const [documentsModalVisible, setDocumentsModalVisible] = useState(false)
  const [documentTags, setDocumentTags] = useState(false)
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRowKeys(selectedRowKey)
      setSelectedRows(selectedRow)
    },
  }
  const showDocumentsModal = data => {
    setDocumentsModalVisible(!documentsModalVisible)
    setEditData(data)
  }
  return {
    documentsModalVisible,
    selectedRows,
    editData,
    setEditData,
    rowSelection,
    setDocumentsModalVisible,
    showDocumentsModal,
    setSelectedRows,
    setSelectedRowKeys,
    documentTags,
    setDocumentTags,
  }
}

const [DocumentsProvider, useDocumentsContext] = constate(useDocuments)

export { DocumentsProvider, useDocumentsContext }

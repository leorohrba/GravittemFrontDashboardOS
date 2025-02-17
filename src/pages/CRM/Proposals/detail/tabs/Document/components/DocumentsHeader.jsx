import Button from '@components/Button'
import ConfirmDeleteModal from '@components/modals/ConfirmDeleteModal'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { useDocumentsContext } from '../contexts/Documents'

export default function DocumentsHeader({
  canInclude,
  documentsData,
  setDocumentsData,
  refreshData,
}) {
  const {
    showDocumentsModal,
    selectedRows,
    setSelectedRows,
    setSelectedRowKeys,
  } = useDocumentsContext()

  const deleteDocuments = e => {
    const keysToRemove = selectedRows.map(selectedRow => selectedRow.key)

    const filteredArray = documentsData.filter(
      i => !keysToRemove.includes(i.key),
    )
    const response = selectedRows.map(d => {
      return apiCRM
        .delete(`api/CRM/ProposalDocument/${d.id}`)
        .catch(function handleError(error) {
          handleAuthError(error)
        })
    })
    Promise.resolve(Promise.all(response)).then(() => {
      setDocumentsData(filteredArray)
      setSelectedRows([])
      setSelectedRowKeys([])
      refreshData()
    })
  }

  return (
    <div className="my-3">
      {selectedRows.length !== 0 && (
        <Button
          quantity={selectedRows.length}
          id="button-delete-account-plan"
          onClick={() => ConfirmDeleteModal(deleteDocuments)}
        >
          <i className="fa fa-trash fa-lg mr-3" />
          {formatMessage({
            id: 'delete',
          })}
        </Button>
      )}
      {canInclude && selectedRows.length === 0 && (
        <Button type="primary" onClick={() => showDocumentsModal({})}>
          Adicionar documentos
        </Button>
      )}
    </div>
  )
}

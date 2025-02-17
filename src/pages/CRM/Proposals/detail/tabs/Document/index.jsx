import React, { useEffect, useState } from 'react'
import DocumentsHeader from './components/DocumentsHeader'
import { useGetDataFromServer } from '@utils/customHooks'
import DocumentsTable from './components/DocumentsTable'
import { DocumentsProvider } from './contexts/Documents'
import AddDocumentsModal from './modals/AddDocumentsModal'
import { apiCRM } from '@services/api'
import { documentEnum } from '@utils/enums'

export default function Document({ proposal, proposalCanBeUpdate, refreshData }) {
  const [documentsData, setDocumentsData] = useState([])
  const [
    documentData,
    loadingDocumentData,
    getDataFromServer,
  ] = useGetDataFromServer(
    apiCRM,
    `/api/CRM/ProposalDocument?proposalId=${proposal?.proposalId}`,
    `Não foi possível obter os documentos do negócio`,
    false,
  )

  useEffect(() => {
    if (documentsData.length === 0) {
      getDataFromServer()
    }
  }, [])

  useEffect(() => {
    setDocumentsData(
      documentData.document?.map((d, index) => ({
        key: index,
        id: d.id,
        codigo: d.valor,
        tipo: d.tipoDocumento,
        documentoExterno: false,
        tipoDescricao: documentEnum.find(e => e.id === d.tipoDocumento)?.name,
      })),
    )
  }, [documentData])

  return (
    <React.Fragment>
      <DocumentsProvider>
        <AddDocumentsModal
          proposalId={proposal?.proposalId}
          {...{ documentsData, setDocumentsData, refreshData }}
        />
        <DocumentsHeader
          canInclude={proposalCanBeUpdate}
          {...{ documentsData, setDocumentsData, refreshData }}
        />
        <DocumentsTable
          canInclude={proposalCanBeUpdate}
          {...{ documentsData }}
        />
      </DocumentsProvider>
    </React.Fragment>
  )
}

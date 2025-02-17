import React from 'react'
import ShowDocument from '@components/LayoutGenerator/ShowDocument'

export function PrintProposal({ proposalId, documentModelId, onClose, isModal }) {
  return (
    <ShowDocument
      modeloDocumentoId={documentModelId}
      parametros="proposalId"
      valores={proposalId}
      titulo1="Detalhes do negócio"
      titulo2="Impressão do negócio"
      onClose={onClose}
      modal={isModal}
    />
  )
}


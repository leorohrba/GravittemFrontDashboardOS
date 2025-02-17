import FileGenerate from '@components/LayoutGenerator/FileGenerate'

// ATENÇÃO: Se for feita alguma alteração aqui, deve-se alterar também o componente PrintProposal

export async function GenerateFile({ proposalId, documentModelId, callback })  {
  FileGenerate({
    modeloDocumentoId: documentModelId,
    parametros: 'proposalId',
    valores: proposalId,
    callback,
  })
}


import { Button } from 'antd'
import React from 'react'
import { useGenerateContractContext } from '../context/GenerateContract'
import PropTypes from 'prop-types'
import { hasPermission } from '@utils'

export default function GenerateContractFooter({ handleSave, handleReturn }) {
  const { canBeUpdated, type, isSaving, userPermissions } = useGenerateContractContext()
  return (
    <React.Fragment>
      {hasPermission(userPermissions, 'Incluir') && (
        <Button
          className="mr-2"
          loading={isSaving}
          onClick={() => handleSave()}
          disabled={!canBeUpdated || type === 'Contrato'}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
          }}
        >
          Salvar
        </Button>
      )}
      <Button onClick={() => handleReturn()} type="secondary">{!canBeUpdated || type === 'Contrato' ? 'Voltar' : 'Cancelar'}</Button>
    </React.Fragment>
  )
}

GenerateContractFooter.propTypes = {
  handleSave: PropTypes.any,
  handleReturn: PropTypes.any,
}
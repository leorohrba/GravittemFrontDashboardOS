import { apiCRM } from '@services/api'
import { Button, message, Row } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

export function LeftBarParcelsModalFooter({
  setShowProposalParcel,
  parcelTotal,
  total,
  proposalId,
  parcels,
  onChange,
  difference,
}) {
  const [saving, setSaving] = useState(false)
  const saveProposalParcels = async () => {
    setSaving(true)
    try {
      const response = await apiCRM.put(`/api/ProposalParcel/${proposalId}`, {
        parcels,
      })
      if (response.data.isOk) {
        message.success('Configurações de parcelamento salvas com sucesso!')
      } else {
        message.error(response.data.message)
      }
    } catch (error) {
      message.error('Não foi possível salvar as configurações de parcelamento')
    }
    setSaving(false)
    setShowProposalParcel(false)
  }

  const generateParcels = async () => {
    setSaving(true)
    try {
      const response = await apiCRM.put(`/api/ProposalParcel/GenerateParcels/${proposalId}`)
      onChange(response.data)
    } catch (error) {
      message.error('Não foi possível re-gerar as parcelas')
    }
    setSaving(false)
  }

  return (
    <div className="ant-modal-footer">
      <Row type="flex">
        <Button
          type="secondary"
          onClick={() => setShowProposalParcel(false)}
          className="mr-auto"
        >
          Voltar
        </Button>
        <Button
          className="mr-2"
          loading={saving}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
          }}
          onClick={() => generateParcels()}
        >
          Re-gerar parcelas
        </Button>
        <Button
          loading={saving}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
          }}
          disabled={difference !== 0}
          onClick={() => saveProposalParcels(parcels)}
        >
          Salvar
        </Button>
      </Row>
    </div>
  )
}

LeftBarParcelsModalFooter.propTypes = {
  parcels: PropTypes.array,
  parcelTotal: PropTypes.number,
  proposalId: PropTypes.number,
  setShowProposalParcel: PropTypes.func,
  total: PropTypes.number,
  onChange: PropTypes.func,
  difference: PropTypes.number,
}

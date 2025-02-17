import React from 'react'
import { Button } from 'antd'

export default function PersonPriceListModalFooter(props: {
  canBeUpdated: boolean
  handleOk: () => void
  handleCancel: () => void
  disabledInput: boolean
}) {
  const { canBeUpdated, handleOk, handleCancel, disabledInput } = props
  const validate = canBeUpdated ? !disabledInput : false
  return (
    <React.Fragment>
      {validate && (
        <Button
          type="primary"
          onClick={() => handleOk()}
          className="formButton"
        >
          Adicionar
        </Button>
      )}

      <Button onClick={() => handleCancel()}>Cancelar</Button>
    </React.Fragment>
  )
}

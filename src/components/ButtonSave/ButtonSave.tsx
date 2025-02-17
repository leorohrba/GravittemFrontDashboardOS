import { Button } from 'antd'
import React from 'react'

export function ButtonSave(props) {
  const {
    form,
    handleOk = null,
    handleSaveAdd = null,
    handleModalCancel,
    canBeUpdated,
    tableData,
    canView,
  } = props
  return (
    <div className="flex justify-start space-x-2">
      {!canView && (
        <>
          <Button
            onClick={handleOk}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              display: !canBeUpdated ? 'none' : 'inline',
            }}
            htmlType="submit"
            form={form}
          >
            Salvar
          </Button>

          <Button
            onClick={handleSaveAdd}
            style={{
              color: '#4caf50',
              borderColor: '#4caf50',
              borderWidth: 1,
              display: tableData == null ? 'inline' : 'none',
            }}
            htmlType="submit"
            form={form}
          >
            Salvar e adicionar outro
          </Button>
        </>
      )}

      <Button onClick={handleModalCancel}>Cancelar</Button>
    </div>
  )
}

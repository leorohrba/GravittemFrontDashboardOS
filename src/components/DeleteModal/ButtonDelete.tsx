import { Button, Col } from 'antd'
import React from 'react'

const ButtonDelete = (props: { 
  selectedRows: any[], 
  setVisibleDelete: React.Dispatch<React.SetStateAction<boolean>> 
}) => {
  const { selectedRows, setVisibleDelete } = props

  return (
    <Col>
      <Button
        style={{ color: 'red', borderColor: 'red' }}
        onClick={() => setVisibleDelete(true)}
      >
        <i className="fa fa-trash fa-lg mr-3" />
        Excluir ({selectedRows.length})
      </Button>
    </Col>
  )
}

export default ButtonDelete

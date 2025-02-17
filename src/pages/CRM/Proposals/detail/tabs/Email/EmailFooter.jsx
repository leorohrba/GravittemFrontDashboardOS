import { Button, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function EmailFooter({
  handleSubmit,
  editData,
  clearForm,
  canBeUpdated,
}) {
  return (
    <React.Fragment>
      {!editData && canBeUpdated && (
        <Row type="flex" className="mt-3">
          <Button type="primary" onClick={() => handleSubmit()}>
            Enviar
          </Button>
          <Button className="ml-3" onClick={() => clearForm()}>
            <i className="fa fa-undo mr-3" style={{ color: 'gray' }} /> Limpar
            formulário
          </Button>
        </Row>
      )}
    </React.Fragment>
  )
}

EmailFooter.propTypes = {
  handleSubmit: PropTypes.func,
  editData: PropTypes.any,
  clearForm: PropTypes.func,
  canBeUpdated: PropTypes.bool,
}

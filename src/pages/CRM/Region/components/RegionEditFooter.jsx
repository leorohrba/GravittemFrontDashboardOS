import { Button } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import router from 'umi/router'
import { formatMessage } from 'umi-plugin-react/locale'

export default function RegionEditFooter({ handleSave, isSaving, canBeUpdated, loading, formChanged, isModal }) {
  return (
    <React.Fragment>
      {(!loading || isSaving) && canBeUpdated && ( 
        <React.Fragment>
          <Button
            className="mr-3"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            loading={isSaving}
            disabled={!formChanged}
            onClick={() => handleSave(false)}
          >
            {formatMessage({
              id: 'saveButton',
            })}
          </Button>
          {!isModal && (
          <Button
            className="mr-3"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            loading={isSaving}
            disabled={!formChanged}
            onClick={() => handleSave(true)}
          >
            Salvar e fechar
          </Button>
          )}
        </React.Fragment>
      )}
      {!isModal && (
        <Button type="secondary" onClick={() => router.push('/Region')}>
          {canBeUpdated ? 
            formatMessage({
              id: 'cancelButton',
            })
            : 'Voltar'}
        </Button>
      )}
    </React.Fragment>
  )
}

RegionEditFooter.propTypes = {
  handleSave: PropTypes.any,
  isSaving: PropTypes.bool,
  loading: PropTypes.bool,
  canBeUpdated: PropTypes.bool,
  formChanged: PropTypes.bool,
  isModal: PropTypes.bool,
}

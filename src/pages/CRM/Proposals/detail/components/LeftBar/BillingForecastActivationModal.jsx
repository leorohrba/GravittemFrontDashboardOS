/* eslint-disable react-hooks/exhaustive-deps */    
import { Button, Modal, Row, DatePicker, message } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function BillingForecastActivationModal({
  initialDate,
  billingForecastDate,
  setBillingForecastDate,
  activationDate,
  setActivationDate,
  activationDateRequired, 
  visible,
  setVisible,
  onChange,
}) {
  
  function disabledDate(current) {
    return current && current < initialDate.startOf('day')
  }

  const handleSave = () => {
    if (!billingForecastDate) {
      message.error('Informe a data de previsão de faturamento!')
      return
    }
    if (!activationDate && activationDateRequired) {
      message.error('Informe a data de ativação!')
      return
    }
    onChange()
    setVisible(false)
  }
  
  return (
    <Modal
      title={activationDateRequired ? "Previsão de faturamento e ativação" : "Previsão de faturamento"}
      visible={visible}
      destroyOnClose
      centered
      onCancel={() => setVisible(false)}
      footer={
        <Row type="flex" justify="space-between" align="middle">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={handleSave}
          >
            Salvar
          </Button>
          <Button
            type="secondary"
            style={{
              marginRight: 'auto',
            }}
            onClick={() => setVisible(false)}
          >
            Cancelar
          </Button>
        </Row>
      }
    >
      <div>
        <Row className="mb-4"> 
          <p className="mb-1"><b>Previsão de faturamento</b></p>
          <DatePicker
            format="DD/MM/YYYY"
            autoFocus
            value={billingForecastDate}
            onChange={(value) => setBillingForecastDate(value)}
            style={{width: '220px'}}
            disabledDate={disabledDate}
          />
        </Row>
        <Row className="mb-2" style={{ display: activationDateRequired ? 'block' : 'none'}}> 
          <p className="mb-1"><b>Data de ativação</b></p>
          <DatePicker
            format="DD/MM/YYYY"
            value={activationDate}
            style={{width: '220px'}}
            onChange={(value) => setActivationDate(value)}
            disabledDate={disabledDate}
          />
        </Row>
      </div>
      
    </Modal>
  )
}

BillingForecastActivationModal.propTypes = {
  billingForecastDate: PropTypes.any,
  setBillingForecastDate: PropTypes.func,
  activationDate: PropTypes.any,
  setActivationDate: PropTypes.func,
  activationDateRequired: PropTypes.bool, 
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  initialDate: PropTypes.any,
  onChange: PropTypes.func,
}



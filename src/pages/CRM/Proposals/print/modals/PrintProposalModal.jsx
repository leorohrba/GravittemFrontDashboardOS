import React from 'react'
import { Button, Modal, Row, Col, message } from 'antd'
import PropTypes from 'prop-types'
import { printComponents } from '../print'

export default function PrintProposalModal({
  setVisiblePrintProposalModal,
  visiblePrintProposalModal,
  proposalId,
  method,
}) {
  
  if (!visiblePrintProposalModal) {
    return null
  }
  
  const getPrint = (method, proposalId) => {
    const PrintComponent = printComponents[method?.method]
    if (!PrintComponent) {
      message.error('Layout de impressão não encontrado!')
      setVisiblePrintProposalModal(false)
      return null
    } 
    return <PrintComponent documentModelId={method.documentModelId} proposalId={proposalId} isModal />  
  }
  
  return (
    <Modal
      title="Impressão do negócio"
      visible={visiblePrintProposalModal}
      width="950px"
      centered
      destroyOnClose
      onCancel={() => setVisiblePrintProposalModal(false)}
      footer={
        <Row type="flex">
          <Col className="ml-auto">
            <Button
              type="secondary"
              key="back"
              onClick={() => setVisiblePrintProposalModal(false)}
            >
              Fechar
            </Button>
          </Col>
        </Row>
      }
    >
      <div style={{ height: '1000px'}}>
        {getPrint(method, proposalId)}
      </div>
      
    </Modal>
  )
}

PrintProposalModal.propTypes = {
  setVisiblePrintProposalModal: PropTypes.func,
  visiblePrintProposalModal: PropTypes.bool,
  proposalId: PropTypes.number,
  method: PropTypes.string,
}


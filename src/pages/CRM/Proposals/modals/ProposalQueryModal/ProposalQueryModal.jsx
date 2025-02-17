import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Button, message, Modal, Row, Skeleton, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import CommissioningCommissionRecurrenceAmountModal from '../../../RoyaltiesAndCommissioningConfig/modals/CommissioningCommissionRecurrenceAmountModal/CommissioningCommissionRecurrenceAmountModal'
import CommissioningConfigTotalInvoicedModal from '../../../RoyaltiesAndCommissioningConfig/modals/CommissioningConfigTotalInvoicedModal/CommissioningConfigTotalInvoicedModal'
import ProposalQueryModalCommission from './components/ProposalQueryModalCommission'
import ProposalQueryModalHeader from './components/ProposalQueryModalHeader'
import ProposalQueryModalItems from './components/ProposalQueryModalItems'
import ProposalQueryModalTotal from './components/ProposalQueryModalTotal'



export default function ProposalQueryModal({
  visible,
  toogleModalVisible,
  proposalId,
  userPermissions,
  ownerProfile,
}) {

  const [loading, setLoading] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [proposal, setProposal] = useState(null)
  
  const [keyModalInvoice, setKeyModalInvoice] = useState(0)
  const [keyModalRecurrence, setKeyModalRecurrence] = useState(0)
  const [defaultCommissionType, setDefaultCommissionType] = useState(1)
  
  const [totalInvoiceModalVisible, setTotalInvoiceModalVisible] = useState(
    false,
  )
  const [
    recurrenceAmountModalVisible,
    setRecurrenceAmountModalVisible,
  ] = useState(false)
  
  const totalInvoicedEditParamsVisible = () =>
    setTotalInvoiceModalVisible(
      totalInvoiceModalVisible => !totalInvoiceModalVisible,
    )
  const recurrenceAmountEditParamsModalVisible = () =>
    setRecurrenceAmountModalVisible(
      recurrenceAmountModalVisible => !recurrenceAmountModalVisible,
    )
  
  const showModalInvoice = (id) => {
    setDefaultCommissionType(id)  
    setKeyModalInvoice(keyModalInvoice + 1)
    setTotalInvoiceModalVisible(true)
  }      

  const showModalRecurrence = () => {
    setKeyModalRecurrence(keyModalRecurrence + 1)
    setRecurrenceAmountModalVisible(true)
  }
  
  useEffect(() => {
    if (visible) {
       setShowSkeleton(true)
       getProposal()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [visible])      
  
  async function getProposal() {
    setLoading(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/proposalQuery`,
        params: { proposalId }
      })
      
      setLoading(false)
      setShowSkeleton(false)
      
      const { data } = response

      if (data.isOk) {
          if (data.proposal.length === 0 || (data.proposal.length > 0 && data.proposal[0].proposalId === 0))
          {
             message.error('Negócio não encontrado ou proibido acesso!')
             toogleModalVisible()
          }
          else {
            setProposal(data.proposal[0])  
          }
      } else {
        message.error(data.message)
        toogleModalVisible()
      }
    } catch (error) {
      handleAuthError(error)
      toogleModalVisible()
    }
  }
  
  const getCommissionConfig = () => {
      if (proposal.header.royaltyType === 5) {
          showModalRecurrence()
      }
      else if (proposal.header.royaltyType === 3) {
          showModalInvoice(2)
      }
      else if (proposal.header.royaltyType === 4) {
          showModalInvoice(1)
      }
      else {
          message.error('Franqueado não possui método de cobrança definido com base em comissões!')
      }
  }      
  
  return (
  <React.Fragment>  
    <Modal
      visible={visible}
      title={loading ? 'Carregando...' : `Negócio nº ${proposal?.header?.number || '...'}`}
      onCancel={toogleModalVisible}
      centered
      destroyOnClose
      width="1000px"
      footer={
        <Row type="flex">
          {ownerProfile === 'Franchisor' && (
           <React.Fragment> 
            <Button
              className="formButton"
              onClick={() => getProposal()}
              disabled={loading}
            >
              Recarregar dados
            </Button>
          
            <Button
              className="formOutlineButton"
              disabled={loading}
              onClick={() => getCommissionConfig()}
            >
              Configuração da comissão
            </Button>
           </React.Fragment>  
          )}
          <Button
            type="secondary"
            style={{ marginLeft: 'auto' }}
            onClick={toogleModalVisible}
          >
            Fechar
          </Button>
        </Row>
      }
    >
      <Spin size="large" spinning={loading}>
        <Skeleton loading={showSkeleton} paragraph={{ rows: 13 }} active>
           {proposal && (
             <React.Fragment>
               <ProposalQueryModalHeader header={proposal.header} ownerProfile={ownerProfile} />
               <ProposalQueryModalItems items={proposal.items} />
               <ProposalQueryModalTotal recurringValue={proposal.header.recurringValue} singleTotalAmount={proposal.header.singleTotalAmount} />
               {proposal.commission && proposal.commission.length > 0 && (
                 <ProposalQueryModalCommission commissions={proposal.commission} />
               )}
             </React.Fragment>
           )}              
        </Skeleton>  
      </Spin>
    </Modal>
    <React.Fragment>
      <CommissioningConfigTotalInvoicedModal
        visible={totalInvoiceModalVisible}
        toogleModalVisible={totalInvoicedEditParamsVisible}
        userPermissions={userPermissions}
        key={keyModalInvoice}
        defaultCommissionType={defaultCommissionType}
        readOnly={ownerProfile !== 'Franchisor'}
      />
    </React.Fragment>
    <React.Fragment>
      <CommissioningCommissionRecurrenceAmountModal
        visible={recurrenceAmountModalVisible}
        toogleModalVisible={recurrenceAmountEditParamsModalVisible}
        userPermissions={userPermissions}
        key={keyModalRecurrence}
        readOnly={ownerProfile !== 'Franchisor'}
      />
    </React.Fragment>  
    
  </React.Fragment>  
  )
}

ProposalQueryModal.propTypes = {
  toogleModalVisible: PropTypes.func,
  visible: PropTypes.bool,
  userPermissions: PropTypes.array,
  proposalId: PropTypes.number,
  ownerProfile: PropTypes.string,
}

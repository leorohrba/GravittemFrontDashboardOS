import commissioningCalendarMoney from '@assets/illustrations/commissioning_calendar_money.png'
import commissioningHandsMoney from '@assets/illustrations/commissioning_hands_money.png'
import React, { useState } from 'react'
import CommissioningCommissionRecurrenceAmountModal from '../modals/CommissioningCommissionRecurrenceAmountModal/CommissioningCommissionRecurrenceAmountModal'
import CommissioningConfigTotalInvoicedModal from '../modals/CommissioningConfigTotalInvoicedModal/CommissioningConfigTotalInvoicedModal'
import CommissioningRoyaltiesCard from './CommissioningRoyaltiesCard'
import PropTypes from 'prop-types'

export default function CommissioningConfig(props) {
  const { userPermissions } = props  
  const [keyModalInvoice, setKeyModalInvoice] = useState(0)
  const [keyModalRecurrence, setKeyModalRecurrence] = useState(0)
  
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
  
  const showModalInvoice = () => {
    setKeyModalInvoice(keyModalInvoice + 1)
    setTotalInvoiceModalVisible(true)
  }      

  const showModalRecurrence = () => {
    setKeyModalRecurrence(keyModalRecurrence + 1)
    setRecurrenceAmountModalVisible(true)
  }
  
  return (
    <React.Fragment>
      <h2 className="mt-5">Configuração de comissionamento</h2>
      <hr />
      <React.Fragment>
        <CommissioningConfigTotalInvoicedModal
          visible={totalInvoiceModalVisible}
          toogleModalVisible={totalInvoicedEditParamsVisible}
          userPermissions={userPermissions}
          key={keyModalInvoice}
        />
      </React.Fragment>
      <React.Fragment>
        <CommissioningCommissionRecurrenceAmountModal
          visible={recurrenceAmountModalVisible}
          toogleModalVisible={recurrenceAmountEditParamsModalVisible}
          userPermissions={userPermissions}
          key={keyModalRecurrence}
        />
      </React.Fragment>  
      <div className="flex mt-5 justify-center">
        <CommissioningRoyaltiesCard
          cardClassName="w-1/3 mr-5 text-center"
          illustration={commissioningHandsMoney}
          editParams={showModalInvoice}
          imgAlt="porcentagem royalties"
          title="Comissionamento no total faturado"
          description="Defina faixas de porcentagem em cima do total faturado e dos descontos aplicados dos seus vendedores."
          userPermissions={userPermissions}
          franchiseQty={0}
        />
        <CommissioningRoyaltiesCard
          cardClassName="w-1/3 mr-5 text-center"
          editParams={showModalRecurrence}
          illustration={commissioningCalendarMoney}
          imgAlt="dinheiro royalties"
          title="Comissionamento nas recorrências"
          description="Defina percentual de comissionamento em cima de uma quantidade de parcelas"
          userPermissions={userPermissions}
          franchiseQty={0}
        />
      </div>
    </React.Fragment>
  )
}

CommissioningConfig.propTypes = {
  userPermissions: PropTypes.array,
}


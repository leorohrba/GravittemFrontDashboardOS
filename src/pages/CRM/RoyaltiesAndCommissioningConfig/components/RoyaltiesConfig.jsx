import royaltiesMoneyIllustration from '@assets/illustrations/royalties_money.png'
import royaltiesPercentageIllustration from '@assets/illustrations/royalties_percentage.png'
import royaltiesTagIllustration from '@assets/illustrations/royalties_tag.png'
import React from 'react'
import CommissioningRoyaltiesCard from './CommissioningRoyaltiesCard'
import PropTypes from 'prop-types'

export default function RoyaltiesConfiguration(props) {
  const { userPermissions } = props
  return (
    <React.Fragment>
      <h2>Configuração de royalties</h2>
      <hr />
      <div className="flex mt-5">
        <CommissioningRoyaltiesCard
          cardClassName="w-1/3 mr-5 text-center"
          illustration={royaltiesPercentageIllustration}
          imgAlt="porcentagem royalties"
          title="Percentual sobre o faturamento"
          description="Defina faixas de porcentagem em cima do faturamento de seus franqueados"
          franchiseQty={0}
          userPermissions={userPermissions}
        />
        <CommissioningRoyaltiesCard
          cardClassName="w-1/3 mr-5 text-center"
          illustration={royaltiesMoneyIllustration}
          imgAlt="dinheiro royalties"
          title="Valor fixo e percentual de marketing"
          description="Defina um valor fixo a ser cobrado de seu franqueado junto um percentual de gastos de marketing"
          franchiseQty={0}
          userPermissions={userPermissions}
        />
        <CommissioningRoyaltiesCard
          cardClassName="w-1/3 mr-5 text-center"
          illustration={royaltiesTagIllustration}
          imgAlt="porcentagem royalties"
          title="Percentual sob a venda de produtos"
          description="Defina um percentual de cobrança em cima de produtos oferecidos para seus franqueados"
          franchiseQty={0}
          userPermissions={userPermissions}
        />
      </div>
    </React.Fragment>
  )
}

RoyaltiesConfiguration.propTypes = {
  userPermissions: PropTypes.array,
}
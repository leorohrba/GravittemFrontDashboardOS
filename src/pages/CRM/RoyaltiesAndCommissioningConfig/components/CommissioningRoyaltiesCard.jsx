import Button from '@components/Button'
import { Card } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { hasPermission } from '@utils'

export default function CommissionRoyaltiesCard({
  cardClassName,
  illustration,
  imgAlt,
  title,
  description,
  franchiseQty,
  editParams,
  userPermissions,
}) {
  return (
    <Card className={cardClassName}>
      <img src={illustration} alt={imgAlt} height={150} />
      <h3 className="mt-3">{title}</h3>
      <p className="mt-3 text-gray-600">{description}</p>
      <Button className="mr-3 iconButton" onClick={editParams}>
        {hasPermission(userPermissions, 'Include') ? 'Editar parâmetros' : 'Consultar parâmetros'}
      </Button>
      {!!franchiseQty && (
        <Button quantity={franchiseQty} className="iconButton">
          <i className="fa fa-user fa-lg mr-2" />
          Franqueados
        </Button>
      )}
    </Card>
  )
}

CommissionRoyaltiesCard.propTypes = {
  cardClassName: PropTypes.string,
  description: PropTypes.string,
  editParams: PropTypes.func,
  franchiseQty: PropTypes.number,
  illustration: PropTypes.node,
  imgAlt: PropTypes.string,
  title: PropTypes.string,
  userPermissions: PropTypes.array,
}

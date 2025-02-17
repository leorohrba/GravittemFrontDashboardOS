/**
 * breadcrumb: Configuração de royalties e comissionamento
 */
import React, { useState, useEffect } from 'react'
import CommissioningConfig from './components/CommissioningConfig'
// import RoyaltiesConfig from './components/RoyaltiesConfig'
import { getPermissions } from '@utils'

export default function RoyaltiesAndCommissioningConfig() {
 
  const [userPermissions, setUserPermissions] = useState([])
 
  useEffect(() => {
    setPermissions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }
  
  return (
    <div className="container">
       
      {/* TODO: Configurações de royaties entra na próxima etapa
      <RoyaltiesConfig userPermissions={userPermissions} /> 
      */}
      <CommissioningConfig userPermissions={userPermissions} />
    </div>
  )
}

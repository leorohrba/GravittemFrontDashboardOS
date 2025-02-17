/**
 * breadcrumb: Modelos de mensagens
 */
import React, { useState, useEffect } from 'react'
import MessageModel from './components/MessageModel'
import { getPermissions } from '@utils'

function Index() {
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
      <MessageModel
        userPermissions={userPermissions}
      />
    </div>
  )
}

export default Index

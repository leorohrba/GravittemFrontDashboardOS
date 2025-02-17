/**
 * breadcrumb: Dashboard
 */
import React, { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import {
  getPermissions
} from '@utils'


function Index() {
  
  const [userPermissions, setUserPermissions] = useState([])

  useEffect(() => {
    setPermissions()
  },[])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  return (
    <div className="container bg-gray-100">
     <Dashboard
       userPermissions={userPermissions}
     />
    </div>
  )

}

export default Index
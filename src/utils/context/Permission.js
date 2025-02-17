import { getPermissions } from '@utils/index'
import constate from 'constate'
import { useEffect, useState } from 'react'

function usePermission({ processName }) {
  const [permissions, setPermissions] = useState([])
  const [loadingPermissions, setLoadingPermissions] = useState(true)

  useEffect(() => {
    setCruPermissions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function setCruPermissions() {
    setLoadingPermissions(true)
    const userPermissions = await getPermissions(processName)
    const hasMultipleProcessesName = processName.indexOf('|') > -1
    const crudPermissions = hasMultipleProcessesName
      ? userPermissions
      : userPermissions.find(item => item.name === processName)?.permissions
    setPermissions(crudPermissions)
    setLoadingPermissions(false)
  }
  return {
    permissions,
    loadingPermissions,
  }
}

const [PermissionProvider, usePermissionContext] = constate(usePermission)

export { PermissionProvider, usePermissionContext }

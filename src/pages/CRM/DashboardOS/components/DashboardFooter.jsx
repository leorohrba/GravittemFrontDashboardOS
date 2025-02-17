import PropTypes from 'prop-types'
import React from 'react'
import { hasPermission, handleAuthError } from '@utils'
import { apiCRM } from '@services/api'
import { Tooltip, message } from 'antd'
import moment from 'moment'

export default function DashboardFooter( { logs, userPermissions, loading, setLoading, fetchData } ) {

  async function dataLoad() {
    setLoading(true)
    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/CRM/BI/DataLoad`,
        data: { type: 1 } ,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        fetchData()
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }
  
  return (
    <React.Fragment>  
        {logs?.length > 0 && (
          <div className="ml-auto mb-2" style={{ color: 'gray' }}>
            <i>
             {`Última atualização: ${logs[0].startDate ? moment(logs[0].startDate).format('DD/MM/YYYY HH:mm') : ''}`}
            </i>
            {hasPermission(userPermissions, 'Include') && (
              <Tooltip title="Fazer a carga de dados com base nos últimos dados atualizados">
                <i 
                  className="ml-2 fa fa-repeat cursor-pointer" 
                  style={{ color: 'gray' }}
                  role="button"
                  onClick={() => dataLoad()}               
                />
              </Tooltip>  
            )}
          </div>
        )}
    </React.Fragment>    
  )
}

DashboardFooter.propTypes = {
  logs: PropTypes.array,
  setLoading: PropTypes.func,
  loading: PropTypes.bool,
  userPermissions: PropTypes.array,
  fetchData: PropTypes.func,
}

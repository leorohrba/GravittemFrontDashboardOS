import Button from '@components/Button'
import { Popover, Tooltip } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { hasPermission } from '@utils'
import PropTypes from 'prop-types'

import CommunicationCollapseOptionsReadByModal from '../modals/CommunicationCollapseOptionsReadByModal'

export default function CommunicationCollapseOptions(
  {
   title, 
   sendDate, 
   communicationId, 
   confirmDelete,
   count,   
   readCount,
   readDate,
   userPermissions,
   ownerProfile,   
   editCommunication,
   setCommunicationRead,
   }) {
  
  const [modalVisible, setModalVisible] = useState(false)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [keyCollapse, setKeyCollapse] = useState(0)
  
  const toogleModalVisible = () => {
    setModalVisible(false)
  }
 
  const showConfirmDelete = () => {
     setTooltipVisible(false)
     confirmDelete(communicationId)
  }
  
  const handleVisibleChange = (visible, key) => {
    setTooltipVisible(visible)
    setKeyCollapse(key)
  }

  return (
    <React.Fragment>
      <span style={{ position: 'absolute', left: '15%' }}>{title}</span>
      <span style={{ position: 'absolute', right: '7%' }}>
        {readCount > 0 && ownerProfile && ownerProfile !== 'Franchise' && (
           <React.Fragment>
            {readCount === count ? (
                <span className="mr-2">
                   <Tooltip title={count === 1 ? 'Comunicado lido pela franquia' : 'Comunicado lido por todas as franquias'}>
                     <i className="fa fa-check" style={{color: '#4caf50'}} />
                   </Tooltip>
                </span> )
               :  
                (               
                <span className="mr-8" style={{color: 'gray'}}>
                   <i className="fa fa-check mr-1" style={{color: '#4caf50'}} />
                   {`Lido por ${readCount} de ${count} franquias`}
                </span> )
            }   
           </React.Fragment>
        )}
        {readDate && ownerProfile === 'Franchise' && (
            <span className="mr-2">
               <Tooltip title={`Lido em ${moment(readDate).format('DD/MM/YYYY HH:mm')}`}>
                 <i className="fa fa-check" style={{color: '#4caf50'}} />
               </Tooltip>
            </span> 
        )}
        <span>
          {`${moment(
            sendDate,
          ).format('D MMM YYYY')}`}
        </span>  
      </span>
      {((ownerProfile && ownerProfile !== 'Franchise') || hasPermission(userPermissions, 'Alter')) && ( 
      <Tooltip placement="top" title="Mais opções">
        <Popover
          placement="bottomLeft"
          visible={tooltipVisible && keyCollapse === communicationId}
          onVisibleChange={visible => handleVisibleChange(visible, communicationId)}          
          overlayClassName="table-popover"
          trigger="click"
          content={
            <React.Fragment>
              {hasPermission(userPermissions, 'Alter')  && ownerProfile && ownerProfile !== 'Franchise' && (
                <button
                  className="popover-button"
                  type="button"
                  onClick={event => {
                    // If you don't want click extra trigger collapse, you can prevent this:
                    event.stopPropagation()
                    setTooltipVisible(false)
                    editCommunication(communicationId)
                  }}
                >
                  Editar
                </button>
              )}
              {ownerProfile && ownerProfile !== 'Franchise' && (
                <button
                  className="popover-button"
                  type="button"
                  onClick={event => {
                    // If you don't want click extra trigger collapse, you can prevent this:
                    event.stopPropagation()
                    setTooltipVisible(false)
                    setModalVisible(true)
                  }}
                >
                  Lido por
                </button>
              )}
              {!readCount && hasPermission(userPermissions, 'Exclude') && ownerProfile && ownerProfile !== 'Franchise' && (
                <button
                  className="popover-button"
                  type="button"
                  onClick={event => {
                    // If you don't want click extra trigger collapse, you can prevent this:
                    event.stopPropagation()
                    showConfirmDelete()
                  }}
                >
                  Excluir
                </button>
              )}  
              {hasPermission(userPermissions, 'Alter') && ownerProfile === 'Franchise' && (
                <button
                  className="popover-button"
                  type="button"
                  onClick={event => {
                    // If you don't want click extra trigger collapse, you can prevent this:
                    event.stopPropagation()
                    setTooltipVisible(false)
                    setCommunicationRead(communicationId, readDate)
                  }}
                >
                 {!readDate ? 'Marcar como lido' : 'Marcar como não lido'}
                </button>
              )}  
            </React.Fragment>
          }
        >
          <Button
            className="iconButton"
            onClick={event => {
              // If you don't want click extra trigger collapse, you can prevent this:
              event.stopPropagation()
            }}
          >
            <i className="fa fa-ellipsis-v fa-lg" style={{color: 'gray'}} />
          </Button>
        </Popover>
      </Tooltip>
      )}
      <CommunicationCollapseOptionsReadByModal
        toogleModalVisible={toogleModalVisible}
        modalVisible={modalVisible}
        communicationId={communicationId}
      />

    </React.Fragment>
  )
}
CommunicationCollapseOptions.propTypes = {
  title: PropTypes.string,
  sendDate: PropTypes.string,
  communicationId: PropTypes.number,
  confirmDelete: PropTypes.func,
  readCount: PropTypes.number,
  count: PropTypes.number,
  readDate: PropTypes.string,
  editCommunication: PropTypes.func,
  ownerProfile: PropTypes.string,
  userPermissions: PropTypes.array,
  setCommunicationRead: PropTypes.func,
}

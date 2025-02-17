/* eslint-disable react/no-danger */
import { Collapse, Spin } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import CommunicationCollapseOptions from './CommunicationCollapseOptions'

const { Panel } = Collapse

export default function CommunicationCollapse({ communicationData, loading, confirmDelete, editCommunication, userPermissions, ownerProfile, setCommunicationRead }) {
  const communicationPanels = communicationData.map(item => (
    <Panel
      header={item.ownerShortName}
      key={item.communicationId}
      extra={
      <CommunicationCollapseOptions
        title={item.title}
        sendDate={item.sendDate}
        communicationId={item.communicationId}
        confirmDelete={confirmDelete}
        count={item.count}
        readDate={ownerProfile === 'Franchise' && item.franchises.length > 0 ? item.franchises[0].readDate : null}
        readCount={item.readCount}
        editCommunication={editCommunication}
        userPermissions={userPermissions}
        ownerProfile={ownerProfile}
        setCommunicationRead={setCommunicationRead}
      />}  
    >
      <p 
        style={{ paddingLeft: 24 }}
        dangerouslySetInnerHTML={{__html: item.detailsHtml}} 
      />    
    </Panel>
  ))
  return (
    <div className="mt-5">
      <Spin size="large" spinning={loading} style={{marginTop: '10%'}}>
        <Collapse className="communication-collapse">
          {communicationPanels}
        </Collapse>
      </Spin>  
    </div>
  )
}

CommunicationCollapse.propTypes = {
  communicationData: PropTypes.array,
  loading: PropTypes.bool,
  confirmDelete: PropTypes.func,
  editCommunication: PropTypes.func,
  ownerProfile: PropTypes.string,
  userPermissions: PropTypes.array,
  setCommunicationRead: PropTypes.func,
}

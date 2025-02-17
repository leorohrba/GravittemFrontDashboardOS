/* eslint-disable react/no-danger */
import { Collapse } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import MaterialsCollapseAttachments from './MaterialsCollapseAttachments'
import MaterialsCollapseOptions from './MaterialsCollapseOptions'

const { Panel } = Collapse

export default function MaterialsCollapse({ libraryData, loading, confirmDelete, editLibrary, userPermissions, ownerProfile, setLibraryRead }) {
  const libraryPanels = libraryData.map(item => (
    <Panel
      header={item.ownerShortName}
      key={item.libraryId}
      extra={
      <MaterialsCollapseOptions
        title={item.title}
        sendDate={item.sendDate}
        libraryId={item.libraryId}
        confirmDelete={confirmDelete}
        count={item.count}
        readDate={ownerProfile === 'Franchise' && item.franchises.length > 0 ? item.franchises[0].readDate : null}
        readCount={item.readCount}
        editLibrary={editLibrary}
        userPermissions={userPermissions}
        ownerProfile={ownerProfile}
        setLibraryRead={setLibraryRead}
      />}  
    >
      <p 
        style={{ paddingLeft: 24 }}
        dangerouslySetInnerHTML={{__html: item.detailsHtml}} 
      />    
      {item.attaches.length > 0 && (
        <React.Fragment>
        <hr />
        <div className="px-10 py-2">
          <h3>{item.attaches.length === 1 ? '1 anexo' : `${item.attaches.length} anexos`}</h3>
          <div className="flex">
            {item.attaches.map((record) => (
              <MaterialsCollapseAttachments
                key={record.libraryAttachId}
                extension={record.extension}
                libraryAttachId={record.libraryAttachId}
                fileName={record.fileName}
                urlFile={record.url}
              />
            ))}  
          </div>
        </div>
        </React.Fragment>
      )} 
    </Panel>
  ))
  return (
    <div className="mt-5">
      <Collapse className="library-collapse">
        {libraryPanels}
      </Collapse>
    </div>
  )
}

MaterialsCollapse.propTypes = {
  libraryData: PropTypes.array,
  loading: PropTypes.bool,
  confirmDelete: PropTypes.func,
  editLibrary: PropTypes.func,
  ownerProfile: PropTypes.string,
  userPermissions: PropTypes.array,
  setLibraryRead: PropTypes.func,
}

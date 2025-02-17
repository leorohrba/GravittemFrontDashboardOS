import React, { useState } from 'react'
import { Col, Row } from 'antd'
import CollaboratorsAutoComplete from './CollaboratorsAutoComplete'
import UsersAutoComplete from './UsersAutoComplete'

export default function PersonUserSupervisorForm({
  form,
  canBeUpdated,
  editData,
}) {
  const [collaboratorSource, setCollaboratorSource] = useState([])
  const [userSource, setUserSource] = useState([])

  return (
    <React.Fragment>
      <Row type="flex" gutter={20}>
        <Col style={{ width: '320px' }}>
          <UsersAutoComplete
            form={form}
            canBeUpdated={canBeUpdated}
            userSource={userSource}
            setUserSource={setUserSource}
            editData={editData}
          />
        </Col>
        <Col style={{ width: '310px' }}>
          <CollaboratorsAutoComplete
            form={form}
            canBeUpdated={canBeUpdated}
            collaboratorSource={collaboratorSource}
            setCollaboratorSource={setCollaboratorSource}
            editData={editData}
          />
        </Col>
      </Row>
    </React.Fragment>
  )
}

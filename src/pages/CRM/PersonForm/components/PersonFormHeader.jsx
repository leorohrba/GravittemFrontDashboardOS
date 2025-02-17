import AttachmentsModal from '@components/modals/AttachmentsModal'
import WhatsAppModal from '@components/modals/WhatsAppModal'
import CommentsModal from '@components/modals/CommentsModal'
import React, { useState } from 'react'
import { Row, Col, Spin, Menu, Dropdown, Button } from 'antd'
import PropTypes from 'prop-types'
import PersonRegionModal from './PersonRegion/PersonRegionModal'

export default function PersonFormHeader({
  personId,
  editData,
  isSaving,
  contactDataSource,
  loadingForm,
  handleCancel,
  canBeUpdated,
  ownerProfile,
  refresh,
  form,
}) {
  const [attachments, setAttachments] = useState([])
  const [signatures, setSignatures] = useState([])
  const [commentsData, setCommentsData] = useState({
    nomeUsuario: '',
    comentarios: [],
  })
  const [whatsappData, setWhatsappData] = useState([])

  const [personRegionModalVisible, setPersonRegionModalVisible] = useState(
    false,
  )

  const personMenu = (
    <Menu>
      <Menu.Item
        key="1"
        disabled={!editData?.collaboratorId}
        onClick={() => handleOpenPersonRegion()}
      >
        Regiões
      </Menu.Item>
    </Menu>
  )

  const handleOpenPersonRegion = () => {
    setPersonRegionModalVisible(true)
  }

  return (
    <React.Fragment>
      <PersonRegionModal
        collaboratorId={editData?.collaboratorId}
        canBeUpdated={canBeUpdated}
        visible={personRegionModalVisible}
        setVisible={setPersonRegionModalVisible}
      />

      <Row className="mb-10">
        <span
          className="mr-3"
          style={{ color: '#1976D2', cursor: 'pointer' }}
          onClick={e => handleCancel(e)}
          role="button"
        >
          Cadastro
        </span>
        <i className="fa fa-angle-right mr-3" />
        {loadingForm
          ? 'Carregando...'
          : personId === 0
          ? 'Criar novo cadastro'
          : canBeUpdated
          ? 'Alterar cadastro'
          : 'Consulta cadastro'}
      </Row>

      <Row type="flex" align="middle">
        <Col>
          <h2>{loadingForm ? 'Carregando...' : 'Dados principais'}</h2>
        </Col>
        <Col>
          <div
            className="px-8"
            style={{ marginTop: '5px', display: isSaving ? 'block' : 'none' }}
          >
            <Spin />
          </div>
        </Col>
        {!!personId && editData?.guidPersonId && (
          <React.Fragment>
            <Col className="ml-auto">
              <WhatsAppModal
                outerSync
                entityId={editData.guidPersonId}
                person={
                  contactDataSource.find(c => c.isMain && c.isActive) ??
                  contactDataSource.find(c => c.isActive)
                }
                {...{
                  whatsappData,
                  setWhatsappData,
                  refresh,
                }}
              />
            </Col>
            <Col className="ml-2">
              <CommentsModal
                entityId={editData.guidPersonId}
                {...{
                  commentsData,
                  setCommentsData,
                }}
              />
            </Col>
            <Col>
              <AttachmentsModal
                buttonClassName="ml-2"
                entityId={editData.guidPersonId}
                {...{
                  attachments,
                  setAttachments,
                }}
              />
            </Col>
            {form.getFieldValue('personType') === 1 &&
              form.getFieldValue('isSeller') && (
                <Col>
                  <AttachmentsModal
                    buttonClassName="ml-2"
                    signature
                    entityId={editData.guidPersonId}
                    attachments={signatures}
                    setAttachments={setSignatures}
                  />
                </Col>
              )}
            {form.getFieldValue('isCollaborator') &&
              ownerProfile &&
              ownerProfile === 'Franchisor' && (
                <Col>
                  <Dropdown overlay={personMenu}>
                    <Button className="ml-2 iconButton">
                      <i className="fa fa-ellipsis-v fa-lg" />
                    </Button>
                  </Dropdown>
                </Col>
              )}
          </React.Fragment>
        )}
      </Row>

      <hr />
    </React.Fragment>
  )
}

PersonFormHeader.propTypes = {
  isSaving: PropTypes.bool,
  loadingForm: PropTypes.bool,
  handleCancel: PropTypes.func,
  canBeUpdated: PropTypes.bool,
  personId: PropTypes.number,
  ownerProfile: PropTypes.string,
  editData: PropTypes.any,
  form: PropTypes.any,
}

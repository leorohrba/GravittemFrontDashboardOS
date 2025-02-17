/* eslint-disable no-param-reassign */
import { Form } from '@ant-design/compatible'
import Button from '@components/Button'
import { isObjEmpty, handleAuthError } from '@utils'
import { message, Modal, Row } from 'antd'
import update from 'immutability-helper'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { apiCRM } from '@services/api'
import { useDocumentsContext } from '../contexts/Documents'
import AddDocumentsModalForm from './AddDocumentsModalForm'

function AddDocumentsModal({
  form,
  documentsData,
  setDocumentsData,
  proposalId,
  refreshData,
}) {
  const {
    documentsModalVisible,
    editData,
    setDocumentsModalVisible,
    showDocumentsModal,
    documentTags,
    setDocumentTags,
  } = useDocumentsContext()

  const isInsertMode = isObjEmpty(editData)

  async function saveDocuments(shouldCloseModal) {
    if (documentTags.length === 0) {
      message.warning('É necessário adicionar um documento')
    } else {
      const values = documentTags[0]
      const body = {
        id: values.id,
        tipoDocumentoId: values.tipo ?? values.tipoId,
        tipo: values.tipo,
        tipoDescricao: values.tipoDescricao,
        codigo: values.codigo,
        documentoExterno: values.documentoExterno,
      }
      handleSave(shouldCloseModal, values, body)
    }
  }

  async function handleSave(shouldCloseModal, values, body) {
    if (isInsertMode) {
      const checkDocumentsExists = documentsData.filter(
        item => item.tipo === values.tipo && item.codigo === values.codigo,
      )
      const shouldInsert = checkDocumentsExists.length === 0

      if (shouldInsert) {
        await apiCRM
          .post('api/CRM/ProposalDocument', {
            idNegocio: proposalId,
            tipoDocumento: body.tipo,
            valor: body.codigo,
          })
          .then(response => {
            body.id = parseInt(response.data.idGenerated)
          })
          .catch(function handleError(error) {
            handleAuthError(error)
          })

        handleNewData(body)
        refreshData()
        shouldCloseModal ? setDocumentsModalVisible(false) : setDocumentTags([])
      } else {
        message.warning('Esse documento já existe, adicione outro')
      }
    } else {
      const checkDocumentsExistsAndIsNotUpdating = documentsData.filter(
        item =>
          item.tipo === values.tipo &&
          item.codigo === values.codigo &&
          item.key !== editData.key,
      )
      const shouldUpdate = checkDocumentsExistsAndIsNotUpdating.length === 0
      if (shouldUpdate) {
        apiCRM
          .post('api/CRM/ProposalDocument', {
            id: editData.id,
            idNegocio: proposalId,
            tipoDocumento: body.tipo,
            valor: body.codigo,
          })
          .catch(function handleError(error) {
            handleAuthError(error)
          })
        handleEditData(body)
        setDocumentsModalVisible(false)
      } else {
        message.warning('Esse documento já existe, adicione outro')
      }
    }
  }

  function handleNewData(body) {
    const maxIndex = documentsData.map(n => n.key)
    const newData = {
      id: body.id,
      key: Object.keys(maxIndex).length === 0 ? 0 : Math.max(...maxIndex) + 1,
      tipo: body.tipo,
      tipoDescricao: body.tipoDescricao,
      codigo: body.codigo,
      documentoExterno: body.documentoExterno,
    }
    setDocumentsData([...documentsData, newData])
    message.success(
      formatMessage({
        id: 'successSave',
      }),
    )
  }

  function handleEditData(body) {
    const index = documentsData.findIndex(d => d.key === editData.key)
    setDocumentsData(
      update(documentsData, {
        [index]: {
          tipo: { $set: body.tipo },
          tipoDescricao: { $set: body.tipoDescricao },
          codigo: { $set: body.codigo },
          documentoExterno: { $set: body.documentoExterno },
        },
      }),
    )
    message.success('Atualizado com sucesso')
  }
  return (
    <Modal
      title="Adicionar documentos"
      visible={documentsModalVisible}
      onCancel={() => showDocumentsModal({})}
      destroyOnClose
      style={{ top: '20%' }}
      footer={
        <Row type="flex">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={e => saveDocuments(true)}
            htmlType="submit"
          >
            {formatMessage({
              id: 'saveButton',
            })}
          </Button>
          {isInsertMode && (
            <Button
              ghost
              style={{
                color: '#4CAF50',
                border: '1px solid #4CAF50',
              }}
              onClick={e => saveDocuments(false)}
            >
              {formatMessage({
                id: 'saveAndAddAnother',
              })}
            </Button>
          )}
          <Button
            type="secondary"
            style={{
              marginLeft: 'auto',
            }}
            onClick={() => showDocumentsModal({})}
          >
            {formatMessage({
              id: 'cancelButton',
            })}
          </Button>
        </Row>
      }
    >
      <AddDocumentsModalForm form={form} editData={editData} />
    </Modal>
  )
}

AddDocumentsModal.propTypes = {
  form: PropTypes.object,
}

const WrappedAddDocumentsModal = Form.create()(AddDocumentsModal)

export default WrappedAddDocumentsModal

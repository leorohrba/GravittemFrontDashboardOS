import { Form } from '@ant-design/compatible'
import Document from '@components/Document'
import { isObjEmpty } from '@utils'
import PropTypes from 'prop-types'
import React from 'react'
import { useDocumentsContext } from '../contexts/Documents'

export default function AddDocumentsModalForm({ editData, form }) {
  const isEditMode = !isObjEmpty(editData)
  const { documentTags, setDocumentTags } = useDocumentsContext()

  const startSearch = () => {}
  return (
    <Form layout="vertical">
      <Document
        {...{
          documentTags,
          setDocumentTags,
        }}
        form={form}
        label="Documento"
        startSearch={startSearch}
        defaultType={isEditMode && editData?.tipoId}
        initialValue={isEditMode ? editData : ''}
      />
    </Form>
  )
}

AddDocumentsModalForm.propTypes = {
  editData: PropTypes.any,
  form: PropTypes.any,
}

import { Form } from '@ant-design/compatible'
import { apiAttendance } from '@services/api'
import { handleAuthError, showApiNotifications } from '@utils'
import { Button, Divider, message, Modal, Row, Steps} from 'antd';
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import ImportExcelStep1 from './ImportExcelModalStep1'
import ImportExcelStep2 from './ImportExcelModalStep2'
import ImportExcelStep3 from './ImportExcelModalStep3'

const { Step } = Steps

function ImportExcel({ documentId, form, visibleModal, setVisibleModal, refreshData }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [fileList, setFileList] = useState([])
  const [replaceFile, setReplaceFile] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isBackground, setIsBackground] = useState(false)

  function importFile() {
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setUploading(true)
        setCurrentStep(currentStep + 1)
        callApiImportFile()
      }
    })
  }

  async function callApiImportFile() {
    setIsSaving(true)

    const formData = new FormData()
    formData.append('documento', documentId)
    formData.append('emails', form.getFieldValue('emails'))
    formData.append('isBackground', isBackground)
    fileList.map(file => formData.append('files', file))

    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/ImportaCadastro`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setIsSaving(false)

      const { data } = response

      if (!isBackground && refreshData !== undefined) {
        refreshData()
      }

      if (data.isOk && !isBackground) {
        message.success('Importação realizada com sucesso!')
      } else if (!data.isOk) {
        showApiNotifications(data)
      }
    } catch (error) {
      console.log(error)
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  async function downloadFile() {
    setIsDownloading(true)
    try {
      const response = await apiAttendance({
        url: `/api/downloadTemplate`,
        method: 'GET',
        params: { documento: documentId },
        responseType: 'blob', // important
      })
      setIsDownloading(false)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const contentDisposition = response.headers['content-disposition']
      const fileName =
        getFileName(contentDisposition) || 'Modelo importação.xlsx'
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      setIsDownloading(false)
      handleAuthError(error)
    }
  }

  function getFileName(contentDisposition) {
    let fileName = contentDisposition.substring(
      contentDisposition.indexOf("''") + 2,
      contentDisposition.length,
    )
    fileName = decodeURI(fileName).replace(/\+/g, ' ')
    return fileName
  }

  return (
    <Modal
      title="Importar cadastro"
      width="40%"
      centered
      visible={visibleModal}
      onCancel={() => setVisibleModal(false)}
      footer={
        !uploading ? (
          <Row type="flex">
            {currentStep === 0 ? (
              <Button onClick={() => setVisibleModal(false)}>
                {formatMessage({ id: 'cancelButton' })}
              </Button>
            ) : (
              <Button onClick={() => setCurrentStep(currentStep - 1)}>
                <i className="fa fa-chevron-left mr-3" aria-hidden="true" />
                  Voltar uma etapa
              </Button>
            )}
            {currentStep !== 2 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={fileList.length === 0 && currentStep === 1}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  marginLeft: 'auto',
                }}
              >
                {formatMessage({ id: 'continueButton' })}
                <i className="fa fa-chevron-right ml-3" aria-hidden="true" />
              </Button>
            ) : (
              <Button
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  marginLeft: 'auto',
                }}
                onClick={() => importFile()}
              >
                {formatMessage({ id: 'import' })}
              </Button>
            )}
          </Row>
        ) : (
          <Button onClick={() => setVisibleModal(false)}>
            Sair
          </Button>
        )
      }
    >
      <Steps current={currentStep}>
        <Step
          Preencha
          o
          modelo
        />
        <Step
          Selecionar
          arquivo
        />
        <Step title={formatMessage({ id: 'import' })} />
      </Steps>
      <Divider />
      {currentStep === 0 ? (
        <ImportExcelStep1 {...{ downloadFile, isDownloading }} />
      ) : currentStep === 1 ? (
        <ImportExcelStep2
          {...{
            replaceFile,
            setReplaceFile,
            fileList,
            setFileList,
          }}
        />
      ) : (
        <ImportExcelStep3 {...{ uploading, form, isSaving, isBackground, setIsBackground }} />
      )}
    </Modal>
  )
}

ImportExcel.propTypes = {
  form: PropTypes.any,
  setVisibleModal: PropTypes.func,
  visibleModal: PropTypes.bool,
  refreshData: PropTypes.func,
  isBackground: PropTypes.bool,
  documentId: PropTypes.number,
}

const WrappedImportExcel = Form.create()(ImportExcel)
export default WrappedImportExcel

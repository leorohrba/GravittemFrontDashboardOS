/**
 * breadcrumb: Gerar contrato
 * hide: true
 */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from 'react'
import { Form } from '@ant-design/compatible'
import { Spin, Skeleton, Alert } from 'antd'
import {
  GenerateContractFinancial,
  GenerateContractFooter,
  GenerateContractForm,
  GenerateContractTable,
  GenerateContractHeader,
} from './components'
import {
  GenerateContractProvider,
  useGenerateContractContext,
} from './context/GenerateContract'
import PropTypes from 'prop-types'
import { withWrapper } from 'with-wrapper'
import { fieldsValidationToast } from '@utils'

function GenerateContract({ form, onClose, totalRecurrenceValue = 0 }) {
  const {
    generateIds,
    alertMessages,
    setAlertMessages,
    generateContract,
    loading,
    isSaving,
    editData,
  } = useGenerateContractContext()
  const refAlert = React.useRef()
  const refPage = React.useRef()

  useEffect(() => {
    if (alertMessages.length > 0 && refAlert.current) {
      refAlert.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [alertMessages])

  useEffect(() => {
    form.resetFields()
    if (refPage.current) {
      refPage.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [editData])

  const handleReturn = () => {
    onClose()
  }

  const handleSave = e => {
    e && e.preventDefault()
    setAlertMessages([])
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else {
        generateContract(values, handleReturn)
      }
    })
  }

  return (
    <div className="container" ref={refPage}>
      <Spin spinning={loading || isSaving} size="large">
        <GenerateContractHeader {...{ handleReturn, generateIds }} />

        <Skeleton
          loading={loading && !isSaving}
          paragraph={{ rows: 15 }}
          active
        />

        <div style={{ display: loading && !isSaving ? 'none' : 'block' }}>
          <div ref={refAlert}>
            {alertMessages.map((message, index) => (
              <Alert
                type="error"
                message={message.mensagem}
                key={index}
                showIcon
                className="mb-2"
              />
            ))}
          </div>

          <Form layout="vertical">
            <GenerateContractForm form={form} />
            <GenerateContractTable />
            <GenerateContractFinancial
              form={form}
              totalRecurrenceValue={totalRecurrenceValue}
            />
          </Form>

          <GenerateContractFooter {...{ handleSave, handleReturn }} />
        </div>
      </Spin>
    </div>
  )
}

GenerateContract.propTypes = {
  form: PropTypes.any,
  id: PropTypes.any,
  setId: PropTypes.func,
  isRouter: PropTypes.bool,
  onClose: PropTypes.func,
  totalRecurrenceValue: PropTypes.number,
}

const WrappedGenerateContractForm = Form.create()(GenerateContract)

export const WrapperGenerateContract = withWrapper((element, props) => (
  <GenerateContractProvider {...props}>{element}</GenerateContractProvider>
))(props => {
  return <WrappedGenerateContractForm {...props} />
})

export default WrapperGenerateContract

import { Button, Modal, Row } from 'antd'
import React, { useEffect } from 'react'
import CustomNotificationModalForm from './CustomNotificationModalForm'
import { timeTypes } from './enums'

export default function CustomNotificationModal({
  visibleCustomNotification,
  setVisibleCustomNotification,
  form,
  fieldName,
  notification,
  setNotification,
  notificationOptions,
}) {
  useEffect(() => {
    form.resetFields(['time', 'type'])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCustomNotification])

  function handleSubmit() {
    setNotification({
      time: form.getFieldValue('time'),
      type: form.getFieldValue('type'),
    })
    const label = `${form.getFieldValue('time')} ${
      timeTypes.find(t => t.id === form.getFieldValue('type')).name
    } antes`
    setVisibleCustomNotification(false)
    form.setFieldsValue({
      [fieldName]: {
        label: `Personalizado - ${label}`,
        value: 0,
      },
    })
  }

  function handleCancel() {
    form.setFieldsValue({
      [fieldName]: {
        label: notificationOptions.find(
          n => n.time === notification.time && n.timeType === notification.type,
        )?.description,
        value: notificationOptions.find(
          n => n.time === notification.time && n.timeType === notification.type,
        )?.description,
      },
    })
    setVisibleCustomNotification(false)
  }

  return (
    <Modal
      title="Personalizar notificação"
      visible={visibleCustomNotification}
      destroyOnClose
      onCancel={() => setVisibleCustomNotification(false)}
      footer={
        <Row type="flex">
          <Button className="formButton" onClick={e => handleSubmit(e)}>
            Salvar
          </Button>
          <Button onClick={handleCancel}>Cancelar</Button>
        </Row>
      }
    >
      <CustomNotificationModalForm {...{ form, timeTypes }} />
    </Modal>
  )
}

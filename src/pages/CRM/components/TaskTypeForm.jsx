/**
 * breadcrumb: Formulário do Cadastro de Tarefas
 */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/destructuring-assignment */
import styles from '@pages/CRM/styles.css'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Form, Button, Input, message, Modal, Radio } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

function TaskTypeFormImplement(props) {
  const icons = [
    'fa-clock-o',
    'fa-paper-plane',
    'fa-flag',
    'fa-phone',
    'fa-cutlery',
    'fa-calendar',
    'fa-mobile',
    'fa-camera',
    'fa-comments',
    'fa-address-book',
    'fa-image',
    'fa-lock',
    'fa-tag',
    'fa-briefcase',
    'fa-trophy',
    'fa-shopping-cart',
    'fa-bell',
    'fa-video-camera',
    'fa-user',
    'fa-thumbs-o-up',
  ]

  const taskTypeNameInput = useRef(null)
  const [loadingForm, setLoadingForm] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { show, taskTypeId, key } = props

  const [form] = Form.useForm()

  const handleSubmit = e => {
    e.preventDefault()
    form
      .validateFields()
      .then(async values => {
        const body = {
          taskType: {
            taskTypeId: props.taskTypeId,
            ...values,
          },
        }

        try {
          const response = await apiCRM({
            method: 'POST',
            url: `/api/crm/tasktype`,
            data: body,
            headers: { 'Content-Type': 'application/json' },
          })
          setIsSaving(false)

          const { data } = response

          if (data.isOk) {
            props.closeTaskTypeForm(true)
          } else {
            if (taskTypeNameInput.current != null) {
              taskTypeNameInput.current.focus()
            }

            message.error(data.message)
          }
        } catch (error) {
          setIsSaving(false)

          handleAuthError(error)
        }
      })
      .catch(err => handleAuthError(err))
  }

  function handleCancel() {
    props.closeTaskTypeForm(false)
  }

  useEffect(() => {
    if (show) {
      form.setFieldsValue({ taskTypeName: '', taskTypeIcon: '' })

      if (taskTypeId > 0) {
        getTaskType(props.taskTypeId)
      } else {
        setLoadingForm(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, taskTypeId])

  async function getTaskType(taskTypeId) {
    setLoadingForm(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/tasktype`,
        params: { taskTypeId },
      })
      setLoadingForm(false)
      const { data } = response

      if (data.isOk) {
        if (data.taskType.length === 0) {
          message.error(
            'Tipo de tarefa não existe ou não há permissão para acesso!',
          )
          handleCancel()
        } else {
          form.setFieldsValue({
            taskTypeName: data.taskType[0].name,
            taskTypeIcon: data.taskType[0].icon,
          })
        }
      } else {
        message.error(data.message)
        handleCancel()
      }
    } catch (error) {
      handleAuthError(error)
      handleCancel()
    }
  }

  const setFocusTaskTypeName = e => {
    e.preventDefault()
    if (taskTypeNameInput.current != null) {
      taskTypeNameInput.current.focus()
    }
  }

  return (
    <Modal
      width="570px"
      visible={show && !loadingForm}
      title="Cadastrar Tipo de Tarefa"
      onOk={handleSubmit}
      onCancel={handleCancel}
      footer={[
        <Button
          key="submit"
          type="primary"
          loading={isSaving}
          onClick={handleSubmit}
          className="formButton"
        >
          {taskTypeId === 0 ? 'Adicionar' : 'Salvar'}
        </Button>,
        <Button key="back" onClick={handleCancel}>
          Cancelar
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onSubmit={handleSubmit}>
        <Form.Item
          name="icon"
          rules={[
            {
              required: true,
              message: 'Escolha um ícone para o tipo de tarefa!',
            },
          ]}
        >
          <Radio.Group buttonStyle="outline" onChange={setFocusTaskTypeName}>
            {icons.map((icon, index) => (
              <Radio.Button
                style={{ width: '51px', borderRadius: '0px' }}
                key={index}
                value={icon}
              >
                <i className={`fa ${icon} fa-fw ${styles.crmColorIconForm}`} />
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Tipo da Tarefa"
          name="name"
          rules={[
            {
              required: true,
              message: 'A descrição do tipo de tarefa é obrigatória!',
            },
          ]}
        >
          <Input
            placeholder="Digite o tipo de tarefa"
            key={key}
            autoFocus
            ref={taskTypeNameInput}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

TaskTypeFormImplement.propTypes = {
  closeTaskTypeForm: PropTypes.func,
  key: PropTypes.number,
  show: PropTypes.bool,
  taskTypeId: PropTypes.number,
}

export default TaskTypeFormImplement

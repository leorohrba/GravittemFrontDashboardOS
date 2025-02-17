/**
 * breadcrumb: Cadastro de Motivo de Perda
 */
/* eslint-disable react/jsx-no-bind */
import DefaultTable from '@components/DefaultTable'
import styles from '@pages/CRM/styles.css'
import { apiCRM } from '@services/api'
import {
  customSort,
  getPermissions,
  handleAuthError,
  hasPermission,
} from '@utils'
import { Button, Col, message, Modal, Row, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import LossReasonForm from './components/LossReasonForm'

export default function LossReasonGrid(props) {
  const columns = [
    {
      title: 'Motivos de Perda',
      dataIndex: 'name',
      sorter: (a, b) => customSort(a.name, b.name),
      width: '90%',
    },
    {
      title: '',
      dataIndex: '',
      render: (text, record) => (
        <div>
          {record.canBeUpdated && hasPermission(userPermissions, 'Alter') && (
            <Tooltip placement="top" title="Editar">
              <Button
                shape="circle"
                size="default"
                type="primary"
                ghost
                className="iconButton"
                onClick={() => editLossReason(record.lossReasonId)}
              >
                <i
                  className={`fa fa-pencil fa-lg ${styles.crmColorIconEdit}`}
                />
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ]

  const [userPermissions, setUserPermissions] = useState([])
  const [lossReasons, setLossReasons] = useState([])
  const [loadingLossReasons, setLoadingLossReasons] = useState(true)
  const [showLossReasonForm, setShowLossReasonForm] = useState(false)
  const [lossReasonId, setLossReasonId] = useState(0)
  const [key, setKey] = useState(1)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  let lossReasonPerformed = []

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedRowKeys => onSelectChangeLossReason(selectedRowKeys),
    getCheckboxProps: record => ({
      disabled: !record.canBeUpdated, // Column configuration not to be checked
    }),
  }

  const onSelectChangeLossReason = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys)
  }

  useEffect(() => {
    setPermissions()
    getLossReasons()
  }, [])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  function editLossReason(lossReasonId) {
    setLossReasonId(lossReasonId)
    setShowLossReasonForm(true)
    setKey(key + 1)
  }

  function closeLossReasonForm(refreshData) {
    setShowLossReasonForm(false)
    if (refreshData) {
      getLossReasons()
    }
  }

  async function getLossReasons() {
    setLoadingLossReasons(true)
    setSelectedRowKeys([])

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/lossreason`,
      })

      const { data } = response

      if (data.isOk) {
        setLossReasons(data.lossReason)
        setLoadingLossReasons(false)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function confirmDeleteLossReasons() {
    Modal.confirm({
      content:
        selectedRowKeys.length === 1
          ? 'Você tem certeza que deseja excluir o motivo de perda selecionado?'
          : 'Você tem certeza que deseja excluir os motivos de perda selecionados?',
      title: 'Atenção',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteLossReasons()
      },
    })
  }

  function addLossReasonPerformed(lossReasonId) {
    lossReasonPerformed.push(lossReasonId)

    if (lossReasonPerformed.length >= selectedRowKeys.length) {
      lossReasonPerformed = []
      getLossReasons()
    }
  }

  function deleteLossReasons() {
    setLoadingLossReasons(true)
    lossReasonPerformed = []

    for (let i = 0; i < selectedRowKeys.length; i++) {
      deleteLossReason(selectedRowKeys[i])
    }
  }

  async function deleteLossReason(lossReasonId) {
    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/crm/lossreason`,
        params: { lossReasonId },
      })

      const { data } = response

      if (!data.isOk) {
        message.error(data.message)
      }

      // setLossReasonPerformed(array => array.concat(lossReasonId));
      addLossReasonPerformed(lossReasonId)
    } catch (error) {
      handleAuthError(error)
      // Adiciona à lista do mesmo jeito
      addLossReasonPerformed(lossReasonId)
    }
  }

  return (
    <React.Fragment>
      <div className="p-4">
        <Row type="flex" className="mb-2" gutter={12}>
          <Col
            style={{
              display:
                selectedRowKeys.length === 0 &&
                hasPermission(userPermissions, 'Include')
                  ? 'block'
                  : 'none',
            }}
          >
            <Button
              type="primary"
              onClick={() => editLossReason(0)}
              disabled={loadingLossReasons}
            >
              <i className="fa fa-plus fa-lg mr-3" />
              Adicionar motivo de perda
            </Button>
          </Col>
          <Col
            style={{
              display:
                selectedRowKeys.length > 0 &&
                hasPermission(userPermissions, 'Exclude')
                  ? 'block'
                  : 'none',
            }}
          >
            <Button
              type="outline"
              onClick={() => confirmDeleteLossReasons()}
              disabled={loadingLossReasons}
              style={{
                color: '#D32F2F',
                border: '1px solid #D32F2F',
              }}
            >
              <i
                className="fa fa-trash fa-lg mr-3"
                size="default"
                ghost
                style={{
                  color: '#D32F2F',
                }}
              />
              {`Excluir (${selectedRowKeys.length})`}
            </Button>
          </Col>
        </Row>

        <div>
          <DefaultTable
            rowKey={record => record.lossReasonId}
            loading={loadingLossReasons}
            rowSelection={
              hasPermission(userPermissions, 'Exclude')
                ? rowSelection
                : undefined
            }
            columns={columns}
            dataSource={lossReasons}
          />
        </div>

        <LossReasonForm
          show={showLossReasonForm}
          lossReasonId={lossReasonId}
          closeLossReasonForm={closeLossReasonForm}
          key={key}
        />
      </div>
    </React.Fragment>
  )
}

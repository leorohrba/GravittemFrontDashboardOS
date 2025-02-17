/**
 * breadcrumb: Grid de Etapas do Funil Negócio
 */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-bind */
import React, { useEffect, useState } from 'react'
import DefaultTable from '@components/DefaultTable'
import styles from '@pages/CRM/styles.css'
import { apiCRM } from '@services/api'
import { handleAuthError, hasPermission } from '@utils'
import { Button, Col, Modal, Row, Tooltip, message } from 'antd'
import { BorderBottomOutlined } from '@ant-design/icons'

import PropTypes from 'prop-types'
import ReactDragListView from 'react-drag-listview'

import FunnelStageForm from './FunnelStageForm'

export default function FunnelStageGrid(props) {
  const {
    loading,
    dataSource,
    salesFunnelId,
    index,
    canBeUpdated,
    userPermissions,
    onChangeSalesFunnel,
  } = props

  const columns = [
    {
      title: 'Etapas do funil',
      dataIndex: 'name',
      render: (text, record) => (
        <div>
          <i
            className={`mr-4 fa ${record.icon} fa-lg fa-fw ${styles.crmColorIconGrid}`}
          />
          {record.name}
        </div>
      ),
      width: '85%',
    },
    {
      title: '',
      dataIndex: '',
      render: (text, record) => (
        <React.Fragment>
          {canBeUpdated && hasPermission(userPermissions, 'AlterFunnelStage') && (
            <Row gutter={10}>
              <Col>
                <Tooltip placement="top" title="Mover">
                  <span
                    style={{ padding: '5px' }}
                    className="drag-handle ant-btn iconButton pt-1"
                  >
                    <BorderBottomOutlined
                      style={{ fontSize: '20px', textAlign: 'center' }}
                    />
                  </span>
                </Tooltip>
              </Col>
              <Col>
                <Tooltip placement="top" title="Editar">
                  <Button
                    shape="circle"
                    size="middle"
                    type="primary"
                    ghost
                    style={{ width: '32px', height: '35px' }}
                    className="iconButton"
                    onClick={() => editFunnelStage(record.funnelStageId)}
                  >
                    <i
                      className={`fa fa-pencil fa-lg ${styles.crmColorIconEdit}`}
                    />
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          )}
        </React.Fragment>
      ),
    },
  ]

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [funnelStageId, setFunnelStageId] = useState(0)
  const [key, setKey] = useState(1)
  const [showFunnelStageForm, setShowFunnelStageForm] = useState(false)
  const [loadingFunnelStages, setLoadingFunnelStages] = useState(false)

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedRowKeys => onSelectChangeFunnelStage(selectedRowKeys),
  }

  const onSelectChangeFunnelStage = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys)
  }

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      props.reOrderFunnelStage(fromIndex, toIndex, index)
    },
    handleSelector: 'span',
  }

  useEffect(() => {
    setSelectedRowKeys([])
  }, [key])

  function editFunnelStage(funnelStageId) {
    setFunnelStageId(funnelStageId)
    setShowFunnelStageForm(true)
    setKey(key + 1)
  }

  function closeFunnelStageForm(refreshData) {
    setShowFunnelStageForm(false)
    if (refreshData) {
      props.refreshSalesFunnel()
    }
  }

  function confirmDeleteFunnelStages() {
    Modal.confirm({
      content:
        selectedRowKeys.length === 1
          ? 'Você tem certeza que deseja excluir a etapa selecionada?'
          : 'Você tem certeza que deseja excluir as etapas selecionadas?',
      title: 'Atenção',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteFunnelStages()
      },
    })
  }

  async function deleteFunnelStages() {
    setLoadingFunnelStages(true)
    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/crm/funnelstage`,
        data: { funnelStageId: selectedRowKeys },
      })

      setLoadingFunnelStages(false)

      const { data } = response

      if (!data.isOk) {
        message.error(data.message)
      }

      setSelectedRowKeys([])
      props.refreshSalesFunnel()
    } catch (error) {
      handleAuthError(error)
    }
  }

  return (
    <div className="">
      {canBeUpdated && (
        <Row className="mb-2" gutter={12}>
          <Col
            style={{
              display:
                selectedRowKeys.length === 0 &&
                hasPermission(userPermissions, 'IncludeFunnelStage')
                  ? 'block'
                  : 'none',
            }}
          >
            <Button
              type="default"
              className={`${styles.crmColorIconGrid}`}
              onClick={() => editFunnelStage(0)}
              disabled={loading || loadingFunnelStages}
            >
              <i className="fa fa-plus mr-3"> </i>
              Adicionar etapa
            </Button>
          </Col>
          <Col
            style={{
              display:
                selectedRowKeys.length === 0 &&
                hasPermission(userPermissions, 'Alter')
                  ? 'block'
                  : 'none',
            }}
          >
            <Button
              className={`${styles.crmColorIconGrid}`}
              onClick={() => onChangeSalesFunnel(salesFunnelId)}
              disabled={loading || loadingFunnelStages}
            >
              <i className="fa fa-pencil mr-3"> </i>
              Editar funil
            </Button>
          </Col>
          <Col
            style={{
              display:
                selectedRowKeys.length > 0 &&
                hasPermission(userPermissions, 'ExcludeFunnelStage')
                  ? 'block'
                  : 'none',
            }}
          >
            <Button
              type="default"
              onClick={() => confirmDeleteFunnelStages()}
              disabled={loading || loadingFunnelStages}
            >
              <i className="fa fa-pencil mr-3" />
              {`Excluir (${selectedRowKeys.length})`}
            </Button>
          </Col>
        </Row>
      )}

      <div className="w-full">
        <ReactDragListView {...dragProps}>
          <DefaultTable
            className="w-full"
            rowKey={record => record.funnelStageId}
            loading={loading || loadingFunnelStages}
            columns={columns}
            rowSelection={
              canBeUpdated &&
              hasPermission(userPermissions, 'ExcludeFunnelStage')
                ? rowSelection
                : null
            }
            dataSource={dataSource}
          />
        </ReactDragListView>
      </div>

      <FunnelStageForm
        show={showFunnelStageForm}
        funnelStageId={funnelStageId}
        salesFunnelId={salesFunnelId}
        closeFunnelStageForm={closeFunnelStageForm}
        key={key}
      />
    </div>
  )
}

FunnelStageGrid.propTypes = {
  canBeUpdated: PropTypes.bool,
  dataSource: PropTypes.object,
  index: PropTypes.any,
  key: PropTypes.number,
  loading: PropTypes.bool,
  reOrderFunnelStage: PropTypes.func,
  refreshSalesFunnel: PropTypes.func,
  salesFunnelId: PropTypes.number,
  userPermissions: PropTypes.array,
  onChangeSalesFunnel: PropTypes.func,
}

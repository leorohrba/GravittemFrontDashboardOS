/**
 * breadcrumb: Cadastro de Funil de Negócios
 */
/* eslint-disable react/jsx-no-bind */
import { apiCRM } from '@services/api'
import {
  handleAuthError,
  hasPermission,
  NoVisualize,
  getPermissions,
} from '@utils'
import {
  PermissionProvider,
  // usePermissionContext,
} from '@utils/context/Permission'
import { withWrapper } from 'with-wrapper'
import { Button, Col, message, Modal, Row, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import FunnelStageGrid from './components/FunnelStageGrid'
import SalesFunnelForm from './components/SalesFunnelForm'
import { IFunnelStage, ISalesFunnel } from './interfaces'

const { TabPane } = Tabs

let ownerProfile = ''

function SalesFunnelGrid() {
  const [salesFunnelId, setSalesFunnelId] = useState(0)
  const [salesFunnel, setSalesFunnel] = useState<ISalesFunnel[]>([])
  const [loadingSalesFunnel, setLoadingSalesFunnel] = useState(true)
  const [key, setKey] = useState(1)
  const [showSalesFunnelForm, setShowSalesFunnelForm] = useState(false)
  const [keyFunnelStageGrid, setKeyFunnelStageGrid] = useState(1)
  const [userPermissions, setUserPermissions] = useState()
  // const { permissions } = usePermissionContext()

  useEffect(() => {
    setPermissions()
    getOwnerProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  async function getOwnerProfile() {
    setLoadingSalesFunnel(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/owner`,
      })

      const { data } = response

      if (data.isOk) {
        // eslint-disable-next-line prefer-destructuring
        ownerProfile = data.ownerProfile
        getSalesFunnel()
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getSalesFunnel() {
    setLoadingSalesFunnel(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/salesfunnel`,
        params: { useFilterType: ownerProfile === 'Franchise' ? true : null },
      })

      const { data } = response
      if (data.isOk) {
        setSalesFunnel([...data?.salesFunnel])
        setKeyFunnelStageGrid(keyFunnelStageGrid + 1)
        setLoadingSalesFunnel(false)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function editSalesFunnel(id) {
    setSalesFunnelId(id)
    setShowSalesFunnelForm(true)
    setKey(key + 1)
  }

  function closeSalesFunnelForm(refreshData) {
    setShowSalesFunnelForm(false)
    if (refreshData) {
      getSalesFunnel()
    }
  }

  async function reOrderFunnelStage(fromIndex, toIndex, index) {
    setLoadingSalesFunnel(true)

    const tableData = salesFunnel[index].funnelStage.slice(0)
    const item = tableData.splice(fromIndex, 1)[0]
    tableData.splice(toIndex, 0, item)

    const funnelStage: IFunnelStage[] = []
    let order = 0

    for (let i = 0; i < tableData.length; i++) {
      order++
      const rowData: IFunnelStage = {
        salesFunnelId: salesFunnel[index].salesFunnelId,
        funnelStageId: tableData[i].funnelStageId,
        name: tableData[i].name,
        icon: tableData[i].icon,
        order,
      }
      funnelStage.push(rowData)
    }
    const funnelStageBody = { funnelStage }

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/funnelstage`,
        data: funnelStageBody,
        headers: { 'Content-Type': 'application/json' },
      })

      const { data } = response

      setLoadingSalesFunnel(false)

      if (data.isOk) {
        getSalesFunnel()
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoadingSalesFunnel(false)
      handleAuthError(error)
    }
  }

  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      editSalesFunnel(0)
    } else if (action === 'remove') {
      confirmDeleteSalesFunnel(parseInt(targetKey, 10))
    }
  }

  const onChangeSalesFunnel = id => {
    editSalesFunnel(id)
  }

  function confirmDeleteSalesFunnel(id) {
    const record = salesFunnel.find(x => x.salesFunnelId === id)
    if (record) {
      if (!record.canBeUpdated) {
        message.error('Funil não pode ser excluido!')
        return
      }

      Modal.confirm({
        content: `Deseja realmente excluir o funil: ${record.title}?`,
        title: 'Atenção',
        okText: 'Sim',
        okType: 'danger',
        cancelText: 'Não',
        onOk: () => {
          deleteSalesFunnel(id)
        },
      })
    }
  }

  async function deleteSalesFunnel(id) {
    setLoadingSalesFunnel(true)

    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/crm/salesFunnel`,
        params: { salesFunnelId: id },
      })

      setLoadingSalesFunnel(false)

      const { data } = response

      if (!data.isOk) {
        message.error(data.message)
      } else {
        getSalesFunnel()
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  return hasPermission(userPermissions, 'Visualize') ? (
    <React.Fragment>
      <div className="p-4">
        <Row className="mb-4" gutter={12}>
          <Col
            style={{
              display: hasPermission(userPermissions, 'IncludeSalesFunnel')
                ? 'block'
                : 'none',
            }}
          >
            <Button
              type="primary"
              onClick={() => editSalesFunnel(0)}
              disabled={loadingSalesFunnel}
            >
              <i className="fa fa-filter fa-lg mr-3" />
              Adicionar novo funil
            </Button>
          </Col>
        </Row>

        <div>
          <Tabs
            type={
              hasPermission(userPermissions, 'IncludeSalesFunnel')
                ? 'editable-card'
                : 'card'
            }
            onEdit={onEdit}
          >
            {salesFunnel?.map((funnel, index) => (
              <TabPane
                tab={funnel?.title}
                key={funnel?.salesFunnelId}
                closable={
                  funnel?.canBeDeleted &&
                  hasPermission(userPermissions, 'ExcludeSalesFunnel')
                }
              >
                <div className="p-2">
                  <FunnelStageGrid
                    salesFunnelId={funnel?.salesFunnelId}
                    canBeUpdated={funnel?.canBeUpdated}
                    loading={loadingSalesFunnel}
                    dataSource={funnel?.funnelStage}
                    refreshSalesFunnel={getSalesFunnel}
                    key={keyFunnelStageGrid}
                    index={index}
                    userPermissions={userPermissions}
                    reOrderFunnelStage={reOrderFunnelStage}
                    onChangeSalesFunnel={onChangeSalesFunnel}
                  />
                </div>
              </TabPane>
            ))}
          </Tabs>
        </div>
        {hasPermission(userPermissions, 'IncludeSalesFunnel') && (
          <SalesFunnelForm
            show={showSalesFunnelForm}
            salesFunnelId={salesFunnelId}
            closeSalesFunnelForm={closeSalesFunnelForm}
            ownerProfile={ownerProfile}
            key={key}
          />
        )}
      </div>
    </React.Fragment>
  ) : (
    <NoVisualize userPermissions={userPermissions} />
  )
}

export const WrapperSalesFunnelGrid = withWrapper((element, props) => (
  <PermissionProvider processName="SalesFunnel">{element}</PermissionProvider>
))(props => {
  return (
    <div className="container">
      <SalesFunnelGrid />
    </div>
  )
})

export default WrapperSalesFunnelGrid

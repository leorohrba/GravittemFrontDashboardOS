/**
 * breadcrumb: Cadastro de Itens
 */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import DefaultTable from '@components/DefaultTable'
import ConfigurationModal from '@components/modals/ConfigurationModal'
import NewSimpleSearch from '@components/NewSimpleSearch'
import styles from '@pages/CRM/styles.css'
import { apiCRM } from '@services/api'
import ItensModal from './components/ItensModal'
import { postItemPriceList, getDefaultOptions } from './service'
import {
  getInitialSearch,
  getPermissions,
  handleAuthError,
  hasPermission,
  setParamValues,
  useGetColumnsConfiguration,
} from '@utils'
import { itemGridColumns } from '@utils/columns/itemGrid'
import {
  Form,
  Button,
  Col,
  Dropdown,
  Menu,
  message,
  Modal,
  Row,
  Tooltip,
} from 'antd'
import ReactExport from 'react-data-export'
import moment from 'moment'
import ItemForm from './Detail/ItemForm'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

let params = {}

export default function ItemGrid(props) {
  const clearParams = () => {
    params = {
      itemId: null,
      code: '',
      type: '',
      name: '',
      queryOperator: 'like',
      getPriceList: true,
      materialTypeId: null,
      status: null,
    }
  }

  const [dataSet, setDataSet] = useState([{ columns: [], data: [] }])
  const [updateColumnsKey, setUpdateColumnsKey] = useState(0)
  const [
    serverColumns,
    loadingColumns,
    getColumns,
  ] = useGetColumnsConfiguration(apiCRM, `ItemGrid`, itemGridColumns())

  useEffect(() => {
    getColumns()
  }, [updateColumnsKey])

  const columns = [
    ...serverColumns,
    {
      title: '',
      width: 60,
      fixed: 'right',
      render: (text, record) => (
        <div>
          <Tooltip
            placement="top"
            title={
              record.canBeUpdated && hasPermission(userPermissions, 'Alter')
                ? 'Editar'
                : 'Consultar'
            }
          >
            <Button
              shape="circle"
              size="default"
              type="primary"
              ghost
              className="iconButton"
              onClick={() => handleEditItem(record)}
            >
              <i
                className={
                  record.canBeUpdated && hasPermission(userPermissions, 'Alter')
                    ? `fa fa-pencil fa-lg ${styles.crmColorIconEdit}`
                    : `fa fa-search fa-lg ${styles.crmColorIconEdit}`
                }
              />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ]

  const [screen, setScreen] = useState('Grid')
  const [tags, setTags] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [items, setItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [keySearch, setKeySearch] = useState(0)
  const [searchOptions, setSearchOptions] = useState([])
  const [visibleConfigurationModal, setVisibleConfigurationModal] = useState(
    false,
  )
  const [editData, setEditData] = useState()
  const [reloadTableKey, setReloadTableKey] = useState(0)
  const [selectedRows, setSelectedRows] = useState([])
  const [form] = Form.useForm()
  const [visibleModal, setVisibleModal] = useState(false)
  const [formModal] = Form.useForm()
  const [success, setSuccess] = useState(false)
  let itemPerformed = []

  // eslint-disable-next-line no-unused-vars
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows)
      setSelectedRowKeys(selectedRowKeys)
    },
    getCheckboxProps: record => ({
      disabled: !record.canBeUpdated, // Column configuration not to be checked
    }),
  }

  const handlerCancelModal = () => {
    setVisibleModal(false)
    formModal.resetFields()
  }

  const onFinish = async value => {
    const { listPrice, alter } = value
    if (alter == 2) {
      const data = selectedRows.map(item => {
        return {
          itemId: item?.itemId,
          priceListId: listPrice,
          type: item?.type,
        }
      })
      await postItemPriceList(data, setSuccess)
    } else {
      handlerCancelModal()
    }
  }

  function buildDataToExport() {
    const dataSetToExport = [
      {
        columns: serverColumns.map(c => c.nomeColuna),
        data: [],
      },
    ]

    items.map(rowData =>
      dataSetToExport[0].data.push(
        serverColumns.map(c =>
          c.dataIndex === 'isRecurrence'
            ? rowData.isRecurrence
              ? 'Recorrente'
              : 'Único'
            : c.dataIndex === 'type'
            ? rowData.type === 'Product'
              ? 'Produto'
              : 'Serviço'
            : c.dataIndex === 'isActive'
            ? rowData.isActive
              ? 'Ativo'
              : 'Inativo'
            : rowData[c.dataIndex],
        ),
      ),
    )

    setDataSet(dataSetToExport)
  }

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  async function getItems() {
    setLoadingItems(true)
    setSelectedRowKeys([])
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/item`,
        params,
      })

      const { data } = response

      if (data.isOk) {
        setItems(data.item)
        setLoadingItems(false)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function confirmDeleteItems() {
    Modal.confirm({
      content:
        selectedRowKeys.length === 1
          ? 'Você tem certeza que deseja excluir o item selecionado?'
          : 'Você tem certeza que deseja excluir os items selecionados?',
      title: 'Atenção',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteItems()
      },
    })
  }

  function addItemPerformed(itemId) {
    itemPerformed.push(itemId)

    if (itemPerformed.length >= selectedRowKeys.length) {
      itemPerformed = []
      getItems()
      setKeySearch(keySearch + 1)
    }
  }

  function deleteItems() {
    setLoadingItems(true)
    itemPerformed = []

    selectedRowKeys.map(selectedRowKey => deleteItem(selectedRowKey))
  }

  async function deleteItem(itemId) {
    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/crm/item`,
        params: { itemId },
      })

      const { data } = response

      if (!data.isOk) {
        message.error(data.message)
      }

      // setItemPerformed(array => array.concat(itemId));
      addItemPerformed(itemId)
    } catch (error) {
      handleAuthError(error)
      // Adiciona à lista do mesmo jeito
      addItemPerformed(itemId)
    }
  }

  function startSearch(fieldName, searchFieldValue) {
    clearParams()
    setParamValues(params, searchOptions, tags)
    getItems()
  }

  const handleAddItem = () => {
    setEditData(null)
    form.resetFields()
    setScreen('Add')
  }

  const handleEditItem = value => {
    setEditData(null)
    form.resetFields()
    setScreen('Edit')
    setEditData(value)
  }

  useEffect(() => {
    buildDataToExport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  useEffect(() => {
    setPermissions()
    clearParams()
    getDefaultOptions(setSearchOptions)
    getInitialSearch('ItemGrid', 'crm', setTags, startSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (tags.length > 0) {
      startSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags])

  useEffect(() => {
    reloadTableKey > 0 && getItems()
  }, [reloadTableKey])

  const menu = (
    <Menu>
      <Menu.Item onClick={() => setVisibleConfigurationModal(true)}>
        Configurações
      </Menu.Item>
    </Menu>
  )

  useEffect(() => {
    if (!success) {
      getItems()
      setVisibleModal(false)
      formModal.resetFields()
      setSelectedRowKeys([])
      setSelectedRows([])
    }
  }, [success])

  return screen === 'Grid' ? (
    <React.Fragment>
      <ConfigurationModal
        {...{
          visibleConfigurationModal,
          setVisibleConfigurationModal,
          setUpdateColumnsKey,
        }}
        screenName="ItemGrid"
        tableName="ItemGrid"
        defaultColumns={itemGridColumns()}
        microserviceName="crm"
        microserviceOrigin={apiCRM}
      />
      <div className="p-4 container">
        <Row className="mb-4">
          <Col className="ml-auto" style={{ width: '580px' }}>
            <NewSimpleSearch
              searchOptions={searchOptions}
              setTags={setTags}
              tags={tags}
              // eslint-disable-next-line react/jsx-no-bind
              startSearch={startSearch}
              // hideSaveSearch
              getSelectLabel
              selectOptionsWidth={190}
              screenName="ItemGrid"
            />
          </Col>
        </Row>
        <Row type="flex" className="mb-4" gutter={12}>
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
              disabled={loadingItems}
              onClick={() => handleAddItem()}
            >
              <i className="fa fa-plus mr-3" />
              Novo produto ou serviço
            </Button>
          </Col>
          {hasPermission(userPermissions, 'ExportExcel') && (
            <ExcelFile
              filename={`${moment().format(
                'DD_MM_YYYY_HHmm',
              )}_produtos_servicos`}
              element={
                <Button
                  className="mr-3"
                  disabled={loadingColumns}
                  type="outline"
                >
                  <i
                    className={`fa fa-download mr-3 fa-lg ${styles.crmColorIconEdit}`}
                  />
                  Exportar
                </Button>
              }
            >
              <ExcelSheet dataSet={dataSet} name="Negócios" />
            </ExcelFile>
          )}
          {/* Botão de excluir Inativopor tempo indeterminado */}
          <Col
            style={{
              display:
                false &&
                selectedRowKeys.length > 0 &&
                hasPermission(userPermissions, 'Exclude')
                  ? 'block'
                  : 'none',
            }}
          >
            <Button
              type="outline"
              onClick={() => confirmDeleteItems()}
              disabled={loadingItems}
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
          {selectedRowKeys.length > 1 && (
            <Button
              className="ml-3"
              disabled={loadingColumns}
              type="outline"
              onClick={() => setVisibleModal(true)}
            >
              <i className="fa fa-edit fa-lg mr-3" style={{ color: 'gray' }} />
              Editar lote {`(${selectedRowKeys.length})`}
            </Button>
          )}
          <Dropdown overlay={menu}>
            <Button className="iconButton ml-auto">
              <i className="fa fa-ellipsis-v fa-lg" style={{ color: 'gray' }} />
            </Button>
          </Dropdown>
        </Row>
        <ItensModal
          visibleModal={visibleModal}
          formModal={formModal}
          handlerCancelModal={handlerCancelModal}
          onFinish={onFinish}
          selectedRowKeys={selectedRowKeys}
          spin={success}
        ></ItensModal>
        <DefaultTable
          rowKey={record => record.itemId}
          rowSelection={rowSelection}
          loading={loadingItems || loadingColumns}
          columns={columns}
          dataSource={items}
          sticky
        />
      </div>
    </React.Fragment>
  ) : (
    <ItemForm
      {...{
        form,
        setScreen,
        editData,
        setEditData,
        reloadTableKey,
        setReloadTableKey,
      }}
    />
  )
}

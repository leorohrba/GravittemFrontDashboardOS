import { apiCRM } from '@services/api'
import { getPermissions, handleAuthError, showApiMessages } from '@utils'
import { message, Modal, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import BusinessAreaHeader from './BusinessAreaHeader'
import BusinessAreaTable from './BusinessAreaTable'
import BusinessAreaEditModal from '../modals/BusinessAreaEditModal'

const { confirm } = Modal

function BusinessArea() {
  
  const [userPermissions, setUserPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [keyTable, setKeyTable] = useState(0)
  const [selectedRows, setSelectedRows] = useState([])
  const [data, setData] = useState([])
  const [dataExport, setDataExport] = useState([])
  const [businessAreaId, setBusinessAreaId] = useState(null)
  const [keyModal, setKeyModal] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    getData()
    setPermissions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }
  
  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  useEffect(() => {
    const source = [
      {
        columns: [
          'Descrição',
        ],
        data: [],
      },
    ]

    data.map(d =>
      source[0].data.push([
        d.descricao,
      ]),
    )

    setDataExport(source)
  }, [data])

  async function getData() {
    setLoading(true)
    setSelectedRows([])
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/AreaNegocio`,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        setData(data.areaNegocio)
        setKeyTable(keyTable + 1)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function confirmDeleteBusinessArea() {
    confirm({
      title: formatMessage({
        id:
          selectedRows.length === 1
            ? 'confirmDeleteSingular'
            : 'confirmDeletePlural',
      }),
      onOk: () => deleteBusinessArea(),
      okType: 'danger',
      cancelText: 'Não',
      okText: 'Sim',
      okButtonProps: { size: 'large' },
      cancelButtonProps: { size: 'large' },
    })
  }
  async function deleteBusinessArea() {
    setLoading(true)
    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/CRM/AreaNegocio`,
        data: { ids: selectedRows.map(record => record.id) },
        headers: { 'Content-Type': 'application/json' },
      })

      setLoading(false)

      const { data } = response

      if (data.isOk) {
        getData()
        message.success(
          formatMessage({
            id: 'successDelete',
          }),
        )
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  const editBusinessArea = id => {
    setBusinessAreaId(id)
    setModalVisible(true)
    setKeyModal(keyModal + 1)
  }

  return (
    <div className="container">
      <Spin spinning={loading} size="large">
        
        <BusinessAreaEditModal
          visible={modalVisible}
          businessAreaId={businessAreaId}
          key={keyModal}
          setVisible={setModalVisible}
          userPermissions={userPermissions}
          refreshGrid={() => getData()}
        />
        
        <BusinessAreaHeader
          editBusinessArea={editBusinessArea}
          selectedRows={selectedRows}
          confirmDeleteBusinessArea={confirmDeleteBusinessArea}
          userPermissions={userPermissions}
          dataExport={dataExport}
        />
        
        <BusinessAreaTable
          data={data}
          userPermissions={userPermissions}
          editBusinessArea={editBusinessArea}
          rowSelection={rowSelection}
          keyTable={keyTable}
          loading={loading}
        />
      </Spin>
    </div>
  )
}

export default BusinessArea

import { apiCRM } from '@services/api'
import { getPermissions, handleAuthError, showApiMessages } from '@utils'
import { message, Modal, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import MarketSegmentHeader from './MarketSegmentHeader'
import MarketSegmentTable from './MarketSegmentTable'
import MarketSegmentEditModal from '../modals/MarketSegmentEditModal'

const { confirm } = Modal

function MarketSegment() {
  
  const [userPermissions, setUserPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [keyTable, setKeyTable] = useState(0)
  const [selectedRows, setSelectedRows] = useState([])
  const [data, setData] = useState([])
  const [dataExport, setDataExport] = useState([])
  const [marketSegmentId, setMarketSegmentId] = useState(null)
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
        url: `/api/CRM/SegmentoMercado`,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        setData(data.segmentoMercado)
        setKeyTable(keyTable + 1)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function confirmDeleteMarketSegment() {
    confirm({
      title: formatMessage({
        id:
          selectedRows.length === 1
            ? 'confirmDeleteSingular'
            : 'confirmDeletePlural',
      }),
      onOk: () => deleteMarketSegment(),
      okType: 'danger',
      cancelText: 'Não',
      okText: 'Sim',
      okButtonProps: { size: 'large' },
      cancelButtonProps: { size: 'large' },
    })
  }
  async function deleteMarketSegment() {
    setLoading(true)
    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/CRM/SegmentoMercado`,
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

  const editMarketSegment = id => {
    setMarketSegmentId(id)
    setModalVisible(true)
    setKeyModal(keyModal + 1)
  }

  return (
    <div className="container">
      <Spin spinning={loading} size="large">
        
        <MarketSegmentEditModal
          visible={modalVisible}
          marketSegmentId={marketSegmentId}
          key={keyModal}
          setVisible={setModalVisible}
          userPermissions={userPermissions}
          refreshGrid={() => getData()}
        />
        
        <MarketSegmentHeader
          editMarketSegment={editMarketSegment}
          selectedRows={selectedRows}
          confirmDeleteMarketSegment={confirmDeleteMarketSegment}
          userPermissions={userPermissions}
          dataExport={dataExport}
        />
        
        <MarketSegmentTable
          data={data}
          userPermissions={userPermissions}
          editMarketSegment={editMarketSegment}
          rowSelection={rowSelection}
          keyTable={keyTable}
          loading={loading}
        />
      </Spin>
    </div>
  )
}

export default MarketSegment

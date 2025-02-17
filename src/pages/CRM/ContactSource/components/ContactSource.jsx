import { apiCRM } from '@services/api'
import { getPermissions, handleAuthError, showApiMessages } from '@utils'
import { message, Modal, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import ContactSourceHeader from './ContactSourceHeader'
import ContactSourceTable from './ContactSourceTable'
import ContactSourceEditModal from '../modals/ContactSourceEditModal'

const { confirm } = Modal

function ContactSource() {
  
  const [userPermissions, setUserPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [keyTable, setKeyTable] = useState(0)
  const [selectedRows, setSelectedRows] = useState([])
  const [data, setData] = useState([])
  const [dataExport, setDataExport] = useState([])
  const [contactSourceId, setContactSourceId] = useState(null)
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
        url: `/api/CRM/OrigemContato`,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        setData(data.origemContato)
        setKeyTable(keyTable + 1)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function confirmDeleteContactSource() {
    confirm({
      title: formatMessage({
        id:
          selectedRows.length === 1
            ? 'confirmDeleteSingular'
            : 'confirmDeletePlural',
      }),
      onOk: () => deleteContactSource(),
      okType: 'danger',
      cancelText: 'Não',
      okText: 'Sim',
      okButtonProps: { size: 'large' },
      cancelButtonProps: { size: 'large' },
    })
  }
  async function deleteContactSource() {
    setLoading(true)
    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/CRM/OrigemContato`,
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

  const editContactSource = id => {
    setContactSourceId(id)
    setModalVisible(true)
    setKeyModal(keyModal + 1)
  }

  return (
    <div className="container">
      <Spin spinning={loading} size="large">
        
        <ContactSourceEditModal
          visible={modalVisible}
          contactSourceId={contactSourceId}
          key={keyModal}
          setVisible={setModalVisible}
          userPermissions={userPermissions}
          refreshGrid={() => getData()}
        />
        
        <ContactSourceHeader
          editContactSource={editContactSource}
          selectedRows={selectedRows}
          confirmDeleteContactSource={confirmDeleteContactSource}
          userPermissions={userPermissions}
          dataExport={dataExport}
        />
        
        <ContactSourceTable
          data={data}
          userPermissions={userPermissions}
          editContactSource={editContactSource}
          rowSelection={rowSelection}
          keyTable={keyTable}
          loading={loading}
        />
      </Spin>
    </div>
  )
}

export default ContactSource

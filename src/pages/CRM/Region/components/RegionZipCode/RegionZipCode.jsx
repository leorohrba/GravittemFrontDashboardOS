import { apiRegion } from '@services/api'
import { handleAuthError, showApiMessages, showApiNotifications } from '@utils'
import { message, Modal, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import PropTypes from 'prop-types'
import RegionZipCodeHeader from './RegionZipCodeHeader'
import RegionZipCodeTable from './RegionZipCodeTable'
import NewRegionZipCodeModal from './modals/NewRegionZipCodeModal'

const { confirm } = Modal

function RegionZipCode({ regionId, regionName, userPermissions, keyRegionZipCode }) {
  
  const [loading, setLoading] = useState(false)
  const [keyTable, setKeyTable] = useState(0)
  const [selectedRows, setSelectedRows] = useState([])
  const [data, setData] = useState([])
  const [dataExport, setDataExport] = useState([])
  const [searchValue, setSearchValue] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  
  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  useEffect(() => {
    if (keyRegionZipCode > 0) {
      getData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyRegionZipCode])
  
  useEffect(() => {
    if (dataExport.length > 0) {
      dataExport[0].columns[0] = regionName
      setDataExport([...dataExport])
    }      
   // eslint-disable-next-line react-hooks/exhaustive-deps  
  },[regionName])
  
  useEffect(() => {
    const source = [
      {
        columns: [
          regionName,
        ],
        data: [],
      },
      {
        ySteps: 1,
        columns: [
          'Cep',
          'Rua',
          'Complemento',
          'Bairro',
          'Limite',
          'Lado',
          'Município',
          'Estado',
          'Sigla',
          'País'
        ],
        data: [],
      },
    ]

    data.map(d =>
      source[1].data.push([
        d.cep,
        d.rua,
        d.complemento,
        d.bairro,
        d.limite,
        d.lado,
        d.municipioNome,
        d.estadoNome,
        d.estadoSigla,
        d.paisNome,
      ]),
    )

    setDataExport(source)
   // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [data])

  async function getData() {
    setLoading(true)
    setSelectedRows([])
    try {
      const response = await apiRegion({
        method: 'GET',
        url: `/api/RegiaoCep`,
        params: { regiaoId: regionId },
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        setData(data.regiaoCep)
        setKeyTable(keyTable + 1)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function confirmDeleteRegionZipCode() {
    confirm({
      title: formatMessage({
        id:
          selectedRows.length === 1
            ? 'confirmDeleteSingular'
            : 'confirmDeletePlural',
      }),
      onOk: () => deleteRegionZipCode(),
      okType: 'danger',
      cancelText: formatMessage({
        id: 'globalComponents.confirmModal.no',
      }),
      okText: formatMessage({
        id: 'globalComponents.confirmModal.yes',
      }),
      okButtonProps: { size: 'large' },
      cancelButtonProps: { size: 'large' },
    })
  }
  async function deleteRegionZipCode() {
    setLoading(true)
    try {
      const response = await apiRegion({
        method: 'DELETE',
        url: `/api/RegiaoCep`,
        data: { regiaoCepIds: selectedRows.map(record => record.regiaoCepId) },
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
        showApiNotifications(data)
        showApiMessages(data)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  const newRegionZipCode = () => {
    setModalVisible(true)
  }

  return (
    <div>
      <Spin spinning={loading} size="large">
        <RegionZipCodeHeader
          newRegionZipCode={newRegionZipCode}
          selectedRows={selectedRows}
          confirmDeleteRegionZipCode={confirmDeleteRegionZipCode}
          userPermissions={userPermissions}
          dataExport={dataExport}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        
        <RegionZipCodeTable
          data={data}
          userPermissions={userPermissions}
          rowSelection={rowSelection}
          keyTable={keyTable}
          searchValue={searchValue}
          loading={loading}
        />
        
        <NewRegionZipCodeModal
          visible={modalVisible}
          setVisible={setModalVisible}
          existingZipCodes={data}
          regionId={regionId}
          refreshData={getData}
        />
        
      </Spin>
    </div>
  )
}

RegionZipCode.propTypes = {
  regionId: PropTypes.string,
  regionName: PropTypes.string, 
  userPermissions: PropTypes.array, 
  keyRegionZipCode: PropTypes.number,
}

export default RegionZipCode

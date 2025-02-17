import { apiRegion } from '@services/api'
import { handleAuthError, showApiMessages, showApiNotifications } from '@utils'
import { message, Modal, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import PropTypes from 'prop-types'
import RegionNeighborhoodHeader from './RegionNeighborhoodHeader'
import RegionNeighborhoodTable from './RegionNeighborhoodTable'
import NewRegionNeighborhoodModal from './modals/NewRegionNeighborhoodModal'

const { confirm } = Modal

function RegionNeighborhood({ regionId, regionName, userPermissions, keyRegionNeighborhood }) {
  
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
    if (keyRegionNeighborhood > 0) {
      getData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyRegionNeighborhood])
  
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
          'Bairro',
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
        d.bairro,
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
        url: `/api/RegiaoBairro`,
        params: { regiaoId: regionId },
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        setData(data.regiaoBairro)
        setKeyTable(keyTable + 1)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function confirmDeleteRegionNeighborhood() {
    confirm({
      title: formatMessage({
        id:
          selectedRows.length === 1
            ? 'confirmDeleteSingular'
            : 'confirmDeletePlural',
      }),
      onOk: () => deleteRegionNeighborhood(),
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
  async function deleteRegionNeighborhood() {
    setLoading(true)
    try {
      const response = await apiRegion({
        method: 'DELETE',
        url: `/api/RegiaoBairro`,
        data: { regiaoBairroIds: selectedRows.map(record => record.regiaoBairroId) },
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

  const newRegionNeighborhood = () => {
    setModalVisible(true)
  }

  return (
    <div>
      <Spin spinning={loading} size="large">
        <RegionNeighborhoodHeader
          newRegionNeighborhood={newRegionNeighborhood}
          selectedRows={selectedRows}
          confirmDeleteRegionNeighborhood={confirmDeleteRegionNeighborhood}
          userPermissions={userPermissions}
          dataExport={dataExport}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <RegionNeighborhoodTable
          data={data}
          userPermissions={userPermissions}
          rowSelection={rowSelection}
          keyTable={keyTable}
          searchValue={searchValue}
          loading={loading}
        />
        <NewRegionNeighborhoodModal
          visible={modalVisible}
          setVisible={setModalVisible}
          existingNeighborhoods={data}
          regionId={regionId}
          refreshData={getData}
        />
      </Spin>
    </div>
  )
}

RegionNeighborhood.propTypes = {
  regionId: PropTypes.string,
  regionName: PropTypes.string, 
  userPermissions: PropTypes.array, 
  keyRegionNeighborhood: PropTypes.number,
}


export default RegionNeighborhood

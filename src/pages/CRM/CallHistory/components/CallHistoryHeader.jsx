import Button from '@components/Button'
import SimpleSearch from '@components/SimpleSearch'
import { hasPermission } from '@utils'
import { Col, Row, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import CallHistoryHeaderEditModalForm from '../modals/CallHistoryHeaderEditModalForm'

const { Option } = Select

export default function CallHistoryHeader({
  selectedRowKeys,
  handleSelectChange,
  selectValue,
  editCall,
  loading,
  userPermissions,
  loadingOptions,
  searchOptions,
  startSearch,
  setSearchValues,
  onChange,
}) {
  const [modalVisible, setModalVisible] = useState(false)
  const [keyModal, setKeyModal] = useState(0)

  const showEditModal = () => {
    setKeyModal(keyModal + 1)
    setModalVisible(true)
  }

  const toogleModalVisible = () => {
    setModalVisible(false)
  }

  return (
    <div>
      <Row>
        <Col
          style={{
            marginBottom: loadingOptions ? '10px' : 0,
            marginLeft: 'auto',
            width: loadingOptions ? '20px' : '500px',
          }}
        >
          {loadingOptions ? (
            <Spin />
          ) : (
            <SimpleSearch
              searchOptions={searchOptions}
              fixedTypeWidth={180}
              startSearch={startSearch}
              setSearchValues={setSearchValues}
            />
          )}
        </Col>
      </Row>
      <Row type="flex">
        <Col>
          {selectedRowKeys.length === 0 ? (
            <React.Fragment>
              {hasPermission(userPermissions, 'Include') && (
                <Button
                  size="default"
                  type="primary"
                  onClick={() => editCall(0)}
                  loading={loading}
                  disabled={loading}
                >
                  <i className="fa fa-plus fa-lg mr-3" />
                  Novo chamado
                </Button>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {hasPermission(userPermissions, 'Alter') && (
                <React.Fragment>
                  <Button
                    type="secondary"
                    className="mr-3 iconButton"
                    loading={loading}
                    disabled={loading}
                    onClick={() => showEditModal()}
                  >
                    <i className="fa fa-edit fa-lg mr-3" />
                    Editar em lote ({selectedRowKeys.length})
                  </Button>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </Col>
        <Col style={{ marginLeft: 'auto' }}>
          <Select
            onChange={handleSelectChange}
            style={{ width: 220 }}
            value={selectValue}
          >
            <Option value={1}>Todos (exceto cancelados)</Option>
            <Option value={2}>Aberto</Option>
            <Option value={3}>Em andamento</Option>
            <Option value={4}>Aberto + em andamento</Option>
            <Option value={5}>Concluído</Option>
            <Option value={6}>Cancelado</Option>
            <Option value={7}>Todos</Option>
          </Select>
        </Col>
      </Row>

      <CallHistoryHeaderEditModalForm
        modalVisible={modalVisible}
        toogleModalVisible={toogleModalVisible}
        selectedRowKeys={selectedRowKeys}
        onChange={onChange}
        key={keyModal}
      />
    </div>
  )
}

CallHistoryHeader.propTypes = {
  handleSelectChange: PropTypes.func,
  selectValue: PropTypes.string,
  selectedRowKeys: PropTypes.array,
  editCall: PropTypes.func,
  loading: PropTypes.bool,
  loadingOptions: PropTypes.bool,
  searchOptions: PropTypes.array,
  startSearch: PropTypes.func,
  setSearchValues: PropTypes.func,
  onChange: PropTypes.func,
  userPermissions: PropTypes.array,
}

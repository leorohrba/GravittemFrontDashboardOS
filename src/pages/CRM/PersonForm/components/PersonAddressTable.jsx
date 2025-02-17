/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
import React, { useState } from 'react'
import DefaultTable from '@components/DefaultTable'
import { Tooltip, Button, Row, Col, Modal, Badge } from 'antd'
import { formatZipCode } from '@utils'
import styles from '@pages/CRM/styles.css'
import PropTypes from 'prop-types'
import PersonAddressForm from './PersonAddressForm'
import personAddressTableCol from '../../../../utils/columns/personAddressTableCol'
import { Spin } from 'antd'
import { useEffect } from 'react'
export default function PersonAddressTable({
  loadingForm,
  canBeUpdated,
  addressDataSource,
  setAddressDataSource,
  states,
  tiposEndereco,
  selectedRowKeysAddress,
  setSelectedRowKeysAddress,
}) {
  const [keyAddress, setKeyAddress] = useState(1)
  const [keyAddressForm, setKeyAddressForm] = useState(1)
  const [showPersonAddressForm, setShowPersonAddressForm] = useState(false)
  const [personAddress, setPersonAddress] = useState(null)
  const [currentState,setCurrentState] = useState(false)
  const [dataSourceStatic, setDataSourceStatic] = useState([...addressDataSource])
  const serverColumns = personAddressTableCol(tiposEndereco)
  const addressColumns = [
    ...serverColumns,
    {
      title: '',
      dataIndex: '',
      render: (text, record) => (
        <div>
          <Tooltip
            placement="top"
            title={canBeUpdated ? 'Editar' : 'Consultar'}
          >
            <Button
              shape="circle"
              size="default"
              type="primary"
              ghost
              className="iconButton"
              onClick={() => editPersonAddress(record.key)}
            >
              <i
                className={
                  canBeUpdated
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
  useEffect( ()=>{
    setDataSourceStatic([...addressDataSource])
  }, [currentState])
  const rowSelectionAddress = {
    selectedRowKeysAddress,
    onChange: selectedRowKeys => onSelectChangeAddress(selectedRowKeys),
    getCheckboxProps: record => ({
      disabled: record.id !== 0, // Column configuration not to be checked
    }),
  }

  const onSelectChangeAddress = selectedRowKeys => {
    setSelectedRowKeysAddress(selectedRowKeys)
  }

  function editPersonAddress(key) {
    if (key === -1) {
      setPersonAddress(null)
      setShowPersonAddressForm(true)
      setKeyAddressForm(keyAddressForm + 1)
    } else {
      const address = addressDataSource.find(x => x.key === key)
      if (address) {
        setPersonAddress(address)
        setShowPersonAddressForm(true)
        setKeyAddressForm(keyAddressForm + 1)
      }
    }
  }

  function confirmDeletePersonAddresses() {
    Modal.confirm({
      content:
        selectedRowKeysAddress.length === 1
          ? 'Você tem certeza que deseja excluir o endereço selecionado?'
          : 'Você tem certeza que deseja excluir os endereços selecionados?',
      title: 'Atenção',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deletePersonAddresses()
      },
    })
  }

  function deletePersonAddresses() {
    selectedRowKeysAddress.map(selectedRowKey => {
      const i = addressDataSource.findIndex(x => x.key === selectedRowKey)
      if (i > -1) {
        addressDataSource.splice(i, 1)
      }
      return true
    })
    setSelectedRowKeysAddress([])
    setAddressDataSource([...addressDataSource])
    setKeyAddress(keyAddress + 1)
  }

  function closePersonAddressForm() {
    setShowPersonAddressForm(false)
  }

  function savePersonAddressForm(addressToSave) {
    let key = -1

    for (let i = 0; i < addressDataSource.length; i++) {
      if (
        addressDataSource[i].key === addressToSave.key &&
        addressToSave.key !== -1
      ) {
        addressDataSource[i] = addressToSave
        setAddressDataSource(addressDataSource)
        break
      }

      if (addressToSave.key === -1 && addressDataSource[i].key > key) {
        key = addressDataSource[i].key
      }
    }
    if (addressToSave.key === -1) {
      key++
      addressToSave.key = key
      addressDataSource.push(addressToSave)
      setAddressDataSource([...addressDataSource])
    }
    setShowPersonAddressForm(false)
  }

  return (
    <React.Fragment>
      <Row type="flex" className="mt-4 mb-4" gutter={12}>
        <Col
          style={{
            display: selectedRowKeysAddress.length === 0 ? 'block' : 'none',
          }}
        >
          <Button
            type="primary"
            disabled={loadingForm || !canBeUpdated}
            onClick={() => editPersonAddress(-1)}
          >
            <i className="fa fa-plus fa-lg mr-3" />
            Adicionar endereço
          </Button>
        </Col>
        <Col
          style={{
            display: selectedRowKeysAddress.length > 0 ? 'block' : 'none',
          }}
        >
          <Button
            type="outline"
            onClick={() => confirmDeletePersonAddresses()}
            disabled={loadingForm || !canBeUpdated}
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
            {`Excluir (${selectedRowKeysAddress.length})`}
          </Button>
        </Col>
      </Row>
      <Spin spinning={currentState}>
        <DefaultTable
          rowKey={record => record.key}
          loading={currentState}
          rowSelection={rowSelectionAddress}
          columns={addressColumns}
          dataSource={currentState === true ? dataSourceStatic : addressDataSource}
          key={keyAddress}
        />
      </Spin>

      <React.Fragment>
        <PersonAddressForm
          show={showPersonAddressForm}
          personAddress={personAddress}
          closePersonAddressForm={closePersonAddressForm}
          savePersonAddressForm={savePersonAddressForm}
          canBeUpdated={canBeUpdated}
          key={keyAddressForm}
          states={states}
          tiposEndereco={tiposEndereco}
          {...{
            setCurrentState,
          }}
        />
      </React.Fragment>
    </React.Fragment>
  )
}

PersonAddressTable.propTypes = {
  loadingForm: PropTypes.bool,
  canBeUpdated: PropTypes.bool,
  addressDataSource: PropTypes.array,
  setAddressDataSource: PropTypes.func,
  states: PropTypes.array,
  selectedRowKeysAddress: PropTypes.array,
  setSelectedRowKeysAddress: PropTypes.func,
}

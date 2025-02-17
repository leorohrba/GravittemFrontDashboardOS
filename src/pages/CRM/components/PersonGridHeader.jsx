/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import ConfigurationModal from '@components/modals/ConfigurationModal'
import ImportExcelModal from '@components/modals/ImportExcelModal/ImportExcelModal'
import LogImportModal from '@components/modals/LogImportModal/LogImportModal'
import NewSimpleSearch from '@components/NewSimpleSearch'
import styles from '@pages/CRM/styles.css'
import { apiCRM } from '@services/api'
import { hasPermission, formatPhone, formatToCPF } from '@utils'
import { personGridColumns } from '@utils/columns/personGrid'
import { Button, Col, Dropdown, Menu, Row, Spin } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import ReactExport from 'react-data-export'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile
export default function PersonGridHeader(props) {
  const {
    startSearch,
    searchOptions,
    keySearch,
    userPermissions,
    loadingPeople,
    selectedRowKeys,
    canDelete,
    confirmDeletePeople,
    dataSet,
    tags,
    setTags,
    refreshData,
    canGenerateTask,
    openGenerateTask,
    openPerson,
    ownerProfile,
    setUpdateColumnsKey,
    params,
    people,
    owner,
    loadingAddressType,
  } = props

  const [visibleLogImportModal, setVisibleLogImportModal] = useState(false)
  const [visibleModal, setVisibleModal] = useState(false)
  const [keyModal, setKeyModal] = useState(0)
  const [personContactData, setPersonContactData] = useState([])
  const [personContactExport, setPersonContactExport] = useState([
    { columns: [], data: [] },
  ])

  const bgColor = 'FFF86B00'
  const fgColor = 'white'

  const handleOpenImportExcel = () => {
    setVisibleModal(true)
    setKeyModal(keyModal + 1)
  }

  const handleOpenLogImport = () => {
    setVisibleLogImportModal(true)
  }

  const [visibleConfigurationModal, setVisibleConfigurationModal] = useState(
    false,
  )
  const extraMenu = (
    <Menu>
      <Menu.Item onClick={() => setVisibleConfigurationModal(true)}>
        Configurações
      </Menu.Item>
    </Menu>
  )
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => handleOpenImportExcel()}>
        Importar cadastro
      </Menu.Item>
      <Menu.Item key="2" onClick={() => handleOpenLogImport()}>
        Histórico de importação
      </Menu.Item>
    </Menu>
  )

  const exportmenu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <ExcelFile
              filename={`${moment().format('DD_MM_YYYY')}_cadastro_pessoas`}
              element={
                <React.Fragment>
                  <i
                    className={`fa fa-download fa-lg mr-3 ${styles.crmColorIconEdit}`}
                  />
                  Pessoa
                </React.Fragment>
              }
            >
              <ExcelSheet dataSet={dataSet} name="Cadastro de Pessoas" />
            </ExcelFile>
          ),
        },
        {
          key: '2',
          label: (
            <ExcelFile
              filename={`${moment().format('DD_MM_YYYY')}_lista_de_contatos`}
              element={
                <React.Fragment>
                  <i
                    className={`fa fa-download fa-lg mr-3 ${styles.crmColorIconEdit}`}
                  />
                  Contatos
                </React.Fragment>
              }
            >
              <ExcelSheet
                dataSet={personContactExport}
                name="Cadastro de Pessoas"
              />
            </ExcelFile>
          ),
        },
      ]}
    />
  )

  const formatColumn = (title, wpx) => {
    return { title, width: { wpx } }
  }

  const formatValue = (value, bold, width) => {
    const result = {
      value,
      style: {
        font: { color: { rgb: fgColor }, bold },
        fill: {
          patternType: 'solid',
          fgColor: { rgb: bgColor },
        },
      },
    }

    return result
  }

  const getPersonContact = async () => {
    try {
      const response = await apiCRM({
        url: '/api/CRM/PersonContactList',
        params,
      })

      const { data } = response

      if (data.isOk) {
        setPersonContactData(data.personContacts)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getPersonContact()
  }, [])

  useEffect(() => {
    getPersonContact()
  }, [people, owner])

  useEffect(() => {
    const source = [
      {
        ySteps: -1,
        columns: [],
        data: [
          [
            '',
            '',
            `Usuário: ${owner?.userName} - ${moment().format(
              'DD/MM/YYYY HH:mm:ss',
            )}`,
          ],
        ],
      },
      {
        columns: [
          formatColumn('', 250),
          formatColumn('', 200),
          formatColumn('', 250),
          formatColumn('', 130),
          formatColumn('', 130),
          formatColumn('', 130),
          formatColumn('', 130),
        ],
        data: [
          [
            formatValue('Nome pessoa', true),
            formatValue('Nome contato', true),
            formatValue('Email', true),
            formatValue('Telefone', true),
            formatValue('Celular', true),
            formatValue('Cargo', true),
            formatValue('CPF', true),
          ],
        ],
      },
    ]
    personContactData.map(p =>
      source[1].data.push([
        p.nomeCompleto,
        p.nomeContato,
        p.email,
        formatPhone(p.telefone),
        formatPhone(p.celular),
        p.cargo,
        formatToCPF(p.cpf),
      ]),
    )

    setPersonContactExport(source)
  }, [personContactData, owner])

  return (
    <React.Fragment>
      <ConfigurationModal
        {...{
          visibleConfigurationModal,
          setVisibleConfigurationModal,
          setUpdateColumnsKey,
        }}
        screenName="PersonGrid"
        tableName="PersonGrid"
        defaultColumns={personGridColumns()}
        microserviceName="crm"
        microserviceOrigin={apiCRM}
        profile={ownerProfile}
      />
      <ImportExcelModal
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        refreshData={refreshData}
        key={keyModal}
        documentId={3}
      />
      <LogImportModal
        visibleModal={visibleLogImportModal}
        setVisibleModal={setVisibleLogImportModal}
        document={3}
      />
      <Row>
        <Col
          style={{
            width: '580px',
            marginLeft: 'auto',
          }}
        >
          <Spin spinning={loadingAddressType}>
            <NewSimpleSearch
              searchOptions={searchOptions}
              setTags={setTags}
              tags={tags}
              startSearch={startSearch}
              // hideSaveSearch
              getSelectLabel
              selectOptionsWidth={190}
              key={keySearch}
              screenName="PersonGrid"
            />
          </Spin>
        </Col>
      </Row>

      <Row type="flex" className="mt-4 mb-4" gutter={12}>
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
            onClick={() => openPerson(0)}
            type="primary"
            disabled={loadingPeople}
          >
            <i className="fa fa-plus fa-lg mr-3" />
            Novo cadastro
          </Button>
          <Dropdown overlay={menu} className="ml-1">
            <Button type="primary">
              <i className="fa fa-angle-down fa-lg" aria-hidden="true" />
            </Button>
          </Dropdown>
        </Col>

        <Col
          style={{
            display:
              selectedRowKeys.length > 0 &&
              hasPermission(userPermissions, 'Exclude')
                ? 'block'
                : 'none',
          }}
        >
          <Button
            type="outline"
            onClick={() => confirmDeletePeople()}
            disabled={loadingPeople || !canDelete}
          >
            <i className="fa fa-trash fa-lg mr-3" />
            {`Excluir (${selectedRowKeys.length})`}
          </Button>
        </Col>

        <Col
          style={{
            display:
              selectedRowKeys.length > 0 &&
              hasPermission(userPermissions, 'Include')
                ? 'block'
                : 'none',
          }}
        >
          <Button
            onClick={() => openGenerateTask()}
            disabled={loadingPeople || !canGenerateTask}
          >
            <i className="mr-2 fa fa-calendar" style={{ color: 'gray' }} />
            {`Agendar tarefas (${selectedRowKeys.length})`}
          </Button>
        </Col>
        <Col
          className="ml-auto"
          style={{
            display: hasPermission(userPermissions, 'ExportExcel')
              ? 'block'
              : 'none',
          }}
        >
          <Dropdown
            disabled={loadingPeople}
            overlay={exportmenu}
            placement="bottom"
            arrow={{
              pointAtCenter: true,
            }}
          >
            <Button>
              <i
                className={`fa fa-download fa-lg mr-3 ${styles.crmColorIconEdit}`}
              />
              Exportar
            </Button>
          </Dropdown>
        </Col>
        <Dropdown overlay={extraMenu}>
          <Button className="iconButton">
            <i className="fa fa-ellipsis-v fa-lg" style={{ color: 'gray' }} />
          </Button>
        </Dropdown>
      </Row>
    </React.Fragment>
  )
}

PersonGridHeader.propTypes = {
  selectedRowKeys: PropTypes.array,
  confirmDeletePeople: PropTypes.func,
  startSearch: PropTypes.func,
  searchOptions: PropTypes.array,
  keySearch: PropTypes.number,
  userPermissions: PropTypes.array,
  loadingPeople: PropTypes.bool,
  canDelete: PropTypes.bool,
  canGenerateTask: PropTypes.bool,
  dataSet: PropTypes.array,
  tags: PropTypes.array,
  setTags: PropTypes.func,
  refreshData: PropTypes.func,
  openGenerateTask: PropTypes.func,
  openPerson: PropTypes.func,
}

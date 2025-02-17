import Button from '@components/Button'
import DefaultTable from '@components/DefaultTable'
import styles from '@pages/CRM/styles.css'
import { customSort, hasPermission } from '@utils'
import { Col, Row, Tooltip } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import TaskFinalize from '../../../../Task/components/TaskFinalize'
import TaskSchedule from '../../../../Task/components/TaskSchedule'

export default function TasksTable({
  setTableSelectedRowKeys,
  tasks,
  loading,
  proposalCanBeUpdate,
  editTask,
  userPermissions,
  setKeyRowTable,
  keyRowTable,
  refreshData,
  keyTable,
  setKeyTable,
}) {
  const columns = [
    {
      title: 'Assunto',
      dataIndex: 'subject',
      width: '21%', // 220,
      sorter: (a, b) => customSort(a.subject, b.subject),
    },
    {
      title: 'Tipo de tarefa',
      dataIndex: 'taskTypeName',
      width: '18%', // 180,
      render: (text, record) => (
        <div>
          <i
            className={`mr-2 fa ${record.taskTypeIcon} fa-fw ${styles.crmColorIconGrid}`}
          />
          {text}
        </div>
      ),
      sorter: (a, b) => customSort(a.taskTypeName, b.taskTypeName),
    },
    {
      title: 'Vendedor',
      dataIndex: 'sellerName',
      width: '15%', // 150,
      sorter: (a, b) => customSort(a.sellerName, b.sellerName),
    },
    {
      title: 'Previsão',
      width: '15%', // 150,
      dataIndex: 'expectedDateTime',
      render: (date, record) =>
        record.isAllDay
          ? moment(date).format('D MMM YYYY')
          : moment(date).format('D MMM YYYY, HH:mm'),
      sorter: (a, b) => customSort(a.expectedDateTime, b.expectedDateTime),
    },
    {
      title: 'Realizada',
      width: '18%', // 185,
      dataIndex: 'realizedDate',
      render: (text, record, index) => (
        <React.Fragment>
          {text && (
            <span style={{ color: '#4CAF50' }}>
              <i
                className="fa fa-calendar-check-o fa-lg mr-3"
                aria-hidden="true"
              />
              {moment(text).format('D MMM YYYY, HH:mm')}
            </span>
          )}
        </React.Fragment>
      ),
      sorter: (a, b) => customSort(a.realizedDate, b.realizedDate),
    },
    {
      title: '',
      width: '13%', // 130,
      key: 'operation',
      render: (text, record, index) => (
        <div>
          <Row type="flex" justify="end" gutter={5}>
            <Col
              style={{
                maxWidth: '36px',
                display:
                  !proposalCanBeUpdate ||
                  record.realizedDate ||
                  !record.canBeUpdated ||
                  !hasPermission(userPermissions, 'Alter')
                    ? 'none'
                    : 'flex',
              }}
            >
              <TaskFinalize
                keyTask={index}
                keyTable={keyRowTable}
                setKeyTable={setKeyRowTable}
                taskId={record.taskId}
                closeTaskFinalize={closeTaskFinalize}
              />
            </Col>

            <Col
              style={{
                maxWidth: '36px',
                display:
                  !proposalCanBeUpdate ||
                  record.realizedDate ||
                  !record.canBeUpdated ||
                  !hasPermission(userPermissions, 'Alter') ||
                  (record.isBatchGenerated &&
                    !hasPermission(userPermissions, 'AlterDate'))
                    ? 'none'
                    : 'flex',
              }}
            >
              <TaskSchedule
                taskId={record.taskId}
                isAllDay={record.isAllDay}
                keyTable={keyRowTable}
                setKeyTable={setKeyRowTable}
                getTasks={refreshData}
              />
            </Col>

            <Col style={{ width: '36px' }}>
              <Tooltip
                placement="top"
                title={`${
                  hasPermission(userPermissions, 'Alter') && proposalCanBeUpdate
                    ? 'Editar'
                    : 'Consultar'
                }`}
              >
                <Button
                  shape="circle"
                  size="default"
                  type="primary"
                  ghost
                  data-testid="edit-task-button"
                  onClick={() => editTask(record.taskId)}
                  className="iconButton"
                >
                  <i
                    className={`fa fa-${
                      hasPermission(userPermissions, 'Alter') &&
                      proposalCanBeUpdate
                        ? 'pencil'
                        : 'search'
                    } fa-lg`}
                  />
                </Button>
              </Tooltip>
            </Col>
          </Row>
        </div>
      ),
    },
  ]

  const closeTaskFinalize = (refreshDataTable, openNewTask) => {
    if (refreshDataTable) {
      refreshData()
    }

    if (openNewTask) {
      editTask(0)
    }
  }
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setTableSelectedRowKeys(selectedRowKeys)
    },
    getCheckboxProps: record => ({
      disabled:
        !record.canBeDeleted ||
        !!record.realizedDate ||
        !hasPermission(userPermissions, 'Exclude') ||
        !proposalCanBeUpdate, // Column configuration not to be checked
    }),
  }

  return (
    <div>
      <DefaultTable
        className="mt-5"
        rowKey={record => record.taskId}
        rowSelection={
          hasPermission(userPermissions, 'Exclude') && proposalCanBeUpdate
            ? rowSelection
            : undefined
        }
        columns={columns}
        dataSource={tasks}
        loading={loading}
        key={keyTable}
      />
    </div>
  )
}

TasksTable.propTypes = {
  setTableSelectedRowKeys: PropTypes.func,
  tasks: PropTypes.array,
  loading: PropTypes.bool,
  proposalCanBeUpdate: PropTypes.bool,
  editTask: PropTypes.func,
  userPermissions: PropTypes.array,
  setKeyRowTable: PropTypes.func,
  keyRowTable: PropTypes.number,
  refreshData: PropTypes.func,
  keyTable: PropTypes.number,
}

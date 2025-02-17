/* eslint-disable react-hooks/exhaustive-deps  */
import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Avatar, Spin, Tooltip } from 'antd'
import { customSort, formatNumber } from '@utils'
import PropTypes from 'prop-types'

const firstColumnWidth = 15 // em %

export default function TasksCard({
  type,
  setType,
  data,
  loading,
  openTaskDetail,
  profile,
}) {
  const [items, setItems] = useState([])
  const [columnWidth, setColumnWidth] = useState(10)

  useEffect(() => {
    const source = []

    data.map(d => {
      d.detail.map(r => {
        const { id } = r
        const { name } = r
        const quantityCreated = r?.quantityCreated || 0
        const quantityClosed = r?.quantityClosed || 0
        const percent =
          quantityClosed === 0 ? 0 : (100 * quantityCreated) / quantityClosed

        const index = source.findIndex(x => x.id === id)
        if (index < 0) {
          source.push({ id, name, quantityCreated, quantityClosed, percent })
        } else {
          source[index].quantityCreated += r?.quantityCreated || 0
          source[index].quantityClosed += r?.quantityClosed || 0
          source[index].percent =
            source[index].quantityClosed === 0
              ? 0
              : (100 * source[index].quantityCreated) /
                source[index].quantityClosed
        }

        return true
      })
      return true
    })

    setColumnWidth((100 - firstColumnWidth) / (data.length + 1))
    source.sort((a, b) => customSort(a.name, b.name))
    setItems(source)
  }, [data])

  const getQuantity = (r, id) => {
    const item = r.detail.find(x => x.id === id)
    const quantity = `${item?.quantityCreated || 0}/${item?.quantityClosed ||
      0}`
    return quantity
  }

  return (
    <Spin spinning={loading}>
      <Card
        title={
          <Row type="flex" gutter={12}>
            <Col>
              <Tooltip title="Tarefas criadas com data de criação conforme período / Tarefas concluídas com data de conclusão conforme período">
                Relatório de tarefas
              </Tooltip>
            </Col>
            <Col className="ml-auto">
              <Tooltip title="Visualizar tarefas por vendedor">
                <i
                  className="cursor-pointer fa fa-user-circle"
                  role="button"
                  style={{ color: type === 'seller' ? '#3182ce' : 'gray' }}
                  onClick={() => setType('seller')}
                />
              </Tooltip>
            </Col>
            <Col
              style={{
                display:
                  profile?.ownerProfile === 'Standard' ? 'none' : 'block',
              }}
            >
              <Tooltip title="Visualizar tarefas por franquia">
                <i
                  className="cursor-pointer fa fa-building-o"
                  role="button"
                  style={{ color: type === 'franchisee' ? '#3182ce' : 'gray' }}
                  onClick={() => setType('franchisee')}
                />
              </Tooltip>
            </Col>
          </Row>
        }
      >
        <Row type="flex" align="middle" justify="center">
          <Col
            className="text-center"
            style={{ width: `${firstColumnWidth}%` }}
          >
            {`${
              type === 'franchisee' ? 'Franquia' : 'Vendedor'
            } / Tipo de tarefa`}
          </Col>
          {data.map((d, index) => (
            <Col className="text-center" style={{ width: `${columnWidth}%` }}>
              <Tooltip title={d.taskTypeName}>
                <i
                  className={`mb-2 fa p-5 ${d.taskTypeIcon} fa-lg`}
                  style={{ color: '#3182ce' }}
                />
              </Tooltip>
              <br />
            </Col>
          ))}
          <Col className="text-center" style={{ width: `${columnWidth}%` }}>
            Total
          </Col>
        </Row>
        <hr />
        {items.map(d => (
          <React.Fragment>
            <Row type="flex" align="middle" justify="center">
              <Col
                className="text-center"
                style={{ width: `${firstColumnWidth}%` }}
              >
                <div className="mb-2">
                  <Avatar
                    style={{
                      backgroundColor: '#3182ce',
                      verticalAlign: 'middle',
                    }}
                  >
                    {d?.name?.length > 0 ? d.name[0].toUpperCase() : ''}
                  </Avatar>
                </div>
                <span>{d.name}</span>
              </Col>
              {data.map(r => (
                <Col
                  className="text-center"
                  style={{ width: `${columnWidth}%` }}
                >
                  <span
                    role="button"
                    className="cursor-pointer"
                    onClick={() => openTaskDetail(type, r.taskTypeId, d.id)}
                  >
                    {getQuantity(r, d.id)}
                  </span>
                </Col>
              ))}
              <Col className="text-center" style={{ width: `${columnWidth}%` }}>
                <span
                  role="button"
                  className="cursor-pointer"
                  onClick={() => openTaskDetail(type, null, d.id)}
                >
                  {`${d.quantityCreated}/${d.quantityClosed} (${formatNumber(
                    d.percent,
                    0,
                  )}%)`}
                </span>
              </Col>
            </Row>
            <hr />
          </React.Fragment>
        ))}
      </Card>
    </Spin>
  )
}

TasksCard.propTypes = {
  type: PropTypes.string,
  loading: PropTypes.bool,
  data: PropTypes.array,
  openTaskDetail: PropTypes.func,
  setType: PropTypes.func,
  profile: PropTypes.any,
}

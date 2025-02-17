import { buildAddressLine1, buildAddressLine2, customDateTimeFormat, formatNumber as customFormatNumber, hasPermission } from '@utils'
import { Card, Col, Row, Spin, Steps, Tag, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import TaskForm from '../../../Task/components/TaskForm'
import { useProposalContext } from '../../Context/proposalContext'

const { Step } = Steps
const { Meta } = Card

const stepStyle = {
  marginBottom: 10,
}

const cardContentStyle = {
  boxShadow: '0px -1px 0 0 #e8e8e8 inset',
  cursor: 'pointer',
}

const cardStyleRed = {
  borderRadius: '5px',
  borderRight: '5px solid red',
}

const cardStyleGreen = {
  borderRadius: '5px',
  borderRight: '5px solid green',
}

const ProposalCards = props => {
  const { owner, userPermissions, openProposal } = useProposalContext()
  const {
    data,
    steps,
    loading,
    onChange,
  } = props

  const [keyTaskForm, setKeyTaskForm] = useState(0)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [taskId, setTaskId] = useState(0)
  const [proposal, setProposal] = useState(null)

  const refreshData = () => {
    onChange()
  }

  const stepsRowWidth = steps?.length * 20

  const editTask = proposalToExport => {
    setTaskId(0)
    setProposal(proposalToExport)
    setKeyTaskForm(keyTaskForm + 1)
    setShowTaskForm(true)
  }

  const closeTaskForm = () => {
    setShowTaskForm(false)
  }

  return (
    <Spin size="large" spinning={loading}>
      <div style={{ height: '83vh' }} className="overflow-y-hidden">
        <TaskForm
          show={showTaskForm}
          taskId={taskId}
          closeTaskForm={closeTaskForm}
          owner={owner}
          userPermissions={userPermissions}
          refreshData={refreshData}
          newTask={() => setTaskId(0)}
          proposal={proposal}
          key={keyTaskForm}
        />
        {(!steps || steps?.length === 0) && (
          <div className="mt-10 text-center" style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
            <i className="fa fa-search fa-3x m-5" aria-hidden="true" />
            <h3 className="my-2">
              Faça uma pesquisa para requisitar os dados.
            </h3>
          </div>
        )}
        <Steps
          style={stepStyle}
          type="navigation"
          size="small"
          current={-1}
          className="steps-cards"
        >
          {steps && steps.map(s => (
            <Step
              title={
                <span>
                  {`${s.funnelStageName} `}
                  <Tooltip
                    title={`${customFormatNumber(s.percentQuantity, 2)}%`}
                  >
                    {`(${s.quantity})`}
                  </Tooltip>
                </span>
              }
              description={
                <React.Fragment>
                  <Tooltip title="Valor único">
                    <span>
                      {`${formatNumber(s.totalUniqueValue, {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                     `}
                    </span>
                  </Tooltip>
                  <span> - </span>
                  <Tooltip title="Valor recorrente">
                    <span>
                      {`${formatNumber(s.totalRecurringValue, {
                        style: 'currency',
                        currency: 'BRL',
                      })}            
                  `}
                    </span>
                  </Tooltip>
                </React.Fragment>
              }
              icon={
                <i
                  className={`fa ${s.funnelStageIcon}`}
                  aria-hidden="true"
                  style={{ color: '#1976D2' }}
                />
              }
            />
          ))}
        </Steps>
        <Row type="flex" style={{ width: `${stepsRowWidth}%` }}>
          {steps && steps.map(s => (
            <div
              className={`w-1/${steps.length} overflow-auto`}
              style={{ height: '65vh' }}
            >
              {data.map(
                d =>
                  d.funnelStageId === s.funnelStageId && (
                    <Card
                      size="small"
                      style={
                        d.actStatusCode === 'ABRT'
                          ? { borderRadius: '5px' }
                          : d.actStatusCode === 'WON'
                          ? cardStyleGreen
                          : cardStyleRed
                      }
                      className="mb-3 mr-2 "
                    >
                      <div
                        style={cardContentStyle}
                        role="button"
                        onClick={() => openProposal(d.proposalId)}
                      >
                        <p className="font-bold">
                          <Tooltip
                            title={
                              <Row>
                                <Col>Negócio: {d.number}</Col>
                                {owner?.ownerProfile !== 'Franchise' && (
                                  <Col>Vendedor: {d.sellerName}</Col>
                                )}
                                <Col>Contato: {d.personContactName}</Col>
                                <Col>
                                  Endereço:{' '}
                                  {buildAddressLine1(
                                    d.addressName,
                                    d.addressNumber,
                                    d.neighborhood,
                                  )}
                                </Col>
                                <Col>
                                  {buildAddressLine2(
                                    d.cityName,
                                    d.stateAbbreviation,
                                  )}
                                </Col>
                              </Row>
                            }
                          >
                            {d.companyShortName}
                          </Tooltip>
                        </p>
                        <p>
                          <i
                            className={`fa fa-${
                              owner?.ownerProfile !== 'Franchisor'
                                ? 'user-circle'
                                : 'building-o'
                            } fa-lg mr-3`}
                            aria-hidden="true"
                            style={{ color: 'gray' }}
                          />
                          {owner?.ownerProfile !== 'Franchisor'
                            ? d.sellerName
                            : d.franchiseeName}
                        </p>
                        <p>
                          <i
                            className="fa fa-usd fa-lg mr-3"
                            aria-hidden="true"
                            style={{ color: 'gray' }}
                          />
                          <Tooltip title="Valor único">
                            <span>
                              {`${formatNumber(d.singleTotalAmount, {
                                style: 'currency',
                                currency: 'BRL',
                              })}`}
                            </span>
                          </Tooltip>
                          <span> - </span>
                          <Tooltip title="Valor recorrente">
                            <span>
                              {`${formatNumber(d.recurringValue, {
                                style: 'currency',
                                currency: 'BRL',
                              })}`}
                            </span>
                          </Tooltip>
                        </p>
                        <p>
                          <Tooltip
                            title={
                              <Row>
                                <Col>{`Data de criação: ${customDateTimeFormat(
                                  d.createDateTime,
                                  'DD/MM/YY HH:mm',
                                )}`}</Col>
                                {d.expectedClosingDate && (
                                  <Col>
                                    {`Expectativa de fechamento: ${customDateTimeFormat(
                                      d.expectedClosingDate,
                                      'DD/MM/YY',
                                    )}`}
                                  </Col>
                                )}
                              </Row>
                            }
                          >
                            <i
                              className="fa fa-hourglass-end fa-lg mr-3 mb-4"
                              aria-hidden="true"
                              style={{ color: 'gray' }}
                            />
                          </Tooltip>
                          {d.actStatusCode === 'ABRT'
                            ? `${d.daysNotInteraction} ${
                                d.daysNotInteraction > 1 ? 'dias' : 'dia'
                              }`
                            : `Fechado em ${customDateTimeFormat(
                                d.closedDate,
                                'DD/MM/YY HH:mm',
                              )}`}
                        </p>
                      </div>
                      <Meta
                        className="mt-3"
                        description={
                          <Row style={{ height: '26px' }} type="flex">
                            {d.scheduledActivitiesOpenedNotLate > 0 && (
                              <Tooltip title="Tarefas em aberto">
                                <Tag color="blue">
                                  <i
                                    className="fa fa-calendar-o ml-auto m-1"
                                    aria-hidden="true"
                                  />
                                  {d.scheduledActivitiesOpenedNotLate}
                                </Tag>
                              </Tooltip>
                            )}

                            {d.scheduledActivitiesClosed > 0 && (
                              <Tooltip title="Tarefas encerradas">
                                <Tag color="green">
                                  <i
                                    className="fa fa-calendar-o ml-auto m-1"
                                    aria-hidden="true"
                                  />
                                  {d.scheduledActivitiesClosed}
                                </Tag>
                              </Tooltip>
                            )}

                            {d.scheduledActivitiesOpenedLate > 0 && (
                              <Tooltip title="Tarefas em atraso">
                                <Tag color="red">
                                  <i
                                    className="fa fa-calendar-o ml-auto m-1"
                                    aria-hidden="true"
                                  />
                                  {d.scheduledActivitiesOpenedLate}
                                </Tag>
                              </Tooltip>
                            )}

                            {d.actStatusCode === 'ABRT' ? (
                              <React.Fragment>
                                {d.canBeUpdated &&
                                  hasPermission(userPermissions, 'Include') && (
                                    <Tooltip title="Adicionar tarefa">
                                      <i
                                        className="fa fa-plus fa-lg mt-1"
                                        aria-hidden="true"
                                        onClick={() => editTask(d)}
                                        style={{
                                          cursor: 'pointer',
                                          color: '#1976D2',
                                          marginLeft: 'auto',
                                        }}
                                      />
                                    </Tooltip>
                                  )}
                              </React.Fragment>
                            ) : (
                              <Tag
                                color={
                                  d.actStatusCode === 'WON'
                                    ? '#008000'
                                    : '#ff0000'
                                }
                                style={{
                                  borderRadius: '70px',
                                  height: '25px',
                                  marginLeft: 'auto',
                                }}
                              >
                                <Tooltip
                                  title={
                                    d.lossReasonId && d.actStatusCode === 'LOST'
                                      ? d.lossReasonName
                                      : ''
                                  }
                                >
                                  {d.actStatusDescription}
                                </Tooltip>
                              </Tag>
                            )}
                          </Row>
                        }
                      />
                    </Card>
                  ),
              )}
            </div>
          ))}
        </Row>
      </div>
    </Spin>
  )
}

ProposalCards.propTypes = {
  data: PropTypes.any,
  steps: PropTypes.any,
  loading: PropTypes.bool,
  onChange: PropTypes.array,
}

export default ProposalCards

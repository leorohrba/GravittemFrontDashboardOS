import TooltipParagraph from '@components/TooltipParagraph'
import { buildAddressLine1, buildAddressLine2, customSort } from '@utils'
import { Col, Row, Tooltip } from 'antd'
import moment from 'moment'
import React from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import { renderDocument } from '../proposals'

export const proposalGridColumns = () =>
  Object.freeze([
    {
      title: 'Organização',
      nomeColuna: 'Organização',
      dataIndex: 'companyShortName',
      width: 200,
      obrigatorio: true,
      padrao: true,
      fixed: 'left',
      sorter: (a, b) => customSort(a.companyShortName, b.companyShortName),
      render: (text, record) => (
        <span>
          <i
            className={`fa fa-${
              record.companyPersonType === 1 ? 'user' : 'building-o'
            } fa-lg mr-3`}
            aria-hidden="true"
            style={{ color: 'gray' }}
          />
          <Tooltip
            title={
              <Row>
                <Col>
                  Endereço:{' '}
                  {buildAddressLine1(
                    record.addressName,
                    record.addressNumber,
                    record.neighborhood,
                  )}
                </Col>
                <Col>
                  {buildAddressLine2(record.cityName, record.stateAbbreviation)}
                </Col>
              </Row>
            }
          >
            {text}
          </Tooltip>
        </span>
      ),
    },
    {
      title: <div className="ml-6">Número do negócio</div>,
      nomeColuna: 'Número do negócio',
      dataIndex: 'number',
      width: 230,
      obrigatorio: true,
      padrao: true,
      sorter: (a, b) => customSort(a.number, b.number),
      render: d => <TooltipParagraph className="ml-6">{d}</TooltipParagraph>,
    },
    {
      title: 'Franqueado',
      nomeColuna: 'Franqueado',
      dataIndex: 'franchiseeName',
      width: 150,
      obrigatorio: true,
      padrao: true,
      franquia: true,
      sorter: (a, b) => customSort(a.franchiseeName, b.franchiseeName),
      ellipsis: {
        showTitle: false,
      },
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Vendedor',
      nomeColuna: 'Vendedor',
      dataIndex: 'sellerName',
      width: 150,
      obrigatorio: true,
      padrao: true,
      sorter: (a, b) => customSort(a.sellerName, b.sellerName),
      ellipsis: {
        showTitle: false,
      },
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Funil',
      nomeColuna: 'Funil',
      dataIndex: 'salesFunnelTitle',
      width: 150,
      obrigatorio: true,
      padrao: true,
      sorter: (a, b) => customSort(a.salesFunnelTitle, b.salesFunnelTitle),
      ellipsis: {
        showTitle: false,
      },
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Fase',
      nomeColuna: 'Fase',
      dataIndex: 'funnelStageOrder',
      width: 100,
      obrigatorio: true,
      padrao: true,
      sorter: (a, b) => a.funnelStageOrder - b.funnelStageOrder,
      render: (text, record) => (
        <span>
          <i
            className={`fa ${record.funnelStageIcon} fa-lg mr-3`}
            aria-hidden="true"
            style={{ color: '#1976D2' }}
          />
          <Tooltip
            title={
              <Row>
                <Col>
                  {`Criado em ${moment(record.createDateTime).format(
                    'DD/MM/YY HH:mm',
                  )}`}
                </Col>
                {record.expectedClosingDate && (
                  <Col>
                    {`Previsto para fechar em ${moment(
                      record.expectedClosingDate,
                    ).format('DD/MM/YY')}`}
                  </Col>
                )}
              </Row>
            }
          >
            {record.funnelStageName}
          </Tooltip>
        </span>
      ),
    },
    {
      title: 'Total da proposta',
      nomeColuna: 'Total da proposta',
      dataIndex: 'singleTotalAmount',
      width: 150,
      obrigatorio: true,
      padrao: true,
      render: d => (
        <span>
          {formatNumber(d, {
            style: 'currency',
            currency: 'BRL',
          })}
        </span>
      ),
    },
    {
      title: 'Status',
      nomeColuna: 'Status',
      dataIndex: 'actStatusDescription',
      obrigatorio: true,
      padrao: true,
      width: 100,
      render: (text, record) =>
        record.actStatusCode === 'ABRT'
          ? 'Aberto'
          : record.actStatusCode === 'WON'
          ? 'Ganho'
          : 'Perdido',
    },
    {
      title: 'Cidade',
      nomeColuna: 'Cidade',
      dataIndex: 'cityName',
      width: 100,
      obrigatorio: false,
      padrao: false,
      ellipsis: {
        showTitle: false,
      },
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'UF',
      nomeColuna: 'UF',
      dataIndex: 'stateAbbreviation',
      width: 80,
      obrigatorio: false,
      padrao: false,
      ellipsis: {
        showTitle: false,
      },
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Valor recorrência',
      nomeColuna: 'Valor recorrência',
      dataIndex: 'recurringValue',
      width: 150,
      obrigatorio: false,
      padrao: false,
      render: d => (
        <span>
          {formatNumber(d || 0, {
            style: 'currency',
            currency: 'BRL',
          })}
        </span>
      ),
    },
    {
      title: 'Valor produto',
      nomeColuna: 'Valor produto',
      dataIndex: 'valorProdutos',
      width: 150,
      obrigatorio: false,
      padrao: false,
      render: d => (
        <span>
          {formatNumber(d || 0, {
            style: 'currency',
            currency: 'BRL',
          })}
        </span>
      ),
    },
    {
      title: 'Valor serviços',
      nomeColuna: 'Valor serviços',
      dataIndex: 'valorServicos',
      width: 150,
      obrigatorio: false,
      padrao: false,
      render: d => (
        <span>
          {formatNumber(d || 0, {
            style: 'currency',
            currency: 'BRL',
          })}
        </span>
      ),
    },
    {
      title: 'Valor locação',
      nomeColuna: 'Valor locação',
      dataIndex: 'locationValue',
      width: 150,
      obrigatorio: false,
      padrao: false,
      franquia: true,
      render: d => (
        <span>
          {formatNumber(d || 0, {
            style: 'currency',
            currency: 'BRL',
          })}
        </span>
      ),
    },
    {
      title: 'Data de criação',
      nomeColuna: 'Data de criação',
      dataIndex: 'createDateTime',
      width: 130,
      obrigatorio: false,
      padrao: false,
      sorter: (a, b) => customSort(a.createDateTime, b.createDateTime),
      render: d => moment(d).format('DD/MM/YY'),
    },
    {
      title: 'Data de envio de proposta',
      nomeColuna: 'Data de envio de proposta',
      dataIndex: 'proposalSendDate',
      width: 100,
      obrigatorio: false,
      padrao: false,
      franquia: true,
      render: d => {
        return d ? moment(d).format('DD/MM/YY') : ''
      },
    },
    {
      title: 'Data de expiração da proposta',
      nomeColuna: 'Data de expiração da proposta',
      dataIndex: 'proposalExpirationDate',
      width: 100,
      obrigatorio: false,
      padrao: false,
      franquia: true,
      render: d => {
        const currentDate = new Date()
        const dataDate = new Date(d)

        const style = currentDate > dataDate ? 'text-red-600' : ''

        return (
          <span className={style}>
            {' '}
            {d ? moment(d).format('DD/MM/YY') : ''}{' '}
          </span>
        )
      },
    },
    {
      title: 'Dias de envio da proposta',
      nomeColuna: 'Dias de envio da proposta',
      dataIndex: 'proposalSendDays',
      width: 100,
      obrigatorio: false,
      padrao: false,
      franquia: true,
    },
    {
      title: 'Dias sem interação',
      nomeColuna: 'Dias sem interação',
      dataIndex: 'daysNotInteraction',
      width: 100,
      obrigatorio: false,
      padrao: false,
      sorter: (a, b) =>
        (a.daysNotInteraction === null ? -1 : a.daysNotInteraction) -
        (b.daysNotInteraction === null ? -1 : b.daysNotInteraction),
    },
    {
      title: 'Atividades agendadas',
      nomeColuna: 'Atividades agendadas',
      dataIndex: 'scheduledActivities',
      width: 100,
      obrigatorio: false,
      padrao: false,
      render: (quantity, record) => (quantity === 0 ? '' : quantity),
      sorter: (a, b) => a.scheduledActivities - b.scheduledActivities,
    },
    {
      title: 'Área de negócio',
      nomeColuna: 'Área de negócio',
      dataIndex: 'unidadeNegocio',
      width: 200,
      obrigatorio: false,
      padrao: false,
    },
    {
      title: 'Tipo de negócio',
      nomeColuna: 'Tipo de negócio',
      dataIndex: 'proposalTypeDescription',
      width: 100,
      obrigatorio: false,
      padrao: false,
      franquia: true,
    },
    {
      title: 'Forma de pagamento',
      nomeColuna: 'Forma de pagamento',
      dataIndex: 'receiptMethodDescription',
      width: 100,
      obrigatorio: false,
      padrao: false,
    },
    {
      title: 'Condições de pagamento',
      nomeColuna: 'Condições de pagamento',
      dataIndex: 'paymentConditionDescription',
      width: 100,
      obrigatorio: false,
      padrao: false,
    },
    {
      title: 'Prazo de instalação',
      nomeColuna: 'Prazo de instalação',
      dataIndex: 'installDate',
      width: 100,
      obrigatorio: false,
      padrao: false,
      franquia: true,
      render: d => moment(d).format('DD/MM/YY'),
    },
    {
      title: 'Unidades habitacionais',
      nomeColuna: 'Unidades habitacionais',
      dataIndex: 'apartamentQuantity',
      width: 100,
      obrigatorio: false,
      padrao: false,
      franquia: true,
    },
    {
      title: 'Previsão de faturamento',
      nomeColuna: 'Previsão de faturamento',
      dataIndex: 'billingForecastDate',
      width: 100,
      obrigatorio: false,
      padrao: false,
      franquia: true,
      render: d => moment(d).format('DD/MM/YY'),
    },
    {
      title: 'Data do fechamento',
      nomeColuna: 'Data do fechamento',
      dataIndex: 'closedDate',
      width: 100,
      obrigatorio: false,
      padrao: false,
      render: d => moment(d).format('DD/MM/YY'),
    },
    {
      title: 'Contato',
      nomeColuna: 'Contato',
      dataIndex: 'personContactName',
      width: 100,
      obrigatorio: false,
      padrao: false,
    },
    {
      title: 'E-mail contato',
      nomeColuna: 'E-mail contato',
      dataIndex: 'email',
      width: 100,
      obrigatorio: false,
      padrao: false,
      ellipsis: {
        showTitle: false,
      },
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Celular contato',
      nomeColuna: 'Celular contato',
      dataIndex: 'celular',
      width: 150,
      obrigatorio: false,
      padrao: false,
    },
    {
      title: 'Motivo da perda',
      nomeColuna: 'Motivo da perda',
      dataIndex: 'lossReasonName',
      width: 100,
      obrigatorio: false,
      padrao: false,
      ellipsis: {
        showTitle: false,
      },
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Documentos',
      nomeColuna: 'Documentos',
      dataIndex: 'documents',
      width: 220,
      ellipsis: {
        showTitle: false,
      },
      obrigatorio: false,
      padrao: false,
      render: val =>
        val && <TooltipParagraph>{renderDocument(val)}</TooltipParagraph>,
    },
  ])

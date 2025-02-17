import styles from '@pages/CRM/styles.css'
import { customSort, formatTaskDateTime, formatTaskDuration } from '@utils'
import { Tooltip } from 'antd'
import moment from 'moment'
import React from 'react'

export const taskGridColumns = () =>
  Object.freeze([
    {
      title: 'Tipo de Tarefa',
      nomeColuna: 'Tipo de Tarefa',
      dataIndex: 'taskTypeName',
      width: 200,
      obrigatorio: true,
      padrao: true,
      fixed: 'left',
      sorter: (a, b) => customSort(a.taskTypeName, b.taskTypeName),
      render: (text, record) => (
        <div>
          <Tooltip title={record.number ? `Negócio: ${record.number}` : ''}>
            <i
              className={`mr-2 fa ${record.taskTypeIcon} fa-lg fa-fw ${styles.crmColorIconGrid}`}
            />
            {text}
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Organização',
      nomeColuna: 'Organização',
      dataIndex: 'companyShortName',
      width: 300,
      obrigatorio: true,
      padrao: true,
      sorter: (a, b) => customSort(a.companyShortName, b.companyShortName),
      render: (text, record) => (
        <div>
          <i
            className={`mr-2 fa ${
              record.companyPersonType === 1 ? 'fa-user' : 'fa-industry'
            } fa-fw ${styles.crmColorIconPersonGrid}`}
          />
          {text}
        </div>
      ),
    },
    {
      title: 'Responsável',
      nomeColuna: 'Responsável',
      dataIndex: 'responsibleName',
      width: 300,
      obrigatorio: true,
      padrao: true,
      franquia: true,
      sorter: (a, b) => customSort(a.responsibleName, b.responsibleName),
    },
    {
      title: 'Assunto',
      nomeColuna: 'Assunto',
      dataIndex: 'subject',
      width: 300,
      obrigatorio: true,
      padrao: true,
      sorter: (a, b) => customSort(a.subject, b.subject),
      render: text => <React.Fragment>{text}</React.Fragment>,
    },
    {
      title: 'Data da agenda',
      nomeColuna: 'Data da agenda',
      key: 'expectedDateTime',
      dataIndex: 'expectedDateTime',
      obrigatorio: true,
      padrao: true,
      sorter: (a, b) => customSort(a.expectedDateTime, b.expectedDateTime),
      render: (text, record) => (
        <p
          className="m-0"
          style={{
            color:
              !record.realizedDate && moment(record.expectedDateTime) < moment()
                ? 'red'
                : 'black',
          }}
        >
          {formatTaskDateTime(text, record.isAllDay)}
        </p>
      ),
    },
    {
      title: 'Duração',
      nomeColuna: 'Duração',
      dataIndex: 'expectedDuration',
      obrigatorio: true,
      padrao: true,
      sorter: (a, b) => customSort(a.expectedDuration, b.expectedDuration),
      render: (text, record) => (
        <span>{formatTaskDuration(record.expectedDuration)}</span>
      ),
    },
    {
      title: 'Vendedor',
      nomeColuna: 'Vendedor',
      dataIndex: 'sellerName',
      obrigatorio: true,
      padrao: true,
      sorter: (a, b) => customSort(a.sellerName, b.sellerName),
    },
    {
      title: 'Status',
      nomeColuna: 'Status',
      dataIndex: 'status',
      obrigatorio: true,
      padrao: true,
      width: 100,
      render: (text, record) =>
        !record.realizedDate ? 'Pendente' : 'Concluído',
    },
    {
      title: 'Data da criação',
      nomeColuna: 'Data da criação',
      dataIndex: 'createDateTime',
      obrigatorio: false,
      padrao: false,
      sorter: (a, b) => customSort(a.createDateTime, b.createDateTime),
      render: d => moment(d).format('DD/MM/YYYY'),
    },
    {
      title: 'Data da conclusão',
      nomeColuna: 'Data da conclusão',
      dataIndex: 'realizedDate',
      obrigatorio: false,
      padrao: false,
      sorter: (a, b) => customSort(a.realizedDate, b.realizedDate),
      render: d => d && moment(d).format('DD/MM/YYYY'),
    },
    {
      title: 'Negócio',
      nomeColuna: 'Negócio',
      dataIndex: 'proposalNumber',
      obrigatorio: false,
      padrao: false,
      sorter: (a, b) => customSort(a.proposalNumber, b.proposalNumber),
    },
    {
      title: 'Origem do contato',
      nomeColuna: 'Origem do contato',
      dataIndex: 'origemContato',
      obrigatorio: false,
      padrao: false,
      franquia: true,
      sorter: (a, b) => customSort(a.origemContato, b.origemContato),
    },
    {
      title: 'Qualificação do contato',
      nomeColuna: 'Qualificação do contato',
      dataIndex: 'qualificacao',
      obrigatorio: false,
      padrao: false,
      sorter: (a, b) =>
        customSort(a.contactQualification, b.contactQualification),
    },
    {
      title: 'Segmento de mercado',
      nomeColuna: 'Segmento de mercado',
      dataIndex: 'segmentoMercado',
      obrigatorio: false,
      padrao: false,
      sorter: (a, b) => customSort(a.segmentoMercado, b.segmentoMercado),
    },
    {
      title: 'Área de negócio',
      nomeColuna: 'Área de negócio',
      dataIndex: 'areaNegocio',
      obrigatorio: false,
      padrao: false,
      sorter: (a, b) => customSort(a.areaNegocio, b.areaNegocio),
    },
  ])

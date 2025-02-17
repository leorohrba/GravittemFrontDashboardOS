import TooltipParagraph from '@components/TooltipParagraph'
import styles from '@pages/CRM/styles.css'
import { customSort, formatCellPhone, formatPhone } from '@utils'
import { Badge } from 'antd'
import moment from 'moment'
import React from 'react'

export const personGridColumns = openRegionModal =>
  Object.freeze([
    {
      title: 'Nome',
      nomeColuna: 'Nome',
      dataIndex: 'shortName',
      width: 200,
      fixed: 'left',
      obrigatorio: true,
      padrao: true,
      sorter: (a, b) => customSort(a.shortName, b.shortName),
      render: (text, record) => (
        <div>
          <i
            className={`mr-1 fa ${
              record.personType === 1 ? 'fa-user' : 'fa-industry'
            } fa-fw ${styles.crmColorIconPersonGrid}`}
          />
          {record.shortName}
        </div>
      ),
    },
    {
      title: 'Endereço',
      nomeColuna: 'Endereço',
      dataIndex: 'addressDescription',
      obrigatorio: true,
      padrao: true,
      sorter: (a, b) => customSort(a.addressDescription, b.addressDescription),
      render: (text, record) => (
        <React.Fragment>
          <TooltipParagraph>{text}</TooltipParagraph>
          <p
            className="m-0"
            style={{
              fontSize: 'small',
              color: 'gray',
              fontStyle: 'italic',
            }}
          >
            {!!record.regionName && (
              <span
                role="button"
                className="cursor-pointer ml-2"
                onClick={() => openRegionModal(record.regionId)}
              >
                {`(${record.regionName})`}
              </span>
            )}
          </p>
        </React.Fragment>
      ),
    },
    {
      title: 'Contato e-mail',
      nomeColuna: 'Contato e-mail',
      dataIndex: 'defaultEmail',
      obrigatorio: true,
      padrao: true,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Franqueado',
      nomeColuna: 'Franqueado',
      dataIndex: 'isFranchisee',
      align: 'center',
      obrigatorio: true,
      padrao: true,
      franquia: true,
      render: d => (
        <i
          className="fa fa-check-circle fa-lg mb-2"
          style={{ color: d ? '#1976D2' : 'lightgray' }}
        />
      ),
    },
    {
      title: 'Franqueado  responsável',
      nomeColuna: 'Franqueado  responsável',
      dataIndex: 'responsibleFranchiseeName',
      obrigatorio: true,
      padrao: true,
      franquia: true,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Cidade',
      nomeColuna: 'Cidade',
      dataIndex: 'cityName',
      obrigatorio: true,
      padrao: true,
    },
    {
      title: 'UF',
      nomeColuna: 'UF',
      dataIndex: 'stateAbbreviation',
      width: 100,
      obrigatorio: true,
      padrao: true,
    },
    {
      title: 'Status',
      nomeColuna: 'Status',
      dataIndex: 'isActive',
      width: 100,
      obrigatorio: false,
      padrao: false,
      sorter: (a, b) =>
        a.isActive > b.isActive ? 1 : a.isActive < b.isActive ? -1 : 0,
      render: (isActive, record) => (
        <span>
          <Badge
            status={isActive ? 'success' : 'error'}
            text={isActive ? 'Ativo' : 'Inativo'}
          />
        </span>
      ),
    },
    {
      title: 'Tipo de pessoa',
      nomeColuna: 'Tipo de pessoa',
      dataIndex: 'personType',
      obrigatorio: false,
      padrao: false,
      render: d => (
        <TooltipParagraph>{d === 1 ? 'Física' : 'Jurídica'}</TooltipParagraph>
      ),
    },
    {
      title: 'Colaborador',
      nomeColuna: 'Colaborador',
      dataIndex: 'isCollaborator',
      align: 'center',
      obrigatorio: false,
      padrao: false,
      render: d => (
        <i
          className="fa fa-check-circle fa-lg mb-2"
          style={{ color: d ? '#1976D2' : 'lightgray' }}
        />
      ),
    },
    {
      title: 'Vendedor',
      nomeColuna: 'Vendedor',
      dataIndex: 'isSeller',
      align: 'center',
      obrigatorio: false,
      padrao: false,
      render: d => (
        <i
          className="fa fa-check-circle fa-lg mb-2"
          style={{ color: d ? '#1976D2' : 'lightgray' }}
        />
      ),
    },
    {
      title: 'Usuário',
      nomeColuna: 'Usuário',
      dataIndex: 'username',
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Supervisor',
      nomeColuna: 'Supervisor',
      dataIndex: 'supervisorName',
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Qualificação',
      nomeColuna: 'Qualificação',
      dataIndex: 'qualificacaoDescricao',
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'CNPJ/CPF',
      nomeColuna: 'CNPJ/CPF',
      dataIndex: 'document',
      obrigatorio: false,
      padrao: false,
      render: (text, record) => record.documentCNPJ ?? record.documentCPF,
    },
    {
      title: 'Inscrição estadual',
      nomeColuna: 'Inscrição estadual',
      dataIndex: 'documentIE',
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Inscrição municipal',
      nomeColuna: 'Inscrição municipal',
      dataIndex: 'documentIM',
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'RG',
      nomeColuna: 'RG',
      dataIndex: 'documentRG',
      obrigatorio: false,
      padrao: false,
    },
    {
      title: 'Razão social',
      nomeColuna: 'Razão social',
      dataIndex: 'name',
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Segmento de mercado',
      nomeColuna: 'Segmento de mercado',
      dataIndex: 'segmentosMercado',
      obrigatorio: false,
      padrao: false,
      render: d => d.map(s => s.segmentoMercadoDescricao).join(', '),
    },
    {
      title: 'Origem do contato',
      nomeColuna: 'Origem do contato',
      dataIndex: 'origemContatoDescricao',
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Unidade de negócio',
      nomeColuna: 'Unidade de negócio',
      dataIndex: 'businessUnit',
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Data de criação',
      nomeColuna: 'Data de criação',
      dataIndex: 'createDateTime',
      obrigatorio: false,
      padrao: false,
      render: date => date && moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Nome do contato',
      nomeColuna: 'Nome do contato',
      dataIndex: 'contactName',
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Telefone do contato',
      nomeColuna: 'Telefone do contato',
      dataIndex: 'phone',
      obrigatorio: false,
      padrao: false,
      render: (text, d) => (
        <React.Fragment>
          {d.phone && <span>{formatPhone(d.phone)}</span>}
        </React.Fragment>
      ),
    },
    {
      title: 'Celular do contato',
      nomeColuna: 'Celular do contato',
      dataIndex: 'cellPhone',
      obrigatorio: false,
      padrao: false,
      render: (text, d) => (
        <React.Fragment>
          {d.cellPhone && <span>{formatCellPhone(d.cellPhone)}</span>}
        </React.Fragment>
      ),
    },
  ])

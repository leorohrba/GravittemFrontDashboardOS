import React from 'react'
import DefaultTable from '@components/DefaultTable'
import { Card, Spin, Tooltip, Row, Col } from 'antd'
import { addBrlCurrencyToNumber, customSort } from '@utils'
import PropTypes from 'prop-types'

export default function SalesRankingCard ({ type, setType, loading, data, openProposalDetail, profile }) {
  
  const columns = [
    {
      title: type === 'franchisee' ? 
             'Franquia' : 
             type === 'seller' ? 
             'Vendedor' :
             type === 'businessArea' ?
             'Área de negócio' :
             '',             
      dataIndex: 'name',
      sorter: (a, b) => customSort(a.name, b.name),
      render: (text, d) => (
        <span
          role="button"
          className="cursor-pointer primary-color"
          onClick={() => openProposalDetail(
                            type === 'franchisee' ? 
                            'salesRankingFranchisee' : 
                            type === 'businessArea' ?
                            'salesRankingBusinessArea' :
                            'salesRankingSeller'
                           , d.id)}
        >
         {text}
       </span>),  
    },
    {
      title: 'Ganhas',
      dataIndex: 'quantityWon',
      sorter: (a, b) => a.quantityWon - b.quantityWon,
      render: (text, d) => (
        <React.Fragment>
          <span style={{ color: '#4caf50', fontSize: '130%' }}>
            {d.quantityWon}
          </span>  
          <br />
          <span style={{ fontSize: '90%'}}>
            <Tooltip title="Valor único">
              {addBrlCurrencyToNumber(d.uniqueValueWon)}
            </Tooltip>  
          </span>
          <br />
          <span style={{ fontSize: '90%'}}>
            <Tooltip title="Valor recorrente">
              {addBrlCurrencyToNumber(d.recurrenceValueWon)}
            </Tooltip>  
          </span>
        </React.Fragment>
      )
    },
    {
      title: 'Perdidas',
      dataIndex: 'quantityLost',
      sorter: (a, b) => a.quantityLost - b.quantityLost,
      render: (text, d) => (
        <React.Fragment>
          <span style={{ color: 'red', fontSize: '130%' }}>
            {d.quantityLost}
          </span>  
          <br />
          <span style={{ fontSize: '90%'}}>
            <Tooltip title="Valor único">
              {addBrlCurrencyToNumber(d.uniqueValueLost)}
            </Tooltip>  
          </span>
          <br />
          <span style={{ fontSize: '90%'}}>
            <Tooltip title="Valor recorrente">
              {addBrlCurrencyToNumber(d.recurrenceValueLost)}
            </Tooltip>  
          </span>
        </React.Fragment>
      )
    },
  ]

  return (
  <Spin spinning={loading}>  
    <Card title={
        <Row type="flex" gutter={12}>
          <Col>
            <Tooltip title="Ranking de vendas dos negócios com data de fechamento conforme período selecionado">
              Ranking de vendas
            </Tooltip>
          </Col>
          <Col className="ml-auto">
            <Tooltip title="Visualizar ranking de vendas por vendedor">
              <i
                className="cursor-pointer fa fa-user-circle"
                role="button"
                style={{ color: type === 'seller' ? '#3182ce' : 'gray' }}
                onClick={() => setType('seller')}
              /> 
            </Tooltip>            
          </Col>
          <Col style={{ display: profile?.ownerProfile === 'Standard' ? 'none' : 'block'}}>
            <Tooltip title="Visualizar ranking de vendas por franquia">
              <i
                className="cursor-pointer fa fa-building-o"
                role="button"
                style={{ color: type === 'franchisee' ? '#3182ce' : 'gray' }}
                onClick={() => setType('franchisee')}
              /> 
            </Tooltip>            
          </Col>
          <Col>
            <Tooltip title="Visualizar ranking de vendas por área de negócio">
              <i
                className="cursor-pointer fa fa-briefcase"
                role="button"
                style={{ color: type === 'businessArea' ? '#3182ce' : 'gray' }}
                onClick={() => setType('businessArea')}
              /> 
            </Tooltip>            
          </Col>
        </Row>
      }  
    >
      <DefaultTable
        size="small"
        rowKey={record => record.id}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </Card>
  </Spin>  
  )
}

SalesRankingCard.propTypes = {
  type: PropTypes.string, 
  setType: PropTypes.func,
  loading: PropTypes.bool,
  data: PropTypes.array, 
  openProposalDetail: PropTypes.func,
  profile: PropTypes.any,
}
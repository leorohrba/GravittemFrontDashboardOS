/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */
import { Form } from '@ant-design/compatible'
import { addBrlCurrencyToNumber, customSort, formatNumber } from '@utils'
import { Alert, Col, Row, Table, Tooltip } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
// eslint-disable-next-line import/no-cycle
import { LeftBarParcelsEditableCell } from './LeftBarParcelsEditableCell'
import { LeftBarParcelsModalFooter } from './LeftBarParcelsModalFooter'

export const EditableContext = React.createContext()

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

EditableRow.propTypes = {
  form: PropTypes.object,
  index: PropTypes.any,
}

const EditableFormRow = Form.create()(EditableRow)

class EditableTable extends React.Component {
  constructor(props) {
    super(props)

    this.columns = [
      {
        title: 'Parcela',
        dataIndex: 'number',
        width: '20%',
        sorter: (a, b) => a.number - b.number,
      },
      {
        title: 'Vencimento',
        dataIndex: 'dueDate',
        width: '45%',
        isDate: true,
        editable: true,
        sorter: (a, b) => customSort(a.dueDate, b.dueDate),
        render: (text, record) => moment(record.dueDate).format('DD/MM/YYYY'),
      },
      {
        title: 'Valor',
        width: '35%',
        dataIndex: 'presentValue',
        sorter: (a, b) => a.value - b.value,
        editable: true,
        render: (text, record) => (
          <Tooltip title={record.presentValue}>
            {addBrlCurrencyToNumber(record.presentValue)}
          </Tooltip>
        ),
      },
    ]

    this.columnsWithInterest = [
      {
        title: 'Parcela',
        dataIndex: 'number',
        width: '10%',
        sorter: (a, b) => a.number - b.number,
      },
      {
        title: 'Vencimento',
        dataIndex: 'dueDate',
        width: '10%',
        isDate: true,
        editable: true,
        sorter: (a, b) => customSort(a.dueDate, b.dueDate),
        render: (text, record) => moment(record.dueDate).format('DD/MM/YYYY'),
      },
      {
        title: 'Valor',
        width: '30%',
        dataIndex: 'presentValue',
        sorter: (a, b) => a.presentValue - b.presentValue,
        editable: true,
        render: (text, record) => (
          <Tooltip title={record.presentValue}>
            {addBrlCurrencyToNumber(record.presentValue)}
          </Tooltip>
        ),
      },
      {
        title: 'Juros',
        width: '20%',
        dataIndex: 'interest',
        sorter: (a, b) => a.interest - b.interest,
        editable: false,
        render: (text, record) => (
          <Tooltip title={record.interest}>{`${formatNumber(
            record.interest,
            10,
          )}%`}</Tooltip>
        ),
      },
      {
        title: 'Valor calculado',
        width: '30%',
        dataIndex: 'value',
        sorter: (a, b) => a.value - b.value,
        editable: false,
        render: (text, record) => (
          <Tooltip title={record.value}>
            {addBrlCurrencyToNumber(record.value)}
          </Tooltip>
        ),
      },
    ]

    this.state = this.props.data
  }

  handleSave = (row, editAll) => {
    let newData = [...this.state.parcels]
    const index = newData.findIndex(item => row.number === item.number)

    if (index === 0 && editAll) {
      const firstDate = row.dueDate

      newData = newData.map(p => {
        let dueDate = firstDate

        const paymentConditionItem = this.props.paymentConditions
          .find(pc => pc.paymentConditionId === this.props.paymentConditionId)
          .items.find(i => i.plotNumber === p.number)

        if (p.number !== 1) {
          dueDate = moment(dueDate).add(
            paymentConditionItem.deadlinePlot,
            'days',
          )
        }

        p.dueDate = dueDate
        return p
      })
    }

    const item = newData[index]
    row.value = row.presentValue * (1 + (row.interest || 0) / 100)
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    this.setState({ parcels: newData })
  }

  render() {
    const { parcels } = this.state

    const hasInterest = !!parcels.find(x => x.interest > 0)

    const components = {
      body: {
        row: EditableFormRow,
        cell: LeftBarParcelsEditableCell,
      },
    }
    const columnsMap = hasInterest ? this.columnsWithInterest : this.columns
    const columns = columnsMap.map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: record => ({
          paymentConditions: this.props.paymentConditions,
          record,
          editable: col.editable,
          isDate: col.isDate,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      }
    })
    const { setShowProposalParcel } = this.props

    const parcelTotal = this.state.parcels.reduce(
      (accumulator, currentValue) => accumulator + currentValue.presentValue,
      0,
    )

    const parcelTotalCalculated = this.state.parcels.reduce(
      (accumulator, currentValue) => accumulator + currentValue.value,
      0,
    )

    const { totalPresentValue } = this.state

    const differenceWithoutRound = totalPresentValue - parcelTotal
    const difference = parseFloat(differenceWithoutRound.toFixed(2))
    const positiveDifference = Math.abs(difference)

    return (
      <React.Fragment>
        <div className="p-5">
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={parcels}
            columns={columns}
            footer={() => (
              <Row className="font-bold w-full" type="flex">
                <Col style={{ width: hasInterest ? '32.5%' : '70%' }}>
                  Total
                </Col>
                <Col style={{ width: hasInterest ? '45%' : '28%' }}>
                  <Tooltip title={parcelTotal}>
                    {addBrlCurrencyToNumber(parcelTotal)}
                  </Tooltip>
                </Col>
                {hasInterest && (
                  <Col>
                    <Tooltip title={parcelTotalCalculated}>
                      {addBrlCurrencyToNumber(parcelTotalCalculated)}
                    </Tooltip>
                  </Col>
                )}
              </Row>
            )}
            pagination={false}
          />
          {difference !== 0 && (
            <Alert
              message={
                <span>
                  {`A soma do valor das parcelas deve ser igual ao valor total único para salvar. O valor das parcelas está com diferença ${
                    difference < 0 ? 'positiva' : 'negativa'
                  } de `}
                  <Tooltip title={Math.abs(differenceWithoutRound)}>
                    {addBrlCurrencyToNumber(positiveDifference)}
                  </Tooltip>
                  .
                </span>
              }
              type="warning"
              className="mt-3"
            />
          )}
        </div>
        <LeftBarParcelsModalFooter
          parcels={this.state.parcels}
          setShowProposalParcel={setShowProposalParcel}
          parcelTotal={parcelTotal}
          total={totalPresentValue}
          proposalId={this.props.proposalId}
          onChange={this.props.onChange}
          difference={difference}
        />
      </React.Fragment>
    )
  }
}

EditableTable.propTypes = {
  data: PropTypes.array,
  proposalId: PropTypes.number,
  setShowProposalParcel: PropTypes.func,
  onChange: PropTypes.func,
}

export default EditableTable

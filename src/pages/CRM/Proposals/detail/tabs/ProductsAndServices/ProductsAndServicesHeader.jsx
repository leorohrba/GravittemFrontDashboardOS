import Button from '@components/Button'
import PropTypes from 'prop-types'
import React from 'react'
import { Row, Col, Tooltip, Spin, InputNumber, Select, Form } from 'antd'
import { removeNumberFormatting } from '@utils'
import ReactExport from 'react-data-export'
import styles from '@pages/CRM/styles.css'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { renderOptions } from '../../../Utils/index'
import { getProposalHistories, getService } from '../../../service'
import { useForm } from 'antd/lib/form/Form'
import { Popover } from 'antd'
import { useDetailProposalContext } from '../../context/DetailProposalContext'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

export default function ProductsAndServicesHeader({
  tableSelectedRowKeys,
  confirmDeleteProposalItems,
  confirmUpdatePriceItems,
  canInclude,
  userPermissions,
  editItem,
  loading,
  currentDiscountPercent,
  setDiscountPercent,
  discountPercent,
  currentDiscountValue,
  setDiscountValue,
  discountValue,
  currentProfitPercent,
  setProfitPercent,
  profitPercent,
  onApplyProfitPercent,
  onApplyDiscountPercent,
  onApplyDiscountValue,
  isSaving,
  dataExport,
  number,
  setPriceListValue,
  proposalId,
}) {
  const { formatPercent, parsePercent } = useDetailProposalContext()

  const [form] = useForm()
  const [priceList, setPriceList] = useState([])
  const [historiesByProposalId, setHistoriesByProposalId] = useState([])
  const [lastAppliedProfits, setLastAppliedProfits] = useState([])

  const priceListDefault =
    priceList?.priceList && priceList?.priceList.length == 1
      ? priceList.priceList[0]?.priceListId
      : null

  const updateLastAppliedProfits = () => {
    const matchedItems = priceList.priceList
      .map(item => {
        const filteredHistories = historiesByProposalId
          .filter(history => history.title && history.title.includes(item.name))
          .sort(
            (a, b) => new Date(b.dateTimeHistory) - new Date(a.dateTimeHistory),
          )

        if (filteredHistories[0]) {
          // Substitui o título pelo nome do priceList correspondente
          return { ...filteredHistories[0], title: item.name }
        }

        return undefined
      })
      .filter(Boolean) // Remove valores undefined

    setLastAppliedProfits(matchedItems)
  }

  const appliedProfits = (
    <>
      {lastAppliedProfits.map(data => (
        <div
          key={data.title}
          className="border-gray-300 border-solid border-t-0 border-r-0 border-l-0 border-b my-2"
        >
          <strong className="mb-0">
            {data.title + ' - ' + data.newValue + ' de lucro'}
          </strong>
        </div>
      ))}
    </>
  )

  useEffect(() => {
    getService('/api/CRM/PriceList', setPriceList)
    getProposalHistories(proposalId, setHistoriesByProposalId)
  }, [])

  useEffect(() => {
    if (priceList?.priceList) {
      updateLastAppliedProfits()
    }
  }, [priceList, historiesByProposalId])

  useEffect(() => {
    if (priceListDefault) {
      setPriceListValue(
        priceList?.priceList.filter(x => x.priceListId == priceListDefault),
      )
      form.setFieldsValue({ priceList: priceListDefault })
    }
  }, [priceListDefault])

  return (
    canInclude && (
      <>
        <Row className="w-full" type="flex" align="middle">
          {tableSelectedRowKeys.length === 0 && canInclude && (
            <Button
              size="default"
              type="primary"
              onClick={() => editItem(0)}
              disabled={loading}
            >
              <i className="fa fa-plus fa-lg mr-3" />
              Novo produto ou serviço
            </Button>
          )}
          {tableSelectedRowKeys.length > 0 && (
            <Button
              quantity={tableSelectedRowKeys.length}
              id="button-delete-account-plan"
              type="outline"
              disabled={loading}
              onClick={() => confirmDeleteProposalItems()}
              className="mr-3"
              style={{
                color: '#D32F2F',
                border: '1px solid #D32F2F',
              }}
            >
              <i
                className="fa fa-trash fa-lg mr-3"
                size="default"
                style={{
                  color: '#D32F2F',
                }}
              />
              Excluir
            </Button>
          )}

          {tableSelectedRowKeys.length > 0 && (
            <Button
              quantity={tableSelectedRowKeys.length}
              type="outline"
              className="mr-3"
              disabled={loading}
              onClick={() => confirmUpdatePriceItems()}
              style={{
                border: '1px solid',
              }}
            >
              <i className="fa fa-repeat fa-lg mr-3" size="default" />
              Atualizar preços
            </Button>
          )}

          {tableSelectedRowKeys.length > 0 && (
            <ExcelFile
              filename={`Itens_do_negocio_${number}_${moment().format(
                'DD_MM_YYYY_HH_mm',
              )}`}
              element={
                <Button size="default" className="iconButton">
                  <i className="fa fa-download fa-lg mr-3" />
                  Exportar ({tableSelectedRowKeys.length})
                </Button>
              }
            >
              <ExcelSheet
                dataSet={dataExport}
                name={`Itens_do_negócio_${number}`}
              />
            </ExcelFile>
          )}
          <Col className="ml-auto" span={10}>
            <Form
              style={{ width: '100%' }}
              form={form}
              initialValues={{ priceList: priceListDefault }} // Definindo valor inicial aqui
            >
              <Form.Item
                label="Lista de preço"
                name="priceList"
                rules={[{ required: true }]}
                className="m-0"
                form={form}
              >
                <Select
                  className="w-full h-full"
                  placeholder="Selecione"
                  onChange={(_, priceList) => setPriceListValue(priceList.data)}
                >
                  {renderOptions(priceList?.priceList)}
                </Select>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row className="w-full mt-6">
          <Col className="ml-auto mr-3">
            <span className="align-middle">
              <b>% de Desconto:</b>
            </span>
          </Col>
          <Col>
            <Spin spinning={isSaving}>
              <InputNumber
                precision={2}
                fixedDecimalScale
                allowNegative={false}
                decimalSeparator=","
                formatter={formatPercent}
                parser={parsePercent}
                disabled={!canInclude}
                onChange={value => setDiscountPercent(value)}
              />
            </Spin>
          </Col>
          {discountPercent != null && discountPercent >= 0 && (
            <React.Fragment>
              <Col>
                <Tooltip title="Aplicar">
                  <Button
                    shape="circle"
                    size="default"
                    type="primary"
                    disabled={isSaving}
                    onClick={() => onApplyDiscountPercent()}
                    ghost
                    className="iconButton ml-1"
                  >
                    <i className="fa fa-check fa-lg" />
                  </Button>
                </Tooltip>
              </Col>
              <Col>
                <Tooltip title="Cancelar">
                  <Button
                    shape="circle"
                    size="default"
                    disabled={isSaving}
                    type="primary"
                    ghost
                    onClick={() => setDiscountPercent(currentDiscountPercent)}
                    className="iconButton ml-1"
                  >
                    <i
                      className={`fa fa-times fa-lg ${styles.crmColorIconEdit}`}
                    />
                  </Button>
                </Tooltip>
              </Col>
            </React.Fragment>
          )}
          <Col className="mx-3">
            <span className="align-middle">
              <b>Valor de Desconto:</b>
            </span>
          </Col>
          <Col>
            <Spin spinning={isSaving}>
              <InputNumber
                precision={2}
                fixedDecimalScale
                allowNegative={false}
                decimalSeparator=","
                formatter={value => value && `R$ ${value}`}
                parser={removeNumberFormatting}
                disabled={true}
                value={discountValue}
                onChange={value => setDiscountValue(value)}
              />
            </Spin>
          </Col>
          {discountValue != null && discountValue >= 0 && (
            <React.Fragment>
              <Col>
                <Tooltip title="Aplicar">
                  <Button
                    shape="circle"
                    size="default"
                    type="primary"
                    disabled={isSaving}
                    onClick={() => onApplyDiscountValue()}
                    ghost
                    className="iconButton ml-1"
                  >
                    <i className="fa fa-check fa-lg" />
                  </Button>
                </Tooltip>
              </Col>
              <Col>
                <Tooltip title="Cancelar">
                  <Button
                    shape="circle"
                    size="default"
                    disabled={isSaving}
                    type="primary"
                    ghost
                    onClick={() => setDiscountValue(currentDiscountValue)}
                    className="iconButton ml-1"
                  >
                    <i
                      className={`fa fa-times fa-lg ${styles.crmColorIconEdit}`}
                    />
                  </Button>
                </Tooltip>
              </Col>
            </React.Fragment>
          )}

          <Col className="mx-3">
            <span className="align-middle">
              <b>Margem:</b>
            </span>
          </Col>
          <Col>
            <Spin spinning={isSaving}>
              <InputNumber
                precision={2}
                fixedDecimalScale
                allowNegative={false}
                decimalSeparator="."
                formatter={formatPercent}
                parser={parsePercent}
                disabled={!canInclude}
                value={profitPercent}
                onChange={value => setProfitPercent(value)}
              />
            </Spin>
          </Col>
          {profitPercent != null && profitPercent >= 0 && (
            <React.Fragment>
              <Col>
                <Tooltip title="Aplicar">
                  <Button
                    shape="circle"
                    size="default"
                    type="primary"
                    disabled={isSaving}
                    onClick={() => onApplyProfitPercent()}
                    ghost
                    className="iconButton ml-1"
                  >
                    <i className="fa fa-check fa-lg" />
                  </Button>
                </Tooltip>
              </Col>
              <Col>
                <Tooltip title="Cancelar">
                  <Button
                    shape="circle"
                    size="default"
                    disabled={isSaving}
                    type="primary"
                    ghost
                    onClick={() => setProfitPercent(currentProfitPercent)}
                    className="iconButton ml-1"
                  >
                    <i
                      className={`fa fa-times fa-lg ${styles.crmColorIconEdit}`}
                    />
                  </Button>
                </Tooltip>
              </Col>
            </React.Fragment>
          )}
        </Row>
        <Row justify="end" gutter={16}>
          <Popover
            placement="bottomLeft"
            title="Últimas margens de lucro aplicadas"
            content={appliedProfits}
            className="mt-3"
          >
            <span className="text-red-500">
              Últimas margens de lucro aplicadas
            </span>
            <i className="fa fa-info-circle cursor-pointer text-blue-500 text-sm ml-1" />
          </Popover>
        </Row>
      </>
    )
  )
}

ProductsAndServicesHeader.propTypes = {
  tableSelectedRowKeys: PropTypes.array,
  confirmDeleteProposalItems: PropTypes.func,
  canInclude: PropTypes.bool,
  userPermissions: PropTypes.array,
  editItem: PropTypes.func,
  loading: PropTypes.bool,
  profitPercent: PropTypes.number,
  setProfitPercent: PropTypes.func,
  currentProfitPercent: PropTypes.number,
  onApplyProfitPercent: PropTypes.func,
  isSaving: PropTypes.bool,
  confirmUpdatePriceItems: PropTypes.func,
  dataExport: PropTypes.array,
  number: PropTypes.number,
}

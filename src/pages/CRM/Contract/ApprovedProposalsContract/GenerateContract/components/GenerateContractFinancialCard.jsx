/* eslint-disable no-template-curly-in-string */
import { Form } from '@ant-design/compatible'
import React, { useState, useEffect, useRef } from 'react'
import {
  getLocaleCurrency,
  showApiNotifications,
  handleAuthError,
} from '@utils'
import { formatDateInput } from '@utils/components'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Row,
  message,
  Spin,
  Checkbox,
} from 'antd'
import PropTypes from 'prop-types'
import { formatNumber, formatMessage } from 'umi-plugin-react/locale'
import { NewAutoComplete, NewSelect } from '@components'
import GenerateContractParcels from './GenerateContractParcels'
import { useGenerateContractContext } from '../context/GenerateContract'
import moment from 'moment'
import { apiNewContract, apiFinancial } from '@services/api'
import { getService } from '../../Services/GetService'

export default function GenerateContractFinancialCard({
  form,
  title,
  data,
  parcelas,
  financialType,
}) {
  const {
    editData,
    paymentConditions,
    type,
    canBeUpdated,
    setVendaParcelas,
    setLocacaoParcelas,
    setRecorrenciaParcelas,
    isProvision,
    setIsProvision,
  } = useGenerateContractContext()
  const { getFieldDecorator } = form
  const [financialConfiguration, setfinancialConfiguration] = useState(false)
  const [currentAccounts, setCurrentAccounts] = useState([])
  const [receiptMethods, setReceiptMethods] = useState([])
  const [showParcels, setShowParcels] = useState(false)
  const [loading, setLoading] = useState(false)

  const dataVencimentoRef = useRef(null)

  async function generateParcelsApi() {
    const params = {
      condicaoParcelamentoId: form.getFieldValue(
        `condicaoParcelamentoId_${financialType}`,
      ),
      dataVencimento: form.getFieldValue(`dataVencimento_${financialType}`)
        ? form
            .getFieldValue(`dataVencimento_${financialType}`)
            .format('YYYY-MM-DD')
        : null,
      valorContrato: data.valor,
      recorrencia: financialType === 3 || financialType === 2,
      vencimentoNoMesmoDia: true,
    }

    if (!params.condicaoParcelamentoId) {
      message.error('Informe a condição de parcelamento!')
      return
    }

    if (!params.dataVencimento) {
      message.error('Informe o dia de vencimento para geração das parcelas!')
      return
    }

    if (!params.valorContrato) {
      message.error('Não é possível gerar parcelas para valor zerado!')
      return
    }
    setLoading(true)
    try {
      const response = await apiNewContract({
        method: 'GET',
        url: `/api/GerarParcelas`,
        params,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        if (financialType === 1) {
          setVendaParcelas(data.parcelas)
        } else if (financialType === 2) {
          setLocacaoParcelas(data.parcelas)
        } else if (financialType === 3) {
          setRecorrenciaParcelas(data.parcelas)
        }
        setShowParcels(true)
      } else {
        showApiNotifications(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  useEffect(() => {
    if (data && type) {
      getService(
        '/api/ConfiguracaoFinanceiro',
        setfinancialConfiguration,
        null,
        apiFinancial,
        'controleRotinasProvisaoParcelas',
      )

      setCurrentAccounts(data?.contaCorrente ? [data.contaCorrente] : [])
      setReceiptMethods(data?.formaBaixa ? [data.formaBaixa] : [])
    }
  }, [data, type])

  useEffect(() => {
    setIsProvision(financialConfiguration)
  }, [financialConfiguration])

  return (
    <div className="mb-2">
      <Spin size="large" spinning={loading}>
        <h3>{title}</h3>
        <Card
          size="small"
          title={
            <h2 className="mb-0">
              {formatNumber(data?.valor, {
                style: 'currency',
                currency: getLocaleCurrency(),
              })}
            </h2>
          }
          extra={
            <div>
              {financialType === 3 && data && financialConfiguration && (
                <Checkbox
                  value={isProvision}
                  defaultChecked={isProvision}
                  disabled={true}
                  onChange={d => setIsProvision(d.target.checked)}
                >
                  Gerar provisão
                </Checkbox>
              )}

              {canBeUpdated && type === 'Proposta' && (
                <Button
                  onClick={() => generateParcelsApi()}
                  type="link"
                  className="px-0 mr-5"
                >
                  Gerar parcelas
                  <i className="fa fa-money ml-2" aria-hidden="true" />
                </Button>
              )}
              <Button
                onClick={() => setShowParcels(!showParcels)}
                type="link"
                className="px-0"
              >
                {showParcels ? 'Ocultar parcelas' : 'Visualizar parcelas'}
                <i className="fa fa-external-link ml-2" aria-hidden="true" />
              </Button>
            </div>
          }
        >
          <Row type="flex" gutter={16}>
            <Col span={6}>
              <NewAutoComplete
                form={form}
                source={currentAccounts}
                setSource={setCurrentAccounts}
                defaultValue={data?.contaCorrente?.contaCorrenteId}
                fieldName={`contaCorrenteId_${financialType}`}
                serviceApi={apiNewContract}
                api="/api/ContaCorrente"
                paramName="Descricao"
                label="Conta corrente"
                placeholder="Digite a descrição"
                disabled={!canBeUpdated || type === 'Contrato'}
                recordId="contaCorrenteId"
                recordDescription="descricao"
                extra="`Agência: ${record.agencia} Conta: ${record.numero}`"
              />
            </Col>
            <Col span={6}>
              <NewAutoComplete
                form={form}
                source={receiptMethods}
                setSource={setReceiptMethods}
                defaultValue={data?.formaBaixa?.formaBaixaId}
                fieldName={`formaBaixaId_${financialType}`}
                serviceApi={apiNewContract}
                api="/api/FormaBaixa"
                defaultParams={{
                  status: 1,
                  empresaId:
                    editData?.perfilEmpresaLogada === 'Franchise'
                      ? editData?.parentOwnerId
                      : null,
                }}
                paramName="Descricao"
                label="Forma de recebimento"
                placeholder="Digite a descrição"
                disabled={!canBeUpdated || type === 'Contrato'}
                recordId="formaBaixaId"
                recordDescription="descricao"
                required={!!data}
              />
            </Col>
            <Col span={6}>
              <NewSelect
                form={form}
                options={paymentConditions}
                optionValue="condicaoParcelamentoId"
                optionLabel="descricao"
                defaultValue={
                  data?.condicaoParcelamento?.condicaoParcelamentoId
                }
                fieldName={`condicaoParcelamentoId_${financialType}`}
                label="Parcelamento"
                required={!!data}
                disabled={!canBeUpdated || type === 'Contrato'}
              />
            </Col>
            <Col span={6}>
              <Form.Item
                label="Data de vencimento"
                onChange={e =>
                  formatDateInput(
                    e.target.value,
                    form,
                    `dataVencimento_${financialType}`,
                    dataVencimentoRef,
                  )
                }
              >
                {getFieldDecorator(`dataVencimento_${financialType}`, {
                  initialValue: data?.dataVencimento
                    ? moment(data.dataVencimento)
                    : null,
                  rules: [
                    {
                      required: !!data,
                      message: formatMessage({ id: 'requiredFieldMessage' }),
                    },
                  ],
                })(
                  <DatePicker
                    disabled={!canBeUpdated || type === 'Contrato'}
                    format="DD/MM/YYYY"
                    style={{
                      width: '100%',
                    }}
                    ref={dataVencimentoRef}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          {showParcels && <GenerateContractParcels parcelas={parcelas} />}
        </Card>
      </Spin>
    </div>
  )
}

GenerateContractFinancialCard.propTypes = {
  form: PropTypes.any,
  financialType: PropTypes.any,
  data: PropTypes.any,
  title: PropTypes.string,
  parcelas: PropTypes.array,
}

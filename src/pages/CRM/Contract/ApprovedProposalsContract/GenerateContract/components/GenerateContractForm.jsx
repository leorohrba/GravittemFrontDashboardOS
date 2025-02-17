/* eslint-disable no-template-curly-in-string */
import { Form } from '@ant-design/compatible'
import React, { useState, useEffect, useRef } from 'react'
import { enumExists, getEnumDefaultOption, getLocaleDateFormat } from '@utils'
import { formatDateInput } from '@utils/components'
import { apiNewContract } from '@services/api'
import { Col, Input, Row, DatePicker } from 'antd'
import PropTypes from 'prop-types'
import { useGenerateContractContext } from '../context/GenerateContract'
import { NewAutoComplete, NewEnum } from '@components'
import { formatMessage } from 'umi-plugin-react/locale'
import moment from 'moment'
import SelectGrouper from '@components/GroupSelect/SelectGrouper'
import { getGrouper } from '../../Services/GetService'

const { RangePicker } = DatePicker

function GenerateContractForm({ form }) {
  const { editData, type, enums, canBeUpdated } = useGenerateContractContext()
  const [costCenters, setCostCenters] = useState([])
  const [classifications, setClassifications] = useState([])
  const [itemsAccountPlan, setItemsAccountPlan] = useState([])
  const [servicesAccountPlan, setServicesAccountPlan] = useState([])
  const [itemPriceLists, setItemPriceLists] = useState([])
  const [servicePriceLists, setServicePriceLists] = useState([])
  const ref = React.useRef()

  useEffect(() => {
    if (editData && type === 'Contrato') {
      const financeiro =
        editData.financeiros?.length > 0 ? editData.financeiros[0] : null
      setClassifications(
        editData?.classificacaoContrato
          ? [editData?.classificacaoContrato]
          : [],
      )
      const planoContaItem = financeiro?.planoContaItem
      const planoContaServico = financeiro?.planoContaServico
      setItemsAccountPlan(planoContaItem ? [planoContaItem] : [])
      setServicesAccountPlan(planoContaServico ? [planoContaServico] : [])
    }
    if (editData) {
      setItemPriceLists(
        editData?.listaPrecoPadraoItem ? [editData.listaPrecoPadraoItem] : [],
      )
      setServicePriceLists(
        editData?.listaPrecoPadraoServico
          ? [editData?.listaPrecoPadraoServico]
          : [],
      )
    }
  }, [editData, type])

  useEffect(() => {
    getGrouper(setCostCenters)
  }, [])

  const { getFieldDecorator } = form
  const periodoVigenciaRef = useRef(null)

  const handleChangeStatus = value => {
    if (
      value &&
      !enumExists(
        enums,
        'Contrato',
        'Motivo',
        value,
        form.getFieldValue('motivo'),
      )
    ) {
      form.setFieldsValue({
        motivo: getEnumDefaultOption(enums, 'Contrato', 'Motivo', value),
      })
    }
  }

  const getLocal = (d, type) => {
    return !d
      ? null
      : `${d?.logradouro}${
          d[type === 'Contrato' ? 'numero' : 'logradouroNumero']
            ? `, ${d[type === 'Contrato' ? 'numero' : 'logradouroNumero']}`
            : ''
        }${d?.bairro ? ` ${d?.bairro}` : ''}, ${d?.cidade} - ${d?.uf}`
  }

  const getExtra = value => {
    let result
    if (value) {
      result = (
        <div className="mb-0" style={{ color: 'gray', marginTop: '-4px' }}>
          <span className="mr-2">Data de emissão:</span>
          <span>{moment(value).format('DD/MM/YYYY HH:mm')}</span>
        </div>
      )
    }
    return result
  }

  return (
    <div>
      <Row type="flex" gutter={12} className="mb-1">
        <Col span={8}>
          <Form.Item
            property=""
            className="mb-0"
            label="N° do contrato"
            extra={type === 'Contrato' ? getExtra(editData?.dataEmissao) : null}
          >
            {getFieldDecorator('numeroContrato', {
              initialValue:
                type === 'Proposta'
                  ? `NG - ${editData?.numero}`
                  : editData?.numero,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'requiredFieldMessage' }),
                },
              ],
            })(
              <Input
                autoFocus
                ref={ref}
                disabled={!canBeUpdated || type === 'Contrato'}
              />,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16} className="mb-2">
        <Col span={6}>
          <Form.Item className="mb-0" label="Contratante">
            {getFieldDecorator('contratante', {
              initialValue:
                type === 'Proposta'
                  ? editData?.contratanteNome
                  : editData?.contratante?.nome,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item className="mb-0" label="Contratado">
            {getFieldDecorator('contratado', {
              initialValue:
                type === 'Proposta'
                  ? editData?.contratadoNome
                  : editData?.contratado.nome,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item className="mb-0" label="Participante">
            {getFieldDecorator('participante', {
              initialValue:
                type === 'Proposta'
                  ? editData?.participanteNome
                  : editData?.participantes?.length > 0
                  ? editData?.participantes[0].pessoa?.nome
                  : null,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
        <Col span={6}>
          <NewEnum
            form={form}
            enums={enums}
            entity="Participante"
            property="TipoParticipante"
            defaultValue={
              type === 'Proposta'
                ? null
                : editData?.participantes?.length > 0
                ? editData?.participantes[0].tipoParticipante
                : null
            }
            fieldName="tipoParticipante"
            label="Tipo de participante"
            required
            disabled={!canBeUpdated || type === 'Contrato'}
          />
        </Col>
      </Row>
      <Row type="flex" gutter={16} className="mb-2">
        <Col span={6}>
          <NewAutoComplete
            form={form}
            source={classifications}
            setSource={setClassifications}
            defaultValue={
              type === 'Proposta'
                ? null
                : editData?.classificacaoContrato?.classificacaoContratoId
            }
            fieldName="classificacaoContratoId"
            serviceApi={apiNewContract}
            api="/api/ClassificacaoContrato"
            defaultParams={{ status: 1 }}
            paramName="Descricao"
            label="Classificação do contrato"
            placeholder="Digite a descrição da classificação"
            required
            disabled={!canBeUpdated || type === 'Contrato'}
            recordId="classificacaoContratoId"
            recordDescription="descricao"
            extra="`Tipo: ${record.tipoContratoDescricao}`"
          />
        </Col>
        <Col span={6}>
          <NewAutoComplete
            form={form}
            source={itemPriceLists}
            setSource={setItemPriceLists}
            defaultValue={editData?.listaPrecoPadraoItem?.listaPrecoId}
            fieldName="listaPrecoPadraoItemId"
            serviceApi={apiNewContract}
            api="/api/ListaPreco"
            paramName="Descricao"
            label="Lista de preço de itens"
            placeholder="Digite a descrição"
            required
            disabled={!canBeUpdated || type === 'Contrato'}
            recordId="listaPrecoId"
            recordDescription="descricao"
            defaultParams={{ status: 1 }}
          />
        </Col>
        <Col span={6}>
          <NewAutoComplete
            form={form}
            source={servicePriceLists}
            setSource={setServicePriceLists}
            defaultValue={editData?.listaPrecoPadraoServico?.listaPrecoId}
            fieldName="listaPrecoPadraoServicoId"
            serviceApi={apiNewContract}
            api="/api/ListaPreco"
            paramName="Descricao"
            label="Lista de preço de serviços"
            placeholder="Digite a descrição"
            required
            disabled={!canBeUpdated || type === 'Contrato'}
            recordId="listaPrecoId"
            recordDescription="descricao"
            defaultParams={{ status: 1 }}
          />
        </Col>
        <Col span={6}>
          <Form.Item
            className="mb-0"
            label="Período de vigência"
            onChange={e =>
              formatDateInput(
                e.target.value,
                form,
                'periodoVigencia',
                periodoVigenciaRef,
                true,
              )
            }
          >
            {getFieldDecorator('periodoVigencia', {
              initialValue:
                type === 'Proposta'
                  ? null
                  : editData?.dataVigenciaInicial || editData?.dataVigenciaFinal
                  ? [
                      editData?.dataVigenciaInicial
                        ? moment(editData?.dataVigenciaInicial)
                        : null,
                      editData?.dataVigenciaFinal
                        ? moment(editData?.dataVigenciaFinal)
                        : null,
                    ]
                  : null,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'requiredFieldMessage' }),
                },
              ],
            })(
              <RangePicker
                disabled={!canBeUpdated || type === 'Contrato'}
                style={{
                  width: '100%',
                }}
                format={getLocaleDateFormat()}
                ref={periodoVigenciaRef}
                allowClear={false}
              />,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16} className="mb-2">
        <Col span={6}>
          <NewEnum
            form={form}
            enums={enums}
            entity="Contrato"
            property="Status"
            defaultValue={type === 'Proposta' ? null : editData?.status}
            getFirstEnumValue
            fieldName="status"
            label="Status"
            required
            disabled={!canBeUpdated || type === 'Contrato'}
            onChange={handleChangeStatus}
          />
        </Col>
        <Col span={6}>
          <NewEnum
            form={form}
            enums={enums}
            entity="Contrato"
            property="Motivo"
            defaultValue={type === 'Proposta' ? null : editData?.motivo}
            getFirstEnumValue
            fieldName="motivo"
            label="Motivo"
            required
            disabled={!canBeUpdated || type === 'Contrato'}
            status={form.getFieldValue('status')}
          />
        </Col>
        <Col span={6}>
          <SelectGrouper
            data={costCenters}
            label="Centro de custo"
            name="centroCustoId"
            defaultValue={
              type === 'Proposta'
                ? null
                : editData?.financeiros?.length > 0
                ? editData?.financeiros[0].centroCusto?.centroCustoId
                : null
            }
            disabled={!canBeUpdated || type === 'Contrato'}
            form={form}
            newForm={false}
            rules={[
              {
                required: true,
                message: 'Por favor, insira o centro de custo!',
              },
            ]}
          ></SelectGrouper>
        </Col>
        <Col span={6}>
          <NewAutoComplete
            form={form}
            source={servicesAccountPlan}
            setSource={setServicesAccountPlan}
            defaultValue={
              type === 'Proposta'
                ? null
                : editData?.financeiros?.length > 0
                ? editData?.financeiros[0].planoContaServico?.planoContaId
                : null
            }
            fieldName="planoContaServicoId"
            serviceApi={apiNewContract}
            api="/api/PlanoConta"
            defaultParams={{ status: 1 }}
            paramName="Descricao"
            label="Plano de contas de serviços"
            placeholder="Digite a descrição"
            required
            disabled={!canBeUpdated || type === 'Contrato'}
            recordId="planoContaId"
            recordDescription="descricao"
          />
        </Col>
      </Row>
      <Row type="flex" gutter={16} className="mb-2">
        <Col span={6}>
          <NewAutoComplete
            form={form}
            source={itemsAccountPlan}
            setSource={setItemsAccountPlan}
            defaultValue={
              type === 'Proposta'
                ? null
                : editData?.financeiros?.length > 0
                ? editData?.financeiros[0].planoContaItem?.planoContaId
                : null
            }
            fieldName="planoContaItemId"
            serviceApi={apiNewContract}
            api="/api/PlanoConta"
            defaultParams={{ status: 1 }}
            paramName="Descricao"
            label="Plano de contas de itens"
            placeholder="Digite a descrição"
            required
            disabled={!canBeUpdated || type === 'Contrato'}
            recordId="planoContaId"
            recordDescription="descricao"
          />
        </Col>
        <Col span={12}>
          <Form.Item className="mb-0" label="Local de atendimento">
            {getFieldDecorator('localAtendimento', {
              initialValue:
                type === 'Proposta'
                  ? getLocal(editData, type)
                  : editData?.locaisAtendimento?.length > 0
                  ? getLocal(editData?.locaisAtendimento[0].endereco, type)
                  : null,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
      </Row>
    </div>
  )
}

GenerateContractForm.propTypes = {
  form: PropTypes.any,
}

export default GenerateContractForm

/* eslint-disable react-hooks/exhaustive-deps */

import { Form } from '@ant-design/compatible'
import { Divider, message } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useGenerateContractContext } from '../context/GenerateContract'
import GenerateContractFinancialCard from './GenerateContractFinancialCard'

function GenerateContractFinancial({ form, totalRecurrenceValue }) {
  const {
    editData,
    type,
    venda,
    setVenda,
    locacao,
    setLocacao,
    recorrencia,
    setRecorrencia,
    vendaParcelas,
    setVendaParcelas,
    locacaoParcelas,
    setLocacaoParcelas,
    recorrenciaParcelas,
    setRecorrenciaParcelas,
    setIsProvision,
  } = useGenerateContractContext()

  useEffect(() => {
    form.resetFields()
  }, [venda, locacao, recorrencia])

  useEffect(() => {
    if (type === 'Proposta' && editData) {
      setDadosProposta()
    } else if (editData) {
      setDadosContrato()
    }
  }, [editData, type])
  function setDadosContrato() {
    setVenda(editData?.financeiros.find(x => x.tipo === 1))
    setVendaParcelas(
      editData?.financeiros.find(x => x.tipo === 1)?.parcelas || [],
    )
    setLocacao(editData?.financeiros.find(x => x.tipo === 2))
    setLocacaoParcelas(
      editData?.financeiros.find(x => x.tipo === 2)?.parcelas || [],
    )
    setRecorrencia(editData?.financeiros.find(x => x.tipo === 3))

    setRecorrenciaParcelas(
      editData?.financeiros.find(x => x.tipo === 3)?.parcelas || [],
    )

    const filteredEditData = {
      ...editData,
      financeiros: editData?.financeiros.filter(x => x.tipo === 3),
    }

    setIsProvision(filteredEditData?.financeiros[0]?.parcelaProvisao)
  }

  function setDadosProposta() {
    setVendaParcelas([])
    setLocacaoParcelas([])
    setRecorrenciaParcelas([])
    if (editData.tipoProposta === 1) {
      setVenda({
        valor: editData?.valorUnico,
        formaBaixa: editData?.formaBaixa,
        condicaoParcelamento: editData?.condicaoParcelamento,
        dataVencimento:
          editData.parcelas?.length > 0
            ? editData.parcelas[0].vencimento
            : null,
      })

      setLocacao(null)
      if (editData?.parcelas?.length > 0) {
        if (
          !editData?.condicaoParcelamento &&
          editData?.condicaoParcelamentoId
        ) {
          message.error(
            'Não foi possível carregar a condição de parcelamento da proposta! Verifique se foi feito a migração do Gravittem para Financeiro!',
          )
        }
        if (editData.parcelas?.length > 0) {
          setVendaParcelas(
            editData.parcelas.map(d => ({
              numero: d.numero,
              dataVencimento: d.vencimento,
              valor: d.valorPresente,
            })),
          )
        }
      }
    } else if (editData.tipoProposta === 2) {
      setLocacao({
        valor: editData?.valorLocacao,
        formaBaixa: editData?.formaBaixa,
        condicaoParcelamento: editData?.condicaoParcelamento,
        dataVencimento:
          editData.parcelas?.length > 0
            ? editData.parcelas[0].vencimento
            : null,
      })
      setVenda(null)
      if (editData?.parcelas?.length > 0) {
        if (
          !editData?.condicaoParcelamento &&
          editData?.condicaoParcelamentoId
        ) {
          message.error(
            'Não foi possível carregar a condição de parcelamento da proposta! Verifique se foi feito a migração do Gravittem para Financeiro!',
          )
        }
        /*
        if (editData.parcelas?.length > 0) {
          setLocacaoParcelas(editData.parcelas.map((d) => ({ numero: d.numero, dataVencimento: d.vencimento, valor: d.valorPresente})))
        }
        */
      }
    }
    setRecorrencia(
      totalRecurrenceValue
        ? {
            valor: totalRecurrenceValue,
            formaBaixa: editData?.formaBaixa,
          }
        : null,
    )
  }

  return (
    <div className="mt-5 mb-2">
      <h2>Financeiro</h2>
      <Divider className="mt-0" />
      <div style={{ display: venda ? 'block' : 'none' }}>
        <GenerateContractFinancialCard
          form={form}
          title="Valor de venda"
          data={venda}
          financialType={1}
          parcelas={vendaParcelas}
        />
      </div>
      <div style={{ display: locacao ? 'block' : 'none' }}>
        <GenerateContractFinancialCard
          form={form}
          title="Valor de locação"
          data={locacao}
          financialType={2}
          parcelas={locacaoParcelas}
        />
      </div>
      <div style={{ display: recorrencia ? 'block' : 'none' }}>
        <GenerateContractFinancialCard
          form={form}
          title="Valor de recorrência"
          data={recorrencia}
          financialType={3}
          parcelas={recorrenciaParcelas}
        />
      </div>
    </div>
  )
}

GenerateContractFinancial.propTypes = {
  form: PropTypes.any,
  totalRecurrenceValue: PropTypes.number,
}

const WrappedGenerateContractFinancial = Form.create()(
  GenerateContractFinancial,
)
export default WrappedGenerateContractFinancial

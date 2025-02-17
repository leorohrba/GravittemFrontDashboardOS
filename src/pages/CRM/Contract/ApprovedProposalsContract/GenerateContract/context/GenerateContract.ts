/* eslint-disable react-hooks/exhaustive-deps */
import constate from 'constate'
import { useState, useEffect } from 'react'
import { apiNewContract, apiCRM, apiFinancial } from '@services/api'
import { message } from 'antd'
import { formatMessage } from 'umi-plugin-react/locale'
import {
  getPermissions,
  handleAuthError,
  hasPermission,
  showApiMessages,
} from '@utils'
import { messageCRM } from '@softinFrontSystems/src/SoftinMessage/message'
import { prepareBody } from '@utils/services/message'
import { messageCostCenter } from '@utils/costCenterMessaging'


function useGenerateContract({ ids }) {
  const [alertMessages, setAlertMessages] = useState([])
  const [editData, setEditData] = useState(null)
  const [userPermissions, setUserPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [generateIds, setGenerateIds] = useState(null)
  const [type, setType] = useState('Proposta')
  const [isSaving, setIsSaving] = useState(false)
  const [canBeUpdated, setCanBeUpdated] = useState(false)
  const [enums, setEnums] = useState([])
  const [paymentConditions, setPaymentConditions] = useState([])
  const [venda, setVenda] = useState(null)
  const [locacao, setLocacao] = useState(null)
  const [recorrencia, setRecorrencia] = useState(null)
  const [vendaParcelas, setVendaParcelas] = useState([])
  const [locacaoParcelas, setLocacaoParcelas] = useState([])
  const [recorrenciaParcelas, setRecorrenciaParcelas] = useState([])
  const [personData, setPersonData] = useState(null)
  const [personBody, setPersonBody] = useState(null)
  const [updatePersonKey, setUpdatePersonKey] = useState(0)
  const [sendPersonKey, setSendPersonKey] = useState(0)
  const [personId, setPersonId] = useState(0)
  const [isProvision, setIsProvision] = useState(true)

  useEffect(() => {
    setCanBeUpdated(
      (!generateIds?.contratoId && hasPermission(userPermissions, 'Incluir')) ||
        (generateIds?.contratoId && hasPermission(userPermissions, 'Alterar')),
    )
  }, [userPermissions, generateIds])

  useEffect(() => {
    setGenerateIds(ids)
  }, [ids])

  useEffect(() => {
    if (generateIds?.contratoId) {
      setType('Contrato')
      getContract()
    } else if (generateIds?.propostaId) {
      setType('Proposta')
      getProposal()
    }
  }, [generateIds])

  useEffect(() => {
    if (editData !== null) {
      if (editData?.contratanteIntId > 0) {
        setPersonId(editData?. contratanteIntId)
        setUpdatePersonKey(key => key + 1)
      }
    }
  }, [editData])

  useEffect(() => {
    if (personId !== 0) {
      getPersonData(personId)
      setSendPersonKey(key => key + 1)
    }
    }, [updatePersonKey])

        
    useEffect(() => {
    if (personData !== null) {
      setPersonBody(prepareBody(personData))
    }  
    }, [sendPersonKey, personData])

    useEffect(() => {
      if (personBody !== null) {
    sendPersonData()  
    }}, [personBody])
    
  useEffect(() => {
    setPermissions()
    getOwner()
    getEnums()
  }, [])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  async function getPersonData(id) {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/Person?personId=${id}&getPersonDetails=true`,
      })
      const { data } = response
      setPersonData(data?.person[0])
    } catch (error) {
      handleAuthError(error)
    }
  }
  
  async function sendFinancialPersonData() {
  try {
    const response = await apiFinancial({
      method:'POST',
      url:`/api/Pessoa/Pessoa`,
      data:personBody
      })  
      if (editData?.pessoaParticipanteIntId > 0) {
      await messageCRM(editData?.pessoaParticipanteIntId)
    }
  }
  catch (error) {
  handleAuthError(error)  
  }  
  }
  
  async function sendPersonData() {
    try {
    const response = await apiNewContract({
    method:'POST',
    url:`/api/Contrato/Pessoa`,
    data:personBody
    })  
    const {data} = response
    if (data?.isOk || response?.status === 200) {
     sendFinancialPersonData()  
    }
    }
    catch (error) {
    handleAuthError(error)  
    }
  }

  async function getPaymentConditions(empresaId) {
    try {
      const response = await apiNewContract({
        method: 'GET',
        url: `/api/CondicaoParcelamento`,
        params: { status: 1, empresaId },
      })
      setPaymentConditions(response.data || [])
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getOwner() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/Owner`,
      })
      if (response?.data?.ownerProfile === 'Franchise') {
        getPaymentConditions(response?.data?.parentOwnerGuid)
      } else {
        getPaymentConditions()
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getEnums() {
    try {
      const response = await apiNewContract({
        method: 'GET',
        url: `/api/enumerador`,
        params: { entidade: 'Contrato|Financeiro|Participante' },
      })
      setEnums(response.data || [])
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getProposal() {
    setLoading(true)
    try {
      const response = await apiNewContract({
        method: 'GET',
        url: `/api/Proposta`,
        params: { propostaId: generateIds.propostaId },
      })
      setLoading(false)
      const { data } = response
      const record = data?.length > 0 ? data[0] : null
      setEditData(record)
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getContract() {
    setLoading(true)
    try {
      const response = await apiNewContract({
        method: 'GET',
        url: `/api/Contrato`,
        params: {
          contratoId: generateIds.contratoId,
          ocultarEstruturaLocalAtendimento: true,
        },
      })
      setLoading(false)
      const { data } = response
      setEditData(data?.length > 0 ? data[0] : null)
    } catch (error) {
      handleAuthError(error)
    }
  }

  function getBody(d) {
    const body = {
      propostaId: editData?.propostaId,
      contratoNumero: d.numeroContrato,
      contratanteId: editData?.contratanteId,
      contratadoId: editData?.contratadoId,
      pessoaEnderecoContratanteId: editData?.pessoaEnderecoId,
      pessoaParticipanteId: editData?.pessoaParticipanteId,
      tipoParticipante: d.tipoParticipante,
      listaPrecoPadraoItemId: d.listaPrecoPadraoItemId,
      listaPrecoPadraoServicoId: d.listaPrecoPadraoServicoId,
      listaPrecoForaContratoItemId: d.listaPrecoPadraoItemId,
      listaPrecoForaContratoServicoId: d.listaPrecoPadraoServicoId,
      classificacaoContratoId: d.classificacaoContratoId,
      planoContaItemId: d.planoContaItemId,
      planoContaServicoId: d.planoContaServicoId,
      status: d.status,
      motivo: d.motivo,
      centroCustoId: d.centroCustoId,
      parcelaProvisao : isProvision,
      dataVigenciaInicial: d.periodoVigencia
        ? d.periodoVigencia[0].format('YYYY-MM-DD')
        : null,
      dataVigenciaFinal: d.periodoVigencia
        ? d.periodoVigencia[1].format('YYYY-MM-DD')
        : null,
      locacao:
        editData?.valorLocacao && editData?.tipoProposta === 2
          ? getFinanceiroContrato(2, editData?.valorLocacao, d)
          : null,
      venda:
        editData?.valorUnico && editData?.tipoProposta === 1
          ? getFinanceiroContrato(1, editData?.valorUnico, d)
          : null,
      recorrencia: editData?.valorRecorrencia
        ? getFinanceiroContrato(3, editData?.valorRecorrencia, d)
        : null,
      itens: editData?.itens?.map(d => ({
        itemId: d.itemId,
        tipoItem: d.tipoItem,
        quantidade: d.quantidade,
        valorUnitario: d.valorUnitarioFinal,
        recorrencia: d.recorrencia,
      })),
    }
    return body
  }

  function getFinanceiroContrato(tipo, valor, d) {
    const financeiro = {
      valor,
      formaBaixaId: d[`formaBaixaId_${tipo}`],
      condicaoParcelamentoId: d[`condicaoParcelamentoId_${tipo}`],
      contaCorrenteId: d[`contaCorrenteId_${tipo}`],
      dataVencimento: d[`dataVencimento_${tipo}`],
      parcelas:
        tipo === 1
          ? vendaParcelas
          : tipo === 2
          ? locacaoParcelas
          : recorrenciaParcelas,
    }
    return financeiro
  }

  async function generateContract(values, callback) {
    const body = getBody(values)

    if (body.venda && body.venda.parcelas?.length === 0) {
      message.error('Não foram geradas as parcelas para venda!')
      return
    }
    if (editData?.tipoProposta === 1) {
      if (body.locacao && body.locacao.parcelas?.length === 0) {
        message.error('Não foram geradas as parcelas para locacação!')
        return
      }
    }
    if (body.recorrencia && body.recorrencia.parcelas?.length === 0) {
      message.error('Não foram geradas as parcelas para recorrencia!')
      return
    }

    await messageCostCenter(values.centroCustoId)
    setIsSaving(true)

    try {
      const response = await apiNewContract({
        method: 'POST',
        url: `/api/Proposta/Contrato`,
        data: body,
      })
      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )

        callback(data.idGerado)
      } else {
        showApiMessages(data)
        setAlertMessages(data.notificacoes || [])
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  return {
    editData,
    setEditData,
    userPermissions,
    loading,
    setLoading,
    getContract,
    getProposal,
    type,
    isSaving,
    setIsSaving,
    canBeUpdated,
    enums,
    paymentConditions,
    generateContract,
    alertMessages,
    setAlertMessages,
    generateIds,
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
    isProvision, 
    setIsProvision
  }
}

const [GenerateContractProvider, useGenerateContractContext] = constate(
  useGenerateContract,
)

export { GenerateContractProvider, useGenerateContractContext }

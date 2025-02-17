/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

import { useState, useEffect } from 'react'
import constate from 'constate'
import { apiCRM, apiLayoutGenerator } from '@services/api'
import { handleAuthError } from '@utils'
import { useProposalContext } from '../../Context/proposalContext'
import { message } from 'antd'

function detailProposalContext() {
  const {
    proposalId,
    setProposalId,
    owner,
    userPermissions,
    proposalStatuses,
    setProposalStatuses,
    setTotalValue,
    totalValue,
  } = useProposalContext()

  const [proposal, setProposal] = useState(null)
  const [proposalTaxLocation, setProposalTaxLocation] = useState([])
  const [printLayouts, setPrintLayouts] = useState([])
  const [sellerId, setSellerId] = useState(null)
  const [contacts, setContacts] = useState([])
  const [profitPercent, setProfitPercent] = useState(null)
  const [refreshAll, setRefreshAll] = useState(0)
  const [refreshTotal, setRefreshTotal] = useState(0)
  const [proposalCanBeUpdate, setProposalCanBeUpdated] = useState(false)

  // LeftBar
  const [personInProposal, setPersonInProposal] = useState()
  const [statusIdSelected, setStatusIdSelected] = useState()

  const [isSaving, setIsSaving] = useState(false)

  const [messageList, setMessageList] = useState([])

  const onChangePermissionProposalUpdate = permission => {
    setProposalCanBeUpdated(permission)
  }

  const clear = () => {
    setProposalTaxLocation([])
    setMessageList([])
  }

  const filterProposalTaxLocationRateLocation = id => {
    return proposalTaxLocation.filter(d => d.locationTime === id)[0]
  }

  const validationAttrFromPerson = () => {
    const prefix = 'Favor revisar o cadastro do cliente, a informação de '
    const sufix = ' pode estar incompleto(a).'

    const {
      addressName,
      addressDescription,
      personType,
      documentCPF,
      documentCNPJ,
      personAddresses
    } = personInProposal

    const validationList = []
    const mainAdress = personAddresses.find(p => p?.isStandart === true)
    const {number, neighborhood, name} = mainAdress
    const addressObj = [addressName, number,neighborhood, name, addressDescription]
    const addressList = ['Endereço']
    const fieldsList = []
    // TO DO Refatorar. Infelizmente hotfix

    if (personType === 1) {
      validationList.push(documentCPF)
      fieldsList.push('CPF')
    } else {
      validationList.push(documentCNPJ)
      fieldsList.push('CNPJ')
    }

    validationList.map((data, index) => {
      if (!data) {
        createMessage(prefix + fieldsList[index] + sufix, 'warning')
      }
      return null
    })

    let hasSended = false
    addressObj.map(data => {
      if (!data && !hasSended) {
        createMessage(prefix + 'Endereço' + sufix, 'warning')
        hasSended = true
      }
      return false
    })


    const isValid =
      validationList.every(attr => attr) && addressList.every(attr => attr)

    const personQualification = personInProposal.qualificacaoDescricao
      ? personInProposal.qualificacaoDescricao?.toUpperCase()
      : ''
    const isClient = personQualification === 'CLIENTE'

    if (!isClient) {
      createMessage(
        'Negócio com status=ganho, a qualificação da pessoa deve ser CLIENTE!',
        'warning',
      )
    }
    // return isValid
    if (isValid && isClient && !hasSended) {
      return true
    }
    setTimeout(() => {
      window.scrollTo({
        top: 0,
      })
    }, 300)
    return false
  }

  const createMessage = (message, type) => {
    const newMessage = {
      key: messageList.length + 1,
      message,
      type,
    }

    messageList.push(newMessage)
    setMessageList([...messageList])
  }

  const getPersonInProposal = async () => {
    setIsSaving(true)
    const response = await apiCRM({
      method: 'get',
      url: '/api/CRM/Person',
      params: { customerId: proposal.companyId, getPersonDetails:true },
    })

    const { data } = response
    if (data.isOk) {
      setPersonInProposal(data.person[0])
      setStatusIdSelected(null)
    } else {
      message.warning(data.message)
    }
    setIsSaving(false)
  }

  const getProposalTaxLocation = async () => {
    try {
      const response = await apiCRM.get('/api/ProposalTaxLocation')
      const { data } = response

      if (data.isOk) {
        setProposalTaxLocation(data.proposalTaxLocations)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }
  async function getPrintLayoutDocument(ownerId) {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/PrintLayoutDocument`,
        params: { ownerId, classDefinition: 'PROPOSAL' },
      })

      const { data } = response

      if (data.isOk) {
        getLayoutGenerator(data.printLayoutDocument || [])
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getLayoutGenerator(layouts) {
    try {
      const response = await apiLayoutGenerator({
        method: 'GET',
        url: `/api/ModeloDocumento/Liberado`,
        params: { codigo: 'Proposal' },
      })

      const { data } = response
      const records = data || []
      records.map(d => {
        layouts.push({
          printLayoutDocumentId: d.modeloDocumentoId,
          documentModelId: d.modeloDocumentoId,
          method: 'printLayoutGenerator',
          description: d.nome,
        })
        return true
      })
      setPrintLayouts(layouts)
    } catch (error) {
      setPrintLayouts(layouts)
    }
  }

  const formatPercent = value =>
    value ? `${value}`.replace('.', ',') + '%' : ''

  const parsePercent = value =>
    value
      ? parseFloat(
          value
            .replace('%', '')
            .replace('.', '')
            .replace(',', '.'),
        )
      : 0
      
  useEffect(() => {
    clear()
    getProposalTaxLocation()
    getPrintLayoutDocument(owner?.ownerId || 0)
  }, [])

  useEffect(() => {
    if (statusIdSelected) {
      getPersonInProposal()
      // getQualification()
    }
  }, [statusIdSelected])

  return {
    formatPercent,
    parsePercent,
    setTotalValue,
    totalValue,
    userPermissions,
    proposal,
    setProposal,
    proposalId,
    setProposalId,
    owner,
    proposalStatuses,
    setProposalStatuses,
    printLayouts,
    sellerId,
    setSellerId,
    contacts,
    setContacts,
    profitPercent,
    setProfitPercent,
    refreshAll,
    setRefreshAll,
    refreshTotal,
    setRefreshTotal,
    proposalCanBeUpdate,
    onChangePermissionProposalUpdate,

    personInProposal,
    messageList,
    setMessageList,
    createMessage,
    statusIdSelected,
    setStatusIdSelected,
    isSaving,
    setIsSaving,
    validationAttrFromPerson,

    filterProposalTaxLocationRateLocation,
  }
}

const [DetailProposalProvider, useDetailProposalContext] = constate(
  detailProposalContext,
)
export { DetailProposalProvider, useDetailProposalContext }

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-return */
import styles from '@pages/CRM/styles.css'
import { apiCRM } from '@services/api'
import {
  addBrlCurrencyToNumber,
  buildAddressLine1,
  buildAddressLine2,
  customDateTimeFormat,
  formatNumber,
  handleAuthError,
  hasPermission,
} from '@utils'
import {
  Button,
  Card,
  Col,
  DatePicker,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Skeleton,
  Spin,
  Tooltip,
} from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import router from 'umi/router'
import BillingForecastActivationModal from './BillingForecastActivationModal'
import LeftBarAttachments from './LeftBarAttachments'
import LeftBarContacts from './LeftBarContacts'
import LeftBarInputSeller from './LeftBarInputSeller'
import LeftBarParcelsModal from './LeftBarParcelsModal'
import { useProposalContext } from '../../../Context/proposalContext'
import { useDetailProposalContext } from '../../context/DetailProposalContext.ts'

const { confirm } = Modal
const { Option } = Select

const renderFunnelStage = (name, icon) => (
  <div>
    <i className={`mr-1 fa ${icon} fa-fw ${styles.crmColorIconGrid}`} />
    <span>{name}</span>
  </div>
)
const proposalUpdate = {
  actStatusId: null,
  funnelStageId: null,
  sellerId: null,
  receiptMethodId: null,
  paymentConditionId: null,
  closedDate: null,
  lossReasonId: null,
  personContactId: null,
  proposalType: null,
  rateLocation: null,
  installationTime: null,
  apartamentQuantity: null,
  areaNegocioId: null,
  billingForecastDate: null,
  activationDate: null,
  proposalSendDate: null,
  proposalTaxLocationId: null,
}

let proposalStatusesSaved = []
let receiptMethodsSaved = []
let paymentConditionsSaved = []
let funnelStagesSaved = []
let lossReasonsSaved = []
let salesFunnelsSaved = []

export default function LeftBar(props) {
  const {
    historyBody,
    createHistory,
    locationTimeEnum,
    filterLocationTimeByValue,
  } = useProposalContext()

  const {
    filterProposalTaxLocationRateLocation,
    userPermissions,
    proposal,
    setProposal,
    proposalId,
    owner,
    proposalStatuses,
    setProposalStatuses,
    // number,
    // setNumber,
    sellerId,
    setSellerId,
    contacts,
    setContacts,
    setProfitPercent,
    refreshAll,
    refreshTotal,

    personInProposal,
    statusIdSelected,
    setStatusIdSelected,
    isSaving,
    setIsSaving,
    validationAttrFromPerson,
    onChangePermissionProposalUpdate,
    // proposalType,
    // setProposalType,
    setTotalValue,
  } = useDetailProposalContext()

  const initialTotal = {
    totalSingleProductValue: 0,
    totalSingleServiceValue: 0,
    totalSingleValue: 0,
    totalRecurrenceValue: 0,
  }

  const {
    onChange,
    onChangeTotal,
    refreshProposal,
    setAllContacts,
    editProposal,
  } = props

  const [franchiseeOwnerId, setFranchiseeOwnerId] = useState(null)
  // const [companyName, setCompanyName] = useState('')
  const [companyPersonType, setCompanyPersonType] = useState(2)
  // const [franchiseeName, setFranchiseeName] = useState('')
  const [canBeUpdated, setCanBeUpdated] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingProposal, setLoadingProposal] = useState(true)
  const [loadingTotal, setLoadingTotal] = useState(false)
  const [total, setTotal] = useState(initialTotal)
  const [loadingReceiptMethod, setLoadingReceiptMethod] = useState(true)
  const [loadingPaymentCondition, setLoadingPaymentCondition] = useState(true)
  const [loadingSalesFunnel, setLoadingSalesFunnel] = useState(true)
  const [loadingProposalStatus, setLoadingProposalStatus] = useState(true)
  const [loadingContacts, setLoadingContacts] = useState(true)
  const [loadingAttachments, setLoadingAttchments] = useState(true)
  const [loadingLossReason, setLoadingLossReason] = useState(true)
  const [attachments, setAttachments] = useState([])
  const [receiptMethods, setReceiptMethods] = useState([])
  const [paymentConditions, setPaymentConditions] = useState([])
  const [salesFunnelId, setSalesFunnelId] = useState(null)
  const [salesFunnels, setSalesFunnels] = useState([])
  const [salesFunnelIsDeleted, setSalesFunnelIsDeleted] = useState(false)
  const [funnelStages, setFunnelStages] = useState([])
  const [lossReasons, setLossReasons] = useState([])
  const [personContactId, setPersonContactId] = useState(0)
  const [companyPersonId, setCompanyPersonId] = useState(0)
  const [sellerSource, setSellerSource] = useState([])
  // const [receiptMethodId, setReceiptMethodId] = useState(null)
  const [paymentConditionId, setPaymentConditionId] = useState(null)
  // const [actStatusId, setActStatusId] = useState(null)
  const [actStatusCode, setActStatusCode] = useState(null)
  const [funnelStageId, setFunnelStageId] = useState(null)
  const [closedDate, setClosedDate] = useState(null)
  const [activationDate, setActivationDate] = useState(null)
  const [billingForecastDate, setBillingForecastDate] = useState(null)
  const [lossReasonId, setLossReasonId] = useState(null)
  const [installationTime, setInstallationTime] = useState(null)
  const [apartamentQuantity, setApartamentQuantity] = useState(null)
  const [proposalCanBeUpdated, setProposalCanBeUpdated] = useState(false)
  const [showProposalParcel, setShowProposalParcel] = useState(false)
  const [
    billingForecastActivationModal,
    setBillingForecastActivationModal,
  ] = useState(false)
  const [initialDate, setInitialDate] = useState(moment())

  const [businessAreas, setBusinessAreas] = useState([])
  const [loadingBusinessArea, setLoadingBusinessArea] = useState(true)
  const [currentProposalStatus, setCurrentProposalStatus] = useState(null)
  const [currentLossReason, setCurrentLossReason] = useState(null)
  const [currentFunnelStage, setCurrentFunnelStage] = useState(null)
  const [currentReceiptMethod, setCurrentReceiptMethod] = useState(null)
  const [currentPaymentCondition, setCurrentPaymentCondition] = useState(null)
  const [currentSalesFunnel, setCurrentSalesFunnel] = useState(null)
  const [activationDateRequired, setActivationDateRequired] = useState(false)
  const [nextStatusId, setNextStatusId] = useState(null)
  const [nextFunnelStageId, setNextFunnelStageId] = useState(null)

  useEffect(() => {
    getProposal(true)
    getBusinessArea()
    getReceiptMethods()
    getPaymentConditions()
    getProposalStatuses()
    getLossReasons()
    getProposalTotal()
    getProposalContacts()
    getAllProposalContacts()
    getProposalAttachments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (refreshAll > 0) {
      getProposal(true)
      getProposalTotal()
      getProposalContacts()
      getAllProposalContacts()
      getProposalAttachments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshAll])

  useEffect(() => {
    setCanBeUpdated(
      hasPermission(userPermissions, 'Alter') && proposalCanBeUpdated,
    )
  }, [userPermissions, proposalCanBeUpdated])

  useEffect(() => {
    if (refreshTotal > 0) {
      getProposalTotal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTotal])

  useEffect(() => {
    if (refreshProposal > 0) {
      getProposal(true)
      getProposalContacts()
      getAllProposalContacts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshProposal])

  useEffect(() => {
    if (
      !loadingReceiptMethod &&
      !loadingPaymentCondition &&
      !loadingSalesFunnel &&
      !loadingProposalStatus &&
      !loadingLossReason &&
      !loadingProposal &&
      !loadingBusinessArea
    ) {
      setLoading(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loadingReceiptMethod,
    loadingPaymentCondition,
    loadingSalesFunnel,
    loadingProposalStatus,
    loadingLossReason,
    loadingProposal,
  ])

  useEffect(() => {
    if (!loadingSalesFunnel && currentFunnelStage) {
      checkIfExistsFunnelStage(
        currentFunnelStage.funnelStageId,
        currentFunnelStage.name,
        currentFunnelStage.icon,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingSalesFunnel, currentFunnelStage, funnelStages])

  function checkIfExistsFunnelStage(id, name, icon) {
    if (funnelStagesSaved.findIndex(x => x.funnelStageId === id) < 0) {
      const funnelStagesWork = funnelStagesSaved
      funnelStagesWork.push({ funnelStageId: id, name, icon })

      setFunnelStages(funnelStagesWork)
    }
  }

  useEffect(() => {
    if (!loadingReceiptMethod && currentReceiptMethod) {
      if (currentReceiptMethod.receiptMethodId) {
        if (
          receiptMethodsSaved.findIndex(
            x => x.receiptMethodId === currentReceiptMethod.receiptMethodId,
          ) < 0
        ) {
          const receiptMethodsWork = receiptMethodsSaved
          receiptMethodsWork.push({
            receiptMethodId: currentReceiptMethod.receiptMethodId,
            receiptMethodDescription:
              currentReceiptMethod.receiptMethodDescription,
          })
          setReceiptMethods(receiptMethodsWork)
        }
      }
    }
  }, [loadingReceiptMethod, receiptMethods, currentReceiptMethod])

  useEffect(() => {
    if (!loadingPaymentCondition && currentPaymentCondition) {
      if (currentPaymentCondition.paymentConditionId) {
        if (
          paymentConditionsSaved.findIndex(
            x =>
              x.paymentConditionId ===
              currentPaymentCondition.paymentConditionId,
          ) < 0
        ) {
          const paymentConditionsWork = paymentConditionsSaved
          paymentConditionsWork.push({
            paymentConditionId: currentPaymentCondition.paymentConditionId,
            paymentConditionDescription:
              currentPaymentCondition.paymentConditionDescription,
          })
          setPaymentConditions(paymentConditionsWork)
        }
      }
    }
  }, [loadingPaymentCondition, paymentConditions, currentPaymentCondition])

  useEffect(() => {
    if (!loadingLossReason && currentLossReason) {
      checkIfExistsLossReason(
        currentLossReason.lossReasonId,
        currentLossReason.name,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingLossReason, currentLossReason, lossReasons])

  function checkIfExistsLossReason(id, name) {
    if (id && lossReasonsSaved.findIndex(x => x.lossReasonId === id) < 0) {
      const lossReasonsWork = lossReasonsSaved
      lossReasonsWork.push({ lossReasonId: id, name })

      setLossReasons(lossReasonsWork)
    }
  }

  useEffect(() => {
    if (!loadingProposalStatus && currentProposalStatus) {
      checkIfExistsStatus(
        currentProposalStatus.id,
        currentProposalStatus.description,
        currentProposalStatus.code,
      )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingProposalStatus, currentProposalStatus, proposalStatuses])

  function checkIfExistsStatus(id, description, code) {
    if (proposalStatusesSaved.findIndex(x => x.statusId === id) < 0) {
      const proposalStatusesWork = proposalStatusesSaved
      proposalStatusesWork.push({ statusId: id, description, code })
      setProposalStatuses(proposalStatusesWork)
    }
  }

  useEffect(() => {
    if (!loadingSalesFunnel && currentSalesFunnel) {
      if (
        salesFunnelsSaved.findIndex(
          x => x.salesFunnelId === currentSalesFunnel.salesFunnelId,
        ) < 0
      ) {
        const salesFunnelsWork = salesFunnelsSaved
        salesFunnelsWork.push(currentSalesFunnel)
        setSalesFunnels(salesFunnelsWork)
      }
    }
  }, [loadingSalesFunnel, salesFunnels, currentSalesFunnel])

  useEffect(() => {
    if (proposal?.areaNegocioId) {
      if (!businessAreas.find(x => x.id === proposal.areaNegocioId)) {
        businessAreas.push({
          id: proposal.areaNegocioId,
          descricao: proposal.areaNegocioDescricao,
        })
        setBusinessAreas([...businessAreas])
      }
    }
  }, [businessAreas, proposal])

  async function getBusinessArea() {
    setLoadingBusinessArea(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/AreaNegocio`,
      })
      setLoadingBusinessArea(false)
      const { data } = response
      if (data.isOk) {
        setBusinessAreas(data.areaNegocio)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getProposal(refreshFields) {
    setLoadingProposal(refreshFields)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/proposal`,
        params: { proposalId },
      })

      const { data } = response

      if (data.isOk) {
        if (data.proposal.length === 0) {
          message.error('Negócio não existe ou você não tem acesso!')
          router.push('/CRM/Proposals')
        } else {
          const proposal = data.proposal[0]
          setProposal(proposal)
          setProposalCanBeUpdated(proposal.canBeUpdated)
          onChangePermissionProposalUpdate(proposal.canBeUpdated)

          if (refreshFields) {
            getSalesFunnels(proposal.salesFunnelId)
            setProfitPercent(proposal.profitPercent)
            // setNumber(proposal.number)
            setSalesFunnelId(proposal.salesFunnelId)
            setCurrentSalesFunnel({
              salesFunnelId: proposal.salesFunnelId,
              title: proposal.salesFunnelTitle,
              type: proposal.salesFunnelType,
              isDeleted: proposal.salesFunnelIsDeleted,
              funnelStage: [
                {
                  funnelStageId: proposal.funnelStageId,
                  name: proposal.funnelStageName,
                  order: 1,
                  icon: proposal.funnelStageIcon,
                  isDeleted: proposal.funnelStageIsDeleted,
                },
              ],
            })
            setCurrentProposalStatus({
              id: proposal.actStatusId,
              description: proposal.actStatusDescription,
              code: proposal.actStatusCode,
            })
            setCurrentLossReason({
              lossReasonId: proposal.lossReasonId,
              name: proposal.lossReasonName,
            })
            setCurrentFunnelStage({
              funnelStageId: proposal.funnelStageId,
              name: proposal.funnelStageName,
              icon: proposal.funnelStageIcon,
            })
            setCurrentReceiptMethod({
              receiptMethodId: proposal.receiptMethodId,
              receiptMethodDescription: proposal.receiptMethodDescription,
            })
            setCurrentPaymentCondition({
              paymentConditionId: proposal.paymentConditionId,
              paymentConditionDescription: proposal.paymentConditionDescription,
            })
            // setBusinessAreaId(proposal.areaNegocioId)
            // setCompanyName(proposal.companyShortName)
            setFranchiseeOwnerId(proposal.franchiseeOwnerId)
            setCompanyPersonType(proposal.companyPersonType)
            setCompanyPersonId(proposal.companyPersonId)
            setPersonContactId(proposal.personContactId)
            // setActStatusId(proposal.actStatusId)
            setActStatusCode(proposal.actStatusCode)
            setPaymentConditionId(proposal.paymentConditionId)
            setFunnelStageId(proposal.funnelStageId)
            setClosedDate(proposal.closedDate)
            setLossReasonId(proposal.lossReasonId)
            setInstallationTime(proposal.installationTime)
            setApartamentQuantity(proposal.apartamentQuantity)
            setActivationDate(
              proposal.activationDate && moment(proposal.activationDate),
            )
            setBillingForecastDate(
              proposal.billingForecastDate &&
                moment(proposal.billingForecastDate),
            )
            const sellerData = {
              label: proposal.sellerName,
              value: proposal.sellerId,
            }
            setSellerSource([sellerData])
            setSellerId(proposal.sellerId)

            proposalUpdate.sellerId = proposal.sellerId
            proposalUpdate.funnelStageId = proposal.funnelStageId
            proposalUpdate.paymentConditionId = proposal.paymentConditionId
            proposalUpdate.receiptMethodId = proposal.receiptMethodId
            proposalUpdate.closedDate = proposal.closedDate
            proposalUpdate.actStatusId = proposal.actStatusId
            proposalUpdate.lossReasonId = proposal.lossReasonId
            proposalUpdate.personContactId = proposal.personContactId
            proposalUpdate.proposalType = proposal.proposalType
            proposalUpdate.rateLocation = proposal.rateLocation
            proposalUpdate.installationTime = proposal.installationTime
            proposalUpdate.apartamentQuantity = proposal.apartamentQuantity
            proposalUpdate.areaNegocioId = proposal.areaNegocioId
            proposalUpdate.billingForecastDate = proposal.billingForecastDate
            proposalUpdate.activationDate = proposal.activationDate
            proposalUpdate.proposalSendDate = proposal.proposalSendDate
            proposalUpdate.proposalTaxLocationId =
              proposal.proposalTaxLocationId
          }
          setLoadingProposal(false)
        }
      } else {
        message.error(data.message)
        router.push('/CRM/Proposals')
      }
    } catch (error) {
      handleAuthError(error)
      router.push('/CRM/Proposals')
    }
  }

  async function getReceiptMethods() {
    setLoadingReceiptMethod(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/receiptMethod`,
      })

      const { data } = response

      if (data.isOk) {
        receiptMethodsSaved = data.receiptMethods
        setReceiptMethods(receiptMethodsSaved)
        setLoadingReceiptMethod(false)
      } else {
        setLoadingReceiptMethod(false)
        message.error(data.message)
      }
    } catch (error) {
      setLoadingReceiptMethod(false)
      handleAuthError(error)
    }
  }

  async function getLossReasons() {
    setLoadingLossReason(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/lossReason`,
      })

      const { data } = response

      if (data.isOk) {
        lossReasonsSaved = data.lossReason
        setLossReasons(lossReasonsSaved)
        setLoadingLossReason(false)
      } else {
        setLoadingLossReason(false)
        message.error(data.message)
      }
    } catch (error) {
      setLoadingLossReason(false)
      handleAuthError(error)
    }
  }

  async function getPaymentConditions() {
    setLoadingPaymentCondition(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/paymentCondition`,
      })

      const { data } = response

      if (data.isOk) {
        paymentConditionsSaved = data.paymentConditions
        setPaymentConditions(paymentConditionsSaved)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
    setLoadingPaymentCondition(false)
  }

  async function getSalesFunnels(includeSalesFunnelId) {
    setLoadingSalesFunnel(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/salesFunnel`,
        params: { useFilterType: true, includeSalesFunnelId },
      })

      setLoadingSalesFunnel(false)

      const { data } = response

      if (data.isOk) {
        if (data.salesFunnel.length === 0) {
          message.error('Não existe funil cadastrado!')
        } else {
          salesFunnelsSaved = data.salesFunnel
          setSalesFunnels(salesFunnelsSaved)
        }
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  useEffect(() => {
    const salesFunnel = salesFunnels.find(
      x => x.salesFunnelId === salesFunnelId,
    )
    if (salesFunnel) {
      funnelStagesSaved = salesFunnel.funnelStage
      setFunnelStages(funnelStagesSaved)
      setSalesFunnelIsDeleted(salesFunnel.isDeleted)
    } else {
      setSalesFunnelIsDeleted(false)
      setFunnelStages([])
    }
  }, [salesFunnels, salesFunnelId])

  async function getProposalStatuses() {
    proposalStatusesSaved = proposalStatuses
    setLoadingProposalStatus(false)
  }

  async function getProposalContacts() {
    setLoadingContacts(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/personContactsByProposalId`,
        params: { proposalId },
      })

      setLoadingContacts(false)

      const { data } = response

      if (data.isOk) {
        setContacts(data.personContacts)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoadingContacts(false)
      handleAuthError(error)
    }
  }

  async function getAllProposalContacts() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/allPersonContactsByProposalId`,
        params: { proposalId },
      })
      const { data } = response
      if (data.isOk) {
        setAllContacts(data.personContacts)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getProposalAttachments() {
    setLoadingAttchments(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/attachesByProposalId`,
        params: { proposalId },
      })

      setLoadingAttchments(false)

      const { data } = response

      if (data.isOk) {
        setAttachments(data.proposalAttaches)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoadingAttchments(false)
      handleAuthError(error)
    }
  }

  async function getProposalTotal() {
    setLoadingTotal(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/proposalTotal`,
        params: { proposalId },
      })

      setLoadingTotal(false)

      const { data } = response

      if (data.isOk) {
        setLoadingTotal(false)
        setTotal(data.total)
        setTotalValue(data)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoadingTotal(false)
      handleAuthError(error)
    }
  }

  async function updateProposal(refreshTotal, refreshAllContacts) {
    const proposalBody = {
      proposal: {
        proposalId,
        actStatusId: proposalUpdate.actStatusId,
        funnelStageId: proposalUpdate.funnelStageId,
        sellerId: proposalUpdate.sellerId,
        personContactId: proposalUpdate.personContactId,
        closedDate: proposalUpdate.closedDate,
        lossReasonId: proposalUpdate.lossReasonId,
        receiptMethodId: proposalUpdate.receiptMethodId,
        paymentConditionId: proposalUpdate.paymentConditionId,
        proposalType: proposalUpdate.proposalType,
        rateLocation: proposalUpdate.rateLocation,
        installationTime: proposalUpdate.installationTime,
        apartamentQuantity: proposalUpdate.apartamentQuantity,
        areaNegocioId: proposalUpdate.areaNegocioId,
        billingForecastDate: proposalUpdate.billingForecastDate,
        activationDate: proposalUpdate.activationDate,
        proposalSendDate: proposalUpdate.proposalSendDate,
        proposalTaxLocationId: proposalUpdate.proposalTaxLocationId,
      },
    }
    setIsSaving(true)

    try {
      const response = await apiCRM({
        method: 'PUT',
        url: `/api/crm/proposalUpdate`,
        data: proposalBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (!data.isOk) {
        let messageError
        if (data.validationMessageList.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          messageError = data.validationMessageList[0]
        } else {
          messageError = data.message
        }
        message.error(
          <span>
            {messageError}
            <br />
            Atualização não realizada
          </span>,
        )

        getProposal(true)
        getProposalContacts()
        getAllProposalContacts()
      } else {
        getProposal(false)
        onChange()
        if (refreshTotal) {
          await getProposalTotal()
          await onChangeTotal()
        }
        if (refreshAllContacts) {
          getAllProposalContacts()
        }
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  const setProposalContactId = contactId => {
    setPersonContactId(contactId)
    proposalUpdate.personContactId = contactId
    updateProposal(false, true)
  }

  const onChangeContact = () => {
    getProposalContacts()
    getAllProposalContacts()
  }

  const onChangeSeller = value => {
    setSellerId(value)
    if (value) {
      // eslint-disable-next-line prefer-destructuring
      proposalUpdate.sellerId = value
      updateProposal()
    }
  }

  const onChangeReceiptMethod = value => {
    // setReceiptMethodId(value)
    proposalUpdate.receiptMethodId = value
    updateProposal()
  }

  const onChangeProposalSendDate = async value => {
    proposalUpdate.proposalSendDate = value ? value.format('YYYY-MM-DD') : null
    updateProposal()

    const dateHistoryBody = historyBody
    dateHistoryBody.proposalHistories[0] = {
      proposalHistoryId: 0,
      proposalId,
      type: 'proposalSendDate',
      title: 'Data de envio de proposta adicionada',
      action: 'Include',
      oldValue: '',
      newValue: value,
    }
    setIsSaving(true)
    createHistory(dateHistoryBody, onChange)
  }

  const onChangePaymentCondition = value => {
    // eslint-disable-next-line
    confirm({
      title: 'Alterar condições de pagamento?',
      content:
        'Alterar as condições de pagamento irá desfazer a configuração das parcelas, deseja atualizar mesmo assim?',
      onOk: () => {
        setPaymentConditionId(value)
        proposalUpdate.paymentConditionId = value
        updateProposal()
      },
      cancelText: 'Cancelar',
      okText: 'Ok',
      okType: 'danger',
    })
  }

  const onChangeActStatus = value => {
    const source = proposalStatuses.find(x => x.statusId === value)

    if (
      source.code === 'WON' &&
      !proposal?.franchiseeId &&
      owner?.ownerProfile === 'Franchisor'
    ) {
      message.info('Informe o franqueado antes de fechar o negócio!')
      editProposal(proposalId, value)
      return
    }

    if (source?.code === 'WON' && owner?.showCRMActivationDate) {
      setInitialDate(closedDate ? moment(closedDate) : moment())
      setActivationDateRequired(
        funnelStageId === owner?.activationDateFunnelStageId,
      )
      setNextStatusId(value)
      setNextFunnelStageId(funnelStageId)
      setBillingForecastActivationModal(true)
    } else {
      handleChangeStatus(value)
    }
  }

  const handleChangeStatus = async value => {
    proposalUpdate.actStatusId = value
    const source = proposalStatuses.find(x => x.statusId === value)
    if (source) {
      if (source.code === 'WON' && !validationAttrFromPerson()) {
        return
      }

      if (
        source.code === 'WON' &&
        !proposal?.franchiseeId &&
        owner?.ownerProfile === 'Franchisor'
      ) {
        message.info('Informe o franqueado antes de fechar o negócio!')
        editProposal(proposalId, value)
        return
      }
      if (source.code === 'ABRT') {
        proposalUpdate.closedDate = null
      } else {
        proposalUpdate.closedDate = proposalUpdate.closedDate
          ? proposalUpdate.closedDate
          : moment().format('YYYY-MM-DDTHH:mm:ss')
      }

      if (source.code !== 'WON') {
        proposalUpdate.billingForecastDate = null
      }

      if (source.code !== 'LOST') {
        proposalUpdate.lossReasonId = null
        setLossReasonId(null)
      }

      setActStatusCode(source.code)
    }
    setClosedDate(proposalUpdate.closedDate)
    updateProposal(true)
  }

  const onChangeFunnelStage = value => {
    const source = proposalStatuses.find(
      x => x.statusId === proposal?.actStatusId,
    )
    if (
      source?.code === 'WON' &&
      value === owner?.activationDateFunnelStageId &&
      owner?.showCRMActivationDate
    ) {
      setInitialDate(closedDate ? moment(closedDate) : moment())
      setActivationDateRequired(true)
      setNextFunnelStageId(value)
      setNextStatusId(proposal?.actStatusId)
      setBillingForecastActivationModal(true)
    } else {
      handleChangeFunnelStage(value)
    }
  }

  const handleChangeFunnelStage = value => {
    setFunnelStageId(value)
    proposalUpdate.funnelStageId = value
    updateProposal(true)
  }

  const handleChangeBillingForecastActivation = () => {
    proposalUpdate.funnelStageId = nextFunnelStageId
    proposalUpdate.actStatusId = nextStatusId
    if (!proposalUpdate.closedDate) {
      proposalUpdate.closedDate = moment().format('YYYY-MM-DDTHH:mm:ss')
    }
    proposalUpdate.billingForecastDate = billingForecastDate.format(
      'YYYY-MM-DD',
    )
    proposalUpdate.activationDate = activationDate
      ? activationDate.format('YYYY-MM-DD')
      : null
    setFunnelStageId(nextFunnelStageId)
    // setActStatusId(nextStatusId)
    setActStatusCode('WON')
    setClosedDate(proposalUpdate.closedDate)
    updateProposal(true)
  }

  const onChangeLossReason = value => {
    setLossReasonId(value)
    proposalUpdate.lossReasonId = value
    updateProposal()
  }

  const onChangeSalesFunnel = value => {
    setSalesFunnelId(value)
    setFunnelStageId(null)
  }

  const onChangeBusinessArea = value => {
    // setBusinessAreaId(value)
    proposalUpdate.areaNegocioId = value
    updateProposal()
  }

  const onChangeAttachments = () => {
    getProposalAttachments()
    onChange()
  }

  const onChangeProposalType = value => {
    // setProposalType(value)
    proposalUpdate.proposalType = value
    if (value === 2) {
      // setRateLocation(ownerRateLocation || 0)
      // proposalUpdate.rateLocation = ownerRateLocation || 0
    } else {
      // setRateLocation(null)
      proposalUpdate.rateLocation = null
      proposalUpdate.proposalTaxLocationId = null
    }
    updateProposal(true)
  }

  const onChangeTaxLocation = value => {
    proposalUpdate.proposalTaxLocationId = value
    updateProposal()

    const dateHistoryBody = historyBody

    dateHistoryBody.proposalHistories[0] = {
      proposalHistoryId: 0,
      proposalId,
      type: 'ProposalTaxLocation',
      title: 'Meses de locação alterado',
      action: 'Include',
      oldValue: filterLocationTimeByValue(proposal?.proposalTaxLocationId)
        ?.descricao,
      newValue: filterLocationTimeByValue(value)?.descricao,
    }
    setIsSaving(true)
    createHistory(dateHistoryBody, onChange)
  }

  const onChangeRateLocation = () => {
    proposalUpdate.rateLocation =
      filterProposalTaxLocationRateLocation(proposal?.proposalTaxLocationId)
        ?.locationPercentage || 0
    updateProposal(true)
  }

  const onChangeBillingForecastDate = value => {
    setBillingForecastDate(value)
    proposalUpdate.billingForecastDate = value
      ? value.format('YYYY-MM-DD')
      : null
    updateProposal(true)
  }

  const onChangeInstallationTime = number => {
    setInstallationTime(number)
    proposalUpdate.installationTime = number
  }

  const onChangeActivationDate = value => {
    setActivationDate(value)
    proposalUpdate.activationDate = value ? value.format('YYYY-MM-DD') : null
    updateProposal(true)
  }

  const onFocusLoseInstallationTime = number => {
    updateProposal(true)
  }

  const onChangeApartamentQuantity = number => {
    setApartamentQuantity(number)
    proposalUpdate.apartamentQuantity = number
  }
  const onFocusLoseApartamentQuantity = number => {
    updateProposal(true)
  }

  const hrClassName = 'ml-10 mr-6'

  useEffect(() => {
    if (personInProposal) {
      onChangeActStatus(statusIdSelected)
    }
  }, [personInProposal])

  return (
    <React.Fragment>
      <BillingForecastActivationModal
        initialDate={initialDate}
        billingForecastDate={billingForecastDate}
        setBillingForecastDate={setBillingForecastDate}
        activationDate={activationDate}
        setActivationDate={setActivationDate}
        activationDateRequired={activationDateRequired}
        visible={billingForecastActivationModal}
        setVisible={setBillingForecastActivationModal}
        onChange={handleChangeBillingForecastActivation}
      />
      <div style={{ width: '21%' }}>
        <Card bodyStyle={{ padding: 0 }}>
          <Spin size="large" spinning={isSaving} style={{ marginTop: '130%' }}>
            <div className="primary-background-color h-24" />
            <div className="relative text-center" style={{ top: '-43px' }}>
              <i
                className="fa fa-paper-plane fa-3x primary-color rounded-icon align-center"
                aria-hidden="true"
              />
            </div>

            <Skeleton
              className="px-4"
              loading={loading || loadingProposal}
              paragraph={{ rows: 11 }}
              active
            >
              <h2 className="text-center mb-10">
                <Tooltip
                  title={
                    <Row>
                      <Col>
                        {buildAddressLine1(
                          proposal?.addressName,
                          proposal?.addressNumber,
                          proposal?.neighborhood,
                        )}
                      </Col>
                      <Col>
                        {buildAddressLine2(
                          proposal?.cityName,
                          proposal?.stateAbbreviation,
                        )}
                      </Col>
                    </Row>
                  }
                >
                  {proposal?.companyShortName}
                </Tooltip>
              </h2>

              <div className="ml-5 mt-4">
                {owner?.ownerProfile !== 'Standard' &&
                  proposal?.franchiseeName && (
                    <React.Fragment>
                      <div className="flex mb-4">
                        <i
                          className={`fa fa-${
                            companyPersonType === 2 ? 'building-o' : 'user'
                          } mt-1`}
                          style={{ fontSize: '20px' }}
                          aria-hidden="true"
                        />
                        <div className="ml-8">
                          <h4>Franqueado</h4>
                          <span>{proposal?.franchiseeName}</span>
                        </div>
                      </div>
                      <hr className={hrClassName} />
                    </React.Fragment>
                  )}
                <div className="flex mb-4">
                  <i
                    className="fa fa-file-text-o mt-1"
                    style={{ fontSize: '20px' }}
                    aria-hidden="true"
                  />
                  <div className="ml-8">
                    <h4>Número do negócio</h4>
                    <span>{proposal?.number}</span>

                    {owner?.isProposalRateLocation && (
                      <div>
                        <div className="mt-3">
                          <h4>Tipo do negócio</h4>
                          <Select
                            showSearch
                            value={proposal?.proposalType || 1}
                            onChange={onChangeProposalType}
                            style={{ width: '13vw' }}
                            disabled={!canBeUpdated}
                            placeholder="Selecione um tipo de negócio"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase()
                                .indexOf(input?.toLowerCase()) >= 0
                            }
                          >
                            <Option value={1}>Vendas</Option>
                            <Option value={2}>Locação</Option>
                          </Select>

                          {proposal?.proposalType === 2 && (
                            <React.Fragment>
                              <h4>Meses de locação</h4>
                              <Select
                                style={{ width: '13vw' }}
                                value={proposal?.proposalTaxLocationId ?? 1}
                                onChange={onChangeTaxLocation}
                              >
                                {locationTimeEnum.map(d => (
                                  <Option value={d.value}>
                                    {' '}
                                    {d.descricao}{' '}
                                  </Option>
                                ))}
                              </Select>
                            </React.Fragment>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <hr className={hrClassName} />
                <div className="flex mb-4">
                  <i
                    className="fa fa-dollar mt-1"
                    style={{ fontSize: '20px' }}
                    aria-hidden="true"
                  />
                  <div className="ml-8">
                    <h4>Valores</h4>
                    <Skeleton
                      className="px-4"
                      loading={loadingTotal}
                      paragraph={{ rows: 3 }}
                      active
                    >
                      <Row type="flex">
                        <Col
                          style={{ width: '90px' }}
                        >{`${addBrlCurrencyToNumber(
                          total.totalSingleProductValue,
                        )}`}</Col>
                        <Col>-&nbsp;Produtos</Col>
                      </Row>
                      <Row type="flex">
                        <Col
                          style={{ width: '90px' }}
                        >{`${addBrlCurrencyToNumber(
                          total.totalSingleServiceValue,
                        )}`}</Col>
                        <Col>-&nbsp;Serviços</Col>
                      </Row>
                      <Row type="flex">
                        <Col
                          style={{ width: '90px' }}
                        >{`${addBrlCurrencyToNumber(
                          total.totalRecurrenceValue,
                        )}`}</Col>
                        <Col>-&nbsp;Recorrência</Col>
                      </Row>

                      {proposal?.proposalType === 2 && (
                        <React.Fragment>
                          <Row type="flex">
                            <Col
                              style={{ width: '90px' }}
                            >{`${addBrlCurrencyToNumber(
                              total.totalLocationValue,
                            )}`}</Col>
                            <Col>-&nbsp;Locação</Col>
                          </Row>
                          <Row type="flex" justify="middle">
                            <Col>
                              <span style={{ color: 'gray' }}>
                                <i>
                                  {`Taxa de locação: ${formatNumber(
                                    proposal.rateLocation,
                                    4,
                                  )}`}
                                </i>
                              </span>
                            </Col>
                            <Col>
                              <Tooltip
                                title={`Aplicar taxa vigente de ${formatNumber(
                                  filterProposalTaxLocationRateLocation(
                                    proposal?.proposalTaxLocationId,
                                  )?.locationPercentage,
                                  4,
                                )}`}
                              >
                                <Button
                                  className="ml-2"
                                  size="small"
                                  onClick={() => onChangeRateLocation()}
                                  disabled={!canBeUpdated}
                                >
                                  <i
                                    className="fa fa-repeat"
                                    style={{ color: 'gray' }}
                                  />
                                </Button>
                              </Tooltip>
                            </Col>
                          </Row>
                        </React.Fragment>
                      )}
                    </Skeleton>
                  </div>
                </div>

                <hr className={hrClassName} />

                <div className="flex mb-4">
                  <i
                    className="fa fa-calendar mt-1"
                    style={{ fontSize: '20px' }}
                    aria-hidden="true"
                  />
                  <div className="ml-5">
                    <h4>Data de envio da proposta</h4>
                    <DatePicker
                      style={{ width: '14vw' }}
                      value={
                        proposal?.proposalSendDate &&
                        moment(proposal?.proposalSendDate)
                      }
                      format="DD/MM/YYYY"
                      onChange={value => onChangeProposalSendDate(value)}
                      disabledDate={current => current > moment()}
                    />
                  </div>
                </div>

                <hr className={hrClassName} />

                <div className="flex mb-4">
                  <i
                    className="fa fa-money mt-1"
                    style={{ fontSize: '20px' }}
                    aria-hidden="true"
                  />
                  <div className="ml-5">
                    <h4>Forma de pagamento</h4>
                    <Select
                      showSearch
                      style={{ width: '14vw' }}
                      disabled={
                        !canBeUpdated || currentProposalStatus?.code === 'WON'
                      }
                      value={proposal?.receiptMethodId}
                      onChange={onChangeReceiptMethod}
                      placeholder="Selecione uma forma de pagamento"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          ?.toLowerCase()
                          .indexOf(input?.toLowerCase()) >= 0
                      }
                    >
                      <Option value={null} />
                      {receiptMethods.map(record => (
                        <Option value={record.receiptMethodId}>
                          {record.receiptMethodDescription}
                        </Option>
                      ))}
                    </Select>
                    <h4 className="mt-3">Condições de pagamento</h4>
                    <Select
                      showSearch
                      disabled={
                        !canBeUpdated || currentProposalStatus?.code === 'WON'
                      }
                      value={paymentConditionId}
                      onChange={onChangePaymentCondition}
                      style={{ width: '14vw' }}
                      placeholder="Selecione uma condição de pagamento"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          ?.toLowerCase()
                          .indexOf(input?.toLowerCase()) >= 0
                      }
                    >
                      <Option value={null} />
                      {paymentConditions.map(record => (
                        <Option value={record.paymentConditionId}>
                          {record.paymentConditionDescription}
                        </Option>
                      ))}
                    </Select>

                    {paymentConditionId &&
                      proposalCanBeUpdated &&
                      proposal.actStatusCode !== 'WON' && (
                        <React.Fragment>
                          {isSaving ? (
                            <span>Alterar parcelas</span>
                          ) : (
                            <React.Fragment>
                              <LeftBarParcelsModal
                                {...{
                                  paymentConditions,
                                  paymentConditionId,
                                  showProposalParcel,
                                  setShowProposalParcel,
                                  proposalId,
                                }}
                              />
                              <span
                                style={{ cursor: 'pointer' }}
                                className="mt-2 primary-color"
                                role="button"
                                onClick={() => setShowProposalParcel(true)}
                              >
                                Alterar parcelas
                              </span>
                            </React.Fragment>
                          )}
                        </React.Fragment>
                      )}
                  </div>
                </div>
                <hr className={hrClassName} />

                <div className="flex mb-4">
                  <i
                    className="fa fa-calendar mt-1"
                    style={{ fontSize: '20px' }}
                    aria-hidden="true"
                  />
                  <div className="ml-5">
                    <h4>Prazo de instalação</h4>
                    <InputNumber
                      style={{ width: '14vw' }}
                      disabled={
                        !canBeUpdated || currentProposalStatus?.code === 'WON'
                      }
                      onChange={number => onChangeInstallationTime(number)}
                      onBlur={number => onFocusLoseInstallationTime(number)}
                      value={installationTime}
                      min={0}
                    />
                  </div>
                </div>

                {owner?.showFieldApartmentQuantityCRM && (
                  <div className="flex mb-4">
                    <i
                      className="fa fa-building-o mt-1"
                      style={{ fontSize: '20px' }}
                      aria-hidden="true"
                    />
                    <div className="ml-5">
                      <h4>Unidades habitacionais</h4>
                      <InputNumber
                        style={{ width: '14vw' }}
                        disabled={!canBeUpdated}
                        onChange={number => onChangeApartamentQuantity(number)}
                        onBlur={number => onFocusLoseApartamentQuantity(number)}
                        value={apartamentQuantity}
                        min={0}
                      />
                    </div>
                  </div>
                )}

                {owner?.showCRMActivationDate && actStatusCode === 'WON' && (
                  <div className="flex mb-4">
                    <i
                      className="fa fa-calendar mt-1"
                      style={{ fontSize: '20px' }}
                      aria-hidden="true"
                    />
                    <div className="ml-5">
                      <h4>Previsão de faturamento</h4>
                      <DatePicker
                        style={{ width: '14vw' }}
                        disabled={!canBeUpdated}
                        format="DD/MM/YYYY"
                        onChange={date => onChangeBillingForecastDate(date)}
                        value={billingForecastDate}
                      />
                    </div>
                  </div>
                )}
                {((owner?.showCRMActivationDate &&
                  funnelStageId === owner?.activationDateFunnelStageId) ||
                  activationDate) && (
                  <div className="flex mb-4">
                    <i
                      className="fa fa-calendar mt-1"
                      style={{ fontSize: '20px' }}
                      aria-hidden="true"
                    />
                    <div className="ml-5">
                      <h4>Ativado em</h4>
                      <DatePicker
                        style={{ width: '14vw' }}
                        disabled={
                          !canBeUpdated ||
                          funnelStageId !== owner?.activationDateFunnelStageId
                        }
                        onChange={date => onChangeActivationDate(date)}
                        format="DD/MM/YYYY"
                        value={activationDate}
                      />
                    </div>
                  </div>
                )}
                <hr className={hrClassName} />
                <div className="flex mb-4">
                  <i
                    className="fa fa-bars mt-1"
                    style={{ fontSize: '20px' }}
                    aria-hidden="true"
                  />
                  <div className="ml-5">
                    <h4>Status</h4>
                    <Select
                      showSearch
                      value={proposal?.actStatusId}
                      onChange={value => setStatusIdSelected(value)}
                      style={{ width: '14vw' }}
                      disabled={!canBeUpdated || actStatusCode !== 'ABRT'}
                      placeholder="Selecione um status"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          ?.toLowerCase()
                          .indexOf(input?.toLowerCase()) >= 0
                      }
                    >
                      {proposalStatuses.map(record => (
                        <Option value={record.statusId}>
                          {record.description}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>

                {actStatusCode === 'LOST' && (
                  <div className="flex mb-4">
                    <i
                      className="fa fa-times mt-1"
                      style={{ fontSize: '20px' }}
                      aria-hidden="true"
                    />
                    <div className="ml-5">
                      <h4>Motivo de perda</h4>
                      <Select
                        showSearch
                        value={lossReasonId}
                        disabled={!!lossReasonId}
                        onChange={onChangeLossReason}
                        style={{ width: '14vw' }}
                        placeholder="Selecione o motivo"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props?.children
                            ?.toLowerCase()
                            .indexOf(input?.toLowerCase()) >= 0
                        }
                      >
                        <Option value={null} />
                        {lossReasons.map(record => (
                          <Option value={record.lossReasonId}>
                            {record.name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                )}

                {closedDate && (
                  <div className="flex mb-4">
                    <i
                      className={`fa fa-${
                        actStatusCode === 'LOST'
                          ? 'calendar-times-o'
                          : 'calendar-check-o'
                      } mt-1`}
                      style={{ fontSize: '20px' }}
                      aria-hidden="true"
                    />
                    <div className="ml-5">
                      <h4>Fechamento</h4>
                      <span>
                        {customDateTimeFormat(closedDate, 'DD/MM/YYYY HH:mm')}
                      </span>
                    </div>
                  </div>
                )}

                <hr className={hrClassName} />

                <div className="flex mb-4">
                  <i
                    className="fa fa-filter mt-1"
                    style={{ fontSize: '20px' }}
                    aria-hidden="true"
                  />

                  <div className="ml-5">
                    <h4>Funil</h4>
                    <Select
                      showSearch
                      value={salesFunnelId}
                      onChange={onChangeSalesFunnel}
                      style={{ width: '14vw' }}
                      disabled={!canBeUpdated}
                      placeholder="Selecione o funil"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.props.children
                          ?.toLowerCase()
                          .indexOf(input?.toLowerCase()) >= 0
                      }
                    >
                      {salesFunnels.map(record => (
                        <Option value={record.salesFunnelId}>
                          <Tooltip title={record.title}>{record.title}</Tooltip>
                        </Option>
                      ))}
                    </Select>

                    {salesFunnelIsDeleted && (
                      <React.Fragment>
                        <br />
                        <span style={{ color: 'red' }}>
                          Este funil foi excluido!
                        </span>
                      </React.Fragment>
                    )}
                  </div>
                </div>

                <div className="flex mb-4">
                  <i
                    className="fa fa-bars mt-1"
                    style={{ fontSize: '20px' }}
                    aria-hidden="true"
                  />
                  <div className="ml-5">
                    <h4>Fase</h4>
                    <Select
                      showSearch
                      value={funnelStageId}
                      onChange={onChangeFunnelStage}
                      disabled={!canBeUpdated}
                      style={{ width: '14vw' }}
                      placeholder="Selecione uma fase"
                      optionFilterProp="children"
                      filterOption={(input, option) => {
                        let checkFilter = -1
                        try {
                          checkFilter = option.props.label // children.props.children[1].props.children
                            .toLowerCase()
                            .indexOf(input?.toLowerCase())
                        } catch {
                          checkFilter = -1
                        }
                        return checkFilter >= 0
                      }}
                    >
                      {funnelStages.map(record => (
                        <Option
                          label={record.name}
                          value={record.funnelStageId}
                        >
                          <Tooltip title={record.name}>
                            {renderFunnelStage(record.name, record.icon)}
                          </Tooltip>
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="flex mb-4">
                  <i
                    className="fa fa-briefcase mt-1"
                    style={{ fontSize: '20px' }}
                    aria-hidden="true"
                  />
                  <div className="ml-5">
                    <h4>Área de negócio</h4>
                    <Select
                      showSearch
                      allowClear
                      value={proposal?.areaNegocioId}
                      onChange={onChangeBusinessArea}
                      disabled={
                        !canBeUpdated || currentProposalStatus?.code === 'WON'
                      }
                      style={{ width: '14vw' }}
                      placeholder="Selecione uma área de negócio"
                      optionFilterProp="children"
                      filterOption={(input, option) => {
                        let checkFilter = -1
                        try {
                          checkFilter = option.props.label // children.props.children[1].props.children
                            .toLowerCase()
                            .indexOf(input?.toLowerCase())
                        } catch {
                          checkFilter = -1
                        }
                        return checkFilter >= 0
                      }}
                    >
                      {businessAreas.map(record => (
                        <Option label={record.descricao} value={record.id}>
                          <Tooltip title={record.descricao}>
                            {record.descricao}
                          </Tooltip>
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>

                <hr className={hrClassName} />

                <div className="flex mb-4">
                  <i
                    className="fa fa-user-circle mt-1"
                    style={{ fontSize: '20px' }}
                    aria-hidden="true"
                  />
                  <div className="ml-5">
                    <h4>Vendedor</h4>
                    <LeftBarInputSeller
                      canBeUpdated={
                        (canBeUpdated && proposal?.actStatusCode !== 'WON') ||
                        isSaving
                      }
                      sellerSource={sellerSource}
                      setSellerSource={setSellerSource}
                      sellerId={sellerId}
                      onChange={onChangeSeller}
                      franchiseeOwnerId={franchiseeOwnerId}
                      owner={owner}
                    />
                  </div>
                </div>
              </div>
            </Skeleton>
          </Spin>
        </Card>

        <LeftBarContacts
          onChangeLeftBar={onChange}
          loading={loadingContacts}
          contacts={contacts}
          canBeUpdated={canBeUpdated && proposal?.actStatusCode !== 'WON'}
          personContactId={personContactId}
          setProposalContactId={setProposalContactId}
          personId={companyPersonId}
          onChange={onChangeContact}
          isSavingProposal={isSaving}
          proposalId={proposalId}
        />

        <LeftBarAttachments
          proposalId={proposalId}
          loading={loadingAttachments}
          attachments={attachments}
          onChange={onChangeAttachments}
          canBeUpdated={canBeUpdated}
        />
      </div>
    </React.Fragment>
  )
}

LeftBar.propTypes = {
  onChange: PropTypes.func,
  refreshProposal: PropTypes.number,
  onChangeTotal: PropTypes.func,
  setAllContacts: PropTypes.func,
  editProposal: PropTypes.func,
  // setFranchiseeId: PropTypes.func,
}

function ProposalParcel(props) {
  const { show, proposalId } = props
  const [loading, setLoading] = useState(true)
  const [parcels, setParcels] = useState([])

  useEffect(() => {
    if (show) {
      getProposalParcel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  async function getProposalParcel() {
    setLoading(true)
    setParcels([])

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/proposalParcel`,
        params: { proposalId },
      })

      const { data } = response

      if (data.isOk) {
        setLoading(false)
        setParcels(data.parcels)
      } else {
        setLoading(false)
        message.error(data.message)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  if (loading) {
    return (
      <div style={{ width: '270px' }}>
        <Spin>
          <Skeleton loading={loading} paragraph={{ rows: 3 }} active />
        </Spin>
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className="p-4" style={{ backgroundColor: '#FAFAFA' }}>
        {parcels.length === 0 ? (
          <span className="primary-color">Não há parcelas para listar</span>
        ) : (
          <React.Fragment>
            {parcels.map((parcel, index) => (
              <Row key={index} type="flex" className="py-1">
                <Col style={{ width: '150px' }}>{parcel.description}</Col>
                <Col
                  className="text-right primary-color"
                  style={{ width: '100px' }}
                >
                  {addBrlCurrencyToNumber(parcel.value)}
                </Col>
              </Row>
            ))}
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  )
}

ProposalParcel.propTypes = {
  proposalId: PropTypes.number,
  show: PropTypes.bool,
}

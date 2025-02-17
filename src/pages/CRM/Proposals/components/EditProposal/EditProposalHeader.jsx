// import { Form } from '@ant-design/compatible'
import styles from '@pages/CRM/styles.css'
import { apiCRM } from '@services/api'
import { handleAuthError, hasPermission, companyIsFranchisee } from '@utils'
import {
  Form,
  Alert,
  Button,
  Col,
  DatePicker,
  message,
  Modal,
  Row,
  Select,
  Skeleton,
  Spin,
} from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import EditProposalHeaderInputCompany from './EditProposalHeaderInputCompany'
import EditProposalHeaderInputFranchisee from './EditProposalHeaderInputFranchisee'
import EditProposalHeaderInputContact from './EditProposalHeaderInputContact'
import EditProposalHeaderInputSeller from './EditProposalHeaderInputSeller'
import EditProposalHeaderProposalType from './EditProposalHeaderProposalType'
import { useProposalContext } from '../../Context/proposalContext'
import { notNullUndefined } from '@utils/generics'

const { Option } = Select

let proposalStatusesSaved = []
let salesFunnelsSaved = []

const EditProposalHeader = props => {
  const { userPermissions, owner } = useProposalContext()

  const { proposalId, task, statusId, show, closeEditProposalHeader } = props

  const [alertMessages, setAlertMessages] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [currentProposalStatus, setCurrentProposalStatus] = useState(null)
  const [currentSalesFunnel, setCurrentSalesFunnel] = useState(null)

  const [canBeUpdated, setCanBeUpdated] = useState(true)
  const [salesFunnelId, setSalesFunnelId] = useState(null)
  const [salesFunnels, setSalesFunnels] = useState([])
  const [funnelStages, setFunnelStages] = useState([])
  const [salesFunnelIsDeleted, setSalesFunnelIsDeleted] = useState(false)
  const [proposalStatuses, setProposalStatuses] = useState([])
  const [loadingForm, setLoadingForm] = useState(true)
  const [loadingSalesFunnel, setLoadingSalesFunnel] = useState(true)
  const [loadingProposalStatuses, setLoadingProposalStatuses] = useState(true)
  const [loadingProposal, setLoadingProposal] = useState(true)
  const [funnelStageId, setFunnelStageId] = useState(null)
  const [franchiseeOwnerId, setFranchiseeOwnerId] = useState(null)
  const [businessAreas, setBusinessAreas] = useState([])

  const [closedDate, setClosedDate] = useState(null)
  const [lossReasonId, setLossReasonId] = useState(null)
  const [receiptMethodId, setReceiptMethodId] = useState(null)
  const [paymentConditionId, setPaymentConditionId] = useState(null)
  const [rateLocation, setRateLocation] = useState(null)

  const [sellerSource, setSellerSource] = useState([])
  const [franchiseeSource, setFranchiseeSource] = useState([])
  const [contactSource, setContactSource] = useState([])
  const [companySource, setCompanySource] = useState([])

  const [selectedCompany, setSelectedCompany] = useState({})

  const [loadingContacts, setLoadingContacts] = useState(false)

  const [companyPersonId, setCompanyPersonId] = useState(0)
  const [taskId, setTaskId] = useState(null)
  const [editData, setEditData] = useState(null)

  const [ownerRateLocation, setOwnerRateLocation] = useState(null)
  const [ownerIsProposalRateLocation, setOwnerIsProposalRateLoation] = useState(
    false,
  )

  const [form] = Form.useForm()
  const companyInput = React.useRef()
  const contactInput = React.useRef()

  useEffect(() => {
    form.resetFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])

  useEffect(() => {
    if (!loadingForm && companyInput.current) {
      try {
        companyInput.current.focus()
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingForm])

  useEffect(() => {
    if (show) {
      setLoadingSalesFunnel(false)
      setLoadingProposalStatuses(false)
      setLoadingProposal(false)
      setLoadingForm(true)

      clearForm()

      getOwnerConfiguration()
      getProposalStatuses()
      getBusinessArea()

      if (proposalId > 0) {
        getProposal()
      } else {
        getSalesFunnels()
        setLoadingProposal(false)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  useEffect(() => {
    if (editData?.areaNegocioId) {
      if (!businessAreas.find(x => x.id === editData.areaNegocioId)) {
        businessAreas.push({
          id: editData.areaNegocioId,
          descricao: editData.areaNegocioDescricao,
        })
        setBusinessAreas([...businessAreas])
      }
    }
  }, [businessAreas, editData])

  async function getBusinessArea() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/AreaNegocio`,
      })
      const { data } = response
      if (data.isOk) {
        setBusinessAreas(data.areaNegocio)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getOwnerConfiguration() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/owner`,
      })

      const { data } = response

      if (data.isOk) {
        setOwnerRateLocation(data.rateLocation)
        setOwnerIsProposalRateLoation(data.isProposalRateLocation)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  useEffect(() => {
    if (!loadingSalesFunnel && !loadingProposalStatuses && !loadingProposal) {
      setLoadingForm(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingSalesFunnel, loadingProposalStatuses, loadingProposal])

  useEffect(() => {
    if (!loadingProposalStatuses && currentProposalStatus) {
      checkIfExistsStatus(
        currentProposalStatus.id,
        currentProposalStatus.description,
        currentProposalStatus.code,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingProposalStatuses, currentProposalStatus, proposalStatuses])

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
    let step = funnelStages.length > 0 ? funnelStages[0].funnelStageId : null
    if (funnelStageId) {
      const i = funnelStages.findIndex(x => x.funnelStageId === funnelStageId)
      if (i >= 0) {
        step = funnelStageId
      }
    }
    form.setFieldsValue({ step })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funnelStageId, funnelStages])

  useEffect(() => {
    if (!form.getFieldValue('status')) {
      const index = statusId
        ? proposalStatuses.findIndex(x => x.statusId === statusId)
        : proposalStatuses.findIndex(x => x.code === 'ABRT')
      if (index >= 0) {
        form.setFieldsValue({ status: proposalStatuses[index].statusId })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalStatuses, form.getFieldValue('status'), statusId])

  async function getProposal() {
    setLoadingProposal(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/proposal`,
        params: { proposalId },
      })

      const { data } = response

      if (data.isOk) {
        if (data.proposal.length === 0) {
          message.error('Negócio não existe ou você não tem acesso a ele!')
          closeEditProposalHeader(false, null)
        } else {
          const proposal = data.proposal[0]

          getSalesFunnels(proposal.salesFunnelId)
          setLoadingProposal(false)

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

          setEditData(proposal)

          setFunnelStageId(proposal.funnelStageId)

          if (proposal.closedDate) {
            setClosedDate(moment(proposal.closedDate))
          }
          setRateLocation(proposal.rateLocation)
          setLossReasonId(proposal.lossReasonId)
          setReceiptMethodId(proposal.receiptMethodId)
          setPaymentConditionId(proposal.paymentConditionId)

          setFranchiseeOwnerId(proposal.franchiseeOwnerId)
          setCompanyPersonId(proposal.companyPersonId)
          setCompanySource([
            {
              label: proposal.companyShortName,
              value: proposal.companyId,
              isFranchisee: proposal.isFranchisee,
              franchiseeId: proposal.franchiseeId,
              franchiseeName: proposal.franchiseeName,
              personId: proposal.companyPersonId,
              franchiseeOwnerId: proposal.isFranchisee
                ? null
                : proposal.franchiseeOwnerId,
            },
          ])

          if (proposal.franchiseeId) {
            setFranchiseeSource([
              {
                label: proposal.franchiseeName,
                value: proposal.franchiseeId,
                ownerId: proposal.franchiseeOwnerId,
              },
            ])
          }

          setSellerSource([
            { label: proposal.sellerName, value: proposal.sellerId },
          ])

          setContactSource([
            {
              label: proposal.personContactName,
              value: proposal.personContactId,
            },
          ])

          getPersonContacts(proposal.companyPersonId, {
            label: proposal.personContactName,
            value: proposal.personContactId,
          })

          setCanBeUpdated(
            proposal.canBeUpdated && hasPermission(userPermissions, 'Alter'),
          )
        }
      } else {
        setLoadingProposal(false)
        message.error(data.message)
        closeEditProposalHeader(false, null)
      }
    } catch (error) {
      // console.log(error)
      handleAuthError(error)
      closeEditProposalHeader(false, null)
    }
  }

  function checkIfExistsStatus(id, description, code) {
    let recordExists = false

    for (let i = 0; i < proposalStatusesSaved.length; i++) {
      if (proposalStatuses[i].statusId === id) {
        recordExists = true
        break
      }
    }

    if (!recordExists) {
      const proposalStatusesWork = proposalStatusesSaved
      proposalStatusesWork.push({ statusId: id, description, code })
      setProposalStatuses(proposalStatusesWork)
    }
  }

  function clearForm() {
    setCanBeUpdated(hasPermission(userPermissions, 'Include'))

    setAlertMessages([])
    setSalesFunnelIsDeleted(false)
    setCurrentProposalStatus(null)
    setCurrentSalesFunnel(null)
    setTaskId(null)
    setSellerSource([])
    setFranchiseeOwnerId(null)
    setRateLocation(null)
    setContactSource([])
    setCompanySource([])
    setFranchiseeSource([])
    setCompanyPersonId(0)

    setClosedDate(null)
    setLossReasonId(null)
    setReceiptMethodId(null)
    setPaymentConditionId(null)
    setFunnelStageId(null)

    if (editData === null) {
      form.resetFields()
    } else {
      setEditData(null)
    }

    if (task && proposalId === 0) {
      setFieldsFromTask()
    }
  }

  function setFieldsFromTask() {
    setCompanyPersonId(task.companyPersonId)
    setFranchiseeOwnerId(task.franchiseeOwnerId)

    setCompanySource([
      {
        label: task.companyShortName,
        value: task.companyId,
        isFranchisee: task.isFranchisee,
        franchiseeId: task.franchiseeId,
        franchiseeName: task.franchiseeName,
        personId: task.companyPersonId,
        franchiseeOwnerId: task.franchiseeOwnerId,
      },
    ])

    if (task.franchiseeId) {
      setFranchiseeSource([
        {
          label: task.franchiseeName,
          value: task.franchiseeId,
          ownerId: task.franchiseeOwnerId,
        },
      ])
    }

    getPersonContacts(task.companyPersonId)
    setSellerSource([{ label: task.sellerName, value: task.sellerId }])

    setEditData({
      sellerId: task.sellerId,
      franchiseeId: task.franchiseeId,
      companyId: task.companyId,
    })

    setTaskId(task.taskId)

    if (contactInput.current) {
      contactInput.current.focus()
    }
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
          closeEditProposalHeader(false, null)
        } else {
          salesFunnelsSaved = data.salesFunnel
          setSalesFunnels(salesFunnelsSaved)
        }
      } else {
        message.error(data.message)
        closeEditProposalHeader(false, null)
      }
    } catch (error) {
      handleAuthError(error)
      closeEditProposalHeader(false, null)
    }
  }

  useEffect(() => {
    setSelectedCompany(
      companySource.filter(
        c => c?.value === form.getFieldValue('companyId'),
      )[0],
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue('companyId')])

  useEffect(() => {
    setSalesFunnelId(form.getFieldValue('salesFunnelId'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue('salesFunnelId')])

  useEffect(() => {
    const salesFunnel = salesFunnels.find(
      x => x.salesFunnelId === salesFunnelId,
    )
    if (salesFunnel) {
      setFunnelStages(salesFunnel.funnelStage)
      setSalesFunnelIsDeleted(salesFunnel.isDeleted)
    } else {
      setSalesFunnelIsDeleted(false)
      setFunnelStages([])
    }
  }, [salesFunnels, salesFunnelId])

  async function getProposalStatuses() {
    setLoadingProposalStatuses(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/proposalStatus`,
      })

      const { data } = response

      if (data.isOk) {
        if (data.proposalStatus.length === 0) {
          message.error('Não existem status de negócio!')
          closeEditProposalHeader(false, null)
        } else {
          proposalStatusesSaved = data.proposalStatus
          setProposalStatuses(proposalStatusesSaved)
          setLoadingProposalStatuses(false)
        }
      } else {
        setLoadingProposalStatuses(false)
        message.error(data.message)
        closeEditProposalHeader(false, null)
      }
    } catch (error) {
      setLoadingProposalStatuses(false)
      handleAuthError(error)
      closeEditProposalHeader(false, null)
    }
  }

  async function getPersonContacts(personId, existingContact, contactId) {
    setLoadingContacts(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/personContact`,
        params: { personId, isActive: true },
      })

      setLoadingContacts(false)

      const { data } = response

      if (data.isOk) {
        const contactWork = []
        let recordExists = false
        let contactIdExists = false
        data.personContact.map(record => {
          if (existingContact && existingContact.value === record.contactId) {
            recordExists = true
          }
          if (contactId && record.contactId === contactId) {
            contactIdExists = true
          }

          notNullUndefined(record.contactName) &&
            contactWork.push({
              label: record.contactName,
              value: record.contactId,
            })
          return true
        })

        if (!recordExists && existingContact) {
          contactWork.push(existingContact)
        }
        setCompanyPersonId(personId)
        setContactSource(contactWork)

        if (contactId && contactIdExists) {
          form.setFieldsValue({ contactId })
        }
      } else {
        setCompanyPersonId(personId)
        setLoadingContacts(false)
        message.error(data.message)
      }
    } catch (error) {
      setCompanyPersonId(personId)
      setLoadingContacts(false)
      handleAuthError(error)
    }
  }

  const handleSubmit = e => {
    e.preventDefault()

    setAlertMessages([])

    if (!canBeUpdated) {
      message.error('Você não pode atualizar o negócio!')
      return
    }
    form
      .validateFields()
      .then(values => {
        if (form.getFieldValue('companyId')) {
          if (
            selectedCompany?.requiredZipCode &&
            selectedCompany?.personAddress[0].zipCode === ''
          ) {
            message.warning(
              'Organização selecionada não apresenta campo CEP informado. Favor, atualizar o cadastro',
            )
          } else {
            saveProposal()
          }
        }
      })
      .catch(err => {
        if (Object.keys(err).length === 1) {
          message.error('Preencha o campo demarcado corretamente!')
        } else {
          message.error('Preencha os campos demarcados corretamente!')
        }
      })
  }

  async function saveProposal() {
    const expectedClosingDate = form.getFieldValue('expectedClosingDate')
      ? moment(
          `${form
            .getFieldValue('expectedClosingDate')
            .format('YYYY-MM-DD')}T00:00:00`,
          'YYYY-MM-DDTHH:mm:ss',
        ).format('YYYY-MM-DDTHH:mm:ss')
      : null

    let closedDateWork = closedDate
    let statusCode = ''

    for (let i = 0; i < proposalStatuses.length; i++) {
      if (proposalStatuses[i].statusId === form.getFieldValue('status')) {
        statusCode = proposalStatuses[i].code
        break
      }
    }

    if (statusCode === 'ABRT') {
      closedDateWork = null
    } else if (statusCode !== 'ABRT' && !closedDateWork) {
      closedDateWork = moment().format('YYYY-MM-DDTHH:mm:ss')
    }

    let activationDate = null
    let billingForecastDate = null
    if (form.getFieldValue('activationDate')) {
      activationDate = form.getFieldValue('activationDate').format('YYYY-MM-DD')
    }
    if (form.getFieldValue('billingForecastDate')) {
      billingForecastDate = form
        .getFieldValue('billingForecastDate')
        .format('YYYY-MM-DD')
    }

    const proposalBody = {
      proposal: {
        proposalId,
        companyId: form.getFieldValue('companyId'),
        franchiseeId: form.getFieldValue('franchiseeId'),
        actStatusId: form.getFieldValue('status'),
        funnelStageId: form.getFieldValue('step'),
        sellerId: form.getFieldValue('sellerId'),
        personContactId: form.getFieldValue('contactId'),
        expectedClosingDate,
        closedDate: closedDateWork,
        lossReasonId,
        receiptMethodId,
        paymentConditionId,
        taskId,
        proposalType: form.getFieldValue('proposalType'),
        rateLocation,
        areaNegocioId: form.getFieldValue('businessAreaId'),
        billingForecastDate,
        activationDate,
        proposalTaxLocationId: form.getFieldValue('locationTime'),
      },
    }

    setIsSaving(true)

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/proposal`,
        data: proposalBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        closeEditProposalHeader(
          true,
          proposalId === 0 ? parseInt(data.idGenerated, 10) : proposalId,
        )
      } else {
        if (data.validationMessageList.length > 0) {
          setAlertMessages(data.validationMessageList)
        }

        message.error(data.message)
      }
    } catch (error) {
      setIsSaving(false)

      handleAuthError(error)
    }
  }

  const onChangeCompany = company => {
    setContactSource([])
    setCompanyPersonId(0)

    if (company) {
      getPersonContacts(company.personId)
      setFranchiseeOwnerId(company.franchiseeOwnerId)

      let franchiseeId = company?.franchiseeId
      if (company?.franchiseeId) {
        setFranchiseeSource([
          {
            value: company?.franchiseeId,
            label: company?.franchiseeName,
            ownerId: company?.franchiseeOwnerId,
          },
        ])
      } else if (owner?.franchiseeId && owner?.ownerProfile === 'Franchise') {
        franchiseeId = owner.franchiseeId
        setFranchiseeSource([
          {
            value: owner.franchiseeId,
            label: owner.ownerShortName,
            ownerId: owner?.ownerId,
          },
        ])
      }

      form.setFieldsValue({ contactId: null, franchiseeId })
    } else {
      form.setFieldsValue({ contactId: null })
    }
  }

  const onChangeContact = id => {
    if (id) {
      setContactSource([])
      form.setFieldsValue({ contactId: null })
      getPersonContacts(companyPersonId, null, id)
    }
  }

  const onChangeProposalType = value => {
    if (value === 2) {
      form.setFieldsValue({ locationTime: 1 })
      setRateLocation(ownerRateLocation || 0)
    } else {
      setRateLocation(null)
    }
  }

  const onChangeFranchisee = franchisee => {
    setFranchiseeOwnerId(franchisee?.ownerId || null)
  }

  const getStatusCode = id => {
    const status = proposalStatuses.find(x => x.statusId === id)
    return status?.code
  }

  const onChangeFunnel = value => {
    if (value !== owner?.activationDateFunnelStageId) {
      form.setFieldsValue({ activationDate: null })
    }
  }

  const onChangeStatus = value => {
    if (getStatusCode(value) !== 'WON') {
      form.setFieldsValue({ activationDate: null, billingForecastDate: null })
    }
  }

  return (
    <Modal
      id="modal-new-proposal"
      title={
        <Row align="middle" type="flex">
          <Col>
            {loadingForm
              ? 'Carregando...'
              : proposalId > 0
              ? `Editar negócio ${editData?.number || '...'}`
              : 'Novo negócio'}
          </Col>
          <Col style={{ display: loadingForm || isSaving ? 'block' : 'none' }}>
            <div style={{ marginLeft: '10px', marginTop: '5px' }}>
              <Spin size="small" />
            </div>
          </Col>
        </Row>
      }
      width="45vw"
      visible={show}
      onCancel={() => closeEditProposalHeader(false, null)}
      onOk={e => handleSubmit(e)}
      destroyOnClose
      centered
      footer={
        <Row type="flex">
          {canBeUpdated && !loadingForm && (
            <Button
              id="button-save-proposal"
              type="primary"
              className="formButton"
              loading={isSaving}
              disabled={loadingForm}
              htmlFor="submit-form"
              onClick={e => handleSubmit(e)}
            >
              Salvar
            </Button>
          )}
          <Button
            id="button-cancel-proposal-save"
            type="secondary"
            onClick={() => closeEditProposalHeader(false, null)}
          >
            Cancelar
          </Button>
        </Row>
      }
    >
      <Skeleton loading={loadingForm} paragraph={{ rows: 11 }} active />

      <div style={{ display: loadingForm ? 'none' : 'block' }}>
        <Form layout="vertical" form={form} onSubmit={e => handleSubmit(e)}>
          {alertMessages.map((message, index) => (
            <Alert
              type="error"
              message={message}
              key={index}
              showIcon
              className="mb-2"
            />
          ))}

          <EditProposalHeaderInputCompany
            form={form}
            canBeUpdated={canBeUpdated && !taskId}
            companySource={companySource}
            setCompanySource={setCompanySource}
            autoFocus={!taskId}
            ref={companyInput}
            onChange={onChangeCompany}
            editData={editData}
          />

          <Spin spinning={loadingContacts}>
            <EditProposalHeaderInputContact
              form={form}
              autoFocus={!!taskId}
              canBeUpdated={canBeUpdated}
              contactSource={contactSource}
              setContactSource={setContactSource}
              personId={companyPersonId}
              onChange={onChangeContact}
              loading={loadingContacts}
              ref={contactInput}
              editData={editData}
            />
          </Spin>

          <div
            style={{
              display:
                (owner?.ownerProfile === 'Franchisor' &&
                  !companyIsFranchisee(
                    form.getFieldValue('companyId'),
                    companySource,
                  )) ||
                (owner?.ownerProfile === 'Franchise' &&
                  !form.getFieldValue('franchiseeId') &&
                  form.getFieldValue('companyId'))
                  ? 'block'
                  : 'none',
            }}
          >
            <EditProposalHeaderInputFranchisee
              form={form}
              canBeUpdated={canBeUpdated && !taskId}
              franchiseeSource={franchiseeSource}
              setFranchiseeSource={setFranchiseeSource}
              editData={editData}
              ownerProfile={owner?.ownerProfile}
              onChange={onChangeFranchisee}
              statusCode={
                proposalStatuses.find(
                  x => x.statusId === form.getFieldValue('status'),
                )?.code
              }
            />
          </div>
          <Row type="flex" gutter={24}>
            <Col
              span={12}
              style={{
                display:
                  owner?.showCRMActivationDate &&
                  getStatusCode(form.getFieldValue('status')) === 'WON'
                    ? 'flex'
                    : 'none',
              }}
            >
              <Form.Item
                label="Previsão de faturamento"
                name="billingForecastDate"
                initialValue={
                  editData?.billingForecastDate
                    ? moment(editData.billingForecastDate)
                    : null
                }
                rules={[
                  {
                    required:
                      owner?.showCRMActivationDate &&
                      getStatusCode(form.getFieldValue('status')) === 'WON',
                    message: 'Campo obrigatório!',
                  },
                ]}
                className="mb-0"
              >
                <DatePicker disabled={!canBeUpdated} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col
              span={12}
              style={{
                display:
                  owner?.showCRMActivationDate &&
                  getStatusCode(form.getFieldValue('status')) === 'WON' &&
                  form.getFieldValue('step') ===
                    owner?.activationDateFunnelStageId
                    ? 'flex'
                    : 'none',
              }}
            >
              <Form.Item
                label="Ativado em"
                name="activationDate"
                initialValue={
                  editData?.activationDate
                    ? moment(editData.activationDate)
                    : null
                }
                rules={[
                  {
                    required:
                      owner?.showCRMActivationDate &&
                      getStatusCode(form.getFieldValue('status')) === 'WON' &&
                      form.getFieldValue('step') ===
                        owner?.activationDateFunnelStageId,
                    message: 'Campo obrigatório!',
                  },
                ]}
                className="mb-0"
              >
                <DatePicker disabled={!canBeUpdated} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
                initialValue={
                  statusId || (editData ? editData?.actStatusId : null)
                }
                rules={[{ required: true, message: 'Campo obrigatório!' }]}
              >
                <Select
                  showSearch
                  disabled={!canBeUpdated}
                  onChange={onChangeStatus}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {proposalStatuses.map((s, index) => (
                    <Option key={s.statusId} value={s.statusId}>
                      {s.description}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Data prevista de fechamento"
                name="expectedClosingDate"
                initialValue={
                  editData?.expectedClosingDate
                    ? moment(editData.expectedClosingDate)
                    : null
                }
              >
                <DatePicker
                  className="w-full"
                  disabled={!canBeUpdated}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                label="Funil"
                name="salesFunnelId"
                initialValue={editData ? editData?.salesFunnelId : null}
                rules={[{ required: true, message: 'Campo obrigatório!' }]}
              >
                <Select
                  showSearch
                  disabled={!canBeUpdated}
                  optionFilterProp="children"
                  onChange={e => setSalesFunnelId(e)}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {salesFunnels.map((s, index) => (
                    <Option key={s.salesFunnelId} value={s.salesFunnelId}>
                      {s.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: salesFunnelId ? 'block' : 'none' }}>
            {salesFunnelIsDeleted && (
              <Row className="mb-2">
                <span style={{ color: 'gray' }}>
                  <i>
                    Este funil foi excluido e por isso não é possível trazer
                    todas as fases
                  </i>
                </span>
              </Row>
            )}
            <Row>
              <Form.Item
                label="Fase do funil"
                name="step"
                initialValue={editData ? editData?.funnelStageId : null}
                rules={[{ required: true, message: 'Campo obrigatório!' }]}
              >
                <Select
                  showSearch
                  disabled={!canBeUpdated}
                  placeholder="Selecione uma fase"
                  optionFilterProp="children"
                  onChange={onChangeFunnel}
                  filterOption={(input, option) => {
                    let checkFilter = -1
                    try {
                      checkFilter = option.props.label // children.props.children[1].props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase())
                    } catch {
                      checkFilter = -1
                    }
                    return checkFilter >= 0
                  }}
                >
                  {funnelStages.map(record => (
                    <Option label={record.name} value={record.funnelStageId}>
                      {renderFunnelStage(record.name, record.icon)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Row>
          </div>

          <Row>
            <Col span={24}>
              <Form.Item
                label="Área de negócio"
                name="businessAreaId"
                initialValue={editData?.areaNegocioId || undefined}
              >
                <Select
                  showSearch
                  allowClear={canBeUpdated}
                  disabled={!canBeUpdated}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {businessAreas.map(d => (
                    <Option value={d.id}>{d.descricao}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <EditProposalHeaderInputSeller
            form={form}
            canBeUpdated={canBeUpdated}
            sellerSource={sellerSource}
            setSellerSource={setSellerSource}
            owner={owner}
            franchiseeOwnerId={franchiseeOwnerId}
            editData={editData}
          />
          <div
            style={{
              display: ownerIsProposalRateLocation ? 'block' : 'none',
            }}
          >
            <EditProposalHeaderProposalType
              {...{
                form,
                editData,
                canBeUpdated,
                onChangeProposalType,
                rateLocation,
              }}
            />
          </div>

          <input type="submit" id="submit-form" className="hidden" />
        </Form>
      </div>
    </Modal>
  )
}

const renderFunnelStage = (name, icon) => (
  <div>
    <i className={`mr-2 fa ${icon} fa-fw ${styles.crmColorIconGrid}`} />
    <span>{name}</span>
  </div>
)

EditProposalHeader.propTypes = {
  proposalId: PropTypes.number,
  task: PropTypes.object,
  statusId: PropTypes.number,
}

export default EditProposalHeader

/* eslint-disable react-hooks/exhaustive-deps */
import { apiCRM } from '@services/api'
import {
  getPermissions,
  handleAuthError,
  hasPermission,
  removeMask,
  removeNumberFormatting,
  zeroesLeft,
} from '@utils'
import { Form, Skeleton, Alert, message, Spin } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import router from 'umi/router'
import PersonMainForm from './components/PersonMainForm'
import PersonMainAddressForm from './components/PersonMainAddressForm'
import InputResponsibleFranchisee from './components/InputResponsibleFranchisee'
import PersonFormHeader from './components/PersonFormHeader'
import PersonAddressTable from './components/PersonAddressTable'
import PersonContactTable from './components/PersonContactTable'
import PersonFormFooter from './components/PersonFormFooter'
import { messageCRM } from '../../../SoftinFrontSystems/src/SoftinMessage/message.ts'
import { notNullUndefined } from '@utils/generics'
import PersonPriceListTable from './components/PersonPriceList/PersonPriceListTable.tsx'
import {
  postDiscountAllowance,
  getPriceListData,
} from './components/PersonPriceList/services.ts'
import { personCheckColaborator } from './services.tsx'

const scrollToRef = ref => window.scrollTo(0, ref.current.offsetTop)

function PersonForm(props) {
  const { personId, setPersonId, onClose, isRouter, fromNewUI } = props
  const [form] = Form.useForm()
  const homeRef = useRef(null)
  const executeScroll = () => scrollToRef(homeRef)
  const personNameInput = useRef(null)

  const [userPermissions, setUserPermissions] = useState([])
  const [refresh, setRefresh] = useState(0)
  const [gettingPermissions, setGettingPermissions] = useState(true)
  const [gettingPerson, setGettingPerson] = useState(true)
  const [alertMessages, setAlertMessages] = useState([])
  const [loadingForm, setLoadingForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [canBeUpdated, setCanBeUpdated] = useState(true)
  const [selectedRowKeysContact, setSelectedRowKeysContact] = useState([])
  const [contactDataSource, setContactDataSource] = useState([])
  const [personAddressId, setPersonAddressId] = useState(0)
  const [addressDataSource, setAddressDataSource] = useState([])
  const [selectedRowKeysAddress, setSelectedRowKeysAddress] = useState([])
  const [states, setStates] = useState([])
  const [tiposEndereco, setTiposEndereco] = useState([])
  const [ownerProfile, setOwnerProfile] = useState('')
  const [citySource, setCitySource] = useState([])
  const [
    responsibleFranchiseeSource,
    setResponsibleFranchiseeSource,
  ] = useState([])
  const [editData, setEditData] = useState(null)
  const [regionSource, setRegionSource] = useState([])
  const [qualificationSource, setQualificationSource] = useState([])
  const [contactSourceSource, setContactSourceSource] = useState([])
  const [marketSegmentSource, setMarketSegmentSource] = useState([])
  const [businessAreaSource, setBusinessAreaSource] = useState([])

  const [selectedRowPriceList, setSelectedRowPriceList] = useState([])
  const [ownerId, setOwnerId] = useState(0)
  const [priceListTableData, setPriceListTableData] = useState([])
  const [isSeller, setIsSeller] = useState(false)
  const [sellerId, setSellerId] = useState(0)
  const [deleteAlcadaDesconto, setDeleteAlcadaDesconto] = useState(false)
  const [editAlcadaDesconto, setEditAlcadaDesconto] = useState(false)
  const [addAlcadaDesconto, setAddEditAlcadaDesconto] = useState(false)

  useEffect(() => {
    setPermissions()
    if (personId === 0) {
      clearForm()
    }
    getOwnerProfile()
    getStates()
    getTiposEndereco()
    getQualification()
    getContactSource()
    getMarketSegment()
    getBusinessArea()
    if (homeRef.current) {
      homeRef.current.scrollIntoView({
        block: 'start',
      })
    }
  }, [])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
    setGettingPermissions(false)
  }

  useEffect(() => {
    if (
      personId === 0 &&
      !gettingPermissions &&
      !hasPermission(userPermissions, 'Include')
    ) {
      exitPage()
      message.error('Você não tem acesso para incluir pessoas!')
    }
  }, [userPermissions, gettingPermissions, personId])

  useEffect(() => {
    if (
      personId > 0 &&
      !gettingPermissions &&
      !gettingPerson &&
      !hasPermission(userPermissions, 'Alter') &&
      !fromNewUI
    ) {
      setCanBeUpdated(false)
    }
  }, [personId, gettingPermissions, gettingPerson, userPermissions])

  useEffect(() => {
    if (states.length > 0) {
      setPersonId(parseInt(personId))
      if (personId > 0) {
        getPerson(personId, false, false)
      } else {
        setLoadingForm(false)
      }

      if (personNameInput.current != null) {
        try {
          personNameInput.current.focus()
        } catch (error) {
          console.log(error)
        }
      }
    }
  }, [states])

  useEffect(() => {
    if (sellerId) {
      getPriceListData(setPriceListTableData, ownerId, sellerId)
    }
  }, [sellerId])

  async function getOwnerProfile() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/owner`,
      })
      const { data } = response
      if (data.isOk) {
        setOwnerProfile(data.ownerProfile)
        setOwnerId(data.ownerId)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  const handleSubmit = async (e, closeForm) => {
    e.preventDefault()

    const userIdSubmit = form.getFieldValue('user')

    if (!canBeUpdated) {
      message.error('Você não pode fazer atualizações para esta pessoa!')
      return
    }

    setIsSaving(true)

    try {
      await form.validateFields()

      if (
        form.getFieldValue('isCollaborator') &&
        notNullUndefined(userIdSubmit)
      ) {
        const response = await personCheckColaborator(
          personId || 0,
          userIdSubmit || 0,
        )
        const { isOk, message: responseMessage } = response.data.value

        if (!isOk) {
          throw new Error(responseMessage)
        }
      }

      await savePerson(closeForm)
    } catch (err) {
      message.error(err.message || 'Existem erros no formulário!')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = e => {
    e && e.preventDefault()
    exitPage()
  }

  function exitPage() {
    if (isRouter) {
      router.push('/crm/PersonGrid')
    } else {
      onClose()
    }
  }

  useEffect(() => {
    form.resetFields()
    setIsSeller(editData?.isSeller)
    setSellerId(editData?.sellerId)
  }, [editData])

  function clearForm() {
    setCanBeUpdated(true)
    setPersonAddressId(0)
    setSelectedRowKeysAddress([])
    setSelectedRowKeysContact([])
    setCitySource([])
    setResponsibleFranchiseeSource([])
    setRegionSource([])
    if (editData === null) {
      form.resetFields()
    } else {
      setEditData(null)
    }
  }

  async function getStates() {
    setLoadingForm(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `${process.env.UMI_API_HOST_CRM}/api/crm/state`,
      })

      const { data } = response

      if (data.isOk) {
        setLoadingForm(false)
        setStates(data.states)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getTiposEndereco() {
    setLoadingForm(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `${process.env.UMI_API_HOST_CRM}/api/CRM/TipoEndereco`,
      })

      const { data } = response

      if (data.isOk) {
        setLoadingForm(false)
        setTiposEndereco(data.tiposEndereco)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  useEffect(() => {
    if (fromNewUI) {
      if (userPermissions.length === 0) {
        setPermissions()
      } else {
        setCanBeUpdated(hasPermission(userPermissions, 'Include'))
      }
    }
  }, [fromNewUI, userPermissions])

  async function getPerson(id, getDeletedPerson, sendPriceListData) {
    setLoadingForm(true)
    setGettingPerson(true)
    clearForm()

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `${process.env.UMI_API_HOST_CRM}/api/crm/person`,
        params: { personId: id, getPersonDetails: true, getDeletedPerson },
      })

      const { data } = response

      if (data.isOk) {
        if (data.person.length === 0) {
          exitPage()
          setLoadingForm(false)
          message.error('Pessoa não existe ou você não tem acesso a ela!')
        } else {
          const person = data.person[0]
          setLoadingForm(false)

          setCanBeUpdated(person.canBeUpdated)

          const dataForm = {
            name: person.personType === 1 ? person.name : person.shortName,
            companyName: person.personType === 2 ? person.name : null,
            personType: person.personType,
            isActive: person.isActive,
            cnpj: person.documentCNPJ ? person.documentCNPJ : '',
            ie: person.documentIE ? person.documentIE : '',
            im: person.documentIM ? person.documentIM : '',
            cpf: person.documentCPF ? person.documentCPF : '',
            rg: person.documentRG ? person.documentRG : '',
            genre: person.isMale ? 'M' : 'F',
            bornDate:
              person.bornDate === null
                ? null
                : moment(person.bornDate, 'YYYY-MM-DD'),
            foundationDate:
              person.foundationDate === null
                ? null
                : moment(person.foundationDate, 'YYYY-MM-DD'),
            defaultEmail: person.defaultEmail,
            phone: person.phone ? removeMask(person.phone) : '',
            cellPhone: person.cellPhone ? removeMask(person.cellPhone) : '',
            site: person.site,
            observation: person.observation,
            isFranchisee: person.isFranchisee,
            isSeller: person.isSeller,
            isCollaborator: person.isCollaborator,
            responsibleFranchiseeId: person.responsibleFranchiseeId,
            availableCapital: person.availableCapital,
            royaltyType: person.royaltyType,
            meetFranchise: person.meetFranchise,
            regionId: person.regionId,
            guidPersonId: person.guidPersonId,
            collaboratorId: person.collaboratorId,
            qualificationId: person.qualificacaoId,
            qualificationDescription: person.qualificacaoDescricao,
            contactSourceId: person.origemContatoId,
            contactSourceDescription: person.origemContatoDescricao,
            marketSegmentId: person.segmentosMercado.map(
              segmento => segmento.segmentoMercadoId,
            ),
            marketSegment: person.segmentosMercado.map(segmento => ({
              id: segmento.segmentoMercadoId,
              descricao: segmento.segmentoMercadoDescricao,
            })),
            businessAreaId: person.areasNegocio.map(d => d.areaNegocioId),
            businessArea: person.areasNegocio.map(d => ({
              id: d.areaNegocioId,
              descricao: d.areaNegocioDescricao,
            })),
            userId: person.userId,
            username: person.username,
            supervisorId: person.supervisorId,
            supervisorName: person.supervisorName,
            sellerId: person.sellerId,
          }

          if (person.regionId) {
            setRegionSource([
              {
                regionId: person.regionId,
                regionName: person.regionName,
                regionDescription: person.regionDescription,
                regionStatus: person.regionStatus,
              },
            ])
          }

          setContactDataSource(person.personContacts)

          const addressDataSourceWork = []

          person.personAddresses.map(addressItem => {
            if (addressItem.isStandart) {
              setCitySource([
                {
                  cityId: addressItem.cityId,
                  cityName: addressItem.cityName,
                  stateAbbreviation: addressItem.stateAbbreviation,
                  stateName: addressItem.stateName,
                  stateId: addressItem.stateId,
                },
              ])

              setPersonAddressId(addressItem.id)

              dataForm.addressName = addressItem.name
              dataForm.addressNumber = addressItem.number
              dataForm.neighborhood = addressItem.neighborhood
              dataForm.complement = addressItem.complement
              dataForm.zipCode = addressItem.zipCode
                ? zeroesLeft(removeMask(addressItem.zipCode), 8)
                : ''
              dataForm.cityId = addressItem.cityId
              dataForm.stateAbbreviation = addressItem.stateAbbreviation
              dataForm.countryId = addressItem.countryId
              dataForm.countryName = addressItem.countryName
              dataForm.locationReference = addressItem.locationReference
            } else {
              addressDataSourceWork.push(addressItem)
            }

            return true
          })

          setAddressDataSource(addressDataSourceWork)

          if (person.responsibleFranchiseeId !== null) {
            setResponsibleFranchiseeSource([
              {
                name: person.responsibleFranchiseeName,
                address: '',
                city: '',
                distance: '',
                id: person.responsibleFranchiseeId,
              },
            ])

            getResponsibleFranchisee(person.responsibleFranchiseeId)
          }

          setEditData(dataForm)

          setGettingPerson(false)

          if (personNameInput.current != null) {
            try {
              personNameInput.current.focus()
            } catch (error) {
              console.log(error)
            }
          }
        }
      } else {
        exitPage()
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
      exitPage()
    }
  }

  async function getResponsibleFranchisee(id) {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `${process.env.UMI_API_HOST_CRM}/api/crm/person`,
        params: {
          franchiseeId: id,
          getPersonDetails: false,
          isFranchisee: true,
        },
      })

      const { data } = response

      if (data.isOk && data.person.length > 0) {
        const person = data.person[0]
        setResponsibleFranchiseeSource([
          {
            name: person.shortName,
            address: person.addressDescription,
            city: `${person.cityName} - ${person.stateAbbreviation}`,
            distance: '',
            id: person.franchiseeId,
            regionId: person.regionId,
            regionName: person.regionName,
            regionStatus: person.regionStatus,
          },
        ])
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getQualification() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/Qualificacao`,
      })
      const { data } = response
      if (data.isOk) {
        setQualificationSource(data.qualificacao)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  useEffect(() => {
    if (
      editData?.qualificationId &&
      !qualificationSource.find(x => x.id === editData.qualificationId)
    ) {
      qualificationSource.push({
        id: editData.qualificationId,
        descricao: editData.qualificationDescription,
      })
      setQualificationSource([...qualificationSource])
    }
  }, [qualificationSource, editData])

  async function getContactSource() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/OrigemContato`,
      })
      const { data } = response
      if (data.isOk) {
        setContactSourceSource(data.origemContato)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  useEffect(() => {
    if (
      editData?.contactSourceId &&
      !contactSourceSource.find(x => x.id === editData.contactSourceId)
    ) {
      contactSourceSource.push({
        id: editData.contactSourceId,
        descricao: editData.contactSourceDescription,
      })
      setContactSourceSource([...contactSourceSource])
    }
  }, [contactSourceSource, editData])

  async function getMarketSegment() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/SegmentoMercado`,
      })
      const { data } = response
      if (data.isOk) {
        setMarketSegmentSource(data.segmentoMercado)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  useEffect(() => {
    if (editData?.marketSegment?.length > 0) {
      let changed = false
      editData.marketSegment.map(d => {
        if (!marketSegmentSource.find(x => x.id === d.id)) {
          changed = true
          marketSegmentSource.push({ id: d.id, descricao: d.descricao })
        }
        return false
      })
      if (changed) {
        setMarketSegmentSource([...marketSegmentSource])
      }
    }
  }, [marketSegmentSource, editData])

  async function getBusinessArea() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/AreaNegocio`,
      })
      const { data } = response
      if (data.isOk) {
        setBusinessAreaSource(data.areaNegocio)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  useEffect(() => {
    if (editData?.businessArea?.length > 0) {
      let changed = false
      editData.businessArea.map(d => {
        if (!businessAreaSource.find(x => x.id === d.id)) {
          changed = true
          businessAreaSource.push({ id: d.id, descricao: d.descricao })
        }
        return false
      })
      if (changed) {
        setBusinessAreaSource([...businessAreaSource])
      }
    }
  }, [businessAreaSource, editData])

  async function savePerson(closeForm) {
    setIsSaving(true)

    setAlertMessages([])

    let isCustomer = true

    if (form.getFieldValue('personType') === 1) {
      if (
        form.getFieldValue('isSeller') ||
        form.getFieldValue('isCollaborator')
      ) {
        isCustomer = false
      }
    }

    const personBody = {
      person: {
        personId,
        name:
          form.getFieldValue('personType') === 1
            ? form.getFieldValue('name')
            : form.getFieldValue('companyName'),
        shortName: form.getFieldValue('name'),
        personType: form.getFieldValue('personType'),
        isActive: form.getFieldValue('isActive'),
        documentCNPJ:
          form.getFieldValue('personType') === 2
            ? removeMask(form.getFieldValue('cnpj'))
            : null,
        documentIE:
          form.getFieldValue('personType') === 2
            ? form.getFieldValue('ie')
            : null,
        documentIM:
          form.getFieldValue('personType') === 2
            ? form.getFieldValue('im')
            : null,
        documentCPF:
          form.getFieldValue('personType') === 1
            ? removeMask(form.getFieldValue('cpf'))
            : '',
        documentRG:
          form.getFieldValue('personType') === 1
            ? form.getFieldValue('rg')
            : null,
        isMale:
          form.getFieldValue('personType') === 2
            ? true
            : form.getFieldValue('genre') === 'M',
        bornDate:
          form.getFieldValue('personType') === 1 &&
          form.getFieldValue('bornDate')
            ? form.getFieldValue('bornDate').format('YYYY-MM-DD')
            : null,
        foundationDate:
          form.getFieldValue('personType') === 2 &&
          form.getFieldValue('foundationDate')
            ? form.getFieldValue('foundationDate').format('YYYY-MM-DD')
            : null,
        defaultEmail:
          form.getFieldValue('defaultEmail') === null
            ? null
            : form.getFieldValue('defaultEmail').toLowerCase(),
        phone: removeMask(form.getFieldValue('phone')),
        cellPhone: removeMask(form.getFieldValue('cellPhone')),
        site: form.getFieldValue('site'),
        observation: form.getFieldValue('observation'),
        isFranchisee:
          form.getFieldValue('personType') === 2
            ? form.getFieldValue('isFranchisee')
            : false,
        isSeller:
          form.getFieldValue('personType') === 1
            ? form.getFieldValue('isSeller')
            : false,
        isCollaborator:
          form.getFieldValue('personType') === 1
            ? form.getFieldValue('isCollaborator')
            : false,
        isCustomer,
        responsibleFranchiseeId: form.getFieldValue('responsibleFranchiseeId'),
        availableCapital: form.getFieldValue('isFranchisee')
          ? removeNumberFormatting(form.getFieldValue('availableCapital'))
          : null,
        royaltyType: form.getFieldValue('isFranchisee')
          ? form.getFieldValue('royaltyType')
          : null,
        meetFranchise: form.getFieldValue('isFranchisee')
          ? form.getFieldValue('meetFranchise')
          : null,
        regionId: form.getFieldValue('isFranchisee')
          ? form.getFieldValue('regionId')
          : null,
        qualificacaoId: form.getFieldValue('qualificationId'),
        origemContatoId: form.getFieldValue('contactSourceId'),
        segmentosMercado: form.getFieldValue('marketSegmentId')
          ? form
              .getFieldValue('marketSegmentId')
              .map(d => ({ segmentoMercadoId: d }))
          : null,
        personContacts: [],
        personAddresses: [],
        supervisorId: form.getFieldValue('supervisor'),
        userId: form.getFieldValue('user'),
      },
    }

    let address = {
      id: personAddressId, // id do endereço principal
      typeId: 1,
      isStandart: true,
      isActive: true,
      name: form.getFieldValue('addressName'),
      number: form.getFieldValue('addressNumber'),
      neighborhood: form.getFieldValue('neighborhood'),
      complement: form.getFieldValue('complement'),
      zipCode:
        form.getFieldValue('zipCode') === null
          ? null
          : removeMask(form.getFieldValue('zipCode')),
      cityId: form.getFieldValue('cityId'),
      stateAbbreviation: form.getFieldValue('stateAbbreviation'),
      countryId: form.getFieldValue('countryId'),
      locationReference: form.getFieldValue('locationReference'),
    }

    personBody.person.personAddresses.push(address)

    addressDataSource.map(addressItem => {
      address = {
        id: addressItem.id,
        typeId: addressItem.typeId,
        isStandart: false,
        isActive: addressItem.isActive,
        name: addressItem.name,
        number: addressItem.number,
        neighborhood: addressItem.neighborhood,
        complement: addressItem.complement,
        zipCode:
          addressItem.zipCode === null ? null : removeMask(addressItem.zipCode),
        cityId: addressItem.cityId,
        stateAbbreviation: addressItem.stateAbbreviation,
        countryId: addressItem.countryId,
        locationReference: addressItem.locationReference,
      }

      personBody.person.personAddresses.push(address)

      return true
    })

    contactDataSource.map(contactItem => {
      const contact = {
        contactName: contactItem.contactName,
        isActive: contactItem.isActive,
        role: contactItem.role,
        emailId: contactItem.emailId,
        email:
          contactItem.email === null ? null : contactItem.email.toLowerCase(),
        phoneId: contactItem.phoneId,
        phone: removeMask(contactItem.phone),
        cellPhoneId: contactItem.cellPhoneId,
        cellPhone: removeMask(contactItem.cellPhone),
        DocumentCPF: removeMask(contactItem.documentCPF) || '',
      }

      personBody.person.personContacts.push(contact)

      return true
    })

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `${process.env.UMI_API_HOST_CRM}/api/crm/person`,
        data: personBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        const id = parseInt(data.idGenerated, 10)
        if (notNullUndefined(id) && id > 0) {
          await messageCRM(id)
        }
        postDiscountAllowance(
          priceListTableData,
          ownerId,
          sellerId || data?.sellerId,
        )
        message.success('Salvo com sucesso!')
        if (closeForm) {
          exitPage()
        } else {
          if (isRouter) {
            router.push(`/crm/PersonForm/${id}`)
          }
          setPersonId(id)
          getPerson(id, false, true)
        }
      } else {
        if (data.validationMessageList.length > 0) {
          setAlertMessages(data.validationMessageList)
          executeScroll()
        }

        if (personNameInput.current != null) {
          try {
            personNameInput.current.focus()
          } catch (error) {
            console.log(error)
          }
        }

        message.error(data.message)
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  useEffect(() => {
    if (userPermissions.length > 0) {
      const canDelete = hasPermission(userPermissions, 'ExcluirAlcadaDesconto')
      const canEdit = hasPermission(userPermissions, 'EditarAlcadaDesconto')
      const canAdd = hasPermission(userPermissions, 'Include')

      setDeleteAlcadaDesconto(canDelete)
      setEditAlcadaDesconto(canEdit)
      setAddEditAlcadaDesconto(canAdd)
    }
  }, [userPermissions])

  return (
    <div className="container" ref={homeRef}>
      <PersonFormHeader
        {...{
          refresh,
          contactDataSource,
          isSaving,
          loadingForm,
          personId,
          editData,
          handleCancel,
          canBeUpdated,
          form,
          ownerProfile,
        }}
      />

      <Spin size="large" spinning={loadingForm || isSaving}>
        <Skeleton loading={loadingForm} paragraph={{ rows: 13 }} active />

        <div style={{ display: loadingForm ? 'none' : 'block' }}>
          {alertMessages.map((message, index) => (
            <Alert
              type="error"
              message={message}
              key={index}
              showIcon
              className="mb-2"
            />
          ))}

          <Form
            form={form}
            layout="vertical"
            onSubmit={e => handleSubmit(e, false)}
          >
            <PersonMainForm
              ref={personNameInput}
              {...{
                form,
                canBeUpdated,
                personId,
                ownerProfile,
                setPersonId,
                getPerson,
                editData,
                regionSource,
                setRegionSource,
                qualificationSource,
                contactSourceSource,
                marketSegmentSource,
                businessAreaSource,
                setIsSeller,
              }}
            />

            <PersonMainAddressForm
              {...{
                form,
                canBeUpdated,
                states,
                citySource,
                setCitySource,
                editData,
              }}
            />

            <InputResponsibleFranchisee
              {...{
                responsibleFranchiseeSource,
                setResponsibleFranchiseeSource,
                form,
                canBeUpdated,
                ownerProfile,
                citySource,
                editData,
              }}
            />

            <PersonAddressTable
              {...{
                loadingForm,
                canBeUpdated,
                addressDataSource,
                setAddressDataSource,
                states,
                tiposEndereco,
                selectedRowKeysAddress,
                setSelectedRowKeysAddress,
              }}
            />

            <PersonContactTable
              {...{
                editData,
                loadingForm,
                canBeUpdated,
                contactDataSource,
                setContactDataSource,
                selectedRowKeysContact,
                setSelectedRowKeysContact,
                setRefresh,
              }}
            />

            {isSeller && (
              <PersonPriceListTable
                {...{
                  loadingForm,
                  canBeUpdated,
                  selectedRowPriceList,
                  setSelectedRowPriceList,
                  priceListTableData,
                  setPriceListTableData,
                  deleteAlcadaDesconto,
                  editAlcadaDesconto,
                  addAlcadaDesconto,
                }}
              />
            )}

            <PersonFormFooter
              {...{ isSaving, handleSubmit, handleCancel, canBeUpdated }}
            />
          </Form>
        </div>
      </Spin>
    </div>
  )
}

PersonForm.propTypes = {
  personId: PropTypes.number,
  setPersonId: PropTypes.func,
  onClose: PropTypes.func,
  isRouter: PropTypes.func,
}

// const WrappedPersonForm = Form.create()(PersonForm)
export default PersonForm

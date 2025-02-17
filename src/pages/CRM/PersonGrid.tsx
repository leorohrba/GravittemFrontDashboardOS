/**
 * breadcrumb: Cadastro de Pessoas
 */
/* eslint-disable consistent-return */
import { apiCRM } from '@services/api'
import { personGridColumns } from '@utils/columns/personGrid'
import {
  formatPhone,
  getInitialSearch,
  getPermissions,
  handleAuthError,
  hasPermission,
  setParamValues,
  useGetColumnsConfiguration,
} from '@utils'
import { message, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import PersonGridHeader from './components/PersonGridHeader'
import PersonGridTable from './components/PersonGridTable'
import PersonForm from './PersonForm/PersonForm'
import RegionModal from './Region/RegionModal'
import TaskGenerateModal from './TaskGenerate/TaskGenerateModal'
import moment from 'moment'
import { notNullUndefined } from '@utils/generics'
import { ISearchOptions } from '../../interfaces/SearchOptionsInterface'
import { findAddress } from '@services/taskGenerate/service'

const params = {}

export default function PersonGrid(props) {
  const [loadingAddressType, setLoadingAddressType] = useState<boolean>(true)
  const [patternSearchOptions] = useState<ISearchOptions[]>([
    {
      value: 'shortName',
      label: 'Nome',
      placeholder: 'Buscar nome da pessoa',
      type: 'search',
    },
    {
      value: 'name',
      label: 'Razão social',
      placeholder: 'Buscar pela razão social',
      type: 'search',
    },
    {
      value: 'userName',
      label: 'Usuário',
      placeholder: 'Buscar pelo usuário',
      type: 'search',
    },
    {
      value: 'personType',
      label: 'Tipo de pessoa',
      placeholder: 'Escolha o tipo de pessoa',
      type: 'select',
      options: [
        { label: 'Física', value: 1 },
        { label: 'Jurídica', value: 2 },
      ],
    },
    {
      value: 'addressType',
      label: 'Tipo de endereço',
      placeholder: 'Escolha o tipo de endereço',
      type: 'select',
      options: [],
    },
    {
      value: 'responsibleFranchiseeName',
      label: 'Franqueado',
      placeholder: 'Informe o nome do franqueado responsável',
      type: 'search',
    },
    {
      value: 'cityName',
      label: 'Cidade',
      placeholder: 'Buscar pela cidade',
      type: 'search',
    },
    {
      value: 'stateAbbreviation',
      label: 'UF',
      placeholder: 'Selecione um estado',
      type: 'select',
      options: [],
    },
    {
      value: 'cnpj',
      label: 'CNPJ',
      placeholder: 'Buscar pelo CNPJ',
      type: 'search',
    },
    {
      value: 'cpf',
      label: 'CPF',
      placeholder: 'Buscar pelo CPF',
      type: 'search',
    },
    {
      value: 'qualificacaoId',
      label: 'Qualificação',
      placeholder: 'Selecione a qualificação',
      type: 'select',
      options: [],
    },
    {
      value: 'origemContatoId',
      label: 'Origem contato',
      placeholder: 'Selecione a origem de contato',
      type: 'select',
      options: [],
    },
    {
      value: 'segmentoMercadoId',
      label: 'Segmento de mercado',
      placeholder: 'Selecione o segmento de mercado',
      type: 'select',
      options: [],
    },
    {
      value: 'areaNegocioId',
      label: 'Área de negócio',
      placeholder: 'Selecione a área de negócio',
      type: 'select',
      options: [],
    },
    {
      value: 'status',
      label: 'Status',
      placeholder: 'Selecione o status',
      type: 'select',
      options: [
        {
          label: 'Ativo',
          value: 1,
        },
        {
          label: 'Inativo',
          value: 2,
        },
      ],
    },
    {
      value: 'CreateDate',
      label: 'Data de criação',
      type: 'rangeDate',
    },
    {
      value: 'hasTasks',
      label: 'Possui tarefas?',
      placeholder: 'Possui tarefas?',
      type: 'select',
      options: [
        { label: 'Sim', value: 1 },
        { label: 'Não', value: 2 },
      ],
    },
    {
      value: 'attribute',
      label: 'Atributo',
      placeholder: 'Escolha o atributo da pessoa',
      type: 'select',
      options: [
        { label: 'Cliente', value: 'customer' },
        { label: 'Franqueado', value: 'franchisee' },
        { label: 'Vendedor', value: 'seller' },
        { label: 'Colaborador', value: 'collaborator' },
      ],
    },
    {
      value: 'email',
      label: 'E-mail',
      placeholder: 'E-mail da pessoa',
      type: 'search',
    },
  ])
  
  const [visibleTaskGenerateModal, setVisibleTaskGenerateModal] = useState(
    false,
  )
  const [keyTaskGenerateModal, setKeyTaskGenerateModal] = useState(0)
  const [userPermissions, setUserPermissions] = useState([])
  const [people, setPeople] = useState([])
  const [loadingPeople, setLoadingPeople] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [owner, setowner] = useState()
  const [ownerProfile, setOwnerProfile] = useState(null)
  const [searchOptions, setSearchOptions] = useState(patternSearchOptions)
  const [dataSet, setDataset] = useState([{ columns: [], data: [] }])
  const [canDelete, setCanDelete] = useState(false)
  const [canGenerateTask, setCanGenerateTask] = useState(false)
  const [keySearch, setKeySearch] = useState(0)
  const [regionId, setRegionId] = useState(null)
  const [regionModalVisible, setRegionModalVisible] = useState(false)
  const [states, setStates] = useState(null)
  const [qualifications, setQualifications] = useState(null)
  const [contactSources, setContactSources] = useState(null)
  const [marketSegments, setMarketSegments] = useState(null)
  const [businessAreas, setBusinessAreas] = useState(null)
  const [tags, setTags] = useState([])
  const [companies, setCompanies] = useState([])
  const [screen, setScreen] = useState('PersonGrid')
  const [personId, setPersonId] = useState(null)
  const query = new URLSearchParams(window?.location?.search)

    const urlPersonId = query.get("personId")
  
    const fromNewUI = query.get("fromNewUI")
    
  const [updateColumnsKey, setUpdateColumnsKey] = useState(0)

  let personPerformed = []

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedRowKeys => onSelectChangePerson(selectedRowKeys),
  }

  const onSelectChangePerson = selectedRowKeys => {
    setCanDelete(false)
    setSelectedRowKeys(selectedRowKeys)
  }

  useEffect(() => {
    buildDataToExport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [people])

  useEffect(() => {
    setCanDelete(
      hasPermission(userPermissions, 'Exclude') &&
        people.filter(
          d => selectedRowKeys.includes(d.personId) && !d.canBeDeleted,
        ).length === 0,
    )

    setCanGenerateTask(
      people.filter(d => selectedRowKeys.includes(d.personId) && !d.isCustomer)
        .length === 0,
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRowKeys, people])

  useEffect(() => {
    updateAddressType()
    setLoadingAddressType(false)
    setPermissions()
    clearParams()
    getOwnerProfile()
    // getPeople()
    getStates()
    getQualifications()
    getContactSources()
    getMarketSegments()
    getBusinessAreas()

    getInitialSearch('PersonGrid', 'crm', setTags, startSearch, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (tags.length > 0) {
      startSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags])

  useEffect(() => {
    if (
      businessAreas &&
      contactSources &&
      qualifications &&
      marketSegments &&
      states &&
      ownerProfile
    ) {
      configureOptions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    states,
    ownerProfile,
    businessAreas,
    contactSources,
    qualifications,
    marketSegments,
  ])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  async function getBusinessAreas() {
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

  function configureOptions() {
    const searchOptionsWork = searchOptions.slice(0)

    if (ownerProfile === 'Franchise' || ownerProfile === 'Standard') {
      let i = searchOptionsWork.findIndex(
        x => x.value === 'responsibleFranchiseeName',
      )
      if (i > -1) {
        searchOptionsWork.splice(i, 1)
      }

      i = searchOptionsWork.findIndex(x => x.value === 'attribute')
      if (i > -1) {
        const j = searchOptionsWork[i].options.findIndex(
          x => x.value === 'franchisee',
        )
        if (j > -1) {
          searchOptionsWork[i].options.splice(j, 1)
        }
      }
    }

    let i = searchOptionsWork.findIndex(x => x.value === 'stateAbbreviation')
    if (i > -1) {
      states.map(state => {
        searchOptionsWork[i].options.push({
          label: state.stateName,
          value: state.stateAbbreviation,
        })
        return true
      })
    }

    i = searchOptionsWork.findIndex(x => x.value === 'qualificacaoId')
    if (i > -1) {
      qualifications.map(d => {
        searchOptionsWork[i].options.push({
          label: d.descricao,
          value: d.id,
        })
        return true
      })
    }

    i = searchOptionsWork.findIndex(x => x.value === 'origemContatoId')
    if (i > -1) {
      contactSources.map(d => {
        searchOptionsWork[i].options.push({
          label: d.descricao,
          value: d.id,
        })
        return true
      })
    }

    i = searchOptionsWork.findIndex(x => x.value === 'segmentoMercadoId')
    if (i > -1) {
      marketSegments.map(d => {
        searchOptionsWork[i].options.push({
          label: d.descricao,
          value: d.id,
        })
        return true
      })
    }

    i = searchOptionsWork.findIndex(x => x.value === 'areaNegocioId')
    if (i > -1) {
      businessAreas.map(d => {
        searchOptionsWork[i].options.push({
          label: d.descricao,
          value: d.id,
        })
        return true
      })
    }

    setSearchOptions(searchOptionsWork)
  }

  async function getOwnerProfile() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `${process.env.UMI_API_HOST_CRM}/api/crm/owner`,
      })

      const { data } = response

      if (data.isOk) {
        setowner(data)
        setOwnerProfile(data.ownerProfile)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getStates() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `${process.env.UMI_API_HOST_CRM}/api/crm/state`,
      })

      const { data } = response

      if (data.isOk) {
        setStates(data.states)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getQualifications() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/Qualificacao`,
      })

      const { data } = response

      if (data.isOk) {
        setQualifications(data.qualificacao)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  useEffect(() => {
    getColumns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateColumnsKey])

  async function getContactSources() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/OrigemContato`,
      })

      const { data } = response

      if (data.isOk) {
        setContactSources(data.origemContato)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getMarketSegments() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/SegmentoMercado`,
      })

      const { data } = response

      if (data.isOk) {
        setMarketSegments(data.segmentoMercado)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getPeople() {
    setLoadingPeople(true)
    setSelectedRowKeys([])
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/person`,
        params,
      })

      const { data } = response

      if (data.isOk) {
        setPeople(data.person)
        setLoadingPeople(false)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function confirmDeletePeople() {
    Modal.confirm({
      content:
        selectedRowKeys.length === 1
          ? 'Você tem certeza que deseja excluir a pessoa selecionada?'
          : 'Você tem certeza que deseja excluir as pessoas selecionadas?',
      title: 'Atenção',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deletePeople()
      },
    })
  }

  function addPersonPerformed(personId) {
    personPerformed.push(personId)

    if (personPerformed.length >= selectedRowKeys.length) {
      personPerformed = []
      getPeople()
      setKeySearch(keySearch + 1)
    }
  }

  function deletePeople() {
    setLoadingPeople(true)
    personPerformed = []

    selectedRowKeys.map(async selectedRowKey => {
      const personContainsSomeProposal = await checkProposalContainsPerson(
        selectedRowKey,
      )
      !personContainsSomeProposal && deletePerson(selectedRowKey)
    })
    setLoadingPeople(false)
  }

  async function checkProposalContainsPerson(personId) {
    const personSelected = people.filter(p => p.personId === personId)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/Proposal`,
        params: { companyId: personSelected[0].customerId },
      })

      const { data } = response
      if (data.isOk) {
        if (data.proposal.length > 0) {
          data.proposal.length === 1
            ? message.warning(
                ` ${personSelected[0].shortName} tem ${data.proposal.length} negócio vinculado. Exclusão não permitida.`,
              )
            : message.warning(
                ` ${personSelected[0].shortName} tem ${data.proposal.length} negócios vinculados. Exclusão não permitida.`,
              )
          return true
        }
        return false
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function deletePerson(personId) {
    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/crm/person`,
        params: { personId },
      })

      const { data } = response

      if (!data.isOk) {
        message.error(data.message)
      }
      // setItemPerformed(array => array.concat(personId));
      addPersonPerformed(personId)
    } catch (error) {
      handleAuthError(error)
      // Adiciona à lista do mesmo jeito
      addPersonPerformed(personId)
    }
  }

  const updateAddressType = async ():Promise<void> => {
    const address = await findAddress();
    if (notNullUndefined(address)) {
      setSearchOptions((prevOptions: ISearchOptions[]) => {
            return prevOptions.map((option: ISearchOptions) => {
                if (option.value === 'addressType') {
                    return {
                        ...option,
                        options: notNullUndefined(address)
                        ? mapAddressTypes(address)
                        : [],
                    };
                }
                return option;
            });
        });
    } else {
      message.error('Erro ao atualizar o tipo de endereço!');
    }
  }

  const mapAddressTypes = (addressType: IGetAddressData) => {
    if (!notNullUndefined(addressType) || !notNullUndefined(addressType.tiposEndereco)) {
        return [];
    }

    return addressType.tiposEndereco.map(type => ({
        label: type.nome,
        value: type.id,
    }));
  }

  function startSearch() {
    setSearchValues()
    getPeople()
  }

  function clearParams() {
    params.personId = null
    params.personType = null
    params.addressType = null
    params.name = ''
    params.shortName = ''
    params.responsibleFranchiseeName = ''
    params.cityName = ''
    params.stateAbbreviation = ''
    params.cnpj = ''
    params.cpf = ''
    params.isSeller = null
    params.isCollaborator = null
    params.isCustomer = null
    params.isFranchisee = null
    params.queryOperator = 'like'
    params.onlyMyOwnerId = null
    params.qualificacaoId = null
    params.origemContatoId = null
    params.segmentoMercadoId = null
    params.startCreateDate = null
    params.endCreateDate = null
    params.areaNegocioId = null
  }

  function setSearchValues() {
    clearParams()
    setParamValues(params, searchOptions, tags)
    params.getPersonDetails = true
  }

  function buildDataToExport() {
    const dataSetToExport = [
      {
        columns: serverColumns.map(c => c.nomeColuna),
        data: [],
      },
    ]

    people.map(rowData =>
      dataSetToExport[0].data.push(
        serverColumns.map(c =>
          c.dataIndex === 'phone'
            ? formatPhone(rowData.phone)
            : c.dataIndex === 'createDateTime'
            ? rowData.createDateTime
              ? moment(rowData.createDateTime).format('DD/MM/YYYY')
              : ''
            : c.dataIndex === 'cellPhone'
            ? formatPhone(rowData.cellPhone)
            : c.dataIndex === 'isActive'
            ? rowData.isActive
              ? 'Ativo'
              : 'Inativo'
            : c.dataIndex === 'isActive'
            ? rowData.isFranchisee
              ? 'Sim'
              : 'Não'
            : c.dataIndex === 'personType'
            ? rowData.personType === 1
              ? 'Física'
              : 'Jurídica'
            : c.dataIndex === 'segmentosMercado'
            ? rowData.segmentosMercado
                .map(s => s.segmentoMercadoDescricao)
                .join(', ')
            : c.dataIndex === 'document'
            ? rowData.documentCNPJ ?? rowData.documentCPF
            : rowData[c.dataIndex],
        ),
      ),
    )

    setDataset(dataSetToExport)
  }

  const openRegionModal = id => {
    setRegionId(id)
    setRegionModalVisible(true)
  }

  const refreshData = () => {
    getPeople()
  }

  const openGenerateTask = () => {
    setKeyTaskGenerateModal(keyTaskGenerateModal + 1)
    setCompanies(
      people
        .filter(d => selectedRowKeys.includes(d.personId) && d.isCustomer)
        .map(x => ({
          companyId: x.customerId,
          franchiseeId: x.responsibleFranchiseeId,
        })),
    )
    setVisibleTaskGenerateModal(true)
  }

  const openPerson = id => {
    setPersonId(id)
    setScreen('PersonForm')
  }

  const handleClosePersonForm = () => {
    setScreen('PersonGrid')
    getPeople()
  }

  useEffect(() => {
  if (fromNewUI && urlPersonId !== undefined) {
  openPerson(urlPersonId)  
  }  
  }, [fromNewUI, urlPersonId])  

  const [
    serverColumns,
    loadingColumns,
    getColumns,
  ] = useGetColumnsConfiguration(
    apiCRM,
    `PersonGrid`,
    personGridColumns(openRegionModal),
  )

  return (
    <React.Fragment>
      {screen === 'PersonForm' ? (
        <PersonForm
          personId={personId}
          setPersonId={setPersonId}
          onClose={handleClosePersonForm}
          {...{fromNewUI}}
        />
      ) : (
        <React.Fragment>
          <RegionModal
            regionId={regionId}
            setRegionId={setRegionId}
            visible={regionModalVisible}
            setVisible={setRegionModalVisible}
            readOnly
          />
          <TaskGenerateModal
            visibleModal={visibleTaskGenerateModal}
            setVisibleModal={setVisibleTaskGenerateModal}
            key={keyTaskGenerateModal}
            companies={companies}
            refreshGrid={() => getPeople()}
          />
          <div className="p-4 container">
            <PersonGridHeader
              {...{
                refreshData,
                tags,
                setTags,
                startSearch,
                searchOptions,
                keySearch,
                userPermissions,
                loadingPeople,
                selectedRowKeys,
                canDelete,
                confirmDeletePeople,
                dataSet,
                canGenerateTask,
                openGenerateTask,
                openPerson,
                ownerProfile,
                setUpdateColumnsKey,
                params,
                people,
                owner,
                loadingAddressType
              }}
            />
            <PersonGridTable
              {...{
                loadingColumns,
                serverColumns,
                openRegionModal,
                rowSelection,
                loadingPeople,
                people,
                ownerProfile,
                userPermissions,
                openPerson,
                updateColumnsKey,
              }}
            />
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

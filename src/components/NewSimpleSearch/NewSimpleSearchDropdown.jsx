import { apiSearch } from '@services/api'
import { handleAuthError, isObjEmpty } from '@utils'
import {
  Button,
  Dropdown,
  Menu,
  message,
  Popconfirm,
  Skeleton,
  Tooltip,
} from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import NewSimpleSearchDropdownModal from './NewSimpleSearchDropdownModal'

export function NewSimpleSearchDropdown({
  searchOptions,
  tags,
  getSearchValues,
  screenName,
  updateTags,
  setTags,
  startSearch,
}) {
  const [dropdownVisible, setDropdownVisible] = useState(false)
  // updating modal data with key
  const [modalKey, setModalKey] = useState(0)
  const [editSearchModalVisible, setEditSearchModalVisible] = useState(false)
  const [editSearchData, setEditSearchData] = useState({})
  const [loadingSavedSearchs, setLoadingSavedSearchs] = useState(true)
  const [savedSearchs, setSavedSearchs] = useState([])
  const [loadingDeleteSearch, setLoadingDeleteSearch] = useState(false)

  useEffect(() => {
    if (dropdownVisible) {
      setEditSearchData({})
      getSavedSearchs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownVisible])

  const getSavedSearchs = async searchId => {
    setLoadingSavedSearchs(true)
    try {
      const response = await apiSearch.get(`/api/Pesquisa/${screenName}`)
      setSavedSearchs(response.data.pesquisas)
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível buscar as pesquisas salvas')
    }
    setLoadingSavedSearchs(false)
  }

  const getSavedSearchDetail = async searchId => {
    try {
      const response = await apiSearch.get(
        `/api/Pesquisa/${screenName}/${searchId}`,
      )
      setEditSearchData(response.data)
    } catch (error) {
      setEditSearchData({})
      handleAuthError(error)
      message.error('Não foi possível carregar os campos')
    }
  }

  const showEditSearchModal = searchId => {
    getSavedSearchDetail(searchId)
  }
  const showSaveSearchModal = () => {
    const searchData = {
      id: 0,
      titulo: 'Nova pesquisa',
      usuarioId: 'vinicius.zomer',
      editavel: false,
    }
    setEditSearchData(searchData)
  }

  useEffect(() => {
    if (!isObjEmpty(editSearchData)) {
      setModalKey(modalKey => modalKey + 1)
      setEditSearchModalVisible(true)
    }
  }, [editSearchData])
  const privateSearchsArray = savedSearchs.filter(
    search => search.pesquisaPessoal,
  )
  const publicSearchsArray = savedSearchs.filter(
    search => !search.pesquisaPessoal,
  )
  const handleDeleteSavedSearch = (event, searchId) => {
    event.stopPropagation()
    deleteSavedSearch(searchId)
  }

  const deletePopConfirm = searchId => {
    return (
      <Popconfirm
        placement="bottomRight"
        onConfirm={event => handleDeleteSavedSearch(event, searchId)}
        title="Deseja mesmo excluir essa pesquisa salva？"
        okText="Excluir"
        cancelText="Cancelar"
      >
        <i
          role="button"
          onClick={event => event.stopPropagation()}
          className="fa fa-times fa-lg mr-2 absolute mt-1"
          style={{
            right: 7,
            color: 'gray',
          }}
        />
      </Popconfirm>
    )
  }

  const searchTitle = searchTitle => {
    return (
      <Tooltip title={searchTitle} placement="left">
        <i
          className="fa fa-star fa-lg mr-2"
          style={{
            color: '#1976d2',
          }}
        />
        {searchTitle}
      </Tooltip>
    )
  }

  const privateSearchsGroup = (
    <Menu.ItemGroup
      key="g1"
      title="Minhas pesquisas"
      className="private-searchs"
      style={{
        color: 'black',
      }}
    >
      {privateSearchsArray.map(search => (
        <Menu.Item
          key={search.id}
          onClick={() => showEditSearchModal(search.id)}
        >
          {searchTitle(search.titulo)}
          {deletePopConfirm(search.id)}
        </Menu.Item>
      ))}
    </Menu.ItemGroup>
  )
  const publicSearchsGroup = (
    <Menu.ItemGroup
      key="g2"
      title="Pesquisas públicas"
      className="private-searchs"
      style={{
        color: 'black',
      }}
    >
      {publicSearchsArray.map(search => (
        <Menu.Item
          key={search.id}
          onClick={() => showEditSearchModal(search.id)}
        >
          {searchTitle(search.titulo)}
          {search.editavel && deletePopConfirm(search.id)}
        </Menu.Item>
      ))}
    </Menu.ItemGroup>
  )

  const deleteSavedSearch = async searchId => {
    setLoadingDeleteSearch(true)
    try {
      const response = await apiSearch.delete(
        `/api/Pesquisa/${screenName}/${searchId}`,
      )
      response.data.isOk && message.success('Pesquisa excluída com sucesso')
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível excluir a pesquisa')
    }
    setLoadingDeleteSearch(false)
    getSavedSearchs()
    setEditSearchModalVisible(false)
  }

  const dropdownContent = (
    <Menu>
      <Menu.Item key="1" onClick={showSaveSearchModal}>
        <i
          className="fa fa-star-o fa-lg mr-2"
          style={{
            color: '#1976d2',
          }}
        />
        Salvar pesquisa
      </Menu.Item>
      {(privateSearchsArray.length > 0 || publicSearchsGroup.length > 0) && (
        <Menu.Divider />
      )}
      {privateSearchsArray.length > 0 && privateSearchsGroup}
      {publicSearchsArray.length > 0 && publicSearchsGroup}
    </Menu>
  )
  return (
    <React.Fragment>
      <Dropdown
        overlay={
          loadingSavedSearchs ? (
            <Menu>
              <Menu.Item style={{ cursor: 'default' }}>
                <Skeleton paragraph={{ rows: 5 }} active loading />
              </Menu.Item>
            </Menu>
          ) : (
            dropdownContent
          )
        }
        visible={dropdownVisible}
        trigger={['click']}
        onVisibleChange={visible => setDropdownVisible(visible)}
        className="ml-1"
        overlayClassName="simple-search-dropdown"
        overlayStyle={{
          width: 250,
        }}
      >
        <Button type="primary">
          <i className="fa fa-angle-down fa-lg" aria-hidden="true" />
        </Button>
      </Dropdown>
      {!loadingSavedSearchs && (
        <NewSimpleSearchDropdownModal
          key={modalKey}
          editSearchModalVisible={editSearchModalVisible}
          setEditSearchModalVisible={setEditSearchModalVisible}
          editSearchData={editSearchData}
          {...{
            searchOptions,
            tags,
            screenName,
            getSearchValues,
            setTags,
            updateTags,
            deleteSavedSearch,
            loadingDeleteSearch,
            startSearch,
          }}
        />
      )}
    </React.Fragment>
  )
}

NewSimpleSearchDropdown.propTypes = {
  dropdownVisible: PropTypes.bool,
  getSearchValues: PropTypes.func,
  screenName: PropTypes.string,
  searchOptions: PropTypes.array,
  setDropdownVisible: PropTypes.func,
  setTags: PropTypes.func,
  startSearch: PropTypes.func,
  tags: PropTypes.array,
  updateTags: PropTypes.func,
}

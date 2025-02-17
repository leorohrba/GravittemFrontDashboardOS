import { Form } from '@ant-design/compatible'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { NewSimpleSearchDropdownModalForm } from './NewSimpleSearchDropdownModalForm'
import { NewSimpleSearchForm } from './NewSimpleSearchForm'

let id = 0

class NewSimpleSearchDropdownModal extends React.Component {
  state = { loadingSavedSearchFields: false }

  remove = k => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    // We need at least one passenger
    if (keys.length === 1) {
      return
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
  }

  add = e => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(id++)
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    })
  }

  componentDidMount = async () => {
    const { form, tags, editSearchData, searchOptions } = this.props
    if (tags.length === 0 && editSearchData.id === 0) {
      const keys = form.getFieldValue('keys')
      const nextKeys = keys.concat(id++)
      form.setFieldsValue({
        keys: nextKeys,
      })
    } else if (editSearchData.id === 0) {
      for (let index = 0; index < tags.length; index++) {
        const keys = form.getFieldValue('keys')
        const nextKeys = keys.concat(id++)
        form.setFieldsValue({
          keys: nextKeys,
        })
      }
      setTimeout(() => {
        const keys = form.getFieldValue('keys')

        for (let index = 0; index < tags.length; index++) {
          const element = tags[index]
          if (element.fieldType === 'rangeDate') {
            const splittedRangeDate = element.searchField.split('~')
            const rangeDate = [
              moment(splittedRangeDate[0], 'DD/MM/YYYY'),
              moment(splittedRangeDate[1], 'DD/MM/YYYY'),
            ]
            form.setFieldsValue({
              [`fieldName_${keys[index]}`]: element.fieldValue,
              [`searchBox_${keys[index]}`]: rangeDate,
            })
          } else {
            form.setFieldsValue({
              [`fieldName_${keys[index]}`]: element.fieldValue,
              [`searchBox_${keys[index]}`]: element.searchField,
            })
          }
        }
      }, 200)
    } else if (editSearchData.id) {
      const { condicoes } = editSearchData
      for (let index = 0; index < condicoes.length; index++) {
        const keys = form.getFieldValue('keys')
        const nextKeys = keys.concat(id++)
        form.setFieldsValue({
          keys: nextKeys,
        })
      }
      this.setState({
        loadingSavedSearchFields: false,
      })

      setTimeout(() => {
        const keys = form.getFieldValue('keys')

        for (let index = 0; index < condicoes.length; index++) {
          const element = condicoes[index]
          const field = searchOptions.find(s => s.value === element.propriedade)

          if (field.type === 'rangeDate') {
            const splittedRangeDate = element.valor.split('~')
            const rangeDate = [
              moment(splittedRangeDate[0], 'DD/MM/YYYY'),
              moment(splittedRangeDate[1], 'DD/MM/YYYY'),
            ]
            form.setFieldsValue({
              [`fieldName_${keys[index]}`]: element.propriedade,
              [`searchBox_${keys[index]}`]: rangeDate,
            })
          } else {
            form.setFieldsValue({
              [`fieldName_${keys[index]}`]: element.propriedade,
              [`searchBox_${keys[index]}`]: !isNaN(Number(element.chave))
                ? Number(element.chave)
                : element.chave ?? element.valor,
            })
          }
        }
      }, 200)
    }
  }

  render() {
    const {
      form,
      tags,
      editSearchData,
      editSearchModalVisible,
      setEditSearchModalVisible,
      updateTags,
      setTags,
      screenName,
      deleteSavedSearch,
      loadingDeleteSearch,
      searchOptions,
      getSearchValues,
      startSearch,
    } = this.props

    const { getFieldDecorator, getFieldValue } = form

    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')

    const { loadingSavedSearchFields } = this.state

    const formItems = keys.map((k, index) => {
      const { condicoes } = editSearchData
      return (
        <div
          key={k}
          className={`flex ${keys.length > 1 && index > 0 && 'mt-5'}`}
        >
          <NewSimpleSearchForm
            searchBoxWidth="24vw"
            {...{
              searchOptions,
              form,
              getSearchValues,
            }}
            defaultType={
              typeof condicoes !== 'undefined'
                ? condicoes[index]?.propriedade
                : tags.length > 0 &&
                  tags.length === keys.length &&
                  tags[index].fieldValue
            }
            disableAutoFocus
            isSaveSearch
            fieldNameIndex={k}
          />
          <i
            className="fa fa-plus mt-1"
            onClick={this.add}
            style={{
              marginLeft: '20px',
              color: '#1976d2',
              cursor: 'pointer',
              fontSize: '1.8em',
            }}
            role="button"
          />
          {keys.length > 1 && (
            <i
              className="fa fa-times mt-1"
              onClick={() => this.remove(k)}
              style={{
                marginLeft: '20px',
                color: '#d32f2f',
                cursor: 'pointer',
                fontSize: '1.8em',
              }}
              role="button"
            />
          )}
        </div>
      )
    })

    return (
      <NewSimpleSearchDropdownModalForm
        add={this.add}
        {...{
          editSearchModalVisible,
          setEditSearchModalVisible,
          screenName,
          getFieldDecorator,
          formItems,
          editSearchData,
          form,
          searchOptions,
          tags,
          updateTags,
          setTags,
          loadingSavedSearchFields,
          startSearch,
          deleteSavedSearch,
          loadingDeleteSearch,
        }}
      />
    )
  }
}

NewSimpleSearchDropdownModal.propTypes = {
  deleteSavedSearch: PropTypes.func,
  editSearchData: PropTypes.array,
  editSearchModalVisible: PropTypes.bool,
  form: PropTypes.object,
  getSearchValues: PropTypes.func,
  loadingDeleteSearch: PropTypes.bool,
  screenName: PropTypes.string,
  searchOptions: PropTypes.array,
  setEditSearchModalVisible: PropTypes.func,
  setTags: PropTypes.func,
  startSearch: PropTypes.func,
  tags: PropTypes.array,
  updateTags: PropTypes.func,
}

export default Form.create({ name: 'dynamic_form_item' })(
  NewSimpleSearchDropdownModal,
)

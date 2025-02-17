import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import useDebounce from '@components/useDebounce'
import { apiGravittem, apiNewContract } from '@services/api'
import { isObjEmpty } from '@utils/'
import { useGetDataFromServer } from '@utils/customHooks'
import { documentEnum } from '@utils/enums'
import { AutoComplete, Input, message, Select, Spin, Tag } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

const InputGroup = Input.Group
const { Option } = Select

export default function Document({
  searchOptions,
  form,
  label,
  startSearch,
  defaultType,
  initialValue,
  documentTags,
  setDocumentTags,
  disabled,
  ...rest
}) {
  const { getFieldDecorator } = form

  const [documentOptions, setDocumentOptions] = useState([])
  const [filterType, setFilterType] = useState(documentEnum[0]?.id)

  const [searchLabel, setSearchLabel] = useState('')
  const debouncedInput = useDebounce(searchLabel, 400)
  const inputSearch = useRef(null)

  useEffect(() => {
    const isEdit = initialValue && !isObjEmpty(initialValue)

    if (defaultType) {
      setFilterType(defaultType)
    }
    setDocumentTags(
      isEdit
        ? [
            {
              codigo: initialValue.codigo,
              tipo: initialValue.tipoId ?? initialValue.tipo,
              tipoDescricao: initialValue.tipoDescricao,
            },
          ]
        : [],
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultType, initialValue])

  const selectedOption =
    documentEnum.find(item => item.id === filterType) ?? documentEnum[0] ?? {}
  const [
    documentData,
    loadingDocumentData,
    getDataFromServer,
  ] = useGetDataFromServer(
    (selectedOption?.key ?? documentEnum[0].key) === "Contrato" ? apiNewContract : apiGravittem,
    (selectedOption?.key ?? documentEnum[0].key) === "Contrato"
      ? `/api/DocumentoContrato?numero=${searchLabel}`
      : `/api/${selectedOption?.key ?? documentEnum[0].key}?query=${searchLabel}`,
    `Não foi possível obter os documentos de ${selectedOption.name}`,
    false,
    {},
  )

  useEffect(() => {
    getDataFromServer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput])

  useEffect(() => {
    const documentOptions =
      documentData?.length > 0 &&
      documentData
        .filter(item => item.Descricao || item.descricao)
        .map(item => (
          <Option key={item.Id || item.id} value={item.Id || item.id}>
            {item.Descricao || item.descricao}
          </Option>
        ))
    setDocumentOptions(documentOptions)
  }, [documentData])

  const clearTags = () => {
    setDocumentTags([])
  }

  function handleSelectDocument(
    selected,
    option,
    setInputValue,
    tags,
    setTags,
  ) {
    if (selected && tags.indexOf(selected) === -1) {
      const newTag = {
        codigo: option.props.children,
        tipo: selectedOption.id,
        tipoId: selectedOption.id,
        tipoDescricao: selectedOption.name,
      }
      const checkTagExists = tags.filter(item => item.codigo === newTag.codigo)
      const shouldInsert = checkTagExists.length === 0
      if (shouldInsert) {
        setTags([newTag])
      } else {
        message.warning('Esse documento já foi selecionado, adicione outro!')
      }
      setInputValue('')
    }
  }

  const closeTag = (tagToRemove, tags, setTags) => {
    const newTags = tags.filter(x => x !== tagToRemove)
    setTags(newTags)
  }

  function handleInputConfirm(inputValue, setInputValue, tags, setTags) {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      const newTag = {
        codigo: inputValue,
        tipo: selectedOption.id,
        tipoDescricao: selectedOption.name,
        documentoExterno: true,
      }
      const checkTagExists = tags.filter(item => item.codigo === newTag.codigo)
      const shouldInsert = checkTagExists.length === 0
      if (shouldInsert) {
        setTags([newTag])
        setInputValue('')
      } else {
        message.warning('Esse documento já foi adicionado, tente outro!')
      }
    }
  }

  return (
    <InputGroup style={{ display: 'flex', width: '100%' }}>
      <Form.Item label={label} style={{ width: '170px' }}>
        {getFieldDecorator('documentType', {
          initialValue: defaultType || documentEnum[0]?.id,
        })(
          <Select
            style={{ width: '170px' }}
            className="select-search-options"
            onChange={e => {
              setFilterType(e)
              setSearchLabel('')
              setDocumentTags([])
              setDocumentOptions([])
            }}
            loading={loadingDocumentData}
          >
            {documentEnum.map((searchOption, index) => (
              <Option key={index} value={searchOption.id}>
                {searchOption.name}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item style={{ top: '30px', position: 'relative' }}>
        {getFieldDecorator('document', {
          initialValue,
        })(
          <React.Fragment>
            <AutoComplete
              value={searchLabel}
              onChange={e => setSearchLabel(e)}
              ref={inputSearch}
              dataSource={documentOptions}
              onFocus={() => getDataFromServer()}
              onSelect={(selected, option) =>
                handleSelectDocument(
                  selected,
                  option,
                  setSearchLabel,
                  documentTags,
                  setDocumentTags,
                )
              }
              notFoundContent={
                loadingDocumentData ? (
                  <Spin size="small" />
                ) : (
                  <div
                    style={{
                      whiteSpace: 'normal',
                    }}
                    className="flex-wrap"
                  >
                    {`Nenhum ${selectedOption.name} encontrado, pressione ENTER
                    para adicionar`}
                  </div>
                )
              }
              disabled={disabled}
              {...rest}
            >
              <Input
                onBlur={() => {
                  handleInputConfirm(
                    searchLabel,
                    setSearchLabel,
                    documentTags,
                    setDocumentTags,
                  )
                }}
                onPressEnter={() => {
                  inputSearch.current.blur()
                }}
                maxLength={10}
                type="number"
                placeholder="Número do documento"
              />
            </AutoComplete>
          </React.Fragment>,
        )}
        <div style={{ width: '250px', position: 'absolute' }}>
          {documentTags.length > 1 && (
            <Tag
              color="red"
              onClick={clearTags}
              className="mt-2 cursor-pointer"
            >
              Excluir todos os itens
            </Tag>
          )}
          <div>
            {documentTags &&
              documentTags.map(tag => (
                <Tag
                  key={tag.codigo}
                  color="blue"
                  closable={!disabled}
                  onClose={() => closeTag(tag, documentTags, setDocumentTags)}
                  className="mt-2"
                >
                  {tag.codigo}
                </Tag>
              ))}
          </div>
        </div>
      </Form.Item>
    </InputGroup>
  )
}

Document.propTypes = {
  defaultType: PropTypes.any,
  disabled: PropTypes.bool,
  documentTags: PropTypes.shape({
    length: PropTypes.number,
    map: PropTypes.func,
  }),
  form: PropTypes.any,
  initialValue: PropTypes.shape({
    codigo: PropTypes.any,
    documentoId: PropTypes.any,
    tipo: PropTypes.any,
    tipoDescricao: PropTypes.any,
  }),
  label: PropTypes.any,
  searchOptions: PropTypes.any,
  setDocumentTags: PropTypes.func,
  startSearch: PropTypes.any,
}

import { Alert, Radio, Select } from 'antd'
import React from 'react'

const { Option } = Select

export default function ConfigurationModalSearch({
  selectedSearchType,
  setSelectedSearchType,
  searchOptions,
  selectedSearch,
  setSelectedSearch,
  loading,
}) {
  const radioStyle = {
    display: 'block',
    lineHeight: '20px',
    marginBottom: '14px',
  }

  return (
    <div>
      <Alert
        message="Pesquisa salva como padrão será aplicada somente para o usuário logado. Não será aplicada aos demais usuários do sistema."
        description=""
        type="warning"
        showIcon
        className="mb-4"
      />
      <Radio.Group
        value={selectedSearchType}
        onChange={e => setSelectedSearchType(e.target.value)}
      >
        <Radio style={radioStyle} value={1}>
          Pesquisa padrão do sistema
        </Radio>
        <Radio style={radioStyle} value={2}>
          Pesquisa personalizada
        </Radio>
      </Radio.Group>
      <Select
        className="w-full"
        placeholder="Selecionar"
        disabled={selectedSearchType === 1}
        onChange={e => setSelectedSearch(e)}
        loading={loading}
        value={selectedSearchType !== 1 ? selectedSearch : null}
      >
        {searchOptions.map(s => (
          <Option value={s.id}>{s.titulo}</Option>
        ))}
      </Select>
    </div>
  )
}

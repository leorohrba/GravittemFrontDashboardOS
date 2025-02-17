import { Tag } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export function NewSimpleSearchTags({ tags, setTags, form }) {
  const clearFilters = () => {
    form.resetFields('searchBox_0')
    setTags([])
  }

  const closeTag = tagToRemove => {
    const remainingTags = tags.filter(tag => tagToRemove.key !== tag.key)
    if (
      form.getFieldValue('fieldName_0') &&
      form.getFieldValue('fieldName_0') === tagToRemove.fieldValue
    ) {
      form.resetFields('searchBox_0')
    }
    setTags(remainingTags)
  }
  return (
    <div style={{ width: 550 }}>
      {tags.length > 1 && (
        <Tag color="red" onClick={clearFilters} className="mt-2 cursor-pointer">
          Limpar todos os filtros
        </Tag>
      )}
      <div>
        {tags.map(tag => (
          <Tag
            color="blue"
            closable
            key={tag.key}
            className="mt-2"
            onClose={() => closeTag(tag)}
          >
            {tag.fieldName}: {tag.searchField}
          </Tag>
        ))}
      </div>
    </div>
  )
}

NewSimpleSearchTags.propTypes = {
  setTags: PropTypes.func,
  tags: PropTypes.array,
  form: PropTypes.object,
}

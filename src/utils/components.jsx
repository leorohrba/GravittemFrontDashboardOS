/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-eval */
/* eslint-disable react/no-danger */
import React from 'react'
import moment from 'moment'

export function getRender(record, recordRender, renderType, recordDescription) {
  if (!recordRender) {
    getProperty(record, recordDescription)
  }
  else if (renderType === 'React') {
    return recordRender
  }
  else if (renderType === 'function') {
    return (<div>{recordRender(record)}</div>)
  }
  else if (!recordRender?.template) {
    return getProperty(record, recordDescription)
  }

  let html = recordRender.template
  recordRender.fields.map( (d, index) => {
     html = html.replace(`{${index}}`, eval(d))
     return true
  })
  return (
    <p 
      className="mb-0"
      dangerouslySetInnerHTML={{__html: html}} 
    />   
  )    
}

export function getProperty(record, property) {
  if (!property) {
    return record?.value
  }
  if (typeof property === 'function') {
    return property(record)
  }
  if ((property.indexOf('`') >= 0 || property.indexOf('.') >= 0) && property.indexOf('record.') >= 0) {
    return eval(property)
  }
  if (property.indexOf('`') >= 0 || property.indexOf('.') >= 0) {
    return eval(`record.${property}`)
  }
  
    return record[property]
  
}

export function getTooltip(id, list, recordId, recordDescription) {
  let result
  const record = findRecord(id, list, recordId)
  if (record) {
    result = getProperty(record, recordDescription)
  }
  return result
}

export function getExtra(id, list, extra, extraType, recordId, recordDescription){
  let result
  if (id && extraType === 'React') {
    result = (<div className="mb-0" style={{ marginTop: '-4px'}}>
                {extra}
              </div>)  
  }
  else if (id && extra) {
    const record = findRecord(id, list, recordId)
    if (record) {
      result = extra?.template ?
      (
        <p 
          className="mb-0"
          dangerouslySetInnerHTML={{__html: getRender(record, extra, '', recordDescription)}} 
        />    
      )
      :
      (
        <div className="mb-0" style={{ marginTop: '-4px' }}>
         <span style={{ color: 'gray' }}>
           {eval(extra)}
         </span>  
        </div>
      )
    } 
  }
  return result
}

export function findRecord(id, list, recordId) {
  if (!recordId) {
    return null
  }
  const ids = recordId.split('.')
  const idValue = ids[0]
  const recordSubId = ids.length > 1 ? ids[1] : null
  const record = recordSubId ?
               list.find(x => x[idValue][recordSubId] === id) :
               list.find(x => x[idValue] === id)
  return record             
}

export function formatDateInput(value, form, field, ref, isRange = false) {
  if (!value || value === '') {
    return value
  }
  if (value.length > 7 && !value.includes('/')) {
    const dateInput = `${value.substring(2, 4)}/${value.substring(
      0,
      2,
    )}/${value.substring(4, 8)}`

    const newDate = new Date(dateInput)

    if (moment(newDate).isValid() && form) {
      const fieldValue = ref.current.props.value
      const newValue = isRange
        ? !fieldValue || fieldValue?.length === 0
          ? [moment(newDate), undefined]
          : [fieldValue[0], moment(newDate)]
        : moment(newDate)

      form.setFieldsValue({
        [field]: newValue,
      })

      ref.current.blur()
      !fieldValue && ref.current.focus()
      return newValue
    }
  }
  return undefined
}
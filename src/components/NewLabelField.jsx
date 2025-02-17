import { Popover, Tooltip } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'

const style = { 
                color: 'gray',
                float: 'right',
                paddingTop: '5px',
                paddingRight: '5px',                       
              }

export default function NewLabelField(props) {
  
  const { label, info, disabled, onRefineSearch, onNewItem, icons, form, fieldName } = props
  
  return (
  <React.Fragment>
     <span>
       {label}
     </span> 
     {(info && !!form.getFieldValue(fieldName)) && (
       <Popover placement="leftBottom" content={info.content} title={info.title}>
         <i 
           className="fa fa-info-circle" 
           style={style}
         />
       </Popover>
     )}
     {icons && icons.filter(x => x.visible).map((d) => (
       <Tooltip title={d.title}>
         <i 
           className={`cursor-pointer fa ${d.icon}`} 
           style={style} 
           role="button"
           onClick={() => d.onClick()}
         />
       </Tooltip>
     ))}  
     {(!disabled && onRefineSearch) && (
       <Tooltip title="Busca refinada">
         <i 
           className="cursor-pointer fa fa-search-plus" 
           style={style} 
           role="button"
           onClick={() => onRefineSearch()}
         />
       </Tooltip>
     )}                   
     {(!disabled && onNewItem) && (
       <Tooltip title="Cadastrar">
         <i 
           className="cursor-pointer fa fa-plus" 
           style={style}
           role="button"
           onClick={() => onNewItem()}
         />
       </Tooltip>
     )}                   
  </React.Fragment>
  )
}

NewLabelField.propTypes = {
  label: PropTypes.string,
  info: PropTypes.any,
  disabled: PropTypes.bool,
  onRefineSearch: PropTypes.func,
  onNewItem: PropTypes.func,
  form: PropTypes.any,
  fieldName: PropTypes.string,
  icons: PropTypes.any,
}
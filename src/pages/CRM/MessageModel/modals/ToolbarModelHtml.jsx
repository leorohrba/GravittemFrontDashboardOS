import React, { useState } from 'react'
import { Popover, Tooltip } from 'antd'
import draftToHtml from 'draftjs-to-html'
import { convertToRaw } from 'draft-js'
import PropTypes from 'prop-types'

export default function ToolbarModelHtml(props) {

  const { editorState } = props
  const [popoverVisible, setPopoverVisible] = useState(false)

  const textEditorData = editorState
    ? draftToHtml(convertToRaw(editorState.getCurrentContent()))
    : ''

  const popoverContent = (
    <div style={{ maxWidth: '800px', maxHeight: '500px', overflowY: 'auto' }}> 
      <div className="p-2">
        {textEditorData}
      </div>  
    </div>
  )

  return (
    <div>
       <Popover
         trigger="click"
         content={popoverContent}
         visible={popoverVisible}
         onVisibleChange={visible => setPopoverVisible(visible)}   
       >
         <Tooltip title="Mostrar código html">
           <i className="mt-2 ml-2 fa fa-code fa-lg cursor-pointer" />
         </Tooltip>  
       </Popover>  
    </div>
  )
}

ToolbarModelHtml.propTypes = {
  editorState: PropTypes.any,
}

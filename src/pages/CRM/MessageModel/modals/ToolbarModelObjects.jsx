import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Popover, Row, Col, Tooltip } from 'antd'
import { Modifier, EditorState } from 'draft-js'

export default function ToolbarModelObjects(props) {

  const { modelObjects, editorState, onChange } = props
  const [popoverVisible, setPopoverVisible] = useState(false)
  
  const insertObject = (obj) => {
    setPopoverVisible(false)
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      obj.mappingName,
      editorState.getCurrentInlineStyle(),
    );
    onChange(EditorState.push(editorState, contentState, 'insert-characters'));
  }
  
  const popoverContent = (
    <div style={{ minWidth: '250px'}}>

     {modelObjects.map((o) => (
        <Row style={{ minHeight: '25px'}} type="flex" className="w-full" align="middle">
          <Col>
            <span
              role="button"
              className="primary-color cursor-pointer"
              onClick={() => insertObject(o)}
            >
             {o.objectDescription}
            </span>   
          </Col>
          {o.type === 'Table' && (
            <Col className="ml-auto">
              <Popover 
                content={
                  <p 
                    style={{ paddingLeft: 24 }}
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{__html: o.tableTemplate}} 
                  />}
              >
                <i className="fa fa-search" />                  
              </Popover>  
            </Col>
          )}
        </Row>
     ))}
    
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
         <Tooltip title="Inserir campos">
           <i className="mt-2 ml-2 fa fa-plus-square-o fa-lg cursor-pointer" />
         </Tooltip>  
       </Popover>  
    </div>
  )
  
}

ToolbarModelObjects.propTypes = {
  modelObjects: PropTypes.array,
  editorState: PropTypes.any,
  onChange: PropTypes.func,
}

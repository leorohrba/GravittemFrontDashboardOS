import React from 'react'
import { Form } from '@ant-design/compatible'
import { Row, Col, Button } from 'antd'
import PropTypes from 'prop-types'

export default function PersonFormFooter ({ isSaving, handleSubmit, handleCancel, canBeUpdated }) {
  return (
   <React.Fragment>
     <Row type="flex" gutter={12}>
       {canBeUpdated && (
        <React.Fragment>
          <Col>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="formButton"
                onClick={(e) => handleSubmit(e, false)}
                loading={isSaving}
              >
                Salvar
              </Button>
            </Form.Item>                
          </Col>
          <Col>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="formButton"
                onClick={(e) => handleSubmit(e, true)}
                loading={isSaving}
              >
                Salvar e retornar
              </Button>
            </Form.Item>                
          </Col>
        </React.Fragment>        
        )}
        <Col>
          <Form.Item>
            <Button
              type="outline"
              onClick={(e) => handleCancel(e)}
            >{canBeUpdated ? "Cancelar" : "Retornar"}
            </Button>   
          </Form.Item>                
        </Col>    
     </Row>
   </React.Fragment>  
  )  
}


PersonFormFooter.propTypes = {
  isSaving: PropTypes.bool, 
  handleSubmit: PropTypes.func, 
  handleCancel: PropTypes.func, 
  canBeUpdated: PropTypes.bool,
}


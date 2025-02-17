import React from 'react'
import { Input, Spin, Form, Checkbox } from 'antd';
import PropTypes from 'prop-types'
import { isEmail } from '@utils'

function ImportExcelStep3({ uploading, form, isSaving, isBackground, setIsBackground }) {

  const { getFieldDecorator } = form

  const emailListValidate = (rule, value, callback) => {
    if (value) {
      const emails = value.split(';')
      let isOk = true
      emails.map((email) => {
        if (!email.trim() || !isEmail(email.trim())) {
          isOk = false
        }
        return true
      })
      if (!isOk && emails.length === 1) {
        callback('E-mail inválido!')
      }
      else if (!isOk && emails.length > 1) {
        callback('E-mails inválidos!')
      }
      else {
        callback()
      }
    }
    else 
    {
      callback()
    }
  } 

  return (
  
    <Form layout="vertical" className="text-center">
      {!uploading ? (
        <div>
          <h3>
            Informe os e-mails (separados por ;) que serão notificados quando a importação finalizar.
          </h3>
          <Form.Item className="mb-0">
            {getFieldDecorator('emails', {
              rules: [
                {
                  required: true,
                  message: 'Campo obrigatório!',
                },
                { 
                  validator: emailListValidate,
                },
              ],
            })(
              <Input
                style={{ width: '70%' }}
              />
            )}
          </Form.Item>
          <Checkbox 
            checked={isBackground}
            onChange={(e) => setIsBackground(e.target.checked)}
          >
            Executar em segundo plano
          </Checkbox>  
        </div>
      ) : (
       <Spin spinning={isSaving}>
        <div>
          <i
            className="fa fa-check-circle fa-3x mb-2"
            style={{ color: '#1976D2' }}
          />
          {isSaving ? (
              <h3>
                Arquivos estão sendo importados, aguarde...
              </h3>
            ) : (
             <React.Fragment> 
              {isBackground ? (
                <h3>
                  Seus dados estão sendo importados em segundo plano. Você pode continuar navegando normalmente e receberá um e-mail quando os dados estiverem disponíveis para uso. 
                </h3>
                ) : (
                  <h3>
                    Importação finalizada! Verifique o status no seu e-mail!
                  </h3>
              )}  
             </React.Fragment>  
          )}
        </div>
      </Spin>  
      )}
    </Form>
  )
}

ImportExcelStep3.propTypes = {
  uploading: PropTypes.bool,
  form: PropTypes.any,
  isSaving: PropTypes.bool,
  isBackground: PropTypes.bool,
  setIsBackground: PropTypes.func,
}

export default ImportExcelStep3

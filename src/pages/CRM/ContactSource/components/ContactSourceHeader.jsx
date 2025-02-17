import { Button, Col, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { hasPermission } from '@utils'
import { formatMessage } from 'umi-plugin-react/locale'
import ReactExport from 'react-data-export'
import moment from 'moment'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

export default function ContactSourceHeader(
  { selectedRows, 
    confirmDeleteContactSource,
    editContactSource,
    userPermissions,    
    dataExport,
  }) {

  return (
    <div>
      <Row type="flex" className="my-5" gutter={12}>
        {selectedRows.length === 0 ? (
          <div>
            {hasPermission(userPermissions, 'Include') && (          
              <Button
                type="primary"
                onClick={() => editContactSource(null)}
              >
                <i className="fa fa-plus fa-lg mr-3" />
                  Nova origem de contato
              </Button>
            )}
          </div>
        ) : (
          <div>
            {hasPermission(userPermissions, 'Exclude') && (     
            <Button
              style={{
                color: 'red',
                borderColor: 'red',
              }}
              onClick={confirmDeleteContactSource}
            >
              <i className="fa fa-trash fa-lg mr-3" />
              {formatMessage({
                id: 'delete',
              })}{' '}
              ({selectedRows.length})
            </Button>
            )}
          </div>
        )}  
        <Col className="ml-auto">
         {hasPermission(userPermissions, 'ExportExcel') && (
           <ExcelFile
             filename={`Origens_de_contato_${moment().format('DD_MM_YYYY_HH_mm')}`}
             element={
                <Button
                  size="default"
                  style={{
                    marginLeft: 'auto',
                  }}
                  className="ml-2 iconButton"
                >
                  <i className="fa fa-download fa-lg mr-3" />
                  {formatMessage({
                    id: 'export',
                  })}
                </Button>
             }
           >
              <ExcelSheet dataSet={dataExport} name="Origens_de_contato" />
           </ExcelFile>
         )}
        </Col>
      </Row>
    </div>
  )
}
ContactSourceHeader.propTypes = {
  confirmDeleteContactSource: PropTypes.func,
  selectedRows: PropTypes.any,
  editContactSource: PropTypes.func,
  userPermissions: PropTypes.array,
  dataExport: PropTypes.array,
}

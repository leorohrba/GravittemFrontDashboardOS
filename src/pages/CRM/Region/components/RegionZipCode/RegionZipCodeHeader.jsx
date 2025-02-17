import { Button, Col, Row, Input } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { hasPermission } from '@utils'
import { formatMessage } from 'umi-plugin-react/locale'
import ReactExport from 'react-data-export'
import moment from 'moment'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

export default function RegionZipCodeHeader(
  { selectedRows, 
    confirmDeleteRegionZipCode,
    newRegionZipCode,
    userPermissions,    
    dataExport,
    searchValue,
    setSearchValue,
  }) {

  return (
    <React.Fragment>
      <Row type="flex" gutter={18}>
        {selectedRows.length === 0 ? (
          <React.Fragment>
            {hasPermission(userPermissions, 'Include') && ( 
              <Col>
                         
                  <Button
                    type="primary"
                    onClick={() => newRegionZipCode()}
                  >
                    <i className="fa fa-plus fa-lg mr-3" />
                      Adicionar CEP
                  </Button>
                
              </Col>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment> 
            {hasPermission(userPermissions, 'Exclude') && (     
              <Col>
                <Button
                  style={{
                    color: 'red',
                    borderColor: 'red',
                  }}
                  onClick={confirmDeleteRegionZipCode}
                >
                  <i className="fa fa-trash fa-lg mr-3" />
                  {formatMessage({
                    id: 'delete',
                  })}{' '}
                  ({selectedRows.length})
                </Button>
                
              </Col>
            )}
          </React.Fragment>  
        )}
        {hasPermission(userPermissions, 'ExportExcel') && dataExport.length > 0 && (        
          <Col>
             <ExcelFile
               filename={`Ceps_Região_${moment().format('DD_MM_YYYY_HH_mm')}`}
               element={
                  <Button>
                    <i className="fa fa-download fa-lg mr-3" />
                    {formatMessage({
                      id: 'export',
                    })}
                  </Button>
               }
             >
                <ExcelSheet dataSet={dataExport} name="Ceps da Região" />
             </ExcelFile>
          </Col> 
        )}
        <Col style={{ width: '400px' }} className="ml-auto">
          <Input.Group compact>
            <Input
              placeholder="O que deseja procurar?"
              allowClear
              onChange={(e) => setSearchValue(e.target.value)}
              style={{
                width: '320px',
              }}
            />
            <Button type="primary">
              <i className="fa fa-search" aria-hidden="true" />
            </Button>
          </Input.Group>
        </Col>
      </Row>
    </React.Fragment>
  )
}
RegionZipCodeHeader.propTypes = {
  confirmDeleteRegionZipCode: PropTypes.func,
  selectedRows: PropTypes.any,
  newRegionZipCode: PropTypes.func,
  userPermissions: PropTypes.array,
  dataExport: PropTypes.array,
  searchValue: PropTypes.string,
  setSearchValue: PropTypes.func,
}

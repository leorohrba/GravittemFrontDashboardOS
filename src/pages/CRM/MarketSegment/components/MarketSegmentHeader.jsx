import { Button, Col, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { hasPermission } from '@utils'
import { formatMessage } from 'umi-plugin-react/locale'
import ReactExport from 'react-data-export'
import moment from 'moment'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

export default function MarketSegmentHeader(
  { selectedRows, 
    confirmDeleteMarketSegment,
    editMarketSegment,
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
                onClick={() => editMarketSegment(null)}
              >
                <i className="fa fa-plus fa-lg mr-3" />
                  Novo segmento de mercado
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
              onClick={confirmDeleteMarketSegment}
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
             filename={`Segmentos_mercado_${moment().format('DD_MM_YYYY_HH_mm')}`}
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
              <ExcelSheet dataSet={dataExport} name="Segmentos_mercado" />
           </ExcelFile>
         )}
        </Col>
      </Row>
    </div>
  )
}
MarketSegmentHeader.propTypes = {
  confirmDeleteMarketSegment: PropTypes.func,
  selectedRows: PropTypes.any,
  editMarketSegment: PropTypes.func,
  userPermissions: PropTypes.array,
  dataExport: PropTypes.array,
}

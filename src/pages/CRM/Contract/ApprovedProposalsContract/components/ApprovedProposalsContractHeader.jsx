import React from 'react'
import { NewSimpleSearch } from '@components'
import { hasPermission } from '@utils'
import { Button, Col, Row } from 'antd'
import { useApprovedProposalsContractContext } from '../context/ApprovedProposalsContract'
import ReactExport from 'react-data-export'
import { formatMessage } from 'umi-plugin-react/locale'
import moment from 'moment'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

export default function ApprovedProposalsContract() {
  const {
    tags,
    setTags,
    startSearch,
    searchOptions,
    data,
    userPermissions,
    dataExport,
  } = useApprovedProposalsContractContext()

  return (
    <React.Fragment>
      <Row>
        <Col
          style={{
            width: '610px',
            marginLeft: 'auto',
          }}
        >
          <NewSimpleSearch
            searchOptions={searchOptions}
            setTags={setTags}
            tags={tags}
            screenName="geracao_contrato_proposta_grid"
            getSelectLabel
            startSearch={startSearch}
            searchBoxWidth={310}
            selectOptionsWidth={215}
          />
        </Col>
      </Row>
      <Row type="flex" className="mt-6" gutter={12}>
        {hasPermission(userPermissions, 'ExportarParaExcel') && (
          <Col className="ml-auto">
            <ExcelFile
              filename={`Propostas_aprovadas_${moment().format(
                'DD_MM_YYYY_HH_mm',
              )}`}
              element={
                <Button
                  size="default"
                  disabled={data.length === 0}
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
              <ExcelSheet dataSet={dataExport} name="Propostas_aprovadas" />
            </ExcelFile>
          </Col>
        )}
      </Row>
    </React.Fragment>
  )
}

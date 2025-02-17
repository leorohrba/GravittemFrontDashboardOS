import Button from '@components/Button'
import NewSimpleSearch from '@components/NewSimpleSearch'
import styles from '@pages/CRM/styles.css'
import { hasPermission } from '@utils'
import { Col, DatePicker, Row } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import ReactExport from 'react-data-export'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile
const { MonthPicker } = DatePicker

export default function CommissioningFranchisorReportHeader(props) {
  const {
    referenceDateInitial,
    referenceDateFinal,
    onChangeReferenceDate,
    searchOptions,
    startSearch,
    exportDataSummary,
    exportDataProposal,
    buildingDataExport,
    userPermissions,
    tags,
    setTags,
  } = props

  const handleChangeInitial = (value) => {
    const start = value.clone()
    let end = referenceDateFinal.clone()
    if (end < start) {
      end = value.clone() 
    }
    onChangeReferenceDate(start, end)
  }

  const handleChangeFinal = (value) => {
    let start = referenceDateInitial.clone()
    const end = value.clone()
    if (start > end) {
      start = value.clone() 
    }
    onChangeReferenceDate(start, end)
  }

  return (
    <div>
      <Row className="mb-2">
        <Col
          style={{
            marginLeft: 'auto',
            width: '580px',
          }}
        >
          <NewSimpleSearch
            searchOptions={searchOptions}
            setTags={setTags}
            tags={tags}
            startSearch={startSearch}
            hideSaveSearch
            getSelectLabel
            selectOptionsWidth={220}
          />
        </Col>
      </Row>

      <Row type="flex">
        <Col>
          <MonthPicker
            allowClear={false}
            mode="year"
            format="MMMM - YYYY"
            onChange={handleChangeInitial}
            value={referenceDateInitial}
          />
        </Col>
        <Col>
          <MonthPicker
            allowClear={false}
            mode="year"
            format="MMMM - YYYY"
            className="ml-4"
            onChange={handleChangeFinal}
            value={referenceDateFinal}
          />
        </Col>
        
        {hasPermission(userPermissions, 'ExportExcel') && (
          <Col className="ml-auto">
            <ExcelFile
              filename={`${moment().format('DD_MM_YYYY_HHmm')}_Rebates_${moment(
                referenceDateInitial,
              ).format('MMMM_YYYY')}_${moment(
                referenceDateFinal,
              ).format('MMMM_YYYY')}`}
              element={
                <Button
                  disabled={buildingDataExport}
                  type="outline"
                  loading={buildingDataExport}
                >
                  <i
                    className={`fa fa-download mr-3 fa-lg ${styles.crmColorIconEdit}`}
                  />
                  Exportar
                </Button>
              }
            >
              <ExcelSheet dataSet={exportDataSummary} name="Resumo" />
              <ExcelSheet dataSet={exportDataProposal} name="Negócios" />
            </ExcelFile>
          </Col>
        )}
      </Row>
    </div>
  )
}
CommissioningFranchisorReportHeader.propTypes = {
  referenceDate: PropTypes.string,
  onChangeReferenceDate: PropTypes.func,
  searchOptions: PropTypes.array,
  startSearch: PropTypes.func,
  exportDataSummary: PropTypes.func,
  exportDataProposal: PropTypes.func,
  buildingDataExport: PropTypes.bool,
  userPermissions: PropTypes.array,
  tags: PropTypes.array,
  setTags: PropTypes.func,
}

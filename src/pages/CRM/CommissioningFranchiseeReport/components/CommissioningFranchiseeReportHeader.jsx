import Button from '@components/Button'
import SimpleSearch from '@components/SimpleSearch'
import styles from '@pages/CRM/styles.css'
import { hasPermission } from '@utils'
import { Col, DatePicker, Row } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import ReactExport from 'react-data-export'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

export default function CommissioningFranchiseeReportHeader(props) {
  const {
    referenceDate,
    onChangeReferenceDate,
    searchOptions,
    startSearch,
    setSearchValues,
    exportDataSummary,
    exportDataProposal,
    buildingDataExport,
    userPermissions,
    keySearchOptions,
  } = props

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Row>
        <Col
          style={{
            marginLeft: 'auto',
            width: '500px',
          }}
        >
          <SimpleSearch
            searchOptions={searchOptions}
            fixedTypeWidth={200}
            startSearch={startSearch}
            setSearchValues={setSearchValues}
            key={keySearchOptions}
          />
        </Col>
      </Row>

      <Row type="flex">
        <DatePicker
          allowClear={false}
          mode="year"
          className="mr-auto"
          format="YYYY"
          value={referenceDate}
          open={isOpen}
          onFocus={() => {
            setIsOpen(true)
          }}
          onBlur={() => {
            setIsOpen(false)
          }}
          onPanelChange={e => {
            onChangeReferenceDate(e)
            setIsOpen(false)
          }}
        />

        {hasPermission(userPermissions, 'ExportExcel') && (
          <ExcelFile
            filename={`${moment().format('DD_MM_YYYY_HHmm')}_Comissões_${moment(
              referenceDate,
            ).format('YYYY')}`}
            element={
              <Button
                className="mr-3"
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
        )}
      </Row>
    </div>
  )
}
CommissioningFranchiseeReportHeader.propTypes = {
  referenceDate: PropTypes.string,
  onChangeReferenceDate: PropTypes.func,
  searchOptions: PropTypes.array,
  startSearch: PropTypes.func,
  setSearchValues: PropTypes.func,
  exportDataSummary: PropTypes.func,
  exportDataProposal: PropTypes.func,
  buildingDataExport: PropTypes.bool,
  userPermissions: PropTypes.array,
  keySearchOptions: PropTypes.number,
}

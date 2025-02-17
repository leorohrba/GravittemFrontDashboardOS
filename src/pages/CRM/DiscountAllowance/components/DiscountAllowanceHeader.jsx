import React from 'react'
import { Button, Spin, Row } from 'antd'
import NewSimpleSearch from '@components/NewSimpleSearch'
import { useDiscountAllowanceContext } from '../context/DiscountAllowanceContext'
import DeleteModal from '@components/DeleteModal'
import { apiCRM } from '@services/api'
import { exportTableData } from '../utils'

export default function DiscountAllowanceHeader() {
  const {
    searchOptions,
    tags,
    setTags,
    startSearch,
    loadingSearchOptions,
    setVisibleNewDiscountAllowanceModal,
    selectedRow,
    setSelectedRow,
    setVisibleSetDiscountAllowanceModal,
    visibleDeleteModal,
    setVisibleDeleteModal,
    successDelete,
    setSuccessDelete,
    jsonDelete,
    setLoadingTableData,
    tableData,
    canAdd,
    canDelete,
    canExportExcel,
    canBurst,
    serverColumns,
  } = useDiscountAllowanceContext()
  const validDelete = selectedRow.filter(x => x.id == 0).length === 0
  return (
    <div className="space-y-5 py-4 px-2">
      <div className="flex justify-end">
        <Spin spinning={loadingSearchOptions}>
          <NewSimpleSearch
            searchOptions={searchOptions}
            tags={tags}
            setTags={setTags}
            startSearch={startSearch}
          />
        </Spin>
      </div>
      <Row className="flex">
        {selectedRow?.length > 0 ? (
          <div className="flex gap-3">
            {canBurst && (
              <Button onClick={() => setVisibleSetDiscountAllowanceModal(true)}>
                <i className={`fa fa-calendar fa-lg mr-3`} /> Definir alçada de
                desconto e acréscimo
              </Button>
            )}
            {canDelete && validDelete && (
              <DeleteModal
                selectedRows={selectedRow}
                setSelectedRows={setSelectedRow}
                visibleDelete={visibleDeleteModal}
                setVisibleDelete={setVisibleDeleteModal}
                handleModalCancel={() => setVisibleDeleteModal(false)}
                title="alçada de desconto e acréscimo"
                description="As alçadas de desconto e acréscimento selecionadas serão excluídas. Deseja continuar?"
                serviceApi={apiCRM}
                api={'/api/AlcadaDesconto'}
                setSucessDelete={setSuccessDelete}
                sucessDelete={successDelete}
                databaseDelete={jsonDelete}
                tableUpdate={startSearch}
              />
            )}
          </div>
        ) : (
          canAdd && (
            <Button
              type="primary"
              onClick={() => setVisibleNewDiscountAllowanceModal(true)}
            >
              Nova alçada de desconto e acréscimo
            </Button>
          )
        )}
        {canExportExcel && (
          <Button
            className="ml-auto mr-2"
            onClick={() =>
              exportTableData(
                setLoadingTableData,
                tableData,
                tags,
                serverColumns,
              )
            }
          >
            <i className={`fa fa-download fa-lg mr-3`} /> Exportar
          </Button>
        )}
      </Row>
    </div>
  )
}

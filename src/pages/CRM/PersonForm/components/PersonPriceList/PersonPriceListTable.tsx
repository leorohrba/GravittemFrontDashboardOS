/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
import React, { useState } from 'react'
import DefaultTable from '@components/DefaultTable'
import { Button, Row, Col, Tooltip, Form } from 'antd'
import PersonPriceListForm from './PersonPriceListForm'
import { INewDiscountAllowance } from "../../interfaces/NewDiscountAllowanceInterface";
import { priceListColumns } from './utils';
import DeleteModal from '../../../../../components/DeleteModal';
import { apiCRM } from '../../../../../SoftinFrontSystems/src/utils/api';
import { deletePriceList } from './services';

export default function PersonPriceListTable(props: {
  loadingForm: boolean,
  canBeUpdated: boolean,
  selectedRowPriceList: any[],
  setSelectedRowPriceList: (rows: any[]) => void,
  priceListTableData: any[],
  setPriceListTableData: (data: any[]) => void
  deleteAlcadaDesconto:boolean,
  editAlcadaDesconto:boolean
  addAlcadaDesconto:boolean
}) {

  const {
    loadingForm,
    canBeUpdated,
    selectedRowPriceList,
    setSelectedRowPriceList,
    priceListTableData,
    setPriceListTableData,
    deleteAlcadaDesconto,
    editAlcadaDesconto,
    addAlcadaDesconto
  } = props

  const [visiblePriceListModal, setVisiblePriceListModal] = useState<boolean>(false)
  const [visibleDeleteModal, setVisibleDeleteModal] = useState<boolean>(false)
  const [successDelete, setSuccessDelete] = useState<boolean>(false)
  const [permissionPersonPriceList, setPermissionPersonPriceList] = useState<boolean>(editAlcadaDesconto)
  const [form] = Form.useForm()
  const [editData, setEditData] = useState<any>(null)

  const editView = (d: any) => {
  setEditData(d)
    setVisiblePriceListModal(true)
  }
 
  const columns = [
    ...priceListColumns,
    {
      title: '',
      key: 'action',
      align: 'right',
      fixed: 'right',
      width: 30,
      render: d => 
        ( 
          <Tooltip placement="top" title={editAlcadaDesconto ? 'Editar' : 'Consultar'}>
          <Button
            shape="circle"
            size="default"
            type="primary"
            ghost
            className="iconButton"
            onClick={() => editView(d)}
            style={{ fontSize: '12px' }}
          >
            <i className={`fa fa-${editAlcadaDesconto ? 'pencil' : 'search'} fa-lg`} />
            </Button>
         </Tooltip> )
        
      ,
    },
  ]  
  const rowSelection = {
      onChange: (selectedRowKey: any, selectedRowPriceList: any) => {
          setSelectedRowPriceList(selectedRowPriceList)
      }
  }

  function savePriceList(priceList:INewDiscountAllowance) {
    setPriceListTableData(prevData => {
      const index = prevData.findIndex((item:{id:string}) => item.id === priceList.id);
      
      if (index !== -1) {
        // Se o item com o mesmo id existir, substitua-o
        const updatedData = [...prevData];
        updatedData[index] = priceList;
        return updatedData;
      } else {
        // Se o item não existir, adicione-o
        return [...prevData, priceList];
      }
    });
  }
  
    const handleDelete = (rows: any[]) => {
      const rowsToDeleteOnServer: number[] = rows.filter((row: any) => !row.isNew).map(row => row.id)
      const newRowState: any[] = priceListTableData.filter(priceList => !rows.map(row => row.id).includes(priceList.id))
      deletePriceList(rowsToDeleteOnServer, setPriceListTableData, newRowState, setSuccessDelete)
      setVisibleDeleteModal(false)
  }

    const handleCancel = () => {
      form.resetFields()
      setVisiblePriceListModal(false)
      setPermissionPersonPriceList(editAlcadaDesconto)
      setEditData(null)
  }

  const handleOpenModal = () => {
    setVisiblePriceListModal(true)
    setPermissionPersonPriceList(addAlcadaDesconto)
  }
  
  return (
    <React.Fragment>
      <Row>
        <h2>Alçada de desconto</h2>
        <hr />
      </Row>

      <Row type="flex" className="mb-4" gutter={12}>
        <Col>
          {selectedRowPriceList?.length === 0? 
          <Button
            type="primary"
            disabled={loadingForm || !canBeUpdated}
            onClick={() => {handleOpenModal()}}
          >
            <i className="fa fa-plus fa-lg mr-3" />
            Nova alçada de desconto
          </Button>
          : 
          !loadingForm && deleteAlcadaDesconto &&
          <DeleteModal 
              selectedRows={selectedRowPriceList}
              setSelectedRows={setSelectedRowPriceList}
              visibleDelete={visibleDeleteModal}
              setVisibleDelete={setVisibleDeleteModal}
              handleModalCancel={() => setVisibleDeleteModal(false)}
              title="lista de preço"
              description="As lista de preço selecionadas serão excluidas. Deseja continuar?"
              serviceApi={apiCRM}
              api={'/api/AlcadaDesconto'}
              setSucessDelete={setSuccessDelete}
              sucessDelete={successDelete}
              customDelete={() => handleDelete(selectedRowPriceList)}
          />
          }
        </Col>
      </Row>

      <DefaultTable
        rowKey={record => record.id}
        loading={loadingForm}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={priceListTableData}
      />

      <React.Fragment>
        <PersonPriceListForm
            {...{
            visiblePriceListModal,
            canBeUpdated,
            savePriceList,
            editData,
            form,
            handleCancel,
            permissionPersonPriceList
            }}
         />
      </React.Fragment>
    </React.Fragment>
  )
}

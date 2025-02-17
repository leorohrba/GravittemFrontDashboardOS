import React, { useEffect } from 'react'
import ModalDelete from './ModalDelete'
import ButtonDelete from './ButtonDelete'
import { deleteItem } from './service'
import { AxiosInstance } from 'axios'

const DeleteModal = (props: {
  selectedRows: any[],
  setSelectedRows:  (rows: any[]) => void,
  visibleDelete: boolean,
  handleModalCancel: () => void,
  setVisibleDelete: (visible: boolean) => void,
  title: string,
  description: string,
  serviceApi: AxiosInstance,
  api: string,
  setSucessDelete: (success: boolean) => void,
  databaseDelete: any[] | null,
  sucessDelete: boolean,
  tableUpdate: () => void | null,
  customDelete: () => void | null,
}) => {
  const {
    selectedRows,
    setSelectedRows,
    visibleDelete,
    handleModalCancel,
    setVisibleDelete,
    title,
    description,
    serviceApi,
    api,
    setSucessDelete,
    databaseDelete = null,
    sucessDelete,
    tableUpdate = null,
    customDelete = null,
  } = props

  const handleDelete = () => {
    if (customDelete != null) {
      customDelete()
    } else {
      deleteItem(databaseDelete, serviceApi, api, setSucessDelete)
    }
  }

  useEffect(() => {
    if (sucessDelete) {
      setVisibleDelete(false)
      setSucessDelete(false)
      setSelectedRows([])
      tableUpdate != null && tableUpdate()
    }
  }, [sucessDelete])

  return (
    <div>
      <React.Fragment>
        <ButtonDelete
          selectedRows={selectedRows}
          setVisibleDelete={setVisibleDelete}
        ></ButtonDelete>
        <ModalDelete
          visibleDelete={visibleDelete}
          handleModalCancel={handleModalCancel}
          title={title}
          description={description}
          handleDelete={handleDelete}
        ></ModalDelete>
      </React.Fragment>
    </div>
  )
}

export default DeleteModal

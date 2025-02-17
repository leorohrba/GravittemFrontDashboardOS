import { Button, Modal } from 'antd'
import React from 'react'

const ModalDelete = (props: {
  visibleDelete: boolean,
  handleModalCancel: ()  => void,
  title: string,
  description: string,
  handleDelete: () => void,
  validDelete: boolean,
}) => {

  const {
    visibleDelete,
    handleModalCancel,
    title,
    description,
    handleDelete,
  } = props

  return (
    <Modal
      visible={visibleDelete}
      onCancel={handleModalCancel}
      footer={null}
      className="flex items-center justify-center"
      width="30%"
      centered
      bodyStyle={{ maxWidth: '100%', margin: 'auto' }}
    >
      <div className="flex items-center gap-3">
        <i
          className="fa fa-exclamation-circle fa-2x mb-3"
          style={{ color: '#f68d20' }}
        />
        <h2>Excluir {title}</h2>
      </div>
      <p className="flex items-center justify-center ml-5 mr-5 text-base">
        {description}{' '}
      </p>
      <div className="flex justify-end space-x-2 mt-5">
        <Button
          danger
          style={{
            color: '#000000',
            borderColor: 'grey',
            borderWidth: 1,
          }}
          onClick={() => {
            handleModalCancel()
          }}
        >
          Não
        </Button>
        <Button
          onClick={() => handleDelete()}
          type='primary'
        >
          Sim
        </Button>
      </div>
    </Modal>
  )
}

export default ModalDelete

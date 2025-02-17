import { Modal } from 'antd'
import PropTypes from 'prop-types'

const { confirm } = Modal

const ConfirmDeleteModal = (handleDelete, id = null) => {
  confirm({
    title: 'Excluir registros?',
    content:
      'Os registros excluídos não poderão ser recuperados. Deseja excluir?',
    onOk: () => handleDelete(id),
    cancelText: 'Cancelar',
    okText: 'Excluir',
    okType: 'danger',
    okButtonProps: {
      type: 'danger',
      size: 'large',
    },
    cancelButtonProps: {
      size: 'large',
    },
  })
}

ConfirmDeleteModal.propTypes = {
  handleDelete: PropTypes.any,
}

export default ConfirmDeleteModal

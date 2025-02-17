import { fireEvent, render } from '@testing-library/react'
import ProductsAndServicesHeader from './ProductsAndServicesHeader'

const confirmDeleteProposalItems = jest.fn()
const loading = false
const userPermissions = [
  { code: 'VINA', name: 'Visualize' },
  { code: 'EXPT', name: 'ExportExcel' },
  { code: 'INCL', name: 'Include' },
  { code: 'ALTE', name: 'Alter' },
  { code: 'EXCL', name: 'Exclude' },
  { code: 'TRAS', name: 'Trash' },
  { code: 'RECOV', name: 'Recover' },
  { code: 'INSE', name: 'IncludeSearch' },
  { code: 'ALSE', name: 'AlterSearch' },
  { code: 'EXSE', name: 'ExcludeSearch' },
]
const proposalCanBeUpdate = true
const editItem = jest.fn()

it('insert new product', async () => {
  const tableSelectedRowKeys = []
  const { getByText } = render(
    <ProductsAndServicesHeader
      tableSelectedRowKeys={tableSelectedRowKeys}
      confirmDeleteProposalItems={confirmDeleteProposalItems}
      loading={loading}
      userPermissions={userPermissions}
      canInclude={proposalCanBeUpdate}
      editItem={editItem}
    />,
  )
  const newProductOrService = getByText('Novo produto ou serviço')
  fireEvent.click(newProductOrService)
  expect(editItem).toHaveBeenCalledTimes(1)
})

it('test delete', async () => {
  const tableSelectedRowKeys = [1, 2, 3]

  const { getByText } = render(
    <ProductsAndServicesHeader
      tableSelectedRowKeys={tableSelectedRowKeys}
      confirmDeleteProposalItems={confirmDeleteProposalItems}
      loading={loading}
      userPermissions={userPermissions}
      canInclude={proposalCanBeUpdate}
      editItem={editItem}
    />,
  )
  const deleteButton = getByText(`Excluir (${tableSelectedRowKeys.length})`)
  expect(deleteButton).toBeInTheDocument()
  fireEvent.click(deleteButton)
  expect(confirmDeleteProposalItems).toHaveBeenCalledTimes(1)
})

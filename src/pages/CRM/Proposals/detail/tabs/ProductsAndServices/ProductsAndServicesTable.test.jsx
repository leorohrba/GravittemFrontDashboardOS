import { act, fireEvent, render } from '@testing-library/react'
import { addBrlCurrencyToNumber, formatNumber } from '@utils'
import ProductsAndServicesTable from './ProductsAndServicesTable'

const rowSelection = {}
const productsAndServicesData = [
  {
    proposalItemId: 40,
    proposalId: 20,
    type: 'Product',
    itemId: 456147,
    itemName: 'AA Produto C',
    priceListId: 53,
    priceListName: 'Lista Genérica',
    unitValue: 400.0,
    quantity: 2,
    measuringUnitId: 1,
    measuringUnitCode: 'un',
    percentDiscount: 0.0,
    totalValue: 800.0,
    locationValue: 0.0,
    isRecurrence: true,
    note: 'comentário teste',
    identifier: 'SC',
    canBeUpdated: true,
    canBeDeleted: true,
  },
  {
    proposalItemId: 44,
    proposalId: 20,
    identifier: 'RS',
    type: 'Service',
    itemId: 456156,
    itemName: 'AB Serviço Teste',
    priceListId: 53,
    priceListName: 'Lista Genérica',
    unitValue: 10.0,
    quantity: 3,
    measuringUnitId: 1,
    measuringUnitCode: 'un',
    percentDiscount: 10.0,
    totalValue: 27.0,
    locationValue: 0.0,
    isRecurrence: false,
    note: null,
    canBeUpdated: true,
    canBeDeleted: true,
  },
]
const loading = false
const keyTable = 1
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
const canAlter = true
const editItem = jest.fn()
describe('sort columns', () => {
  it('sort name', async () => {
    const { getByText } = render(
      <ProductsAndServicesTable
        rowSelection={rowSelection}
        productsAndServicesData={productsAndServicesData}
        loading={loading}
        keyTable={keyTable}
        userPermissions={userPermissions}
        canAlter={canAlter}
        editItem={editItem}
      />,
    )
    const name = getByText('Nome')
    await act(async () => {
      await fireEvent.click(name)
      await fireEvent.click(name)
    })
    const columns = document.querySelectorAll('.ant-table-row')
    const firstRowName = columns[0].children[1].textContent
    const secondRowName = columns[1].children[1].textContent
    const secondName = productsAndServicesData[1].itemName
    const firstName = productsAndServicesData[0].itemName

    expect(getByText(secondName).textContent).toBe(firstRowName)
    expect(getByText(firstName).textContent).toBe(secondRowName)
  })
  it('sort identifier', async () => {
    const { getByText } = render(
      <ProductsAndServicesTable
        rowSelection={rowSelection}
        productsAndServicesData={productsAndServicesData}
        loading={loading}
        keyTable={keyTable}
        userPermissions={userPermissions}
        canAlter={canAlter}
        editItem={editItem}
      />,
    )
    const identifier = getByText('Identificador')
    await act(async () => {
      await fireEvent.click(identifier)
      await fireEvent.click(identifier)
    })
    const columns = document.querySelectorAll('.ant-table-row')
    const firstRowIdentifier = columns[0].children[2].textContent
    const secondRowIdentifier = columns[1].children[2].textContent
    const firstIdentifier = productsAndServicesData[0].identifier
    const secondIdentifier = productsAndServicesData[1].identifier

    expect(getByText(firstIdentifier).textContent).toBe(firstRowIdentifier)
    expect(getByText(secondIdentifier).textContent).toBe(secondRowIdentifier)
  })
  it('sort type', async () => {
    const { getByText } = render(
      <ProductsAndServicesTable
        rowSelection={rowSelection}
        productsAndServicesData={productsAndServicesData}
        loading={loading}
        keyTable={keyTable}
        userPermissions={userPermissions}
        canAlter={canAlter}
        editItem={editItem}
      />,
    )
    const type = getByText('Tipo')
    await act(async () => {
      await fireEvent.click(type)
      await fireEvent.click(type)
    })
    const columns = document.querySelectorAll('.ant-table-row')
    const firstRowType = columns[0].children[3].textContent
    const secondRowType = columns[1].children[3].textContent
    const firstType =
      productsAndServicesData[0].type === 'Product' ? 'Produto' : 'Serviço'
    const secondType =
      productsAndServicesData[1].type === 'Product' ? 'Produto' : 'Serviço'

    expect(getByText(secondType).textContent).toBe(firstRowType)
    expect(getByText(firstType).textContent).toBe(secondRowType)
  })
  it('sort quantity', async () => {
    const { getByText } = render(
      <ProductsAndServicesTable
        rowSelection={rowSelection}
        productsAndServicesData={productsAndServicesData}
        loading={loading}
        keyTable={keyTable}
        userPermissions={userPermissions}
        canAlter={canAlter}
        editItem={editItem}
      />,
    )
    const quantity = getByText('Quantidade')
    await act(async () => {
      await fireEvent.click(quantity)
      await fireEvent.click(quantity)
    })
    const columns = document.querySelectorAll('.ant-table-row')
    const firstRowQuantity = columns[0].children[4].textContent
    const secondRowQuantity = columns[1].children[4].textContent
    const firstQuantity = `${productsAndServicesData[0].quantity} un`
    const secondQuantity = `${productsAndServicesData[1].quantity} un`
    expect(getByText(secondQuantity).textContent).toBe(firstRowQuantity)
    expect(getByText(firstQuantity).textContent).toBe(secondRowQuantity)
  })
  it('sort percentDiscount', async () => {
    const { getByText } = render(
      <ProductsAndServicesTable
        rowSelection={rowSelection}
        productsAndServicesData={productsAndServicesData}
        loading={loading}
        keyTable={keyTable}
        userPermissions={userPermissions}
        canAlter={canAlter}
        editItem={editItem}
      />,
    )
    const percentDiscount = getByText('Desconto')
    await act(async () => {
      await fireEvent.click(percentDiscount)
      await fireEvent.click(percentDiscount)
    })
    const columns = document.querySelectorAll('.ant-table-row')
    const firstRowDiscount = columns[0].children[5].textContent
    const secondRowDiscount = columns[1].children[5].textContent
    const firstDiscount = productsAndServicesData[0].percentDiscount
      ? `${formatNumber(productsAndServicesData[0].percentDiscount, 2)}%`
      : ''
    const secondDiscount = productsAndServicesData[1].percentDiscount
      ? `${formatNumber(productsAndServicesData[1].percentDiscount, 2)}%`
      : ''
    expect(secondDiscount).toBe(firstRowDiscount)
    expect(firstDiscount).toBe(secondRowDiscount)
  })
  it('sort unitValue', async () => {
    const { getByText } = render(
      <ProductsAndServicesTable
        rowSelection={rowSelection}
        productsAndServicesData={productsAndServicesData}
        loading={loading}
        keyTable={keyTable}
        userPermissions={userPermissions}
        canAlter={canAlter}
        editItem={editItem}
      />,
    )
    const unitValue = getByText('Valores')
    await act(async () => {
      await fireEvent.click(unitValue)
      await fireEvent.click(unitValue)
    })
    const columns = document.querySelectorAll('.ant-table-row')
    const firstRowTotalValue = columns[0].children[6].textContent
    const secondRowTotalValue = columns[1].children[6].textContent
    const firstTotalValue = `${addBrlCurrencyToNumber(
      productsAndServicesData[0].unitValue,
    )}${addBrlCurrencyToNumber(productsAndServicesData[0].totalValue)}`
    const secondTotalValue = `${addBrlCurrencyToNumber(
      productsAndServicesData[1].unitValue,
    )}${addBrlCurrencyToNumber(productsAndServicesData[1].totalValue)}`
    expect(firstTotalValue).toBe(firstRowTotalValue)
    expect(secondTotalValue).toBe(secondRowTotalValue)
  })
  it('sort isRecurrence', async () => {
    const { getByText } = render(
      <ProductsAndServicesTable
        rowSelection={rowSelection}
        productsAndServicesData={productsAndServicesData}
        loading={loading}
        keyTable={keyTable}
        userPermissions={userPermissions}
        canAlter={canAlter}
        editItem={editItem}
      />,
    )
    const isRecurrence = getByText('Recorrência')
    await act(async () => {
      await fireEvent.click(isRecurrence)
      await fireEvent.click(isRecurrence)
    })
    const columns = document.querySelectorAll('.ant-table-row')
    const firstRowRecurrence = columns[0].children[7].textContent
    const secondRowRecurrence = columns[1].children[7].textContent
    const firstRecurrence = productsAndServicesData[0].isRecurrence
      ? 'Recorrente'
      : 'Único'
    const secondRecurrence = productsAndServicesData[1].isRecurrence
      ? 'Recorrente'
      : 'Único'

    expect(getByText(firstRecurrence).textContent).toBe(firstRowRecurrence)
    expect(getByText(secondRecurrence).textContent).toBe(secondRowRecurrence)
  })
})

describe('test click on table actions', () => {
  it('click edit button', async () => {
    const { getAllByTestId, getByText } = render(
      <ProductsAndServicesTable
        rowSelection={rowSelection}
        productsAndServicesData={productsAndServicesData}
        loading={loading}
        keyTable={keyTable}
        userPermissions={userPermissions}
        canAlter={canAlter}
        editItem={editItem}
      />,
    )
    const commentButton = getAllByTestId('editButton')[0]
    commentButton.click()
    expect(getByText(productsAndServicesData[0].itemName)).toBeInTheDocument()
  })
  it('click comment button with comment', async () => {
    const { getAllByTestId, getByText } = render(
      <ProductsAndServicesTable
        rowSelection={rowSelection}
        productsAndServicesData={productsAndServicesData}
        loading={loading}
        keyTable={keyTable}
        userPermissions={userPermissions}
        canAlter={false}
        editItem={editItem}
      />,
    )
    const commentButton = getAllByTestId('commentButton')[0]
    commentButton.click()
    expect(getByText(productsAndServicesData[0].note)).toBeInTheDocument()
  })
  it('click comment button without comment', async () => {
    const { getAllByTestId, getAllByText } = render(
      <ProductsAndServicesTable
        rowSelection={rowSelection}
        productsAndServicesData={productsAndServicesData}
        loading={loading}
        keyTable={keyTable}
        userPermissions={userPermissions}
        canAlter={canAlter}
        editItem={editItem}
      />,
    )
    const commentButton = getAllByTestId('commentButton')[1]
    commentButton.click()
    expect(getAllByText('Comentários sobre o item')[1]).toBeInTheDocument()
  })
})

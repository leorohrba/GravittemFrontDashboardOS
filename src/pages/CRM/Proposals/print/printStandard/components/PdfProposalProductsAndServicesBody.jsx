import { addBrlCurrencyToNumber, formatNumber } from '@utils'

export function productsAndServicesTitle() {
  return [
    {
      margin: [0, 20, 0, 0],
      text: 'Produtos e serviços',
      alignment: 'left',
      bold: true,
      fontSize: '12',
    },
  ]
}
export const mapProductsAndServicesTableBody = proposal => {
  const productsAndServicesTableBody = proposal.items.map(item => [
    item.itemName,
    item.type === 'Product'
      ? 'Produto'
      : item.type === 'Service'
      ? 'Serviço'
      : '',
    `${item.quantity} ${item.measuringUnitCode}`,
    item.percentDiscount ? `${formatNumber(item.percentDiscount, 2)}%` : '',
    addBrlCurrencyToNumber(
        item.grossUnitValue,
      ),
    addBrlCurrencyToNumber(
        item.totalValue,
      ),
    item.isRecurrence ? 'Recorrente' : 'Único',
  ])
  return productsAndServicesTableBody
}
export function productsAndServicesTable(proposal) {
  return [
    {
      margin: [0, 10, 0, 0],
      layout: {
        fillColor(rowIndex, node, columnIndex) {
          return rowIndex === 0 && '#434843'
        },
      },
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        // ['*', 40, 55, 45, 'auto', 'auto', 55],
        headerRows: 1,
        widths: ['auto', 'auto', 'auto', 'auto', 65, 65, 'auto'],
        body: [
          [
            {
              text: 'Descrição',
              color: 'white',
            },
            {
              text: 'Tipo',
              color: 'white',
            },
            {
              text: 'Quantidade',
              color: 'white',
            },
            {
              text: 'Desconto',
              color: 'white',
            },
            {
              text: 'Valor unit.',
              color: 'white',
            },
            {
              text: 'Valor total',
              color: 'white',
            },
            {
              text: 'Recorrência',
              color: 'white',
            },
          ],
          ...mapProductsAndServicesTableBody(proposal),
        ],
      },
    },
  ]
}

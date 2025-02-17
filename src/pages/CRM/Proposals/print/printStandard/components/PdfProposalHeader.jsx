export default function header(number, currentPage, pageCount, pageSize) {
  return [
    {
      text: `Página ${currentPage} de ${pageCount}`,
      alignment: 'right',
      margin: [0, 10, 30, 0],
    },
    {
      text: `N° do negócio: ${number}`,
      alignment: 'right',
      margin: [0, 0, 30, 0],
    },
  ]
}

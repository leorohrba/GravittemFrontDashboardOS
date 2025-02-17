/** Utils dos Negócios */

/** Renderiza o documento formando uma string
 * @param {object} data - Json com dados do documento
 * @returns {string}
 */

export function renderDocument(data) {
  return data
    .map(
      d =>
        `${
          d.tipoDocumento === 1
            ? 'Ordem de serviço'
            : d.tipoDocumento === 2
            ? 'Pedido de venda'
            : 'Contrato'
        } ${d.valor}`,
    )
    .join(', ')
}

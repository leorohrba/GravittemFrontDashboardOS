export default function tenthSection(
  proposalData,
  arrowImgDataUri,
) {
  return [
    {
      style: 'defaultStyle',
      stack: [
          {
            text: 'Equipamentos para a Adequação\n',
            style: 'titleStyle',
          },
          {
            text: 'PLANILHA I\n',
            fontSize: 14,
            bold: true,
            alignment: 'center',
          },
          tenthSectionTable(proposalData),
          tenthSectionObservation(arrowImgDataUri),
          tenthSectionProposalObservation(proposalData),
      ],
    },
  ]
}

function tenthSectionProposalObservation(proposalData) {

  const result = proposalData?.observation ?
   [ 
     { text: '\nOBSERVAÇÃO ADICIONAL', bold: true },
     { text: `${proposalData?.observation}` } 
   ] : []
  
  return result  

}

function tenthSectionObservation(arrowImgDataUri) {

  const result = [
    {
      margin: [0, 0, 0, 8],
      text: [
        {
          text: '\nObservação: ',
          bold: true,
        },
        'Todos os itens listados para a ',
        {
          text: 'adequação',
          bold: true,
        },
        ' serão oferecidos já devidamente instalados e configurados, podendo ser na forma de locação (em 36 meses), e/ou como ',
        {
          text: 'venda financiada ',
          bold:true,
        },
        '(com prazos de 12, 24, 36, 48 ou 60 meses). Importante se observar que na opção de venda financiada, poderão ser somados aos valores de equipamentos e mão-de-obra de instalação, outros valores destinados a viabilizar os seguintes investimentos / gastos do condomínio:',
      ],
    },
    printList(arrowImgDataUri),
    {  
      margin: [0, 4, 0, 0],
      text: 'Adicionalmente, o condomínio poderá escolher seus fornecedores, com condição de pagamento à vista, desde que o montante total não ultrapasse a quantia de R$ 250.000,00 (duzentos e cinquenta mil reais). O valor total do financiamento será transferido para conta bancária do condomínio em prazo máximo de 7 dias uteis, após assinatura do contrato.',  
    },
  ]
  return result  
}

function printList(arrowImgDataUri) {
  const body = [
    [getImage(arrowImgDataUri),'rescisões trabalhistas de colaboradores;'],
    [getImage(arrowImgDataUri),'modernização de elevadores;'],
    [getImage(arrowImgDataUri),'reformas e consertos em geral (i.e., alvenaria, elétrica, hidráulica etc.);'],
    [getImage(arrowImgDataUri),'complementos de serralheria, vidros, acabamentos e pintura predial;'],
    [getImage(arrowImgDataUri),'móveis, equipamentos e utensílios (i.e., recepção, hall, academia, churrasqueiras etc.).'],
  ]
  const result = 
    [
      {
        margin: [0, 0, 0, 10],
        layout: {
          hLineWidth(i, node) {
            return 0
          },
          vLineWidth(i, node) {
            return 0
          },
        },
        table: {
          headerRows: 0,
          widths: ['auto', '*'],
          body,
        },
      },
    ]  
  return result    
}

function getImage(arrowImgDataUri) {
  const result = 
    {
      image: arrowImgDataUri,
      width: 8,
      margin: [0, 3],
    }
  
  return result
}

function tenthSectionTable(proposalData) {
  const body = [
    [
      {
        text: 'EQUIPAMENTOS',
        color: 'white',
        bold: true,
        alignment: 'center',
        colSpan: 2,
      },
      {},
    ],
    [
      {
        text: 'Quantidade',
        alignment: 'center',
      },
      {
        text: 'Descrição',
        bold: true,
        alignment: 'center',
      },
    ],
  ]
  proposalData.products.map(prod =>
    body.push([
      { text: prod.quantity, alignment: 'center' },
      { text: prod.description, alignment: 'center' },
    ]),
  )
  return proposalData.products.length === 0
    ? []
    : [
        {
          margin: [0, 10, 0, 0],
          layout: {
            fillColor(rowIndex, node, columnIndex) {
              if (rowIndex === 0) {
                return '#be0c16'
              }

              return rowIndex % 2 !== 0 ? '#ededed' : null
            },

            hLineColor(i, node) {
              return '#ededed'
            },

            hLineWidth(i, node) {
              return 0.1
            },

            vLineColor(i, node) {
              return 'white'
            },
          },
          table: {
            headerRows: 2,
            widths: [80, 400],
            body,
          },
        },
      ]
}

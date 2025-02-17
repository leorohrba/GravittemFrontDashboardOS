import { addBrlCurrencyToNumber } from '@utils'

export default function eleventhSection(
  proposalData,
) {
  return [
    {
      pageBreak: 'before',
      style: 'defaultStyle',
      stack: [
        {
          text: 'Contrato e Proposta Comercial\n',
          style: 'titleStyle',
        },
        {
          text: [
            'Uma vez aprovada e assinada essa Proposta pelos representantes legais do condomínio, nos termos do aceite, esta passará a ser parte integrante do ',
            {
              text: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS E OUTRAS AVENÇAS - PORTARIA REMOTA ',
              bold: true,
            },
            'e será incluída como ',
            {
              text: 'Anexo I, ',
              bold: true,
            },
            'servindo para explicitar as necessidades de adequação do condomínio e para caracterizar os serviços a serem prestados.',
          ],
        },
        {
          text: [
             '\nEm conjunto com o contrato acima mencionado, de acordo com a opção escolhida de locação e/ou venda financiada, que aliás podem inclusive serem combinadas, procederemos a assinatura do ',
             {
               text: 'CONTRATO DE FINANCIAMENTO DE EQUIPAMENTOS DE ADEQUAÇÃO E COMPLEMENTOS ',
               bold: true,
             },
             'e/ou do ',
             {
               text: 'CONTRATO DE LOCAÇÃO DE EQUIPAMENTOS DE ADEQUAÇÃO E COMPLEMENTOS.',
               bold: true,
             },
          ],
        },
        eleventhSectionValues(proposalData),
        eleventhSectionNaoIncluso,
      ],
    },
  ]
}

const eleventhSectionNaoIncluso = [
  {
    margin: [0, 10, 0, 0],
    text: 'O que não está incluso nessa proposta\n',
    style: 'titleStyle',
  },
  {
    lineHeight: 1.5,
    ul: [
      'Projeto executivo (As Built);',
      'Materiais e serviços de instalação de clausuras de pedestre e/ou veículos;',
      'Serviços de alvenaria, construção, pintura e/ou embutimento de cabeamento;',
      'Serviços estruturais mecânicos (serralheria, esquadrias de alumínio, vidros etc.);',
      'Serviços de elétrica, aterramento, iluminação e automação de áreas comuns;',
      'Intervenção / manobra nos elevadores do condomínio;',
      'Caixas de correios e/ou locais para recebimento e armazenamento de encomendas.',
    ],
  },
]

function eleventhSectionValues(proposalData) {
  const parcelValue = proposalData?.parcels.length > 0 && proposalData.proposalType === 1 ?
                      proposalData.parcels[0].value :
                      0
/*
  const totalValue = (proposalData?.recurrenceTotalValue || 0) +   
                     (proposalData?.locationValue || 0) +
                     parcelValue
*/                     
  const condition = parcelValue ? `${proposalData?.paymentCondition ? ' - ' : ''}${proposalData.paymentCondition || ''}` : ''                  
  const result = [
    {
      text: '\nValores da Proposta Comercial\n',
      style: 'titleStyle',
    },
    {
      bold: true,
      layout: {
        paddingLeft (i, node) { return 5; },
        paddingRight (i, node) { return 5; },
        paddingTop (i, node) { return 5; },
        paddingBottom (i, node) { return 5; },      
      },    
      table: {
        headerRows: 0,
        widths: ['*'],
        body: [
          ['1) Valor mensal (Serviços de Portaria) Portaria Remota'],
          [addBrlCurrencyToNumber(proposalData?.recurrenceTotalValue || 0)],
          ['2) Valor mensal (Locação de Equipamentos) Portaria Remota'],
          [addBrlCurrencyToNumber(proposalData?.locationValue || 0)],
          ['3) Valor mensal (Financiamento de Equipamentos) Portaria Remota'],
          [`${addBrlCurrencyToNumber(parcelValue)}${condition}`],
        ]
      },
    },
  ]
  return result
}

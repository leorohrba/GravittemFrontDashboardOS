import { addBrlCurrencyToNumber, formatNumber } from '@utils'
import moment from 'moment'

export const fifthChapterFirstSection = {
  margin: [0, 20, 0, 0],
  lineHeight: 1.5,
  stack: [
    {
      text: [
        {
          text: '5. CONDIÇÕES COMERCIAIS',
          id: 'condicoes_comerciais',
          style: 'header',
        },
        '\nEssa Proposta Comercial é um documento complementar ao',
        {
          text:
            ' CONTRATO DE PRESTAÇÃO DE SERVIÇOS E OUTRAS AVENÇAS - PORTARIA REMOTA, ',
          bold: true,
        },
        'que por objetivo explicitar os itens necessários a adequação e os serviços a serem realizados tanto na adequação tanto no atendimento remoto da portaria.\n\n',
      ],
    },
    {
      text: [
        {
          text: '5.1 Condição para os Serviços de Portaria Remota',
          id: 'condicao_servicos_portaria',
          style: 'subheader',
        },
        '\nFica sob a responsabilidade da',
        {
          text: ' ATENDE PORTARIA ',
          bold: true,
        },
        'a prestação dos serviços de Portaria Remota, que será realizada por seu corpo de atendentes baseados em São Paulo no endereço Avenida Álvaro Ramos, 2201, SÃO PAULO/SP.\nOs serviços relacionados a essa condição são: Serviço de Portaria Remota 12h e 24h e o Uso do Aplicativo Atende Portaria.',
      ],
    },
  ],
}
export const fifthChapterSecondSection = {
  margin: [0, 20, 0, 0],
  lineHeight: 1.5,
  text: [
    {
      id: 'condicao_equipamentos_servicos',
      text: '5.2 Condição para Equipamentos e Serviços – FRANQUEADA CONTRATADA',
      style: 'subheader',
    },
    '\nFica sob a responsabilidade da',
    {
      text: ' FRANQUEADA CONTRATADA ',
      bold: true,
    },
    'o fornecimento e suporte dos equipamentos eletrônicos de interfone, câmeras de imagem e demais pacotes contratados separadamente, inclusive a instalação dos mesmos, de acordo com as recomendações da',
    {
      text: ' ATENDE PORTARIA ',
      bold: true,
    },
    'e aprovação da CONTRATANTE.\n',
    'Durante a contratação do modo Locação de Equipamento fica a FRANQUEADA CONTRATADA sob a responsabilidade de garantia estendida até o prazo final de locação.\n',
    'A',
    {
      text: ' FRANQUEADA CONTRATADA ',
      bold: true,
    },
    'se compromete a cumprir as obrigações previstas nessa Proposta Comercial, através de seus representantes, sócios, profissionais ou prepostos, atendendo sempre as solicitações efetivadas pela',
    {
      text: ' CONTRATANTE, ',
      bold: true,
    },
    'ficando isenta a',
    {
      text: ' ATENDE PORTARIA ',
      bold: true,
    },
    'de quaisquer responsabilidades sobre os equipamentos ou serviços relacionados aos mesmos. Os serviços relacionados a essa condição são: Locação de Equipamentos, Manutenção preventiva / corretiva 24/7 e Monitoramento de Alarmes perimetrais.',
  ],
}
export function fifthChapterSecondSectionFirstSub(proposalData) {
  // VENDA
  if (proposalData.proposalType === 1) {
    return [
      {
        margin: [0, 20, 0, 0],
        lineHeight: 1.5,
        text: [
          {
            text: '5.2.1 Opção: Compra de Equipamentos',
            id: 'opcao_compra_equipamentos',
            style: 'subheader',
          },
          `\nNa forma de venda de equipamentos, a CONTRATANTE pagará a FRANQUEADA CONTRATADA o valor de R$ ${formatNumber(
            proposalData.singleTotalValue,
            2,
          )}`,
          proposalData.paymentCondition
            ? `, com a condição pagamento: ${proposalData.paymentCondition}`
            : '.',
        ],
      },
    ]
  }

  return [{}]
}

export function fifthChapterSecondSectionSecondSubTable(proposalData) {
  const body = [
    [
      {
        text: 'Parcela',
        color: 'white',
        bold: true,
        alignment: 'center',
      },
      {
        text: 'Vencimento',
        color: 'white',
        bold: true,
        alignment: 'center',
      },
      {
        text: 'Valor',
        color: 'white',
        bold: true,
        alignment: 'center',
      },
    ],
  ]
  proposalData.parcels.map(parcel =>
    body.push([
      { text: parcel.number, alignment: 'center' },
      {
        text: moment(parcel.dueDate).format('DD/MM/YYYY'),
        alignment: 'center',
      },
      { text: addBrlCurrencyToNumber(parcel.value), alignment: 'center' },
    ]),
  )
  return proposalData.parcels.length === 0
    ? []
    : [
        {
          margin: [0, 10, 0, 0],
          layout: {
            fillColor(rowIndex, node, columnIndex) {
              if (rowIndex === 0) {
                return '#be0c16'
              }

              return rowIndex % 2 !== 0 ? '#fddfe0' : null
            },

            hLineColor(i, node) {
              return '#e9aeb2'
            },

            vLineColor(i, node) {
              return '#e9aeb2'
            },
          },
          table: {
            headerRows: 1,
            widths: [80, 200, 200],
            body,
          },
        },
      ]
}

export function fifthChapterSecondSectionSecondSub(proposalData) {
  // LOCAÇÃO
  if (proposalData.proposalType === 2) {
    return [
      {
        margin: [0, 20, 0, 0],
        lineHeight: 1.5,
        text: [
          {
            text: '5.2.2 Opção: Locação de Equipamento',
            id: 'opcao_locacao_equipamento',
            style: 'subheader',
          },
          `\nNa forma de locação conforme contrato referente a essa modalidade, terá mensalidades mensais de R$ ${formatNumber(
            proposalData.proposalType === 2
              ? proposalData.locationValue
              : proposalData.recurrenceTotalValue,
            2,
          )}.\n`,
          `Condomínio pagará MENSALMENTE a quantia de R$ ${formatNumber(
            proposalData.recurrenceTotalValue,
            2,
          )}, durante todo o lapso temporal em que forem prestados os serviços de Portaria Remota (atualizado anualmente pelo IGPM ou outro indexador que vier substituí-lo) conforme CONTRATO DE PRESTAÇÃO DE SERVIÇOS E OUTRAS AVENÇAS - PORTARIA REMOTA pela data de assinatura do mesmo, com prazo de 36 meses.\n\n`,
          {
            text: `Observação: ${proposalData.observation || ''}`,
            bold: true,
          },
        ],
      },
    ]
  }

  return [
    {
      margin: [0, 20, 0, 0],
      lineHeight: 1.5,
      text: [
        `Condomínio pagará MENSALMENTE a quantia de R$ ${formatNumber(
          proposalData.recurrenceTotalValue,
          2,
        )}, durante todo o lapso temporal em que forem prestados os serviços de Portaria Remota (atualizado anualmente pelo IGPM ou outro indexador que vier substituí-lo) conforme CONTRATO DE PRESTAÇÃO DE SERVIÇOS E OUTRAS AVENÇAS - PORTARIA REMOTA pela data de assinatura do mesmo, com prazo de 36 meses.\n\n`,
        {
          text: `Observação: ${proposalData.observation || ''}`,
          bold: true,
        },
      ],
    },
  ]
}
export const fifthChapterThirdSectionTitle = {
  margin: [0, 20, 0, 0],
  lineHeight: 1.5,
  text: [
    {
      text: '5.2.3. Itens Inclusos na instalação',
      id: 'itens_inclusos_instalacao',
      style: 'subheader',
    },
    '\n',
  ],
}
export const fifthChapterThirdSectionList = {
  lineHeight: 1.5,
  fontSize: 12,
  margin: [30, 5, 0, 0],
  ul: [
    'Infraestrutura (Eletrodutos / eletrocalhas passagem de cabos necessários em geral.)',
    'Painéis para fixação e instalação dos equipamentos – leitoras, biometrias, sensores, ...',
    'Instalação de Nobreak nos equipamentos de portaria e garagem',
    'Instalação dos equipamentos constantes na planilha II',
  ],
}
export const fifthChapterFourthSectionTitle = {
  margin: [0, 20, 0, 0],
  lineHeight: 1.5,
  text: [
    {
      text: '5.2.4. O que não está incluso nesta proposta',
      id: 'nao_incluso_proposta',
      style: 'subheader',
    },
    '\n',
  ],
}
export const fifthChapterFourthSectionList = {
  lineHeight: 1.5,
  fontSize: 12,
  margin: [30, 5, 0, 0],
  ul: [
    'Providenciar a clausura de pedestres (recomendado).',
    'Serviços estruturais, serralheria, esquadrias de alumínio ou vidros.',
    'Manobra nos elevadores quando necessário',
    'Projeto executivo',
    'Elétrica e automação da iluminação das áreas comuns',
    'Caixas de correios ou dispenser para recebimento de encomendas.',
    'Alvenaria, pinturas ou infraestrutura embutida.',
  ],
}

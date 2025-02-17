const margin  = 8

export default function sixthSection(
) {
  return [
    {
      pageBreak: 'before',
      style: 'defaultStyle',
      stack: [
         sixthSectionArmazenamento,
         sixthSectionComunicacao,
         sixthSectionManutencao,
      ],
    },
  ]
}

const sixthSectionArmazenamento = [
  {
    text: 'Armazenamento e confidencialidade das informações',
    style: 'titleStyle',
  },
  {
    text: [
      'Todos os Registros dos históricos (logs) de eventos ficarão armazenadas por até 3 (três) meses na Central da Atende Portaria.',
    ]
  },
  {
    margin: [0, margin, 0, 0],
    text: [
      'As imagens ficarão armazenadas por até 30 (trinta) dias em Equipamento de Gravação no local (condomínio), e terão uma cópia dos eventos pelo mesmo período, na ',
      {
        text: 'Central Atende Portaria.',
        bold: true,
      },
    ]
  },
  {
    margin: [0, margin, 0, 0],
    text: [
      'As conversas de áudio relacionadas a eventos, ficarão armazenadas por até 30 (trinta) dias na Central da Atende Portaria.',
    ]
  },
  {
    margin: [0, margin, 0, 0],
    text: [
      'Todas as informações ficam armazenadas pelo período mencionado acima e podem ser solicitadas, no site ',
      {
        text: 'www.atendeportaria.com.br',
        link: 'http://www.atendeportaria.com.br',
        style: 'linkStyle',
      },
      ' conforme especificado abaixo no Item ',
      {
        text: 'Experiência do Cliente.',
        bold: true,
      },
    ]
  },
]

const sixthSectionComunicacao = [
  {
    text: '\nComunicação - links de internet',
    style: 'titleStyle',
  },
  {
    text: [
      'O serviço de Portaria Remota prescinde de nítida e estável comunicação entre a Central da Atendimento e o seu condomínio, razão pela qual são pré-requisitos operacionais a disponibilidade dos dois links de internet com IP fixo, sendo um deles para operação em contingência.',
    ]
  },
  {
    margin: [0, margin, 0, 0],
    text: [
      'Esses links serão contratados pelo Condomínio, deverão ter capacidade mínima de ',
      {
        text: '60MB de Upload,',
        bold: true,
      },
      '(preferencialmente com IP fixo). A Atende Portaria se utilizará de tecnologia para transformar estes links em túnel privado de internet (VPN), criptografado objetivando maior estabilidade, segurança e sigilo dos dados dos moradores, conectados nos equipamentos e padrões da Atende Portaria.',
    ]
  },
]

const sixthSectionManutencao = [
  {
    text: '\nManutenção - corretiva, preventiva e/ou corretiva',
    style: 'titleStyle',
  },
  {
    text: [
      'No contrato do condomínio, a nossa empresa representante autorizada local estará especificamente destacada como parte ' ,
      {
        text: 'PRESTADORA LOCAL, ',
        bold: true,
      },
      ' e se obrigará a prestar o atendimento e apoio técnico local ao condomínio, sempre que acionada pela Central Atende Portaria.',
    ]
  },
  slaTable(),
  {
    margin: [0, margin, 0, 0],
    text: [
      'Adicionalmente, executará manutenções corretivas (eventualmente preventivas e preditivas) dos equipamentos adquiridos e instalados no escopo dessa proposta, desde que estes ainda estejam sob garantia legal de fábrica.',
    ]
  },
  {
    margin: [0, margin, 0, 0],
    text: [
      'Para os demais serviços e/ou fora do período de garantia legal dos equipamentos, o condomínio deverá firmar um contrato adicional, específico e complementar com garantia de fornecimento de peças e serviços.',
    ]
  },
  {
    margin: [0, margin, 0, 0],
    text: [
      'A infraestrutura que regulará o fluxo físico de pedestres e veículos no condomínio (cercas e gradis, portas e portões, e respectivos acionadores) deverão também ter contrato(s) de manutenção corretiva e peças sobressalentes, efetivados antes do início da operação da Portaria Remota, e de modo que uma eventual falha ou interrupção dessa infraestrutura possa sempre ser prontamente corrigida.',
    ]
  },
]

function slaTable() {
  const body = [
    [
      {
        text: 'ACORDO DE NÍVEL DE SERVIÇOS (SLA)',
        color: 'white',
        bold: true,
        colSpan: 3,
      },
      {},{},
    ],
    [
      {
        text: 'PRIORIDADE',
        color: 'white',
        bold: true,
        alignment: 'center',
      },
      {
        text: 'TIPO DE OCORRÊNCIA',
        color: 'white',
        bold: true,
        alignment: 'center',
      },
      {
        text: 'SLA TEMPO DE ATENDIMENTO',
        color: 'white',
        bold: true,
        alignment: 'center',
      },
    ],
  ]
  
  body.push(
    [
      {
        text: 'ALTA',
        bold: true,
        alignment: 'center',
      },
      {
        text: 'Parada total do Sistema',
        alignment: 'center',
      },
      {
        text: 'Em até 4 horas',
        alignment: 'center',
      },
    ]  
  )

  body.push(
    [
      {
        text: 'MÉDIA',
        bold: true,
        alignment: 'center',
      },
      {
        text: 'Parada parcial permanecendo o Acesso e atendimento',
        alignment: 'center',
      },
      {
        text: 'Em até 12 horas',
        alignment: 'center',
      },
    ]  
  )
  
  body.push(
    [
      {
        text: 'BAIXA',
        bold: true,
        alignment: 'center',
      },
      {
        text: 'Ocorrências que não afetam o Acesso e atendimento',
        alignment: 'center',
      },
      {
        text: 'Em até 24 horas',
        alignment: 'center',
      },
    ]  
  )  
  const result =  
      [
        {
          margin: [0, 10, 0, 10],
          layout: {
            fillColor(rowIndex, node, columnIndex) {
              if (rowIndex === 0 || rowIndex === 1) {
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
            headerRows: 1,
            widths: ['auto', '*', 'auto'],
            body,
          },
        },
      ]
  
  return result
}

export default function secondSection(
  checkSymbolImgDataUri,
  secondSectionPilaresImgDataUri,
) {
  return [
    {
      pageBreak: 'before',
      style: 'defaultStyle',
      stack: [
        
        secondSectionQuemSomos(checkSymbolImgDataUri),
             
        {
          margin: [0, 10],
          image: secondSectionPilaresImgDataUri,
          width: 250,
          alignment: 'center',
        },

        secondSectionFirstParagraph,
        secondSectionSecondParagraph,
        secondSectionThirdParagraph,
        secondSectionFourthParagraph,

      ],
    },
  ]

}

const secondSectionFirstParagraph = 
  [
   {
     text: [
        '\nApaixonados pelo que fazemos, ambicionamos um ATENDIMENTO de qualidade SUPERIOR. "Na nossa cultura o cliente não só tem razão, ele é a nossa razão e está no centro do nosso propósito em contribuir para ',
        {
          text: 'condomínios mais seguros, inteligentes e econômicos',
          bold: true,
        },
        '"',
     ]
   }     
  ] 

const secondSectionSecondParagraph =  
  [
   {
     text: [
        '\nNossos ',
        {
          text: 'profissionais ',
          bold: true,
        },
        'são rigorosamente recrutados e passam por constante aprimoramento técnico, operacional e comportamental. Visamos a evolução das nossas competências e investimos fortemente na melhoria contínua dos nossos serviços. Posicionamos a Atende como "um novo jeito de fazer de portaria“ e como “marca que valoriza o seu condomínio".',
     ]
   }     
  ] 

const secondSectionThirdParagraph =  
  [
   {
     text: [
        '\nA Atende Portaria tem sua Central de Monitoramento própria e usa ',
        {
          text: 'tecnologias de ponta ',
          bold: true,
        },
        'para atender 24 horas por dia nossos clientes, através de uma rede de comunicações segura, de alta velocidade, com geradores de energia e links de contingência, tudo planejado para garantir uma ',
        {
          text: ' alta disponibilidade ',
          bold: true,
        },
        'dos nossos serviços.',
     ]
   }     
  ] 

const secondSectionFourthParagraph =  
  [
   {
     text: [
      '\nAtuamos ativamente para ',
      {
        text: 'viabilizar o negócio em curto e longo prazo, ',
        bold: true,
      },
      'ajudando o cliente a decidir pela solução mais adequada ao seu perfil e disponibilidade de recursos (ver na próxima página nossos Planos de Serviços).',
     ]
   }     
  ] 

function secondSectionQuemSomos(checkSymbolImgDataUri) {
  const columnGap = 10
  const marginLeft = 20
  const lineHeight = 1.5
  const quemSomos = 
  [   
    {
      text: 'QUEM SOMOS?\n',
      style: 'titleStyle',
    },
    
    {
      margin: [ marginLeft, 0 ] , 
      lineHeight,
      columnGap,
      columns: [
        {
          image: checkSymbolImgDataUri,
          width: 8,
          margin: [ 0, 4 ],
        },
        {
          text: [
              {
                text: `Especialistas em Portaria Remota`,
                bold: true,
              },
              {
                text: `de Condomínios Residenciais e Empresariais;\n`,
              },
          ]
        }
      ]
    },
    
    {
      margin: [ marginLeft, 0 ] ,
      lineHeight,
      columnGap,
      columns: [
        {
          image: checkSymbolImgDataUri,
          width: 8,
          margin: [ 0, 4 ],
        },
        {
          text: [
              {
                text: `Focados no `,
              },
              {
                text: `controle de acessos e monitoramento `,
                bold: true,
              },
              {
                text: `remotos;`,
              },
          ]
        }
      ]
    },

    {
      margin: [ marginLeft, 0 ] ,
      columnGap,
      lineHeight,
      columns: [
        {
          image: checkSymbolImgDataUri,
          width: 8,
          margin: [ 0, 4 ],
        },
        {
          text: [
              {
                text: `Fundada em 2015 em São Paulo, e atualmente `,
              },
              {
                text: `em crescente expansão nacional;`,
                bold: true,
              },
          ]
        }
      ]
    },
    
    {
      margin: [ marginLeft, 0 ] ,
      columnGap,
      lineHeight,
      columns: [
        {
          image: checkSymbolImgDataUri,
          width: 8,
          margin: [ 0, 4 ],
        },
        {
          text: [
              {
                text: `Profissionais `,
              },
              {
                text: `comprometidos`,
                bold: true,
              },
              {
                text: ` com nossos clientes em `,
              },
              {
                text: `curto e longo prazo.`,
                bold: true,
              },
          ]
        }
      ]
    },
  ]
  return quemSomos    
}

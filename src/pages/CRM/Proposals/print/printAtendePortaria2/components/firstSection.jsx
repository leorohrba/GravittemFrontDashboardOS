
export function firstSectionLogoImg(
  firstSectionLogoImgDataUri,
) {
  return [
    {
      image: firstSectionLogoImgDataUri,
      width: 200,
      alignment: 'center',
      margin: [ 0, 0 ],
    },
  ]
}

export function firstSectionProposal(proposalData) {
  return [
    {
      lineHeight: 1.3,
      text: [
        {
          text: 'PROPOSTA COMERCIAL\n',
          fontSize: 16,
          bold: true,
        },
        {
          text: `N°: ${proposalData.number || ''}\n`,
          fontSize: 13,
        },
        {
          text: `A/C: ${proposalData.contactNameCustomer || ''}\n`,
          fontSize: 13,
        },
        {
          text: `${proposalData.customerName || ''}`,
          fontSize: 13,
        },
        proposalData.franchiseeName ?
        {
          text: [ 
            { fontSize: 10, bold: true, text: '\nAutorizado local: ' },
            { fontSize: 10, text: proposalData.franchiseeName } ,
          ]
        } :
        []
      ],
      absolutePosition: {
        x: 50,
        y: 450,
      },
    },
  ]
}

export const firstSectionAttendancePlaces = 
  [
    {
      layout: {
        paddingLeft (i, node) { return 8; },
        paddingRight (i, node) { return 8; },
        hLineWidth(i, node) {
          return 0
        },
        vLineWidth(i, node) {
          if (i === 1 || i === 2) {
            return 0.1
          }
          return 0
        },
        vLineColor(i, node) {
          return 'red'
        },
      },
      lineHeight: 1.0,
      fontSize: 8,
      absolutePosition: {
        x: 50,
        y: 560,
      },
      table: {
        headerColumns: 0,
        widths: ['*', '*', '*'],
        body: [
           ['Anhanguera | São Paulo - SP', 'Jardim Santana | Hortolândia - SP', 'Santa Cruz | Rio de Janeiro - RJ'],
           ['Aririba | Balneário Camboriú - SC', 'Jardins | São Paulo - SP', 'Santo Amaro | São Paulo - SP'],
           ['Blumenau | Blumenau - SC', 'Moema | São Paulo - SP', 'Santos | São Paulo - SP'],
           ['Centro | Limeira - SP', 'Mooca | São Paulo – SP', 'Saúde | São Paulo - SP'],
           ['Centro | Piracicaba - SP', 'Nova Osasco | São Paulo – SP', 'Trindade | Florianópolis - SC'],
           ['Centro | Bertioga - SP', 'Nova Vinhedo | Vinhedo – SP', 'Vila Assunção | Santo André - SP'],
           ['Centro | São Paulo - SP', 'Nossa Sra das Graças| Manaus – AM', 'Vila Maria | São Paulo - SP'],
           ['Centro | Bebedouro - SP', 'Osasco | São Paulo - SP', 'Vila Nova Conceição | São Paulo – SP'],
           ['Ecoville | Curitiba - PR', 'Parque Bom Retiro | Paulínia - SP', 'Fátima | Fortaleza – CE'],
           ['Gutierrez | Belo Horizonte - MG', 'Parque das Nações | Americana - SP', 'Itaquera | São Paulo – SP'],
           ['Jardim Nova Europa | Campinas - SP', 'Centro | Guarulhos - SP', 'Centro| Itú  – SP'],
           ['Jardim Planalto | Jundiaí - SP', 'Ponte Preta | Campinas - SP', 'Bairro do Limão - SP'],
           ['Jardim Santa Rosália | Sorocaba - SP', 'Porto Velho | Rondônia - RO', 'Tatuapé - SP'],
           ['São José dos Campos  – SP', 'Lavras - MG','Alphaville | Santana de Parnaíba - SP'],
           ['Natal - RN', 'Barra - Rio de Janeiro - RJ','Taquara - Rio de Janeiro - RJ'],
        ],
      }
    }
  ]
/*
  [
    {
      columnGap: 10,
      lineHeight: 1.4,
      fontSize: 8,
      absolutePosition: {
        x: 50,
        y: 600,
      },
      columns: [
        {
          width: 150,
          text: ['Anhanguera | São Paulo – SP\n',
                 'Aririba | Balneário Camboriú - SC\n',
                 'Blumenau | Blumenau – SC\n',
                 'Casa Verde | São Paulo – SP\n',
                 'Centro | Limeira – SP\n',
                 'Centro | Piracicaba – SP\n',
                 'Centro | Bertioga – SP\n',
                 'Centro | São Paulo – SP\n',
                 'Centro | Bebedouro – SP\n',
                 'Ecoville | Curitiba – PR\n',
                 'Gutierrez | Belo Horizonte – MG\n',
                 'Jardim Nova Europa | Campinas – SP\n',
                 ],
        },
        {
          width: 'auto',
          canvas: [ { type: 'line', x1: 0, y1: 0, x2: 0, y2: 160, lineWidth: 1, color: 'red' } ],
        },
        {
          width: 150,
          text: ['Jardim Planalto | Jundiaí – SP\n',
                 'Jardim Santa Rosália | Sorocaba – SP\n',
                 'Jardim Santana | Hortolândia – SP\n',
                 'Jardins | São Paulo – SP\n',
                 'Moema | São Paulo – SP\n',
                 'Mooca | São Paulo – SP\n',
                 'Nova Osasco | São Paulo – SP\n',
                 'Nova Vinhedo | Vinhedo – SP\n',
                 'Osasco | São Paulo – SP\n',
                 'Parque Bom Retiro | Paulínia – SP\n',
                 'Parque das Nações | Americana – SP\n',
                 'Ponte Preta | Campinas – SP\n',
                 ],
        },
        {
          width: 'auto',
          canvas: [ { type: 'line', x1: 0, y1: 0, x2: 0, y2: 160, lineWidth: 1, color: 'red' } ],
        },
        {
          width: '*',
          text: ['Santos | São Paulo – SP\n',
                 'Saúde | São Paulo – SP\n',
                 'Tatuapé | São Paulo – SP\n',
                 'Trindade | Florianópolis – SC\n',
                 'Porto Velho | Rondônia – RO\n',
                 'Santa Cruz | Rio de Janeiro – RJ\n',
                 'Santo Amaro | São Paulo – SP\n',
                 'Vila Assunção | Santo André – SP\n',
                 'Vila Maria | São Paulo – SP\n',
                 'Vila Nova Conceição | São Paulo - SP\n',
                 ],
        },
      ],
    }
  ]
*/






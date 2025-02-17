export default function fifthSection(
  fifthSectionTableImgDataUri
) {
  return [
    {
      pageBreak: 'before',
      style: 'defaultStyle',
      stack: [

          {
            text: 'DESCRIÇÃO DE RECURSOS DO PLANO PERSONALIZADO\n',
            style: 'titleStyle',
          },
          {
            text: [
              {
                text: 'OPÇÃO: ',
                bold: true,
              },
              'Plano Personalizado permite a escolha do grupo de recursos ',
              {
                text: '(COMPLETO, PADRÃO ou ECONOMICO), ',
                bold: true,
              },
              'conforme especificações abaixo:',
            ]
          },
          {
            margin: [0, 10],
            image: fifthSectionTableImgDataUri,
            width: 500,
            alignment: 'center',
          },
      ],
    },
  ]
}

const width = 95 // tamanho da imagem
 
export default function fourthSection(
  fourthSectionAppAtendeImgDataUri,
  fourthSectionPortaCortinaImgDataUri,
  fourthSectionArmarioInteligenteImgDataUri,
  fourthSectionAtendeUsecarImgDataUri,
  fourthSectionAtendeLprImgDataUri,
  fourthSectionScannerQrImgDataUri,
) {
  return [
    {
      pageBreak: 'before',
      style: 'defaultStyle',
      stack: [

          {
            text: 'Acessórios (opcionais)\n',
            style: 'titleStyle',
          },
          'Os seguintes acessórios são compatíveis e estão disponíveis para serem adicionados à todos os Planos de Serviços da Atende Portaria, em qualquer momento da Jornada de Segurança do condomínio.',
          table(fourthSectionAppAtendeImgDataUri,
                fourthSectionPortaCortinaImgDataUri,
                fourthSectionArmarioInteligenteImgDataUri,
                fourthSectionAtendeUsecarImgDataUri,
                fourthSectionAtendeLprImgDataUri,
                fourthSectionScannerQrImgDataUri),
      ],
    },
  ]
}

function table (fourthSectionAppAtendeImgDataUri,
                fourthSectionPortaCortinaImgDataUri,
                fourthSectionArmarioInteligenteImgDataUri,
                fourthSectionAtendeUsecarImgDataUri,
                fourthSectionAtendeLprImgDataUri,
                fourthSectionScannerQrImgDataUri)
{
  const result = 
  {
    bold: true,
    margin: [0, 10, 0, 0],
    alignment: 'justify',
    layout: {
      defaultBorder:false,
      paddingLeft (i, node) { return 6; },
      paddingRight (i, node) { return 6; },
      paddingTop (i, node) { return 9; },
      paddingBottom (i, node) { return 9; },      
    },    
    table: {
      headerRows: 0,
      widths: [width,130,width,130],
      body: [
        [

          { 
            image: fourthSectionAppAtendeImgDataUri,
            width,
          },
          'Ajuda na organização, comunicação interna e com a Portaria. Permite ao morador reservar espaços, pré-cadastrar e liberar convidados, se autorizado. Acessa às câmeras do condomínio.',

          { 
            stack: [
              {
                image: fourthSectionPortaCortinaImgDataUri,
                width,
              }, 
              {
                bold: false,
                alignment: 'left',
                lineHeight: 1,
                text: '* Produto temporariamente indisponível',
                color: 'red',
              },
            ]
          },
          'Mais segurança por ser ultra-rápido (½ segundo), forma o efeito clausura e previne “risco de carona”. Pode ser contingência para o portão principal. Maior satisfação dos moradores pela agilidade na entrada e saída da garagem.',
        ],
        [

          { 
            image: fourthSectionArmarioInteligenteImgDataUri,
            width,
          },
          'Agiliza recebimento de entregas, libera tempo do zelador/ajudante. Traz mais autonomia e comodidade. Pode ser acrescentado em módulos, facilitando a adoção prática em condomínios de todos os tipos e tamanhos.',

          { 
            image: fourthSectionAtendeUsecarImgDataUri,
            width,
          },
          'É o compartilhamento de veículo (s) e pagamento por uso/hora, acionado pelo App Atende Mobile. Ideal para trajetos de ida e volta. Mais segurança, economia e comodidade aos moradores. Ideal ter vagas de estacionamento reservadas para o Usecar.',
        ],
        [

          { 
            image: fourthSectionAtendeLprImgDataUri,
            width,
          },
          'Agiliza reconhecimento de veículos pela leitura da placa, na entrada e saída de condomínio com alto fluxo. Pode ser combinada com a troca da cancela por Portão Cortina (segurançae eficiência)',

          { 
            image: fourthSectionScannerQrImgDataUri,
            width,
          },
          'Proporciona autonomia de acesso e verificação por proximidade e segurança anti-clonagem. Ideal para muitas portas espalhadas, muitos visitantes e anfitriões. Prescinde do App Atende Mobile.',
        ],
      ]
    }      
  }
  return result
}  
const width = 75 // 130 // tamanho da imagem
const columnGap = 10 // distancia entre as colunas
const marginY = 10 // margem vertical da tabela
 
export default function thirdSection(
   thirdSectionAtendeVilagioImgDataUri,
   thirdSectionAtendePersonalizadoImgDataUri,
   thirdSectionAtendeDiretoImgDataUri,
   thirdSectionAtendeCorporativoImgDataUri,
   thirdSectionAtendeAcessoImgDataUri,
) {
  return [
    {
      pageBreak: 'before',
      style: 'defaultStyle',
      stack: [

          {
            text: 'Planos de Serviços\n',
            style: 'titleStyle',
          },
          '(*) todos compatíveis com os acessórios opcionais na página seguinte.',
          thirdSectionAtendeAcesso(thirdSectionAtendeAcessoImgDataUri),
          thirdSectionAtendeVilagio(thirdSectionAtendeVilagioImgDataUri),
          thirdSectionAtendePersonalizado(thirdSectionAtendePersonalizadoImgDataUri),
          thirdSectionAtendeDireto(thirdSectionAtendeDiretoImgDataUri),
          thirdSectionAtendeCorporativo(thirdSectionAtendeCorporativoImgDataUri),
      ],
    },
  ]
}

function thirdSectionAtendeAcesso(thirdSectionAtendeAcessoImgDataUri) {  
  const result = 
  [
   {
     columnGap,
     margin: [0, marginY],
     columns: [
        {
          width,
          image: thirdSectionAtendeAcessoImgDataUri   
        },
        {
          text: 'Para condomínios residenciais, horizontais e verticais com até 500 unidades. Utiliza a plataforma tecnológica da Atende para executar o controle de acessos localmente, e endereçar a central diversos eventos de alerta (tipo portas abertas, perímetros violados, sistema de detecção de incêndio, função pânico acionado por pedestres ou veículos etc).\nO “Acesso” foi desenvolvido para evoluir facilmente para portaria remota (12 ou 24 horas), aproveitando 100% da sua infraestrutura e equipamentos, e mantendo 100% dos cadastros de pessoas, veículos e dispositivos e é compatível com todos os acessórios Atende Portaria (Portão Cortina, Armário Conectado, APP, Atende Portaria Mobile, e outros).',
          bold: true,
          alignment: 'justify',
        },
     ]
   }     
  ] 
  return result
}

function thirdSectionAtendeVilagio(thirdSectionAtendeVilagioImgDataUri) {  
  const result = 
  [
   {
     columnGap,
     margin: [0, marginY],
     columns: [
        {
          width,
          image: thirdSectionAtendeVilagioImgDataUri   
        },
        {
          text: 'Para residenciais individualizados, de 2 até 16 unidades, onde não se tem disponibilidade de infraestrutura de telefonia e não comporta colaboradores dedicados (porteiro, zelador e/ou síndico). Melhoramos a segurança via controle dos acessos de pessoas e veículos, fazemos a gestão do delivery e entregas com a ativa colaboração dos moradores, e monitoramento de perímetro.',
          bold: true,
          alignment: 'justify',
        },
     ]
   }     
  ] 
  return result
}

function thirdSectionAtendePersonalizado(thirdSectionAtendePersonalizadoImgDataUri) {  
  const result = 
  [
   {
     columnGap,
     margin: [0, marginY],
     columns: [
        {
          width,
          image: thirdSectionAtendePersonalizadoImgDataUri   
        },
        {
          text: 'Para condomínios residenciais, verticais ou horizontais, de 12 até 100 unidades. Ajudamos na definição do escopo de serviços (COMPLETO, PADRÃO ou ECONÔMICO) e a adaptar a infraestrutura de acordo com a opção escolhida. Controlamos os acessos de pessoas, veículos e perímetro, fazemos a gestão do delivery e entregas através de zelador e auxiliares, e o monitoramento do escopo personalizado do seu condomínio.',
          bold: true,
          alignment: 'justify',
        },
     ]
   }     
  ] 
  return result
}

function thirdSectionAtendeDireto(thirdSectionAtendeDiretoImgDataUri) {  
  const result = 
  [
   {
     columnGap,
     margin: [0, marginY],
     columns: [
        {
          width,
          image: thirdSectionAtendeDiretoImgDataUri   
        },
        {
          text: 'Para condomínios residenciais maiores, verticais ou horizontais, de 101 até 3.000 unidades, faixa onde o desafio da viabilidade econômica é superado com muita tecnologia. Atendemos com agilidade muitas pessoas e veículos; e monitoramos perímetros maiores. Fazemos a gestão do delivery e de entregas, com o envolvimento de zeladores e eventuais auxiliares, eventualmente mantidos como apoio presencial.',
          bold: true,
          alignment: 'justify',
        },
     ]
   }     
  ] 
  return result
}

function thirdSectionAtendeCorporativo(thirdSectionAtendeCorporativoImgDataUri) {  
  const result = 
  [
   {
     columnGap,
     margin: [0, marginY],
     columns: [
        {
          width,
          image: thirdSectionAtendeCorporativoImgDataUri   
        },
        {
          text: [
                 'Para condomínios Empresariais (logístico, industrial e/ou administrativo) e um número ilimitado de funcionários, veículos e visitantes. ',
                 'Incorporamos nosso know-how de Portaria Remota ao Sistema de Segurança da empresa. Colaboradores, veículos e visitantes cadastrados entram de forma ágil e adequadamente controlada. Anfitriões tem autonomia para liberar acesso aos visitantes, veículos e cargas. A Central Atende atua nos eventuais desvios. A Inteligência Ativa de monitoramento direciona eventuais exceções para um quadro local otimizado (rondas).',
               ],
          bold: true,
          alignment: 'justify',
        },
     ]
   }     
  ] 
  return result
}
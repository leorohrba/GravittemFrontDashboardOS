export default function eighthSection(
  eighthSectionLoginImgDataUri
) {
  return [
    {
      margin: [0, -26],
      style: 'defaultStyle',
      stack: [
        {
          image: eighthSectionLoginImgDataUri,
          width: 500,
        },
        eighthSectionSolicitacaoAnalise,
        eighthSectionAvisos,
        eighthSectionSolicitacaoAcesso,
        eighthSectionFaleConosco,
      ],
    },
  ]
}

const eighthSectionSolicitacaoAnalise = [
    {
      margin: [0, 10, 0, 0],
      text: 'Solicitação de análise de ocorrências\n',
      style: 'titleStyle',
    },
    {
      text: 'Se for necessário analisar alguma ocorrência no seu condomínio, os moradores (residencial) e/ou colaboradores (corporativo) poderão nos solicitar informações através do formulário web disponibilizado nesta opção. De acordo com a Política de Segurança do seu condomínio as informações serão encaminhadas via Síndico e/ou Comitê de Segurança, em até 24h do recebimento da solicitação, dependendo se as informações de data e hora da ocorrência nos forem informadas com precisão razoável (com intervalo em torno de 30 minutos).',
    },
]

const eighthSectionAvisos = [
    {
      margin: [0, 10, 0, 0],
      text: 'Avisos de Locação Temporária\n',
      style: 'titleStyle',
    },
    {
      text: [
        'A Atende Portaria recomenda que todos que necessitem nos comunicar de uma locação temporária, o façam pelo método mais ágil e seguro, através do nosso App Atende Portaria, conforme demonstramos passo a passo em dois vídeos disponibilizados na Área do Cliente. Na impossibilidade de se usar o nosso aplicativo, a Atende Portaria disponibiliza com segunda opção (contingência) o formulário Web para que os proprietários preencham e nos enviem sua solicitação com uma ',
        {
          text: ' antecedência mínima de 48 horas, ',
          bold: true,
        },
        'de forma que os acessos temporários sejam providenciados em tempo hábil.',        
      ],
    },
]

const eighthSectionSolicitacaoAcesso = [
    {
      margin: [0, 10, 0, 0],
      text: 'Solicitação de acesso ao Aplicativo\n',
      style: 'titleStyle',
    },
    {
      text: [
        'Para se beneficiar do conforto e agilidade de nossos aplicativos ',
        {
          text: 'Atende Portaria',
          bold: true,
        },
        ' ou o ',
        {
          text: 'Atende Portaria Mobile, ',
          bold: true,
        },
        'solicite um usuário e senha preenchendo as informações do formulário web, disponibilizado, e em seguida assista os vídeos que demonstra o funcionamento do passo a passo.',        
      ],
    },
]

const eighthSectionFaleConosco = [
    {
      margin: [0, 10, 0, 0],
      text: 'Fale Conosco\n',
      style: 'titleStyle',
    },
    {
      text: [
        'A Atende Portaria quer sempre saber sua opinião, e se compromete a considerar seus comentários e observações para melhorar nossos serviços. Ajude a nos mantermos firmes no propósito de condomínios a serem seguros, inteligentes (via tecnologia e aplicação das melhores práticas) e econômico, nos deixando saber suas opiniões sobre nossos serviços.',
      ],
    },
]

export default function seventhSection(
  seventhSectionAreaClienteImgDataUri
) {
  return [
    {
      margin: [0, 30],
      style: 'defaultStyle',
      stack: [
        seventhSectionAreaCliente(seventhSectionAreaClienteImgDataUri),
        seventhSectionPrimeiroCadastro,
        seventhSectionAberturaOS,
      ],
    },
  ]
}

function seventhSectionAreaCliente(seventhSectionAreaClienteImgDataUri) {
  const result = 
  [
    {
      text: 'Área do Cliente',
      style: 'titleStyle',
    },
    {
      text: [
         'No compromisso de proporcionarmos agilidade e simplicidade no relacionamento com nossos clientes e seus representantes, criamos a Área do Cliente no website ',
         {
           text: 'www.atendeportaria.com.br',
           link: 'http://www.atendeportaria.com.br',
           style: 'linkStyle',
         },
         ' e disponibilizamos as seguintes ferramentas:',
      ],
    },
    {
      text: 'https://www.atendeportaria.com.br/area-cliente',
      link: 'https://www.atendeportaria.com.br/area-cliente',
      style: 'linkStyle',
      fontSize: 14,
      margin: [0, 8, 0, 0],
    },
    {
      image: seventhSectionAreaClienteImgDataUri,
      width: 450,
    },
    
  ]
  return result
}

const seventhSectionPrimeiroCadastro = [
    {
      margin: [0, 12, 0, 0],
      text: 'Como fazer o Primeiro Cadastro do Morador (formulário web)',
      style: 'titleStyle',
    },
    {
      text: [
        'A Atende Portaria recomenda que todos os moradores (proprietários e/ou locatários) cadastrem o mais cedo possível os seus dados, de seus familiares, funcionários e respectivos veículos, no formulário web (*). Desta forma poderemos rapidamente aprovar com os responsáveis pela segurança do seu condomínio a imediata efetivação dos seus cadastros. Essa primeira etapa é imprescindível para que nossa equipe de implantação possa complementar presencialmente seus cadastros, com as fotos e biometrias necessárias para o início da nossa prestação de serviço.',
      ],
    },
    {
      text: '(*) podendo futuramente atualizar cadastros diretamente no App Atende.',
      fontSize: 9,
      margin: [0, 8, 0, 0],
    },
]

const seventhSectionAberturaOS = [
    {
      margin: [0, 12, 0, 0],
      text: 'Abertura de Ordem de serviços (ticket)',
      style: 'titleStyle',
    },
    {
      text: [
        'Ciente da importância de mantermos os equipamentos no condomínio em perfeito estado de funcionamento, disponibilizamos acesso aos moradores (Residencial) ou colaboradores (Corporativo) via web (*) e celular, para que possam nos comunicar imediatamente qualquer eventual anormalidade percebida.',
        '\n\nEstes podem mandar foto ou vídeo do eventual desvio percebido, sem necessidade de login, e com a imediata visibilidade das ordens de serviços geradas e respectivas soluções (registro de data, hora e responsável técnico) para os gestores do condomínio.',
      ],
    },
    {
      text: '(*) conforme demostra a imagem abaixo.',
      fontSize: 9,
      margin: [0, 8, 0, 0],
    },
]


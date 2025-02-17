export const thirdChapterText = {
  margin: [0, 20, 0, 0],
  lineHeight: 1.5,
  text: [
    {
      text: '3. PRAZO DE INSTALAÇÃO E INÍCIO DA PRESTAÇÃO DOS SERVIÇOS',
      id: 'prazo_instalacao_inicio_prestacao',
      style: 'header',
    },
    '\n\u200B\t\t\tA segurança depende de todos! Pensando nisto, a',
    {
      text: ' ATENDE PORTARIA, ',
      bold: true,
    },
    {
      text:
        'através da FRANQUEADA CONTRATADA, vai oferecer treinamentos para os condôminos na fase de implantação, abordando hábitos comuns no dia a dia que colocam em risco a segurança dos moradores.',
    },
  ],
}
export const thirdChapterList = proposalData => {
  return [
    {
      lineHeight: 1.5,
      fontSize: 12,
      margin: [30, 5, 0, 0],
      ul: [
        'Todos os equipamentos inclusive portões e câmeras deverão ser ligados em Nobreaks exceto em caso de haver geradores no condomínio, contingenciando eventuais faltas de energia elétrica.',
        'O Condomínio não deverá dispensar a portaria física antes do final da implantação da portaria.',
        'Será fornecido um cronograma de instalação em até 10 dias após a assinatura do contrato.',
        `O prazo da implantação é de até ${proposalData.installationTime ||
          0} dias úteis, do início da instalação, ou seja, após todas as adequações físicas que o condomínio tiver que fazer.`,
        'Sugerimos a contratação pelo condomínio de um plano de celular corporativo para melhor comunicação da central com o seu funcionário nas dependências do condomínio.',
        'Em caso de o condomínio ter mais de um funcionário produtivo sugerimos intercalar a escala de horários.',
        'Incluir na obrigação dos funcionários; receber treinamento, e participar ativamente da segurança comum do empreendimento.',
      ],
    },
  ]
}
export const thirdChapterFirstSectionTitle = {
  margin: [0, 20, 0, 0],
  lineHeight: 1.5,
  text: [
    {
      text: '3.1 Benefícios aos Condôminos',
      id: 'beneficios_condominos',
      style: 'subheader',
    },
  ],
}
export const thirdChapterFirstSectionList = {
  lineHeight: 1.5,
  fontSize: 12,
  margin: [30, 5, 0, 0],
  ul: [
    'Serviço de gerenciamento de acesso à distância com tecnologia e segurança;',
    'O Condomínio não deverá dispensar a portaria física antes do final da implantação da portaria.',
    'Função pânico para os moradores;',
    'Centralização dos serviços de manutenção em um único prestador de serviço;',
    'Localização de morador estando ou não em sua unidade;',
  ],
}

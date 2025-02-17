export const firstChapterText = {
  pageBreak: 'before',
  margin: [0, 0, 0, 0],

  text: [
    {
      text: '1. SOBRE ATENDE PORTARIA',
      style: 'header',
      id: 'sobre_atende_portaria',
    },
    {
      text:
        '\n\n\u200B\t\t\tA Atende oferece uma Central de Monitoramento própria, com tecnologia de ponta para atender chamados 24h por dia, 7 dias por semana, através de rede certificada de alta velocidade e geradores de energia. Estamos sempre dispostos a manter a sua segurança, através de eventos gerados online, verificando seu equipamento e o correto funcionamento de alarmes e câmeras de CFTV. Os profissionais que fazem a gestão da Central são rigorosamente recrutados e passam por constantes treinamentos, sempre visando a excelência e o melhor atendimento ao cliente.\n\n',
    },
    {
      text: 'Vídeo monitoramento\n\n',
      bold: true,
    },
    {
      text:
        'Central de portaria remota com mão de obra capacitada e treinada\n\n',
    },
    {
      text: 'Interligação\n\n',
      bold: true,
    },
    {
      text:
        'Através de um túnel de internet privado, 2 links de IP fixo transformados em túnel VPN, através da tecnologia ATENDE PORTARIA. Isolando o Condomínio da internet garantindo o sigilo das informações dos condôminos.\n\n',
    },
    {
      text: 'Gestão\n\n',
      bold: true,
    },
    {
      text:
        'Auxiliada com o mais moderno software e aplicativo de gestão de segurança.\n\n',
    },
    {
      text: '24 horas por dia\n\n',
      bold: true,
    },
    {
      text:
        'Imagens e acessos serão analisadas e gravadas em todos os eventos que forem tratados pela Central Remota.\n\n',
    },
    {
      text: 'Acesso\n\n',
      bold: true,
    },
    {
      text:
        'Seu acesso pode ser feito por, biometria, RFID, TAGS, APP, LPR, etc...\n\n',
    },
    {
      text: 'Ronda Atende\n\n',
      bold: true,
    },
    {
      text:
        'Os operadores na Central de Monitoramento executam rondas de imagens nas câmeras instaladas no condomínio. Todos os eventos gerados pelo sistema são analisados e atendidos imediatamente, dentre eles: disparos de invasão, portas deixadas abertas ou abertas sem permissão, mau funcionamento de câmeras, alarmes de perímetro (cercas elétricas, barreiras), etc.\n\n',
    },
  ],
  fontSize: 12,
}
export function firstChapterImage(firstChapterImgDataUri) {
  return [{ image: firstChapterImgDataUri, width: 450, alignment: 'center' }]
}

export const firstChapterFirstSectionTitle = {
  // pageBreak: 'before',
  margin: [0, 40, 0, 0],
  text: '1.1 Porque ATENDE PORTARIA?',
  id: 'porque_atende_portaria',
  style: 'header',
}
export const firstChapterFirstSectionList = {
  lineHeight: 1.5,
  fontSize: 12,
  margin: [30, 10, 0, 0],
  separator: ' ',
  ol: [
    'Central de monitoramento 24 horas estruturada para atendimento em todo território nacional.',
    'Operadores altamente qualificados.',
    'Investimos cada vez mais em sistemas de comunicação e grandes parcerias como diferencial para nossos serviços.',
    'Todos os equipamentos oferecidos são de alta qualidade, homologados em rigorosos testes.',
    'VPN – Comunicação direta sem a liberação de portas.',
    'Ronda virtual',
    'Treinamentos aos condôminos, até na esfera comportamental, elaborado por profissional de segurança.',
    'Possibilidade de contratação do portão cortina meio segundo',
    'Controle de entrada e saída de todos os visitantes e prestadores',
    'Unidades franqueadas localizadas a no máximo 5Km do condomínio, nas grandes cidades e nas cidades menores esta distância fica até 10km do condomínio permitindo assim maior rapidez no atendimento.\n\n',
  ],
}

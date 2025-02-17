export default function ninethSection(
  proposalData
) {
  return [
    {
      margin: [0, 40], 
      style: 'defaultStyle',
      stack: [
        ninethSectionPrazoInstalacao(proposalData),
        ninethSectionAdequacao,
      ],
    },
  ]
}

function ninethSectionPrazoInstalacao(proposalData) {
  
  const days = (proposalData?.installationTime || 0) === 1 ? '1 dia útil' : `${proposalData?.installationTime} dias úteis`
  const margin = 5
  
  const result = [
    {
      text: 'Prazo de instalação e início da prestação do serviço\n',
      style: 'titleStyle',
    },
    {
      text: [
        'A segurança depende de todos no condomínio, e não apenas dos síndicos e conselho. Pensando nisto, trabalhamos a conscientização e treinamento dos moradores e colaboradores do condomínio durante a implantação. Planejamos juntos com os responsáveis (síndico e/ou Comitê de Segurança) a realização dos treinamentos na frequência e públicos necessários. Em geral abrangemos aspectos e práticas de segurança e convivência no condomínio, em especial os vícios comuns no dia-a-dia que mais colocam em risco a segurança do condomínio.',
        '\n\nEntre os pontos de atenção mais comuns estão:',
      ],
    },
    {
      margin: [10, margin, 0, 0],
      ul: [
        {
          text: 'Todos os equipamentos (portas e portões controlados, câmeras e equipamentos de acesso, meios de comunicação etc.) estarão ligados em fonte de contingência de energia (nobreaks), bancos de baterias e/ou gerador(es) de energia do condomínio;',
          margin: [0, margin, 0, 0],
        },
        {
          text: 'Não dispensar a portaria presencial antes de se completar a implantação e garantir minimamente a estabilidade do serviço de portaria remota;',
          margin: [0, margin, 0, 0],
        },
        {
          text: 'Cumprimento do cronograma e especificações de instalação, em geral entregue ao condomínio em até 10 dias após a assinatura do Contrato;',
          margin: [0, margin, 0, 0],
        },
        {
          margin: [0, margin, 0, 0],
          text: [
            'Cumprir todas as adequações físicas imprescindíveis para o início da instalação, que em geral será executada em até ',
            {
              text: days,
              bold: true,
            },
            ' (condomínios residenciais) após a Atende Portaria revisar as adequações (',
            {
              text: 'Nota',
              decoration: 'underline',
              decorationColor: 'red',
            },
            ': projetos específicos - em geral corporativos ou residenciais maiores com grande adaptação na infraestrutura - terão esses prazos estendidos);',
          ],
        },
        {
          text: 'Contratação de celulares para os colaboradores de apoio (zelador e/ou ajudantes) para que sejam contatados pela central de portaria e/ou seus técnicos locais, quando necessário;',
          margin: [0, margin, 0, 0],
        },
        {
          text: 'Incluir as atividades específicas de apoio à Portaria Remota e respectivos horários de disponibilidade desses em quadro visual do condomínio, para que possam ser treinados à partir dessas e os moradores notificados com relação ao escopo e horários dos mesmos.',
          margin: [0, margin, 0, 0],
        },
      ],
    }
  ]
  return result
}

const ninethSectionAdequacao = [
    {
      text: '\nAdequação (equipamentos e mão-de-obra)\n',
      style: 'titleStyle',
    },
    {
      text: [
        'A Atende, através da nossa PRESTADORA LOCAL, entregará os equipamentos descritos na planilha abaixo, devidamente instalados e configurados de maneira a podermos iniciar os serviços de portaria remota dentro do prazo previsto.',
        '\n\nDe acordo com as adequações definidas, serviços de serralheria, obras civis, gesso, pintura, entre outros, poderão anteceder e/ou continuar após o início da operação da Portaria Remota. Esses pontos serão combinados com o Condomínio durante o detalhamento que se seguirá após a aprovação dessa proposta.',
      ],
    },
]

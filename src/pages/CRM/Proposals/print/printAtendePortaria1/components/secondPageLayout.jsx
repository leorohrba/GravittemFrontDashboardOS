export const secondPageLayoutTitle = {
  pageBreak: 'before',
  margin: [20, 60, 0, 0],
  text: 'ÍNDICE\n',
  fontSize: 16,
  bold: true,
}
export function secondPageLayoutContent(proposalData) {
  return [
    {
      margin: [20, 0, 0, 0],
      stack: [
        {
          text: [
            {
              textReference: 'sobre_atende_portaria',
            },
            '............................................................................',
            {
              pageReference: 'sobre_atende_portaria',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'porque_atende_portaria',
            },
            '........................................................................',
            {
              pageReference: 'porque_atende_portaria',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'descricao_dos_servicos',
            },
            '...........................................................................',
            {
              pageReference: 'descricao_dos_servicos',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'servico_remoto_portaria',
            },
            '........................................................',
            {
              pageReference: 'servico_remoto_portaria',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'servico_de',
              bold: false,
            },
            {
              textReference: 'gerenciamento',
            },
            {
              textReference: 'acesso_distancia',
              bold: false,
            },
            '.',
            {
              pageReference: 'servico_de',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'controle_acesso_moradores_funcionarios',
            },
            '......................................',
            {
              pageReference: 'controle_acesso_moradores_funcionarios',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'controle_acesso_visitantes',
            },
            '.................................................................',
            {
              pageReference: 'controle_acesso_visitantes',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'controle_acesso_entregadores',
            },
            '............................................................',
            {
              pageReference: 'controle_acesso_entregadores',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'armazenamento_e_confidencialidade',
            },
            '................................',
            {
              pageReference: 'armazenamento_e_confidencialidade',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'comunicacao_e_interfonia',
            },
            '.............................................................................',
            {
              pageReference: 'comunicacao_e_interfonia',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'demais_servicos',
            },
            '............................................................................................',
            {
              pageReference: 'demais_servicos',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'manutencao_falhas',
            },
            '...........................................................',
            {
              pageReference: 'manutencao_falhas',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'prazo_instalacao_inicio_prestacao',
            },
            '...............',
            {
              pageReference: 'prazo_instalacao_inicio_prestacao',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'beneficios_condominos',
            },
            '..........................................................................',
            {
              pageReference: 'beneficios_condominos',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'adequacao',
            },
            '....................................................................................................',
            {
              pageReference: 'adequacao',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'equipamento_adequacao',
            },
            '.....................................................................',
            {
              pageReference: 'equipamento_adequacao',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'condicoes_comerciais',
            },
            '...............................................................................',
            {
              pageReference: 'condicoes_comerciais',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'condicao_servicos_portaria',
            },
            '.............................................',
            {
              pageReference: 'condicao_servicos_portaria',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'condicao_equipamentos_servicos',
            },
            '....',
            {
              pageReference: 'condicao_equipamentos_servicos',
            },
            '\n',
          ],
        },
        {
          text:
            // VENDA
            proposalData.proposalType === 1
              ? [
                  {
                    textReference: 'opcao_compra_equipamentos',
                  },
                  '...............................................................',
                  {
                    pageReference: 'opcao_compra_equipamentos',
                  },
                  '\n',
                ]
              : [],
        },
        {
          text:
            // LOCAÇÃO
            proposalData.proposalType === 2
              ? [
                  {
                    textReference: 'opcao_locacao_equipamento',
                  },
                  '................................................................',
                  {
                    pageReference: 'opcao_locacao_equipamento',
                  },
                  '\n',
                ]
              : [],
        },
        {
          text: [
            {
              textReference: 'itens_inclusos_instalacao',
            },
            '.......................................................................',
            {
              pageReference: 'itens_inclusos_instalacao',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'nao_incluso_proposta',
            },
            '......................................................',
            {
              pageReference: 'nao_incluso_proposta',
            },
            '\n',
          ],
        },
        {
          text: [
            {
              textReference: 'termos_aceite_proposta',
            },
            '..........................................................................',
            {
              pageReference: 'termos_aceite_proposta',
            },
            '\n',
          ],
        },
      ],
      fontSize: 13,
      bold: true,
    },
  ]
}

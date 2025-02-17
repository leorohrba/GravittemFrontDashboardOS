import moment from 'moment'

export default function twelfthSection(proposalData, arrowImgDataUri) {

  return [
    {
      pageBreak: 'before',
      style: 'defaultStyle',
      stack: [
        {
          text: 'Termos do Aceite\n',
          style: 'titleStyle',
        },
        {
          text: 'As Partes declaram e concordam integralmente com a presente Proposta, incluindo todas as páginas de assinatura e eventuais anexos, formadas por meio digital com o qual expressamente declaram concordar que representam a integralidade dos termos entre elas acordados, substituindo quaisquer outros acordos anteriores formalizados por qualquer outro meio, verbal ou escrito, físico ou digital, nos termos dos art. 107, 219 e 220 do Código Civil.',
        },
        {
          text: '\nAdicionalmente, nos termos do art. 10, § 2º, da Medida Provisória nº 2.200-2, as partes expressamente concordam em utilizar e reconhecem como válida qualquer forma de comprovação de anuência aos termos ora acordados em formato eletrônico, ainda que não utilizem de certificado digital emitido no padrão ICP-Brasil, incluindo assinaturas eletrônicas. A formalização das avenças na maneira supra acordada será suficiente para a validade e integral vinculação das partes ao presente Contrato.',
        },
        {
          margin: [0, 0, 0, 10], 
          text: [
            '\nO Condomínio, na pessoa de seu síndico eleito, aceita ',
            { 
              text: 'INTEGRALMENTE ',
              bold: true,
            },
            'todos os termos e condições da presente',
            { 
              text: ' PROPOSTA, ',
              bold: true,
            },
            ' onde prosseguimos para a fase de assinatura dos contratos, de acordo com a opção definida:',
          ],
        },
        tableItems(arrowImgDataUri),
        twelfthSectionTable(proposalData),
      ],
    }
  ] 
}

function twelfthSectionTable(proposalData) {
  
  const witness1 = proposalData?.witnesses.length > 0 ? proposalData.witnesses[0] : null 
  const witness2 = proposalData?.witnesses.length > 1 ? proposalData.witnesses[1] : null 
  
  const result =   
    {
      layout: {
        paddingLeft (i, node) { return 9; },
        paddingRight (i, node) { return 5; },
        paddingTop (i, node) { return 5; },
        paddingBottom (i, node) { return 5; },      
      },    
      table: {
        headerRows: 0,
        widths: ['*', '*'],
        body: [
          [ twelfthSectionContratante(proposalData), {} ],
          [ 
             twelfthSectionPessoa('PRESTADORA LOCAL:',
                                 proposalData?.contactNameFranchisee || '',
                                 proposalData?.documentNumberFranchisee || ''),
          
             twelfthSectionPessoa('CENTRAL ATENDE - ATENDE PORTARIA LTDA',
                                 proposalData?.contactNameFranchisor,
                                 proposalData?.documentNumberFranchisor),
          ],
          [ 
             twelfthSectionPessoa('TESTEMUNHA 1:',
                                 witness1?.name || '',
                                 witness1?.cpf || ''),
          
             twelfthSectionPessoa('TESTEMUNHA 2:',
                                 witness2?.name || '',
                                 witness2?.cpf || ''),
          ],
        ]
      },
    }
  return result  
}

function twelfthSectionContratante(proposalData) {
  
  const localAndDate = `São Paulo, ${moment().format('DD')} de ${moment().format('MMMM')} de ${moment().format('YYYY')}.`
  const name = proposalData?.contactNameCustomer
  const cpf = proposalData?.documentNumberCustomer
  
  const result = 
    {
      colSpan: 2,
      stack: [
        {
          text: localAndDate,
          bold: true,
        },
        {
          text: 'De acordo:',
          bold: true,
          margin: [0, 12, 0, 10],
        },
        {
          columns: [
            { 
              width: '*',
              text: '',
            },
            {
              width: 'auto',
              text: [
                '_____________________________________________\n',
                {
                  text: 'CONTRATANTE\n',
                  bold: true,
                },
                `Nome: ${name || ''}\n`,
                `CPF: ${cpf || ''}\n`,
              ],
            },
            { 
              width: '*',
              text: '',
            },
          ],
        },
      ],
    }
  
  return result
}

function twelfthSectionPessoa(
  title,
  name,
  cpf
) {
  
  const result = [
    {
      margin: [0, 18, 0, 0],
      stack: [
        {
          text: [
            '_____________________________________________\n',
            {
              text: `${title || ''}\n`,
              bold: true,
            },
            `Nome: ${name || ''}\n`,
            `CPF: ${cpf || ''}\n`,
          ],
        },
      ],
    }
  ]
  return result
}

function tableItems(arrowImgDataUri) {
  const body = [
    [getImage(arrowImgDataUri),'CONTRATO DE PRESTAÇÃO DE SERVIÇOS E OUTRAS AVENÇAS - PORTARIA REMOTA;'],
    [getImage(arrowImgDataUri),'CONTRATO DE FINANCIAMENTO DE EQUIPAMENTOS DE ADEQUAÇÃO E COMPLEMENTOS;'],
    [getImage(arrowImgDataUri),'CONTRATO DE LOCAÇÃO DE EQUIPAMENTOS DE ADEQUAÇÃO E COMPLEMENTOS.'],
  ]
  const result = 
    [
      {
        margin: [0, 0, 0, 10],
        layout: {
          hLineWidth(i, node) {
            return 0
          },
          vLineWidth(i, node) {
            return 0
          },
        },
        table: {
          headerRows: 0,
          widths: ['auto', '*'],
          body,
        },
      },
    ]  
  return result    
}

function getImage(arrowImgDataUri) {
  const result = 
    {
      image: arrowImgDataUri,
      width: 8,
      margin: [0, 3],
    }
  
  return result
}
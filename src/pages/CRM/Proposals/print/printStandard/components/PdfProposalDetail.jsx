import { formatCellPhone, formatPhone } from '@utils'

export function proposalDetailTitle() {
  return [
    {
      margin: [0, 0, 0, 0],
      text: 'Detalhes do negócio',
      alignment: 'center',
      bold: true,
      fontSize: '12',
    },
  ]
}
export function proposalDetailTable(proposal) {
  const {
    proposalHeader,
    companyAddress,
    companyContact,
    companyDocumentCpfCnpj,
  } = proposal
  return [
    {
      style: 'tableExample',
      margin: [0, 10, 0, 0],
      table: {
        widths: [60, 170, 60, 170],
        headerRows: 1,
        body: [
          [
            {
              text: 'Nome:',
              bold: 'true',
            },
            proposalHeader.companyName,
            {
              text: 'Contato:',
              bold: 'true',
            },
            companyContact.contactName,
          ],
          [
            {
              text: `${companyDocumentCpfCnpj.typeAbbreviation || `CNPJ`}:`,
              bold: 'true',
            },
            companyDocumentCpfCnpj.formattedValue,
            {
              text: 'E-mail:',
              bold: 'true',
            },
            companyContact.email,
          ],
          [
            {
              text: 'Endereço:',
              bold: 'true',
            },
            addressName(companyAddress.name, companyAddress.number),
            {
              text: 'Telefone:',
              bold: 'true',
            },
            formatPhone(companyContact.phone),
          ],
          [
            {
              text: 'Bairro:',
              bold: 'true',
            },
            companyAddress.neighborhood,
            {
              text: 'Celular:',
              bold: 'true',
            },
            formatCellPhone(companyContact.cellPhone),
          ],
          [
            {
              text: 'Cidade:',
              bold: 'true',
            },
            companyAddress.cityName,
            '',
            '',
          ],
          [
            {
              text: 'Estado:',
              bold: 'true',
            },
            companyAddress.stateName,
            '',
            '',
          ],
        ],
      },
      layout: 'noBorders',
    },
  ]
}

const addressName = (name, number) => {
  let result = name
  if (number) {
    result += `, ${number}`
  }
  return result
}

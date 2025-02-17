export const d = new Date()
export function signatureSection(proposalData) {
  return [
    {
      margin: [0, 20, 0, 0],
      pageBreak: 'before',
      lineHeight: 1.5,
      text: [
        `São Paulo, ${d.getDate()} de ${d.toLocaleString('pt-BR', {
          month: 'long',
        })} de ${d.getFullYear()}\n\n`,
        'De acordo\n\n',
        {
          text: '_____________________________________\n',
        },
        {
          text: `CLIENTE: ${proposalData.customerName || ''}\n`,
          bold: true,
        },
        `Nome: ${proposalData.contactNameCustomer || ''}\n`,
        `CPF: ${proposalData.documentNumberCustomer || ''}\n\n\n`,
        {
          text: '_____________________________________\n',
        },
        {
          text: `FRANQUEADO(A) CONTRATADO(A): ${proposalData.franchiseeName ||
            ''}\n`,
          bold: true,
        },
        `Nome: ${proposalData.contactNameFranchisee || ''}\n`,
        `CPF: ${proposalData.documentNumberFranchisee || ''}\n\n\n`,
        {
          text: '_____________________________________\n',
        },
        {
          text: 'ATENDE PORTARIA\n',
          bold: true,
        },
        `Nome: ${proposalData.contactNameFranchisor || ''}\n`,
        `CPF: ${proposalData.documentNumberFranchisor || ''}`,
      ],
    },
  ]
}

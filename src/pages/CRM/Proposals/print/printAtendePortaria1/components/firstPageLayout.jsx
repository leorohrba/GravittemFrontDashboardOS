import { formatPhone } from '@utils'

export default function firstPageLayout(proposalData) {
  return [
    {
      text: [
        {
          text: 'PROPOSTA COMERCIAL\n',
          fontSize: 18,
          bold: true,
        },
        {
          text: `N°: ${proposalData.number || ''}\n`,
          fontSize: 15,
        },
        {
          text: 'ANEXO |\n',
          fontSize: 15,
        },
        {
          text: `A/C: ${proposalData.contactNameCustomer || ''}\n`,
          fontSize: 15,
        },
        {
          text: `Condomínio: ${proposalData.customerName || ''}\n`,
          fontSize: 15,
        },
        {
          text: `Unidade: ${proposalData.franchiseeName || ''}\n`,
          fontSize: 15,
        },
        {
          text: `Consultor: ${proposalData.sellerName || ''}\n`,
          fontSize: 15,
        },
        {
          text: `Telefone: ${formatPhone(proposalData.sellerPhone) || ''}\n`,
          fontSize: 15,
        },
        {
          text: `E-mail: ${proposalData.sellerEmail || ''}`,
          fontSize: 15,
        },
      ],
      absolutePosition: {
        x: 50,
        y: 550,
      },
    },
  ]
}

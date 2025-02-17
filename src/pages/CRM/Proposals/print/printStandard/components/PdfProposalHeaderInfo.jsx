import { formatCellPhone, formatPhone } from '@utils'

const defaultSize = { width: 100, height: 55  }

export function companyHeaderInfo(companyLogo, proposal, currentPage, pageCount, pageSize) {
  const companyHeaderLocationText = proposal.ownerName
  return [
    {
      margin: [40, 0, 0, 40],
      columnGap: 3,
      columns: [
        {
          margin: [0, 10, 0, 0],
          width: 100,
          alignment: 'left',
          stack: [
            { 
              image: companyLogo,
              margin: [0, 10],
              fit: [defaultSize.height, defaultSize.width],
            }
          ]
        },
        {
          margin: [0, 30, 0, 0],
          width: '*',
          fontSize: 9,
          stack: [
            {
              margin: [0, 0, 5, 0],
              text: companyHeaderLocationText,
              alignment: 'center',
              fontSize: '13',
              bold: true,
            },
            companyHeaderLocation(proposal),
            companyHeaderUser(proposal),
          ]
        },
        {
          width: 127,
          lineHeight: 1.0,
          margin: [0, 30, 30, 0],
          alignment: 'right',
          stack: [
            {
              text: `Página ${currentPage} de ${pageCount}`,
            },
            {
              text: ['N° do negócio: ' , { bold: true, text: proposal.proposalHeader?.number || 0 }],
            },
         ]
        }  
      ],
    },
  ]
}

export function companyHeaderLocation(proposal) {
  return [
    {
      text: ownerAddress(proposal.ownerAddress),
      lineHeight: 1.0,
      alignment: 'center',
    },
  ]
}

export function companyHeaderUser(proposal) {
  return [
    {
      alignment: 'center',
      lineHeight: 1.0,
      text: sellerContact(
        proposal.proposalHeader.sellerName,
        proposal.sellerContact,
      ),
    },
  ]
}

const ownerAddress = address => {
  let result = address.name || ''
  if (address.number) {
    result += `, ${address.number}`
  }
  if (address.neighborhood) {
    result += ` - ${address.neighborhood}`
  }
  if (address.cityName) {
    result += `, ${address.cityName}`
  }
  if (address.stateAbbreviation) {
    result += ` - ${address.stateAbbreviation}`
  }

  return result
}

const sellerContact = (name, contact) => {
  let result = name
  if (contact.phone) {
    result += ` | ${formatPhone(contact.phone)}`
  }
  if (contact.cellPhone && !contact.phone) {
    result += ` | ${formatCellPhone(contact.cellPhone)}`
  }
  if (contact.email) {
    result += ` | ${contact.email}`
  }
  return result
}

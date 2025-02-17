import { addBrlCurrencyToNumber } from '@utils'

export function productsAndServicesFooter(proposal) {
  const result = [
      {
        margin: [ 0, 10 ],
        lineHeight: 1.3,
        columnGap: 5,
        columns: [
          {
            width: '53%',
            stack: [
              getReceiptMethod(proposal),
              getPaymentCondition(proposal),
              getParcels(proposal),
            ]  
          },
          {
            stack: [
              getRecurrenceValue(proposal),
              getSingleValue(proposal),
            ]  
          }
        ]
      },
  ]
  return result
}

function getReceiptMethod(proposal) {
  const result = []
  if (proposal?.proposalHeader?.receiptMethodId) {
      result.push(
        { 
          columnGap: 5,
          columns: [
          {
            width: '56%',
            text: 'Forma de pagamento único: ',
            bold: 'true',
          },
          {
            text: proposal?.proposalHeader?.receiptMethodDescription,
          },
          ]
        }
      )
  }
  return result    
}

function getPaymentCondition(proposal) {
  const result = []
  if (proposal?.proposalHeader?.paymentConditionId) {
      result.push(
        {
          columnGap: 5,
          columns: [
            {
              width: '56%',
              text: 'Condições de pagamento único: ',
              bold: 'true',
            },
            proposal?.proposalHeader?.paymentConditionDescription,
         ]
        }
      )
  }
  return result    
}

function getParcels(proposal) {
  const result = []
  const { parcels } = proposal
  if (parcels.length > 0) {
    result.push ({
      columns: [
        { text: parcels.map(parcel => `- Parcela ${parcel.number}`).join('\n') } ,
        { text: parcels.map(parcel => addBrlCurrencyToNumber(parcel.value)).join('\n') }
      ]
    })
  }
  return result
}

function getSingleValue(proposal) {
  const { total } = proposal
  const result = []

  if (!!total.totalSingleValue || !!total.totalSingleDiscount) {
    result.push(
      {
         margin: [ 0, 10 ],
         stack: [
            {
              columns: [
                      { width: '60%', text: `Descontos no valor único: `, bold: true },
                      `${total.totalSingleDiscount ? '- ' : ''}${addBrlCurrencyToNumber(total.totalSingleDiscount || 0)}`,
                    ],
            },
            {
              columns: [
                      { width: '60%', text: 'Total no valor único: ', bold: true },
                      { bold: true, text: addBrlCurrencyToNumber(total.totalSingleValue || 0) },
                    ],
            },
        ]  
      }
    )
  }
  return result
}

function getRecurrenceValue(proposal) {
  const { total } = proposal
  const result = []

  if (!!total.totalRecurrenceValue || !!total.totalRecurrenceDiscount) {
    result.push(
        {
          stack: [
            {
              columns: [
                         { width: '60%', text: 'Descontos na recorrência: ', bold: true },
                         `${total.totalRecurrenceDiscount ? '- ' : ''}${addBrlCurrencyToNumber(total.totalRecurrenceDiscount || 0)}`,
                    ],
            },
            {
              columns: [
                         { width: '60%', text: 'Total recorrente: ', bold: true },
                         { bold: true, text: addBrlCurrencyToNumber(total.totalRecurrenceValue || 0) },
                    ],
            },
          ]
        }    
    )
  }
  return result
}

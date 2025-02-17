import { apiCRM, apiAttachment } from '@services/api'
import { handleAuthError } from '@utils'
import { message, Modal } from 'antd'
import image2base64 from '@utils/image-to-base64'
import { PropTypes } from 'prop-types'
import PdfProposalPdfMake from './components/PdfProposalPdfMake'

// ATENÇÃO: Se for feita alguma alteração aqui, deve-se alterar também o componente PrintProposal

export async function GenerateFile({ proposalId, type, callback })  {
  
  let result = await image2base64(require('@assets/images/favicon/gravittem1.jpg')) 
  const gravittemLogo = `data:image/png;base64,${result}`

  result = await image2base64(require(`@assets/images/companyLogo/emptyLogo.png`)) 
  const emptyLogo = `data:image/png;base64,${result}`

  apiCRM({
    method: 'GET',
    url: `/api/CRM/proposalDataPrint`,
    params: { proposalId },
  })
    .then(response => {
      const { data } = response
      
      if (data.isOk) {
        if (data.proposal.length === 0) {
          Modal.error({
            title: `Negócio não encontrado!`,
          })
        } else {
          const proposal = data.proposal[0]
          getLogo(proposal)
        }
      } else {
        message.error(data.message)
      }
    })
    .catch(function abort(error) {
      // handle error
      console.log(error)
      handleAuthError(error)
    })

  async function getLogo(proposal) {
    let companyLogo = emptyLogo
    if (proposal) {
      try {
        const response = await apiAttachment({
          method: 'GET',
          url: `/api/anexo/logo`,
          params: { ownerId: proposal.mainOwnerId, tipo: 2 },
        })
        const { data } = response
        companyLogo = `data:image/png;base64,${data}`
      } catch (error) {
      }

      PdfProposalPdfMake(
      {
        gravittemLogo,
        companyLogo,
        proposal,
        type,
        callback,
      })
    }
  }
}

GenerateFile.propTypes = {
  proposalId: PropTypes.number,
}


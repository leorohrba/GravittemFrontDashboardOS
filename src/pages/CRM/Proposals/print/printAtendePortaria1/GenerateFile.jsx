import companyBackgroundImg from '@assets/images/print/atendePortaria/bg-min.png'
import firstChapterImg from '@assets/images/print/atendePortaria/cap-1.jpg'
import secondChapterSecondSectionImg from '@assets/images/print/atendePortaria/cap-2-secao-2.png'
import secondChapterThirdSectionFirstImg from '@assets/images/print/atendePortaria/cap-2-secao-3-1.jpg'
import secondChapterThirdSectionSecondImg from '@assets/images/print/atendePortaria/cap-2-secao-3-2.png'
import secondChapterSeventhSectionFirstSectionImg from '@assets/images/print/atendePortaria/cap-2-secao-7.jpg'
import headerFooterImgBackgroundImg from '@assets/images/print/atendePortaria/rodape-cabecalho-min.png'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { message, Modal } from 'antd'
import image2base64 from '@utils/image-to-base64'
import { PropTypes } from 'prop-types'
import PdfMakeConfig from './components/pdfMakeConfig'

// ATENÇÃO: Se for feita alguma alteração aqui, deve-se alterar também o componente PrintProposal

export async function GenerateFile({ proposalId, type, callback })  {
  
  let result = await image2base64(companyBackgroundImg)
  const companyBackgroundImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(headerFooterImgBackgroundImg)
  const headerFooterImgBackgroundDataUri = `data:image/png;base64,${result}`

  result = await image2base64(firstChapterImg)
  const firstChapterImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(secondChapterSecondSectionImg)
  const secondChapterSecondSectionImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(secondChapterThirdSectionFirstImg)
  const secondChapterThirdSectionFirstImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(secondChapterThirdSectionSecondImg)
  const secondChapterThirdSectionSecondImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(secondChapterSeventhSectionFirstSectionImg)
  const secondChapterSeventhSectionFirstSectionImgDataUri = `data:image/png;base64,${result}`

  apiCRM({
    method: 'GET',
    url: `/api/CRM/ProposalPrintEspecific`,
    params: { proposalId },
  })
    .then(response => {
      const { data } = response
      
      if (data.isOk) {
        if (data.proposal.proposalId === 0) {
          Modal.error({
            title: `Negócio não encontrado!`,
          })
        } else {
          const proposalData = data.proposal

          PdfMakeConfig(
          {
            companyBackgroundImgDataUri,
            headerFooterImgBackgroundDataUri,
            firstChapterImgDataUri,
            secondChapterSecondSectionImgDataUri,
            secondChapterThirdSectionFirstImgDataUri,
            secondChapterThirdSectionSecondImgDataUri,
            secondChapterSeventhSectionFirstSectionImgDataUri,
            proposalData,
            type,
            callback
          })
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
}

GenerateFile.propTypes = {
  proposalId: PropTypes.number,
}


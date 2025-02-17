import firstSectionLogoImg from '@assets/images/print/atendePortaria2/logo-pagina1-min.png'
import firstSectionMapImg from '@assets/images/print/atendePortaria2/mapa-pagina1-min.png'

import checkSymbolImg from '@assets/images/print/atendePortaria2/check-symbol.png'
import arrowImg from '@assets/images/print/atendePortaria2/arrow.png'
import abfLogoImg from '@assets/images/print/atendePortaria2/logo-abf-rodape-min.png'
import abeseLogoImg from '@assets/images/print/atendePortaria2/logo-abese-rodape-min.png'

import secondSectionPilaresImg from '@assets/images/print/atendePortaria2/pilares-pagina2-min.jpg'

import thirdSectionAtendeVilagioImg from '@assets/images/print/atendePortaria2/vilagio-pagina3-min.jpg'
import thirdSectionAtendePersonalizadoImg from '@assets/images/print/atendePortaria2/personalizado-pagina3-min.jpg'
import thirdSectionAtendeDiretoImg from '@assets/images/print/atendePortaria2/direto-pagina3-min.jpg'
import thirdSectionAtendeCorporativoImg from '@assets/images/print/atendePortaria2/corporativo-pagina3-min.jpg'
import thirdSectionAtendeAcessoImg from '@assets/images/print/atendePortaria2/acesso-pagina3-min.jpg'

import fourthSectionAppAtendeImg from '@assets/images/print/atendePortaria2/atende-pagina4-min.jpg'
import fourthSectionPortaCortinaImg from '@assets/images/print/atendePortaria2/cortina-pagina4-min.jpg'
import fourthSectionArmarioInteligenteImg from '@assets/images/print/atendePortaria2/inteligente-pagina4-min.jpg'
import fourthSectionAtendeUsecarImg from '@assets/images/print/atendePortaria2/usecar-pagina4-min.jpg'
import fourthSectionAtendeLprImg from '@assets/images/print/atendePortaria2/lpr-pagina4-min.jpg'
import fourthSectionScannerQrImg from '@assets/images/print/atendePortaria2/scanner-qr-pagina4-min.jpg'

import fifthSectionTableImg from '@assets/images/print/atendePortaria2/tabela-pagina5-min.png'
import seventhSectionAreaClienteImg from '@assets/images/print/atendePortaria2/area-do-cliente-pagina7-min.png'
import eighthSectionLoginImg from '@assets/images/print/atendePortaria2/atendimento-login-pagina8-min.png'

import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { message, Modal } from 'antd'
import image2base64 from '@utils/image-to-base64'
import { PropTypes } from 'prop-types'
import PdfMakeConfig from './components/pdfMakeConfig'

// ATENÇÃO: Se for feita alguma alteração aqui, deve-se alterar também o componente PrintProposal

export async function GenerateFile({ proposalId, type, callback })  {
  
  let result = await image2base64(firstSectionLogoImg)
  const firstSectionLogoImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(firstSectionMapImg)
  const firstSectionMapImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(checkSymbolImg)
  const checkSymbolImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(abfLogoImg)
  const abfLogoImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(abeseLogoImg)
  const abeseLogoImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(secondSectionPilaresImg)
  const secondSectionPilaresImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(thirdSectionAtendeVilagioImg)
  const thirdSectionAtendeVilagioImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(thirdSectionAtendePersonalizadoImg)
  const thirdSectionAtendePersonalizadoImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(thirdSectionAtendeDiretoImg)
  const thirdSectionAtendeDiretoImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(thirdSectionAtendeCorporativoImg)
  const thirdSectionAtendeCorporativoImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(thirdSectionAtendeAcessoImg)
  const thirdSectionAtendeAcessoImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(fourthSectionAppAtendeImg)
  const fourthSectionAppAtendeImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(fourthSectionPortaCortinaImg)
  const fourthSectionPortaCortinaImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(fourthSectionArmarioInteligenteImg)
  const fourthSectionArmarioInteligenteImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(fourthSectionAtendeUsecarImg)
  const fourthSectionAtendeUsecarImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(fourthSectionAtendeLprImg)
  const fourthSectionAtendeLprImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(fourthSectionScannerQrImg)
  const fourthSectionScannerQrImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(fifthSectionTableImg)
  const fifthSectionTableImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(seventhSectionAreaClienteImg)
  const seventhSectionAreaClienteImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(eighthSectionLoginImg)
  const eighthSectionLoginImgDataUri = `data:image/png;base64,${result}`

  result = await image2base64(arrowImg)
  const arrowImgDataUri = `data:image/png;base64,${result}`

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
            firstSectionLogoImgDataUri,
            firstSectionMapImgDataUri,
            checkSymbolImgDataUri,
            abfLogoImgDataUri,
            abeseLogoImgDataUri,
            secondSectionPilaresImgDataUri,
            thirdSectionAtendeVilagioImgDataUri,
            thirdSectionAtendePersonalizadoImgDataUri,
            thirdSectionAtendeDiretoImgDataUri,
            thirdSectionAtendeCorporativoImgDataUri,
            thirdSectionAtendeAcessoImgDataUri,
            fourthSectionAppAtendeImgDataUri,
            fourthSectionPortaCortinaImgDataUri,
            fourthSectionArmarioInteligenteImgDataUri,
            fourthSectionAtendeUsecarImgDataUri,
            fourthSectionAtendeLprImgDataUri,
            fourthSectionScannerQrImgDataUri,
            fifthSectionTableImgDataUri,
            seventhSectionAreaClienteImgDataUri,
            eighthSectionLoginImgDataUri,
            arrowImgDataUri,
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


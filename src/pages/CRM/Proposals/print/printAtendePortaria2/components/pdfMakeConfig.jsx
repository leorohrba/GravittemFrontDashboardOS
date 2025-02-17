import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import PropTypes from 'prop-types'
import {
  firstSectionLogoImg,
  firstSectionProposal,
  firstSectionAttendancePlaces,
} from './firstSection'
import secondSection from './secondSection'
import thirdSection from './thirdSection'
import fourthSection from './fourthSection'
import fifthSection from './fifthSection'
import sixthSection from './sixthSection'
import seventhSection from './seventhSection'
import eighthSection from './eighthSection'
import ninethSection from './ninethSection'
import tenthSection from './tenthSection'
import eleventhSection from './eleventhSection'
import twelfthSection from './twelfthSection'
import footer from './footer'

pdfMake.vfs = pdfFonts.pdfMake.vfs

export default function PdfMakeConfig({
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
  twelvethSectionLoginImgDataUri,
  arrowImgDataUri,
  proposalData,
  type,
  callback,
  width,
  height,
}) {
  // left, top, right, bottom
  const docDefinition = {
    info: {
      title: 'Detalhe do negócio',
    },
    pageMargins: [50, 80, 50, 80],
    header(currentPage, pageCount, pageSize) {
        if (currentPage !== 1) {
          return [
            { text: `Página ${currentPage}`, alignment: 'right', margin:  [0, 40, 40, 0] },
          ]
        }
        return false
    },   
    footer(page) {
      if (page !== 1) {
        return footer(abfLogoImgDataUri, abeseLogoImgDataUri)
      }
      return false
    },
    background(currentPage) {
      if (currentPage === 1) {
        return [
          {
            image: firstSectionMapImgDataUri,
            margin: [ 0, -30 ],
            width: 600,
          },
        ]
      }
      return false
    },
    content: [
      firstSectionLogoImg(firstSectionLogoImgDataUri),
      firstSectionProposal(proposalData),
      firstSectionAttendancePlaces,
      secondSection(checkSymbolImgDataUri, secondSectionPilaresImgDataUri),
      thirdSection(thirdSectionAtendeVilagioImgDataUri,
                   thirdSectionAtendePersonalizadoImgDataUri,
                   thirdSectionAtendeDiretoImgDataUri,
                   thirdSectionAtendeCorporativoImgDataUri,
                   thirdSectionAtendeAcessoImgDataUri,
      ),
      fourthSection(fourthSectionAppAtendeImgDataUri,
                    fourthSectionPortaCortinaImgDataUri,
                    fourthSectionArmarioInteligenteImgDataUri,
                    fourthSectionAtendeUsecarImgDataUri,
                    fourthSectionAtendeLprImgDataUri,
                    fourthSectionScannerQrImgDataUri),
      fifthSection(fifthSectionTableImgDataUri),
      sixthSection(),
      seventhSection(seventhSectionAreaClienteImgDataUri),
      eighthSection(eighthSectionLoginImgDataUri),
      ninethSection(proposalData),
      tenthSection(proposalData, arrowImgDataUri),
      eleventhSection(proposalData),
      twelfthSection(proposalData, arrowImgDataUri),
    ],
    styles: {
      defaultStyle: {
          fontSize: 11,
          lineHeight: 1.2,
          alignment: 'justify',
        },      
      titleStyle: {
          fontSize: 16,
          bold: true,
          lineHeight: 1.8,
        },  
      linkStyle: {
        color: '#0000EE',
        decoration: 'underline',
      }        
    },

  }
  // download the PDF
  const pdfDocGenerator = pdfMake.createPdf(docDefinition)

  if (type === 'blob')   {
    pdfDocGenerator.getBlob((blob) => {
      callback(blob)
    })
  }
  else 
  {
    try {
      pdfDocGenerator.getDataUrl(dataUrl => {
        const targetElement = document.querySelector('#proposalReport')
        const iframe = document.createElement('iframe')
        iframe.style.cssText = `position:absolute;width:${width};height:${height};`  
        iframe.src = dataUrl
        targetElement.appendChild(iframe)
      })
      return <div />
    } catch {}
  }    
}

PdfMakeConfig.propTypes = {
  firstSectionLogoImgDataUri: PropTypes.any,
  firstSectionMapImgDataUri: PropTypes.any,
  checkSymbolImgDataUri: PropTypes.any,
  abfLogoImgDataUri: PropTypes.any,
  abeseLogoImgDataUri: PropTypes.any,
  secondSectionPilaresImgDataUri: PropTypes.any,
  thirdSectionAtendeVilagioImgDataUri: PropTypes.any,
  thirdSectionAtendePersonalizadoImgDataUri: PropTypes.any,
  thirdSectionAtendeDiretoImgDataUri: PropTypes.any,
  thirdSectionAtendeCorporativoImgDataUri: PropTypes.any,
  thirdSectionAtendeAcessoImgDataUri: PropTypes.any,
  fourthSectionAppAtendeImgDataUri: PropTypes.any,
  fourthSectionPortaCortinaImgDataUri: PropTypes.any,
  fourthSectionArmarioInteligenteImgDataUri: PropTypes.any,
  fourthSectionAtendeUsecarImgDataUri: PropTypes.any,
  fourthSectionAtendeLprImgDataUri: PropTypes.any,
  fourthSectionScannerQrImgDataUri: PropTypes.any,
  fifthSectionTableImgDataUri: PropTypes.any,
  seventhSectionAreaClienteImgDataUri: PropTypes.any,
  eighthSectionLoginImgDataUri: PropTypes.any,
  twelvethSectionLoginImgDataUri: PropTypes.any,
  arrowImgDataUri: PropTypes.any,
  proposalData: PropTypes.any,
  type: PropTypes.string,
  callback: PropTypes.func,
  width: PropTypes.any,
  height: PropTypes.any,
}

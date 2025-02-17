import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import PropTypes from 'prop-types'
import {
  fifthChapterFirstSection,
  fifthChapterFourthSectionList,
  fifthChapterFourthSectionTitle,
  fifthChapterSecondSection,
  fifthChapterSecondSectionFirstSub,
  fifthChapterSecondSectionSecondSub,
  fifthChapterSecondSectionSecondSubTable,
  fifthChapterThirdSectionList,
  fifthChapterThirdSectionTitle,
} from './fifthChapter'
import {
  firstChapterFirstSectionList,
  firstChapterFirstSectionTitle,
  firstChapterImage,
  firstChapterText,
} from './firstChapter'
import firstPageLayout from './firstPageLayout'
import footer from './footer'
import {
  fourthChapter,
  fourthChapterFirstSectionObservation,
  fourthChapterFirstSectionProductsTable,
  fourthChapterFirstSectionTitle,
} from './fourthChapter'
import {
  secondChapterEighthSection,
  secondChapterEighthSectionTable,
  secondChapterFifthSection,
  secondChapterFistSection,
  secondChapterFourthSection,
  secondChapterSecondSection,
  secondChapterSecondSectionImg,
  secondChapterSeventhSectionFirstSection,
  secondChapterSeventhSectionFirstSectionImg,
  secondChapterSeventhSectionHeader,
  secondChapterSeventhSectionList,
  secondChapterSixthSection,
  secondChapterThirdSection,
  secondChapterThirdSectionFirstImg,
  secondChapterThirdSectionSecondImg,
} from './secondChapter'
import {
  secondPageLayoutContent,
  secondPageLayoutTitle,
} from './secondPageLayout'
import { signatureSection } from './signatureSection'
import { sixthChapter } from './sisxthChapter'
import {
  thirdChapterFirstSectionList,
  thirdChapterFirstSectionTitle,
  thirdChapterList,
  thirdChapterText,
} from './thirdChapter'

pdfMake.vfs = pdfFonts.pdfMake.vfs

export default function PdfMakeConfig({
  companyBackgroundImgDataUri,
  headerFooterImgBackgroundDataUri,
  firstChapterImgDataUri,
  secondChapterSecondSectionImgDataUri,
  secondChapterThirdSectionFirstImgDataUri,
  secondChapterThirdSectionSecondImgDataUri,
  secondChapterSeventhSectionFirstSectionImgDataUri,
  proposalData,
  type,
  callback,
  width,
  height,
}) {

  const docDefinition = {
    info: {
      title: 'Detalhe do negócio',
    },
    footer(page) {
      if (page !== 1) {
        return {
          ...footer,
        }
      }
      return false
    },
    background(currentPage) {
      if (currentPage === 1) {
        return [
          {
            image: companyBackgroundImgDataUri,
            width: 600,
          },
        ]
      }
      return [
        {
          image: headerFooterImgBackgroundDataUri,
          width: 594,
        },
      ]
    },
    pageMargins: [40, 40, 40, 80],
    content: [
      firstPageLayout(proposalData),
      secondPageLayoutTitle,
      secondPageLayoutContent(proposalData),
      firstChapterText,
      firstChapterImage(firstChapterImgDataUri),
      firstChapterFirstSectionTitle,
      firstChapterFirstSectionList,
      secondChapterFistSection,
      secondChapterSecondSection,
      secondChapterSecondSectionImg(secondChapterSecondSectionImgDataUri),
      secondChapterThirdSection,
      secondChapterThirdSectionFirstImg(
        secondChapterThirdSectionFirstImgDataUri,
      ),
      secondChapterThirdSectionSecondImg(
        secondChapterThirdSectionSecondImgDataUri,
      ),
      secondChapterFourthSection,
      secondChapterFifthSection,
      secondChapterSixthSection,
      secondChapterSeventhSectionHeader,
      secondChapterSeventhSectionList,
      secondChapterSeventhSectionFirstSection,
      secondChapterSeventhSectionFirstSectionImg(
        secondChapterSeventhSectionFirstSectionImgDataUri,
      ),
      secondChapterEighthSection,
      secondChapterEighthSectionTable,
      thirdChapterText,
      thirdChapterList(proposalData),
      thirdChapterFirstSectionTitle,
      thirdChapterFirstSectionList,
      fourthChapter,
      fourthChapterFirstSectionTitle,
      fourthChapterFirstSectionProductsTable(proposalData),
      // fourthChapterFirstSectionServicesTable(proposalData),
      fourthChapterFirstSectionObservation,
      fifthChapterFirstSection,
      fifthChapterSecondSection,
      fifthChapterSecondSectionFirstSub(proposalData),
      proposalData.proposalType === 1 &&
        fifthChapterSecondSectionSecondSubTable(proposalData),
      fifthChapterSecondSectionSecondSub(proposalData),
      fifthChapterThirdSectionTitle,
      fifthChapterThirdSectionList,
      fifthChapterFourthSectionTitle,
      fifthChapterFourthSectionList,
      sixthChapter,
      signatureSection(proposalData),
    ],
    styles: {
      header: {
        fontSize: 15,
        bold: true,
      },
      subheader: {
        fontSize: 14,
        bold: true,
      },
      subsubheader: {
        fontSize: 11,
        bold: true,
      },
    },

    // content: [productsAndServicesTable, signatureSection],
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
    pdfDocGenerator.getDataUrl(dataUrl => {
      const targetElement = document.querySelector('#proposalReport')
      const iframe = document.createElement('iframe')
      iframe.style.cssText = `position:absolute;width:${width};height:${height};`  
      iframe.src = dataUrl
      targetElement.appendChild(iframe)
    })
    return <div />
  }    
}

PdfMakeConfig.propTypes = {
  companyBackgroundImgDataUri: PropTypes.any,
  firstChapterImgDataUri: PropTypes.any,
  headerFooterImgBackgroundDataUri: PropTypes.any,
  proposalData: PropTypes.any,
  secondChapterSecondSectionImgDataUri: PropTypes.any,
  secondChapterSeventhSectionFirstSectionImgDataUri: PropTypes.any,
  secondChapterThirdSectionFirstImgDataUri: PropTypes.any,
  secondChapterThirdSectionSecondImgDataUri: PropTypes.any,
  type: PropTypes.string,
  callback: PropTypes.func,
  width: PropTypes.any,
  height: PropTypes.any,
}

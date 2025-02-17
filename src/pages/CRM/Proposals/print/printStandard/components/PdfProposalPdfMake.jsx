import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import PropTypes from 'prop-types'
import React from 'react'
import proposalConfiguration from './PdfProposalConfiguration'
import { proposalDetailTable, proposalDetailTitle } from './PdfProposalDetail'
import footer from './PdfProposalFooter'
import { companyHeaderInfo } from './PdfProposalHeaderInfo'
import { productsAndServicesTable, productsAndServicesTitle } from './PdfProposalProductsAndServicesBody'
import { productsAndServicesFooter } from './PdfProposalProductsAndServicesFooter'
import { signatureSection } from './PdfProposalSignatureSection'

pdfMake.vfs = pdfFonts.pdfMake.vfs

export default function PdfMakeTest({ companyLogo, gravittemLogo, proposal, type, callback, width, height }) {
  const docDefinition = {
    info: {
      title: 'Detalhe do negócio',
    },
    pageMargins: [40, 100, 40, 40],
    footer() {
      return footer(gravittemLogo)
    },
    header(currentPage, pageCount, pageSize) {
      // you can apply any logic and return any valid pdfmake element
      return companyHeaderInfo(companyLogo, proposal, currentPage, pageCount, pageSize)
    },

    content: [
      proposalDetailTitle(),
      proposalDetailTable(proposal),
      productsAndServicesTitle(),
      productsAndServicesTable(proposal),
      productsAndServicesFooter(proposal),
      proposalConfiguration(proposal.proposalConfiguration.title, proposal.proposalConfiguration.description),
      proposalConfiguration(proposal.proposalHeader.observation ? 'Anotações' : null, proposal.proposalHeader.observation),
      signatureSection,
    ],
    defaultStyle: {
      fontSize: 10,
    }
  }
  // download the PDF
  
  const pdfDocGenerator = pdfMake.createPdf(docDefinition)
  const iframeWidth = width || '95%'
  const iframeHeight = height || '90%'
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
        iframe.style.cssText = `position:absolute;width:${iframeWidth};height:${iframeHeight};`  
        iframe.src = dataUrl
        targetElement.appendChild(iframe)
      })
      return <div />
    } catch {}
  }   
  
}

PdfMakeTest.propTypes = {
  companyLogo: PropTypes.any,
  gravittemLogo: PropTypes.any,
  proposal: PropTypes.array,
  type: PropTypes.string, 
  callback: PropTypes.func, 
  width: PropTypes.number, 
  height: PropTypes.number, 
}

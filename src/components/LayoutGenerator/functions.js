/* eslint-disable no-template-curly-in-string */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/no-danger */
import { apiLayoutGenerator } from '@services/api'
import { handleAuthError, replaceAll, showApiNotifications } from '@utils'
import htmlToPdfmake from 'html-to-pdfmake'
import { message, Row, Col } from 'antd'
import React from 'react'

const pdfMake = require('pdfmake/build/pdfmake')
const pdfFonts = require('pdfmake/build/vfs_fonts')

pdfMake.vfs = pdfFonts.pdfMake.vfs

export async function getData(
  modelDocumentId,
  parameters,
  values,
  callback,
  setLoadingDocument,
) {
  try {
    const response = await apiLayoutGenerator({
      method: 'GET',
      url: `/api/Documento`,
      params: {
        modeloDocumentoId: modelDocumentId,
        parametros: parameters,
        valores: values,
      },
    })
    const { data } = response
    if (data.isOk) {
      callback && callback(data.documentoGerado, setLoadingDocument)
    } else {
      showApiNotifications(data)
      callback && callback(null, setLoadingDocument)
    }
  } catch (error) {
    handleAuthError(error)
  }
}

const replaceContentWithNewFormatting = content => {
  if (!content) {
    return null
  }
  let newContent = content
  // if flag border style none is defined, remove table borders
  newContent = newContent.replaceAll(
    'border="0"',
    'border="0" data-pdfmake="{&quot;layout&quot;:&quot;noBorders&quot;}"',
  )

  newContent = newContent.replaceAll(
    'margin-left: auto; margin-right: auto;',
    '',
  )

  // if flag isnt defined, dont remove table borderes
  newContent = newContent.replaceAll(
    'data-pdfmake="{&amp;quot;layout&amp;quot;:&amp;quot;noBorders&amp;quot;}"',
    '',
  )

  // remove links that represent server data
  newContent = newContent.replaceAll('<a href="editor#data">', '')
  // newContent = newContent.replaceAll(']</a>', ']')
  return newContent
}

const getHeaderFooter = (content, currentPage, pageCount, document, type) => {
  if (!content) {
    return null
  }
  let text = JSON.stringify(content)
  text = replaceAll(text, '${numPagina}', currentPage)
  text = replaceAll(text, '${totalPaginas}', pageCount)
  try {
    const body = JSON.parse(text)
    body[0].margin = getMargin(document, type)
    return body
  } catch {
    return null
  }
}

const getMargin = (document, type, height) => {
  const headerHeight = type === 1 ? height : 0
  const top =
    type === 1 || type === 2 ? document.margemSuperior + headerHeight : 0
  const bottom = type === 1 || type === 3 ? document.margemInferior : 0
  const left = document.margemEsquerda
  const right = document.margemDireita
  return [left, top, right, bottom]
}

export const getParameter = name => {
  const result =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get(name)
      : ''
  return result
}

export const PdfMakeConfig = ({
  documentContent,
  type,
  callback,
  height,
  width,
  newWindow,
}) => {
  const secoes = documentContent?.secoes || []
  const sectionsHtml =
    secoes
      .filter(x => x.tipo === 1)
      .map(section => section.html)
      .join('<h2 class="pdf-pagebreak-before"> <!-- my page break --></h2>') ||
    null

  const header = secoes.find(x => x.tipo === 2)
  const footer = secoes.find(x => x.tipo === 3)
  const headerHtml = replaceContentWithNewFormatting(header?.html)
  const footerHtml = replaceContentWithNewFormatting(footer?.html)

  const contentFormatted = replaceContentWithNewFormatting(sectionsHtml)
  const pdfMakeContent = htmlToPdfmake(contentFormatted, {
    tableAutoSize: true,
  })
  const headerContent = htmlToPdfmake(headerHtml, {
    tableAutoSize: true,
  })
  const footerContent = htmlToPdfmake(footerHtml, {
    tableAutoSize: true,
  })

  const docDefinition = {
    pageOrientation: documentContent.formatoPaisagem ? 'landscape' : 'portrait',
    content: !sectionsHtml ? null : pdfMakeContent,
    pageBreakBefore(currentNode) {
      return (
        currentNode.style &&
        currentNode.style.indexOf('pdf-pagebreak-before') > -1
      )
    },
    footer(currentPage, pageCount) {
      if (currentPage >= (footer?.paginaInicial || 1) && footerContent) {
        const footer = getHeaderFooter(
          footerContent,
          currentPage,
          pageCount,
          documentContent,
          3,
        )
        return footer || false
      }
      return false
    },
    header(currentPage, pageCount) {
      if (currentPage >= (header?.paginaInicial || 1) && headerContent) {
        const header = getHeaderFooter(
          headerContent,
          currentPage,
          pageCount,
          documentContent,
          2,
        )
        return header || false
      }
      return false
    },
    pageMargins: getMargin(documentContent, 1, header?.altura || 0), // [25, 90, 30, 45], //getMargin(documento, 1),
    info: {
      title: 'Documento',
    },
  }
  let pdfDocGenerator
  if (newWindow) {
    pdfDocGenerator = pdfMake.createPdf(docDefinition).open()
    return pdfDocGenerator
  }

  pdfDocGenerator = pdfMake.createPdf(docDefinition)
  const iframeWidth = width || '95%'
  const iframeHeight = height || '90%'

  if (type === 'download') {
    pdfDocGenerator.download()
    callback && callback()
  } else if (type === 'show') {
    try {
      pdfDocGenerator.getDataUrl(dataUrl => {
        const targetElement = document.querySelector('#pdfMakeReport')
        const iframe = document.createElement('iframe')
        iframe.style.cssText = `position:absolute;width:${iframeWidth};height:${iframeHeight};`
        iframe.src = dataUrl
        targetElement.appendChild(iframe)
      })
      callback && callback()
      return <div />
    } catch {
      message.error('Não foi possível criar a visualização do documento!')
    }
  } else if (type === 'blob') {
    pdfDocGenerator.getBlob(blob => {
      callback && callback(blob)
    })
  }

  return pdfDocGenerator
}

export const ShowHtml = ({ content, replaceFields }) => {
  const left = content?.margemEsquerda || 0
  const right = content?.margemDireita || 0
  const bottom = content?.margemInferior || 0
  const top = content?.margemSuperior || 0
  const header = content.secoes.find(x => x.tipo === 2)?.html
  const footer = content.secoes.find(x => x.tipo === 3)?.html
  const body = content.secoes
    .filter(x => x.tipo === 1)
    .map(d => d.html)
    .join('<br />')
  let html = header || ''
  html = html ? `${html}<br />${body}` : body
  html = !html ? footer || '' : footer ? `${html}<br />${footer}` : html
  if (!replaceFields) {
    html = replaceAll(html, '${numPagina}', '1')
    html = replaceAll(html, '${totalPaginas}', '1')
  }
  // html='<div style="background-color: yellow;">' + html + '</div>'
  return (
    <Row justify="center" className="w-full">
      <Col
        style={{
          borderStyle: 'solid',
          borderWidth: '2px',
          borderColor: '#ccc',
        }}
        className="py-8 px-20 bg-gray-300"
      >
        <div
          style={{
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: '#ccc',
            paddingLeft: `${left}px`,
            paddingRight: `${right}px`,
            paddingTop: `${top}px`,
            paddingBottom: `${bottom}px`,
            backgroundColor: 'white',
            width: '24cm',
          }}
        >
          <p
            className="mb-0"
            style={{ width: '21cm', overflowX: 'auto' }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </Col>
    </Row>
  )
}

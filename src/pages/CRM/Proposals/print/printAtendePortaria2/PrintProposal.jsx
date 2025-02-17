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
import { message, Modal, Row, Spin } from 'antd'
import image2base64 from '@utils/image-to-base64'
import { PropTypes } from 'prop-types'
import React, { useEffect, useState } from 'react'
import PdfMakeConfig from './components/pdfMakeConfig'

// ATENÇÃO: Se for feita alguma alteração aqui, deve-se alterar também o componente GenerateFilePrintProposal

export const PrintProposal = ({ proposalId, isModal, onClose }) => {
  const [proposalData, setProposalData] = useState(null)
  
  const [
    firstSectionLogoImgDataUri,
    setFirstSectionLogoImgDataUri,
  ] = useState('')

  const [
    firstSectionMapImgDataUri,
    setFirstSectionMapImgDataUri,
  ] = useState('')

  const [
    checkSymbolImgDataUri,
    setCheckSymbolImgDataUri,
  ] = useState('')

  const [
    abfLogoImgDataUri,
    setAbfLogoImgDataUri,
  ] = useState('')
  
  const [
    abeseLogoImgDataUri,
    setAbeseLogoImgDataUri,
  ] = useState('')

  const [
    secondSectionPilaresImgDataUri,
    setSecondSectionPilaresImgDataUri,
  ] = useState('')

  const [
    thirdSectionAtendeVilagioImgDataUri,
    setThirdSectionAtendeVilagioImgDataUri,
  ] = useState('')

  const [
    thirdSectionAtendePersonalizadoImgDataUri,
    setThirdSectionAtendePersonalizadoImgDataUri,
  ] = useState('')

  const [
    thirdSectionAtendeDiretoImgDataUri,
    setThirdSectionAtendeDiretoImgDataUri,
  ] = useState('')

  const [
    thirdSectionAtendeCorporativoImgDataUri,
    setThirdSectionAtendeCorporativoImgDataUri,
  ] = useState('')

  const [
    thirdSectionAtendeAcessoImgDataUri,
    setThirdSectionAtendeAcessoImgDataUri,
  ] = useState('')

  const [
    fourthSectionAppAtendeImgDataUri,
    setFourthSectionAppAtendeImgDataUri,
  ] = useState('')

  const [
    fourthSectionPortaCortinaImgDataUri,
    setFourthSectionPortaCortinaImgDataUri,
  ] = useState('')

  const [
    fourthSectionArmarioInteligenteImgDataUri,
    setFourthSectionArmarioInteligenteImgDataUri,
  ] = useState('')

  const [
    fourthSectionAtendeUsecarImgDataUri,
    setFourthSectionAtendeUsecarImgDataUri,
  ] = useState('')

  const [
    fourthSectionAtendeLprImgDataUri,
    setFourthSectionAtendeLprImgDataUri,
  ] = useState('')

  const [
    fourthSectionScannerQrImgDataUri,
    setFourthSectionScannerQrImgDataUri,
  ] = useState('')

  const [
    fifthSectionTableImgDataUri,
    setFifthSectionTableImgDataUri,
  ] = useState('')

  const [
    seventhSectionAreaClienteImgDataUri,
    setSeventhSectionAreaClienteImgDataUri,
  ] = useState('')

  const [
    eighthSectionLoginImgDataUri,
    setEighthSectionLoginImgDataUri,
  ] = useState('')

  const [
    arrowImgDataUri,
    setArrowImgDataUri,
  ] = useState('')

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getFirstSectionLogoDataUri = async () => {
      const result = await image2base64(firstSectionLogoImg)
      setFirstSectionLogoImgDataUri(`data:image/png;base64,${result}`)
    }

    const getFirstSectionMapDataUri = async () => {
      const result = await image2base64(firstSectionMapImg)
      setFirstSectionMapImgDataUri(`data:image/png;base64,${result}`)
    }

    const getCheckSymbolDataUri = async () => {
      const result = await image2base64(checkSymbolImg)
      setCheckSymbolImgDataUri(`data:image/png;base64,${result}`)
    }

    const getAbfLogoDataUri = async () => {
      const result = await image2base64(abfLogoImg)
      setAbfLogoImgDataUri(`data:image/png;base64,${result}`)
    }

    const getAbeseLogoDataUri = async () => {
      const result = await image2base64(abeseLogoImg)
      setAbeseLogoImgDataUri(`data:image/png;base64,${result}`)
    }

    const getSecondSectionPilaresDataUri = async () => {
      const result = await image2base64(secondSectionPilaresImg)
      setSecondSectionPilaresImgDataUri(`data:image/png;base64,${result}`)
    }

    const getThirdSectionAtendeVilagioDataUri = async () => {
      const result = await image2base64(thirdSectionAtendeVilagioImg)
      setThirdSectionAtendeVilagioImgDataUri(`data:image/png;base64,${result}`)
    }

    const getThirdSectionAtendePersonalizadoDataUri = async () => {
      const result = await image2base64(thirdSectionAtendePersonalizadoImg)
      setThirdSectionAtendePersonalizadoImgDataUri(`data:image/png;base64,${result}`)
    }

    const getThirdSectionAtendeDiretoDataUri = async () => {
      const result = await image2base64(thirdSectionAtendeDiretoImg)
      setThirdSectionAtendeDiretoImgDataUri(`data:image/png;base64,${result}`)
    }

    const getThirdSectionAtendeCorporativoDataUri = async () => {
      const result = await image2base64(thirdSectionAtendeCorporativoImg)
      setThirdSectionAtendeCorporativoImgDataUri(`data:image/png;base64,${result}`)
    }

    const getThirdSectionAtendeAcessoDataUri = async () => {
      const result = await image2base64(thirdSectionAtendeAcessoImg)
      setThirdSectionAtendeAcessoImgDataUri(`data:image/png;base64,${result}`)
    }

    const getFourthSectionAppAtendeDataUri = async () => {
      const result = await image2base64(fourthSectionAppAtendeImg)
      setFourthSectionAppAtendeImgDataUri(`data:image/png;base64,${result}`)
    }

    const getFourthSectionPortaCortinaDataUri = async () => {
      const result = await image2base64(fourthSectionPortaCortinaImg)
      setFourthSectionPortaCortinaImgDataUri(`data:image/png;base64,${result}`)
    }

    const getFourthSectionArmarioInteligenteDataUri = async () => {
      const result = await image2base64(fourthSectionArmarioInteligenteImg)
      setFourthSectionArmarioInteligenteImgDataUri(`data:image/png;base64,${result}`)
    }

    const getFourthSectionAtendeUsecarDataUri = async () => {
      const result = await image2base64(fourthSectionAtendeUsecarImg)
      setFourthSectionAtendeUsecarImgDataUri(`data:image/png;base64,${result}`)
    }

    const getFourthSectionAtendeLprDataUri = async () => {
      const result = await image2base64(fourthSectionAtendeLprImg)
      setFourthSectionAtendeLprImgDataUri(`data:image/png;base64,${result}`)
    }

    const getFourthSectionScannerQrDataUri = async () => {
      const result = await image2base64(fourthSectionScannerQrImg)
      setFourthSectionScannerQrImgDataUri(`data:image/png;base64,${result}`)
    }

    const getFifthSectionTableDataUri = async () => {
      const result = await image2base64(fifthSectionTableImg)
      setFifthSectionTableImgDataUri(`data:image/png;base64,${result}`)
    }

    const getSeventhSectionAreaClienteDataUri = async () => {
      const result = await image2base64(seventhSectionAreaClienteImg)
      setSeventhSectionAreaClienteImgDataUri(`data:image/png;base64,${result}`)
    }

    const getEighthSectionLoginDataUri = async () => {
      const result = await image2base64(eighthSectionLoginImg)
      setEighthSectionLoginImgDataUri(`data:image/png;base64,${result}`)
    }

    const getArrowDataUri = async () => {
      const result = await image2base64(arrowImg)
      setArrowImgDataUri(`data:image/png;base64,${result}`)
    }

    getData()
    getFirstSectionLogoDataUri()
    getFirstSectionMapDataUri()
    getCheckSymbolDataUri()
    getAbfLogoDataUri()
    getAbeseLogoDataUri()
    getSecondSectionPilaresDataUri()
    getThirdSectionAtendeVilagioDataUri()
    getThirdSectionAtendePersonalizadoDataUri()
    getThirdSectionAtendeDiretoDataUri()
    getThirdSectionAtendeCorporativoDataUri()
    getThirdSectionAtendeAcessoDataUri()
    getFourthSectionAppAtendeDataUri()
    getFourthSectionPortaCortinaDataUri()
    getFourthSectionArmarioInteligenteDataUri()
    getFourthSectionAtendeUsecarDataUri()
    getFourthSectionAtendeLprDataUri()
    getFourthSectionScannerQrDataUri()
    getFifthSectionTableDataUri()
    getSeventhSectionAreaClienteDataUri()
    getEighthSectionLoginDataUri()
    getArrowDataUri()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  useEffect(() => {
    if (
      firstSectionLogoImgDataUri.length > 0 &&
      firstSectionMapImgDataUri.length > 0 &&
      checkSymbolImgDataUri.length > 0 &&
      abfLogoImgDataUri.length > 0 &&
      abeseLogoImgDataUri.length > 0 &&
      secondSectionPilaresImgDataUri.length > 0 &&
      thirdSectionAtendeVilagioImgDataUri.length > 0 &&
      thirdSectionAtendePersonalizadoImgDataUri.length > 0 &&
      thirdSectionAtendeDiretoImgDataUri.length > 0 &&
      thirdSectionAtendeCorporativoImgDataUri.length > 0 &&
      thirdSectionAtendeAcessoImgDataUri.length > 0 &&
      fourthSectionAppAtendeImgDataUri.length > 0 &&
      fourthSectionPortaCortinaImgDataUri.length > 0 &&
      fourthSectionArmarioInteligenteImgDataUri.length > 0 &&
      fourthSectionAtendeUsecarImgDataUri.length > 0 &&
      fourthSectionAtendeLprImgDataUri.length > 0 &&
      fourthSectionScannerQrImgDataUri.length > 0 &&
      fifthSectionTableImgDataUri.length > 0 &&
      seventhSectionAreaClienteImgDataUri.length > 0 &&
      eighthSectionLoginImgDataUri.length > 0 &&
      arrowImgDataUri.length > 0 &&
      proposalData !== null
    ) {
      setLoading(false)
    }
  }, [
    firstSectionLogoImgDataUri.length,
    firstSectionMapImgDataUri.length,
    checkSymbolImgDataUri.length,
    abfLogoImgDataUri.length,
    abeseLogoImgDataUri.length,
    secondSectionPilaresImgDataUri.length,
    thirdSectionAtendeVilagioImgDataUri.length,
    thirdSectionAtendePersonalizadoImgDataUri.length,
    thirdSectionAtendeDiretoImgDataUri.length,
    thirdSectionAtendeCorporativoImgDataUri.length,
    thirdSectionAtendeAcessoImgDataUri.length,
    fourthSectionAppAtendeImgDataUri.length,
    fourthSectionPortaCortinaImgDataUri.length,
    fourthSectionArmarioInteligenteImgDataUri.length,
    fourthSectionAtendeUsecarImgDataUri.length,
    fourthSectionAtendeLprImgDataUri.length,
    fourthSectionScannerQrImgDataUri.length,
    fifthSectionTableImgDataUri.length,
    seventhSectionAreaClienteImgDataUri.length,
    eighthSectionLoginImgDataUri.length,
    arrowImgDataUri.length,
    proposalData,
  ])

  async function getData() {
    setLoading(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/ProposalPrintEspecific`,
        params: { proposalId },
      })

      const { data } = response

      if (data.isOk) {
        if (data.proposal.proposalId === 0) {
          Modal.error({
            title: `Negócio não encontrado!`,
            onOk: () => {
              onClose()
            },
          })
        } else {
          setProposalData(data.proposal)
        }
      } else {
        message.error(data.message)
        onClose()
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  const goProposal = e => {
    e.preventDefault()
    onClose()
  }

  return loading ? (
    <Spin
      size="large"
      className="relative"
      style={{ left: '50%', marginTop: '10%' }}
    />
  ) : (
    <div className={!isModal ? "container" : ""}>
      {!isModal && (
        <Row className="mb-5">
          <span
            style={{
              color: '#1976D2',
              cursor: 'pointer',
            }}
            onClick={e => goProposal(e)}
            role="button"
          >
            Detalhes do negócio
          </span>
          <i className="mx-3 fa fa-angle-right" />
          Impressão do negócio
        </Row>
      )}
      <div id="proposalReport" className={!isModal ? "mt-5" : ""} style={{ minHeight: isModal ? '1000px' : ''}}>
        <PdfMakeConfig
          {...
            {
              proposalData,
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
            }
          }  
          width={isModal ? "94%" : "95%"}
          height={isModal ? '73%' : '88%'}
        />
      </div>
    </div>
  )
}

PrintProposal.propTypes = {
  proposalId: PropTypes.number,
  isModal: PropTypes.bool,
  onClose: PropTypes.func,
}


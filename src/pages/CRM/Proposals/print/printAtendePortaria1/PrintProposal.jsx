import companyBackgroundImg from '@assets/images/print/atendePortaria/bg-min.png'
import firstChapterImg from '@assets/images/print/atendePortaria/cap-1.jpg'
import secondChapterSecondSectionImg from '@assets/images/print/atendePortaria/cap-2-secao-2.png'
import secondChapterThirdSectionFirstImg from '@assets/images/print/atendePortaria/cap-2-secao-3-1.jpg'
import secondChapterThirdSectionSecondImg from '@assets/images/print/atendePortaria/cap-2-secao-3-2.png'
import secondChapterSeventhSectionFirstSectionImg from '@assets/images/print/atendePortaria/cap-2-secao-7.jpg'
import headerFooterImgBackgroundImg from '@assets/images/print/atendePortaria/rodape-cabecalho-min.png'
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
    companyBackgroundImgDataUri,
    setCompanyBackgroundImgDataUri,
  ] = useState('')
  const [
    headerFooterImgBackgroundDataUri,
    setHeaderFooterImgBackgroundDataUri,
  ] = useState('')
  const [firstChapterImgDataUri, setFirstChapterImgDataUri] = useState('')
  const [
    secondChapterSecondSectionImgDataUri,
    setSecondChapterSecondSectionImgDataUri,
  ] = useState('')
  const [
    secondChapterThirdSectionFirstImgDataUri,
    setSecondChapterThirdSectionFirstImgDataUri,
  ] = useState('')
  const [
    secondChapterThirdSectionSecondImgDataUri,
    setSecondChapterThirdSectionSecondImgDataUri,
  ] = useState('')
  const [
    secondChapterSeventhSectionFirstSectionImgDataUri,
    setSecondChapterSeventhSectionFirstSectionImgDataUri,
  ] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getCompanyBackgroundDataUri = async () => {
      const result = await image2base64(companyBackgroundImg)
      setCompanyBackgroundImgDataUri(`data:image/png;base64,${result}`)
    }
    const getHeaderFooterImgBackgroundDataUri = async () => {
      const result = await image2base64(headerFooterImgBackgroundImg)
      setHeaderFooterImgBackgroundDataUri(`data:image/png;base64,${result}`)
    }
    const getFirstChapterImgDataUri = async () => {
      const result = await image2base64(firstChapterImg)
      setFirstChapterImgDataUri(`data:image/png;base64,${result}`)
    }
    const getSecondChapterSecondSectionImgDataUri = async () => {
      const result = await image2base64(secondChapterSecondSectionImg)
      setSecondChapterSecondSectionImgDataUri(`data:image/png;base64,${result}`)
    }
    const getSecondChapterThirdSectionFirstImgDataUri = async () => {
      const result = await image2base64(secondChapterThirdSectionFirstImg)
      setSecondChapterThirdSectionFirstImgDataUri(
        `data:image/png;base64,${result}`,
      )
    }
    const getSecondChapterThirdSectionSecondImgDataUri = async () => {
      const result = await image2base64(secondChapterThirdSectionSecondImg)
      setSecondChapterThirdSectionSecondImgDataUri(
        `data:image/png;base64,${result}`,
      )
    }
    const getSecondChapterSeventhSectionFirstSectionImgDataUri = async () => {
      const result = await image2base64(
        secondChapterSeventhSectionFirstSectionImg,
      )
      setSecondChapterSeventhSectionFirstSectionImgDataUri(
        `data:image/png;base64,${result}`,
      )
    }

    getData()
    getCompanyBackgroundDataUri()
    getHeaderFooterImgBackgroundDataUri()
    getFirstChapterImgDataUri()
    getSecondChapterSecondSectionImgDataUri()
    getSecondChapterThirdSectionFirstImgDataUri()
    getSecondChapterThirdSectionSecondImgDataUri()
    getSecondChapterSeventhSectionFirstSectionImgDataUri()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (
      companyBackgroundImgDataUri.length > 0 &&
      headerFooterImgBackgroundDataUri.length > 0 &&
      firstChapterImgDataUri.length > 0 &&
      secondChapterSecondSectionImgDataUri.length > 0 &&
      secondChapterThirdSectionFirstImgDataUri.length > 0 &&
      secondChapterThirdSectionSecondImgDataUri.length > 0 &&
      secondChapterSeventhSectionFirstSectionImgDataUri.length > 0 &&
      proposalData !== null
    ) {
      setLoading(false)
    }
  }, [
    companyBackgroundImgDataUri.length,
    firstChapterImgDataUri.length,
    headerFooterImgBackgroundDataUri.length,
    proposalData,
    secondChapterSecondSectionImgDataUri.length,
    secondChapterSeventhSectionFirstSectionImgDataUri.length,
    secondChapterThirdSectionFirstImgDataUri.length,
    secondChapterThirdSectionSecondImgDataUri.length,
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
            onClick={e => onClose()}
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
          companyBackgroundImgDataUri={companyBackgroundImgDataUri}
          headerFooterImgBackgroundDataUri={headerFooterImgBackgroundDataUri}
          firstChapterImgDataUri={firstChapterImgDataUri}
          proposalData={proposalData}
          secondChapterSecondSectionImgDataUri={secondChapterSecondSectionImgDataUri}
          secondChapterThirdSectionFirstImgDataUri={secondChapterThirdSectionFirstImgDataUri}
          secondChapterThirdSectionSecondImgDataUri={secondChapterThirdSectionSecondImgDataUri}
          secondChapterSeventhSectionFirstSectionImgDataUri={secondChapterSeventhSectionFirstSectionImgDataUri}
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


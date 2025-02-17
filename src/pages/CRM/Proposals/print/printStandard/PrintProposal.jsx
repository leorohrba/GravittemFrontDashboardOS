import gravittemLogo from '@assets/images/favicon/gravittem1.jpg'
import { apiCRM, apiAttachment } from '@services/api'
import { handleAuthError } from '@utils'
import { message, Modal, Row, Spin } from 'antd'
import image2base64 from '@utils/image-to-base64'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import PdfProposalPdfMake from './components/PdfProposalPdfMake'

export function PrintProposal({ proposalId, onClose, isModal }) {
  const [proposal, setProposal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [companyImgDataUri, setCompanyImgDataUri] = useState('')
  const [gravittemLogoUri, setGravittemLogoUri] = useState('')

  useEffect(() => {
    getGravittemLogoUri(gravittemLogo)
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // configurando imagem

  useEffect(() => {
    getLogo()
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [proposal])

  async function getLogo() {
    if (proposal) {
      try {
        const response = await apiAttachment({
          method: 'GET',
          url: `/api/anexo/logo`,
          params: { ownerId: proposal.mainOwnerId, tipo: 2 },
        })
        const { data } = response
        setCompanyImgDataUri(`data:image/png;base64,${data}`)
      } catch (error) {
        getCompanyImgDataUri(require(`@assets/images/companyLogo/emptyLogo.png`))
      }      
    }
  }
  
  useEffect(() => {
    if (companyImgDataUri.length > 0) {
      setLoading(false)
    }
  }, [companyImgDataUri])

  const getCompanyImgDataUri = async companyLogo => {
    const result = await image2base64(companyLogo)
    setCompanyImgDataUri(`data:image/png;base64,${result}`)
  }

  const getGravittemLogoUri = async gravittemLogo => {
    const result = await image2base64(gravittemLogo)
    setGravittemLogoUri(`data:image/png;base64,${result}`)
  }

  async function getData() {
    setLoading(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/proposalDataPrint`,
        params: { proposalId },
      })

      const { data } = response

      if (data.isOk) {
        if (data.proposal.length === 0) {
          Modal.error({
            title: `Negócio não encontrado!`,
            onOk: () => {
              onClose()
            },
          })
        } else {
          setProposal(data.proposal[0])
        }
      } else {
        message.error(data.message)
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
        <PdfProposalPdfMake
          companyLogo={companyImgDataUri}
          gravittemLogo={gravittemLogoUri}
          proposal={proposal}
          width={isModal ? "94%" : "95%"}
          height={isModal ? '73%' : '90%'}
        />
      </div>
    </div>
  )
}

PrintProposal.propTypes = {
  proposalId: PropTypes.number,
  onClose: PropTypes.func,
  isModal: PropTypes.bool,
}

import React from 'react'
import { Modal } from 'antd'
import PropTypes from 'prop-types'
import Link from 'antd/lib/typography/Link'
import { handleLogin } from '../../../../../../components/modals/WhatsAppModal/components/LoginUtils'

function QrCodeModal({ visible, qrCode, setQrCode, setShowQrCode, onClose }) {
  return (
    <React.Fragment>
      <Modal open={visible} footer={null} onCancel={onClose}>
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p>
            Para enviar mensagens é necessário vincular o seu número do WhatsApp
          </p>
          <p>
            Já com o aplicativo aberto na aba de vinculação, escaneie o QR Code
            abaixo
          </p>
          <p>
            Caso tenha problema com o QR Code,{' '}
            <Link onClick={() => handleLogin(setQrCode, setShowQrCode)}>
              clique aqui para gerar outro
            </Link>
          </p>
          <img
            src={
              qrCode?.includes('data') || qrCode?.includes('http')
                ? qrCode
                : `data:image/png;base64,${qrCode}`
            }
            alt="QR Code"
            style={{ width: '50%' }}
          />
        </div>
      </Modal>
    </React.Fragment>
  )
}

QrCodeModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  qrCode: PropTypes.string,
  onClose: PropTypes.func.isRequired,
}

export default QrCodeModal

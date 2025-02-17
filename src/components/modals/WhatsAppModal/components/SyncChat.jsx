import React, { useState, useEffect } from 'react'
import { handleAuthError } from '@utils'
import { message, Button, Row, Col, DatePicker, Modal } from 'antd'
import { handleLogin } from './LoginUtils'
import moment from 'moment'
import { getChat } from './Service'
import Link from 'antd/lib/typography/Link'

const SyncChat = ({
  isModalOpen,
  setIsModalOpen,
  getChats,
  entityId,
  person,
  tableName,
}) => {
  const [showQrCode, setShowQrCode] = useState(false)
  const [qrCode, setQrCode] = useState()
  const [loading, setLoading] = useState(false)
  const [startDateError, setStartDateError] = useState('')
  const [startDate, setStartDate] = useState('')

  useEffect(() => {
    if (qrCode && !showQrCode) handleLogin(setQrCode, setShowQrCode)
  }, [qrCode])

  const handleOk = async () => {
    if (startDate === '') {
      setStartDateError('Campo obrigatório')
      return
    }

    if (!moment(startDate).isValid()) {
      setStartDateError('Data inválida')
      return
    }

    try {
      setLoading(true)
      const response = await getChat(startDate, person, entityId, tableName)

      if (
        !response.data.isOk &&
        response.data.notificacoes[0].propriedade === 'Conta'
      ) {
        await handleLogin(setQrCode, setShowQrCode, false)
        setLoading(false)
        return
      }
      if (!response.data.isOk && response.data.notificacoes[0]) {
        message.error(response.data.notificacoes[0].mensagem)
      }
      if (response.data.isOk && getChats) {
        await getChats()
      }
      if (response.data.isOk) {
        message.success('Conversa sincronizada com sucesso')
      }
    } catch (error) {
      handleAuthError(error)
    }
    setLoading(false)
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onStartDateChange = value => {
    setStartDateError()
    setStartDate(value)
  }

  return (
    <>
      <Modal
        centered
        title="Sincronizar WhatsApp"
        width={showQrCode && qrCode ? 500 : 260}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between	',
            }}
          >
            <Button
              shape="round"
              key="ok"
              type="primary"
              style={{
                backgroundColor: '#4CAF50',
                borderColor: 'green',
                borderRadius: '4px',
              }}
              onClick={handleOk}
              loading={loading}
            >
              Sincronizar
            </Button>
            <Button
              key="cancel"
              shape="round"
              style={{ borderRadius: '4px' }}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </div>
        }
      >
        <Row justify="center">
          <Col>
            <div>Data inicial</div>
            <DatePicker
              style={{ width: '100%' }}
              placeholder="DD/MM/AAAA"
              format="DD/MM/YYYY"
              value={startDate}
              onChange={onStartDateChange}
            />
            {startDateError && (
              <div style={{ color: 'red' }}>{startDateError}</div>
            )}
          </Col>
        </Row>
        {showQrCode && qrCode && (
          <div>
            <div style={{ textAlign: 'center' }}>
              <p>
                Para sincronizar as conversas é necessário vincular o seu número
                do WhatsApp
              </p>
              <p>
                Já com o aplicativo aberto na aba de vinculação, escaneie o QR
                Code abaixo
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
          </div>
        )}
      </Modal>
    </>
  )
}

export default SyncChat

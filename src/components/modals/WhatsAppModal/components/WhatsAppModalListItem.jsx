/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Spin, Timeline, Button, Tooltip, Collapse, Input } from 'antd'
import {
  MoreOutlined,
  SearchOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'
import moment from 'moment'
import Message from './Message'
import { getMessages } from './Service'

const { Panel } = Collapse

export default function WhatsAppModalListItem({ chat }) {
  const [showMessages, setShowMessages] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [search, setSearch] = useState('')
  const [messages, setMessages] = useState([])
  const [filteredMessages, setFilteredMessages] = useState(messages)

  const getMessagesAsync = async () => {
    const response = await getMessages(chat)
    setMessages(response)
    setFilteredMessages(response)
  }

  useEffect(() => {
    if (showMessages) {
      getMessagesAsync()
    }
  }, [showMessages])

  useEffect(() => {
    if (search.length > 0) {
      setFilteredMessages(() => {
        const newMessages = [...messages]
        const filtered = [
          ...newMessages.filter(message =>
            message.texto?.toLowerCase().includes(search.toLowerCase()),
          ),
        ]
        return filtered
      })
    } else {
      setFilteredMessages(messages)
    }
  }, [search])

  return (
    <Timeline.Item color="gray">
      <div>
        <div>
          <span style={{ fontSize: '12px', color: 'gray' }}>
            {moment(chat.data).format('DD MMMM, HH:mm')}
          </span>
          <Collapse
            expandIcon={() => <MoreOutlined />}
            expandIconPosition="end"
            value={showMessages}
            onChange={() => setShowMessages(!showMessages)}
            style={{ marginTop: '7px' }}
          >
            <Panel
              // header={(`Mensagens de ${new Date(messages[0].timestamp * 1000).toLocaleString('pt-BR')} a ${new Date(messages[messages.length - 1].timestamp * 1000).toLocaleString('pt-BR')}`)}
              header={
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {/* Title and subtitle */}
                  <div
                    style={{
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <WhatsAppOutlined style={{ marginRight: '5px' }} />
                    <span>Conversa no WhatsApp sincronizada</span>
                    <span style={{ color: 'gray', marginLeft: '5px' }}>
                      - De {chat.nomeDestinatario}
                    </span>
                  </div>

                  {/* Search and tooltip section */}
                  <div style={{ display: 'flex' }}>
                    {showInput && (
                      <Input
                        onClick={e => e.stopPropagation()}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                      />
                    )}
                    <Tooltip title="Buscar mensagem">
                      <Button
                        onClick={e => {
                          e.stopPropagation()
                          setShowInput(showInput => !showInput)
                        }}
                        type="text"
                        shape="circle"
                        icon={<SearchOutlined />}
                      />
                    </Tooltip>
                  </div>
                </div>
              }
              key="1"
            >
              <div
                style={{
                  maxHeight: '300px' /* Adjust the height as needed */,
                  overflowY: 'auto',
                  width: '100%',
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column-reverse', // This is the key to reverse the order visually
                }}
              >
                {messages.length === 0 ? (
                  <Spin size="small" />
                ) : (
                  filteredMessages.map(message => (
                    <Message
                      key={message.id}
                      message={message}
                      fromMe={message.fromMe}
                    />
                  ))
                )}
              </div>
            </Panel>
          </Collapse>
        </div>
      </div>
    </Timeline.Item>
  )
}

import React from 'react'
import { Card, Row, Col, ConfigProvider, Space } from 'antd'
import {
  FileImageOutlined,
  AudioOutlined,
  FilePdfOutlined,
  LinkOutlined,
  YoutubeOutlined,
} from '@ant-design/icons'
import moment from 'moment'

const Message = ({ message }) => {
  return (
    <Row>
      {message.enviadaPorMim ? (
        <Col span={8}>
          <></>
        </Col>
      ) : null}
      <Col span={16}>
        <Row
          className="mb-5"
          justify={message.enviadaPorMim ? 'end' : 'start'}
          align="center"
        >
          <ConfigProvider
            theme={{
              components: {
                Card: {
                  paddingLG: 20,
                },
              },
            }}
          >
            <Space
              direction="vertical"
              className={message.enviadaPorMim ? '' : 'mr-auto'}
              align={message.enviadaPorMim ? 'end' : 'start'}
            >
              <p
                className={`text-gray-400 ${
                  message.enviadaPorMim ? '' : 'mr-auto'
                } mb-0`}
              >
                {!message.enviadaPorMim && (
                  <span className="inline-block w-6 h-6 rounded-full bg-blue-600 text-white text-center leading-6 mr-2 text-sm">
                    {message.remetente.charAt(0)}
                  </span>
                )}
                {message.remetente}{' '}
                {moment(message.dataHora).format('DD/MM/YYYY HH:mm')}
                {message.enviadaPorMim && (
                  <span className="inline-block w-6 h-6 rounded-full bg-blue-600 text-white text-center leading-6 ml-2 text-sm">
                    {message.remetente.charAt(0)}
                  </span>
                )}
              </p>
              <Card
                size="small"
                bordered={false}
                className={`${
                  message.enviadaPorMim
                    ? 'bg-blue-100 mr-8 text-start'
                    : 'bg-gray-100 ml-8 mr-auto text-start'
                } w-fit max-w-[90%] p-1`}
              >
                <p className="text-base m-0">
                  {message.mimetype ? (
                    message.mimetype.includes('https://youtu.be/') ? (
                      <div className="gap-2 flex justify-center">
                        <YoutubeOutlined className="text-xl" /> Link do YouTube
                      </div>
                    ) : message.mimetype.includes('http') ? (
                      <div className="gap-2 flex justify-center">
                        <LinkOutlined className="text-xl" /> Link
                      </div>
                    ) : message.mimetype.includes('audio') ? (
                      <div className="gap-2 flex justify-center">
                        <AudioOutlined className="text-xl" /> Audio
                      </div>
                    ) : message.mimetype.includes('pdf') ? (
                      <div className="gap-2 flex justify-center">
                        <FilePdfOutlined className="text-xl" /> File
                      </div>
                    ) : message.mimetype.includes('image') ? (
                      <div className="gap-2 flex justify-center">
                        <FileImageOutlined className="text-xl" /> Image
                      </div>
                    ) : null
                  ) : (
                    message.texto
                  )}
                </p>
              </Card>
            </Space>
          </ConfigProvider>
        </Row>
      </Col>
      {message.enviadaPorMim ? null : (
        <Col span={8}>
          <></>
        </Col>
      )}
    </Row>
  )
}

export default Message

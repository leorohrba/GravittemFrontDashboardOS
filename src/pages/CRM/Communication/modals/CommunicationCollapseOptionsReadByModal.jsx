import checkAllBlue from '@assets/icons/check-all-blue.png'
import checkAllGrey from '@assets/icons/check-all-grey.png'
import Button from '@components/Button'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Avatar, message, Modal, Skeleton, Spin } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

export default function CommunicationCollapseOptionsReadByModal({
  toogleModalVisible,
  modalVisible,
  communicationId,
}) {
  const [loading, setLoading] = useState(false)
  const [communicationReads, setCommunicationReads] = useState([])

  useEffect(() => {
    if (modalVisible) {
      getCommunicationReads()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible])

  async function getCommunicationReads() {
    setLoading(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/communicationReads`,
        params: { communicationId },
      })

      const { data } = response
      setLoading(false)

      if (data.isOk) {
        setCommunicationReads(data.communicationReads)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  const mapCommunicationReads = () => {
    const communicationLength = communicationReads.length
    const mappedItems = communicationReads.map((comm, index) => {
      const firstFranchiseNameLetter = comm.franchiseShortName
        ? comm.franchiseShortName[0].toUpperCase()
        : '?'
      return (
        <React.Fragment>
          <div className="flex flex-wrap my-5 px-5" key={comm.communicationId}>
            <Avatar
              size={50}
              style={{
                backgroundColor: '#1976d2',
              }}
            >
              {firstFranchiseNameLetter}
            </Avatar>
            <h3 className="ml-5">{comm.franchiseShortName}</h3>
            {comm.userName && (
              <h3 className="font-normal ml-1">{`- ${comm.userName}`}</h3>
            )}
            <h3
              className="font-normal ml-1"
              style={{
                position: 'absolute',
                marginTop: '25px',
                marginLeft: '70px',
                color: 'grey',
              }}
            >
              {comm.readDate
                ? `Lido em ${moment(comm.readDate).format('ll')}, ${moment(
                    comm.readDate,
                  ).format('LT')}`
                : 'Não lido'}
            </h3>
            <img
              src={comm.readDate ? checkAllBlue : checkAllGrey}
              alt="double-check-grey"
              style={{
                position: 'absolute',
                height: '35px',
                right: '20px',
                marginTop: '5px',
              }}
            />
          </div>
          {communicationLength !== index + 1 && <hr />}
        </React.Fragment>
      )
    })
    return mappedItems
  }
  return (
    <Modal
      onCancel={event => {
        event.stopPropagation()
        toogleModalVisible()
      }}
      bodyStyle={{ padding: 0 }}
      visible={modalVisible}
      width="500px"
      title={`Comunicado ${communicationId} lido por`}
      footer={
        <Button
          type="secondary"
          onClick={event => {
            event.stopPropagation()
            toogleModalVisible()
          }}
        >
          Voltar
        </Button>
      }
    >
      <Spin size="large" spinning={loading}>
        <Skeleton loading={loading} paragraph={{ rows: 8 }} active>
          {mapCommunicationReads()}
        </Skeleton>
      </Spin>
    </Modal>
  )
}

CommunicationCollapseOptionsReadByModal.propTypes = {
  modalVisible: PropTypes.bool,
  toogleModalVisible: PropTypes.func,
  communicationId: PropTypes.number,
}

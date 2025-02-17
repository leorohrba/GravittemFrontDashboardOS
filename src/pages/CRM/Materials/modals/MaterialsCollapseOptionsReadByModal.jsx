import checkAllBlue from '@assets/icons/check-all-blue.png'
import checkAllGrey from '@assets/icons/check-all-grey.png'
import Button from '@components/Button'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Avatar, message, Modal, Skeleton, Spin } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

export default function MaterialsCollapseOptionsReadByModal({
  toogleModalVisible,
  modalVisible,
  libraryId,
}) {
  const [loading, setLoading] = useState(false)
  const [libraryReads, setLibraryReads] = useState([])

  useEffect(() => {
    if (modalVisible) {
      getLibraryReads()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible])

  async function getLibraryReads() {
    setLoading(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/libraryReads`,
        params: { libraryId },
      })

      const { data } = response
      setLoading(false)

      if (data.isOk) {
        setLibraryReads(data.libraryReads)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  const mapLibraryReads = () => {
    const libraryLength = libraryReads.length
    const mappedItems = libraryReads.map((comm, index) => {
      const firstFranchiseNameLetter = comm.franchiseShortName
        ? comm.franchiseShortName[0].toUpperCase()
        : '?'
      return (
        <React.Fragment>
          <div className="flex flex-wrap my-5 px-5" key={comm.libraryId}>
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
          {libraryLength !== index + 1 && <hr />}
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
      title={`Material ${libraryId} lido por`}
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
          {mapLibraryReads()}
        </Skeleton>
      </Spin>
    </Modal>
  )
}

MaterialsCollapseOptionsReadByModal.propTypes = {
  modalVisible: PropTypes.bool,
  toogleModalVisible: PropTypes.func,
  libraryId: PropTypes.number,
}

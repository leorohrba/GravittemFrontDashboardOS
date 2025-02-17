import { apiCRM } from '@services/api'
import { Modal, Skeleton, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import LeftBarParcelsModalTable from './LeftBarParcelsModalTable'

function LeftBarParcelsModal({
  form,
  paymentConditions,
  paymentConditionId,
  showProposalParcel,
  setShowProposalParcel,
  proposalId,
}) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({})
  const [keyTable, setKeyTable] = useState(0)
  useEffect(() => {
    setLoading(true)
    const getProposalParcel = async () => {
      const response = await apiCRM.get(`/api/ProposalParcel/${proposalId}`)
      setData(response.data)
      setLoading(false)
    }
    showProposalParcel && getProposalParcel()
  }, [proposalId, showProposalParcel])

  const handleChangeData = newData => {
    setData(newData)
    setKeyTable(keyTable + 1)
  }

  return (
    <Modal
      visible={showProposalParcel}
      title="Parcelas"
      width={data?.parcels?.find(x => x.interest > 0) ? '60%' : '38%'}
      footer={null}
      bodyStyle={{ padding: 0 }}
      destroyOnClose
      onCancel={() => setShowProposalParcel(false)}
    >
      <Spin size="large" spinning={loading}>
        <Skeleton loading={loading} paragraph={{ rows: 10 }} active>
          <LeftBarParcelsModalTable
            onChange={handleChangeData}
            key={keyTable}
            {...{
              paymentConditions,
              paymentConditionId,
              setShowProposalParcel,
              proposalId,
              data,
            }}
          />
        </Skeleton>
      </Spin>
    </Modal>
  )
}

LeftBarParcelsModal.propTypes = {
  form: PropTypes.object,
  proposalId: PropTypes.number,
  setShowProposalParcel: PropTypes.func,
  showProposalParcel: PropTypes.bool,
}

export default LeftBarParcelsModal

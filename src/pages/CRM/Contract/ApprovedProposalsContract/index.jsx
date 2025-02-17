/**
 * breadcrumb: Gerar contratos de propostas aprovadas
 */
import React, { useState } from 'react'
import {
  ApprovedProposalsContractHeader,
  ApprovedProposalsContractTable,
} from './components'
import {
  ApprovedProposalsContractProvider,
  useApprovedProposalsContractContext,
} from './context/ApprovedProposalsContract'
import { withWrapper } from 'with-wrapper'
import { Spin } from 'antd'
import GenerateContract from './GenerateContract'
import { hasPermission, NoVisualize } from '@utils'

function ApprovedProposalsContract() {
  const {
    loading,
    startSearch,
    userPermissions,
  } = useApprovedProposalsContractContext()

  const [ids, setIds] = useState(null)
  const [screen, setScreen] = useState('Grid')
  const [totalRecurrenceValue, setTotalRecurrenceValue] = useState(0)

  const handleEdit = ids => {
    setIds(ids)
    setScreen('Edit')
  }

  const handleClose = () => {
    setScreen('Grid')
    startSearch()
  }

  return hasPermission(userPermissions, 'Visualize') ? (
    <React.Fragment>
      {screen === 'Grid' && (
        <div className="container">
          <Spin size="large" spinning={loading}>
            <ApprovedProposalsContractHeader />
            <ApprovedProposalsContractTable
              handleEdit={handleEdit}
              setTotalRecurrenceValue={setTotalRecurrenceValue}
            />
          </Spin>
        </div>
      )}
      {screen === 'Edit' && (
        <GenerateContract
          ids={ids}
          onClose={handleClose}
          totalRecurrenceValue={totalRecurrenceValue}
        />
      )}
    </React.Fragment>
  ) : (
    <NoVisualize userPermissions={userPermissions} />
  )
}

export const WrapperApprovedProposalsContract = withWrapper(
  (element, props) => {
    return (
      <ApprovedProposalsContractProvider>
        {element}
      </ApprovedProposalsContractProvider>
    )
  },
)(props => {
  return <ApprovedProposalsContract />
})

export default WrapperApprovedProposalsContract

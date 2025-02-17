/* eslint-disable spaced-comment */
/**
 * breadcrumb: Detalhe do negócio
 * hide: true
 */
import React, { useEffect, useState } from 'react'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { printComponents } from '../print/print'
import { message, Spin } from 'antd'
import PropTypes from 'prop-types'
import router from 'umi/router'
import LeftBar from './components/LeftBar/LeftBar'
import ProposalContent from './components/ProposalContent'
import EditProposalHeader from '../components/EditProposal/EditProposalHeader'
import { ShowDocumentNewWindow } from '@components/LayoutGenerator/ShowDocumentNewWindow'
import { useProposalContext } from '../Context/proposalContext'
import {
  DetailProposalProvider,
  useDetailProposalContext,
} from './context/DetailProposalContext.ts'
import ProposalMessagesContainer from './components/ProposalMessagesContainer'
import { getUserContact } from './proposalService'

function Content({ onClose, isRouter }) {
  const { handleCloseProposal, createHistory } = useProposalContext()
  const {
    userPermissions,
    proposal,
    proposalId,
    setProposalId,
    owner,
    sellerId,
    profitPercent,
    setProfitPercent,
    refreshAll,
    setRefreshAll,
    refreshTotal,
    setRefreshTotal,
    messageList,
  } = useDetailProposalContext()

  const [loadingDocument, setLoadingDocument] = useState(false)
  const [refreshHistory, setRefreshHistory] = useState(0)
  const [discountPercent, setDiscountPercent] = useState(null)
  const [discountValue, setDiscountValue] = useState(null)
  const [allContacts, setAllContacts] = useState([])
  const [userContact, setUserContact] = useState('')
  const [screen, setScreen] = useState('Proposal')
  const [proposalEditId, setProposalEditId] = useState(proposalId || 0)
  const [showEditProposalHeader, setShowEditProposalHeader] = useState(false)
  const [keyModal, setKeyModal] = useState(0)
  const [statusEditId, setStatusEditId] = useState(null)
  const [emailsFromFiltered, setEmailsFromFiltered] = useState([])
  const [emailsFrom, setEmailsFrom] = useState([])
  const [method, setMethod] = useState(null)

  const ref = React.useRef()

  useEffect(() => {
    const emails = emailsFrom
      .filter(
        x =>
          x.isNoReply ||
          (x.contacts &&
            x.contacts.find(
              y =>
                (owner?.userId && y.userId === owner?.userId) ||
                y.sellerId === sellerId ||
                y.franchiseeId === proposal?.franchiseeId ||
                y.ownerId === owner?.ownerId ||
                (y.ownerId === owner?.parentOwnerId && owner?.parentOwnerId),
            )),
      )
      .map(d => ({
        isNoReply: d.isNoReply,
        email: d.email,
        name:
          d.contacts?.length > 0
            ? d.contacts[0].contactName || d.contacts[0].name
            : null,
        order: !d.contacts
          ? 5
          : d.contacts.find(r => r.userId === owner?.userId && owner?.userId)
          ? 0
          : d.contacts.find(r => r.sellerId === sellerId)
          ? 1
          : d.contacts.find(r => r.franchiseeId === proposal?.franchiseeId)
          ? 2
          : d.contacts.find(r => r.ownerId === owner?.ownerId)
          ? 3
          : d.contacts.find(
              r => owner?.parentOwnerId && r.ownerId === owner?.parentOwnerId,
            )
          ? 4
          : 5,
      }))
    setEmailsFromFiltered(emails.sort((a, b) => a.order - b.order))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailsFrom, owner, sellerId, proposal?.franchiseeId])

  useEffect(() => {
    getEmailsFrom()
    getUserContact(owner.userId, setUserContact)
    if (ref.current) {
      ref.current.scrollIntoView({
        block: 'start',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function getEmailsFrom() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/EmailFrom`,
      })
      const { data } = response
      if (data.isOk) {
        setEmailsFrom(data.emails)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  const onChangeFromLeftBar = () => {
    setRefreshHistory(refreshHistory + 1)
  }

  const onChangeHistory = () => {
    setRefreshHistory(refreshHistory + 1)
  }

  const onChangeTotal = () => {
    setRefreshHistory(refreshHistory + 1)
    setRefreshTotal(refreshTotal + 1)
  }

  const onChangeProposal = id => {
    if (id !== proposalId) {
      if (isRouter) {
        router.push(`/CRM/Proposals/detail/${id}`)
      }
      setProposalId(id)
    }
    setRefreshAll(refreshAll + 1)
  }

  // const onChangePermissionProposalUpdate = permission => {
  //   setProposalCanBeUpdated(permission)
  // }

  const closeEditProposalHeader = (refreshData, proposalId) => {
    setShowEditProposalHeader(false)

    if (refreshData) {
      onChangeProposal(proposalId)
    }
  }

  const editProposal = (id, statusId) => {
    setProposalEditId(id)
    setStatusEditId(statusId || null)
    setKeyModal(keyModal + 1)
    setShowEditProposalHeader(true)
  }

  const handlePrint = (method, documentModelId) => {
    if (documentModelId) {
      ShowDocumentNewWindow({
        modeloDocumentoId: documentModelId,
        modeloDocumento: null,
        parametros: 'proposalId',
        valores: proposalId,
        setLoadingDocument,
      })
    } else {
      setMethod({ method, documentModelId })
      setScreen('Print')
    }
  }

  const handleClosePrint = () => {
    setMethod(null)
    setScreen('Proposal')
  }

  const getPrint = method => {
    const PrintComponent = printComponents[method.method]
    if (!PrintComponent) {
      message.error('Layout de impressão não encontrado!')
      setScreen('Proposal')
      setMethod(null)
      return null
    }
    return (
      <PrintComponent
        documentModelId={method.documentModelId}
        proposalId={proposalId}
        onClose={handleClosePrint}
      />
    )
  }

  return (
    <div ref={ref}>
      {screen === 'Print' && method && (
        <React.Fragment>{getPrint(method)}</React.Fragment>
      )}
      <Spin size="large" spinning={loadingDocument}>
        {messageList.length > 0 && <ProposalMessagesContainer />}

        <div
          style={{ display: screen === 'Proposal' ? 'flex' : 'none' }}
          className="container flex"
        >
          <EditProposalHeader
            proposalId={proposalEditId}
            statusId={statusEditId}
            show={showEditProposalHeader}
            closeEditProposalHeader={closeEditProposalHeader}
            userPermissions={userPermissions}
            key={keyModal}
            owner={owner}
          />

          <LeftBar
            onChange={onChangeFromLeftBar}
            onChangeTotal={() => setRefreshAll(refreshAll + 1)}
            allContacts={allContacts}
            setAllContacts={setAllContacts}
            editProposal={editProposal}
          />

          <ProposalContent
            refreshHistory={refreshHistory}
            onChangeTotal={onChangeTotal}
            onChangeProposal={onChangeProposal}
            onChangeHistory={onChangeHistory}
            profitPercent={profitPercent}
            setProfitPercent={setProfitPercent}
            discountPercent={discountPercent}
            setDiscountPercent={setDiscountPercent}
            discountValue={discountValue}
            setDiscountValue={setDiscountValue}
            contacts={allContacts}
            isRouter={isRouter}
            onClose={handleCloseProposal}
            onPrint={handlePrint}
            editProposal={editProposal}
            emailsFrom={emailsFromFiltered}
            createHistory={createHistory}
            allContacts={allContacts}
            userContact={userContact}
          />
        </div>
      </Spin>
    </div>
  )
}

const Proposal = ({ proposalId, setProposalId, isRouter }) => {
  return (
    <DetailProposalProvider>
      <Content {...{ proposalId, setProposalId, isRouter }} />
    </DetailProposalProvider>
  )
}
Content.propTypes = {
  isRouter: PropTypes.bool,
}
export default Proposal

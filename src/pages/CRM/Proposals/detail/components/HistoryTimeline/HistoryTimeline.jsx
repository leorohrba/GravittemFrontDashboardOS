import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { message, Spin, Timeline } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import HistoryTimelineAttachment from './HistoryTimelineAttachment'
import HistoryTimelineCheckbox from './HistoryTimelineCheckbox'
import HistoryTimelineComment from './HistoryTimelineComment'
import HistoryTimelineProposal from './HistoryTimelineProposal'
import HistoryTimelineTask from './HistoryTimelineTask'
import HistoryTimelineDocument from './HistoryTimelineDocument'
import HistoryTimelineMail from './HistoryTimelineMail'
import HistoryTimelineSendDate from './HistoryTimeLineSendDate'
import HistoryTimelineProposalTaxLocation from './HistoryTimelineProposalTaxLocation'
import EmailModal from '../../tabs/Email/EmailModal'
import HistoryTimelineWhatsappProposal from './HistoryTimelineWhatsappProposal'
import HistoryTimelineWhatsappChat from './HistoryTimelineWhatsappChat'
import { getProposalHistories, getService } from '../../../service'

export default function HistoryTimeline(props) {
  const plainOptions = [
    'Negócios',
    'Tarefas',
    'Documentos',
    'Anexos',
    'Comentários',
    'E-mails',
    'Whatsapp',
  ]

  const {
    allContacts,
    proposalId,
    refreshHistory,
    userPermissions,
    printLayouts,
    proposalHistory,
    setProposalHistory,
  } = props

  const [visibleEmailModal, setVisibleEmailModal] = useState(false)
  const [emailSentId, setEmailSentId] = useState(null)
  const [whatsappData, setWhatsappData] = useState(null)
  const [priceList, setPriceList] = useState([])
  const defaultCheckedList = [
    'Negócios',
    'Tarefas',
    'Documentos',
    'Anexos',
    'Comentários',
    'E-mails',
    'Whatsapp',
  ]
  const [checkedList, setCheckedList] = useState(defaultCheckedList)
  const [indeterminate, setIndeterminate] = useState(true)
  const [checkAll, setCheckAll] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getProposalHistories(proposalId, setProposalHistory, setLoading)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (refreshHistory > 0) {
      getProposalHistories(proposalId, setProposalHistory, setLoading)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshHistory])

  const onChange = checkedList => {
    setCheckedList(checkedList)
    setIndeterminate(
      !!checkedList.length && checkedList.length < plainOptions.length,
    )
    setCheckAll(checkedList.length === plainOptions.length)
  }

  const onCheckAllChange = e => {
    setCheckedList(e.target.checked ? plainOptions : [])
    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }

  const showEmail = id => {
    setEmailSentId(id)
    setVisibleEmailModal(true)
  }
  const showWhatsapp = data => {
    setWhatsappData(data)
    setEmailSentId(undefined)
    setVisibleEmailModal(true)
  }

  useEffect(() => {
    getService('/api/CRM/PriceList', setPriceList)
  }, [])

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 100)
  }, [proposalHistory, checkedList])

  return (
    <div className="mt-10">
      <EmailModal
        whatsappData={whatsappData}
        emailSentId={emailSentId}
        visibleEmailModal={visibleEmailModal}
        setVisibleEmailModal={setVisibleEmailModal}
        userPermissions={userPermissions}
        printLayouts={printLayouts}
        allContacts={allContacts}
      />

      {loading ? (
        <div className="w-full justify-center">
          <Spin size="large" spinning={loading} />
        </div>
      ) : (
        <>
          <Timeline>
            <HistoryTimelineCheckbox
              {...{
                indeterminate,
                onCheckAllChange,
                checkAll,
                plainOptions,
                checkedList,
                onChange,
              }}
            />
            {proposalHistory.map((history, index) => {
              let renderHistory

              if (
                history.type === 'Proposal' &&
                checkedList.includes('Negócios')
              ) {
                renderHistory = (
                  <HistoryTimelineProposal
                    key={history.proposalHistoryId}
                    date={history.dateTimeHistory}
                    proposalId={history.proposalHistoryId}
                    title={history.title}
                    action={history.action}
                    oldValue={history.oldValue}
                    newValue={history.newValue}
                    userName={history.userNameHistory}
                    priceList={priceList?.priceList}
                  />
                )
              }

              if (history.type === 'Attach' && checkedList.includes('Anexos')) {
                renderHistory = (
                  <HistoryTimelineAttachment
                    key={history.proposalHistoryId}
                    date={history.dateTimeHistory}
                    proposalId={history.proposalHistoryId}
                    title={history.title}
                    action={history.action}
                    oldValue={history.oldValue}
                    newValue={history.newValue}
                    userName={history.userNameHistory}
                  />
                )
              }

              if (history.type === 'Email' && checkedList.includes('E-mails')) {
                renderHistory = (
                  <HistoryTimelineMail
                    key={history.proposalHistoryId}
                    date={history.dateTimeHistory}
                    proposalId={history.proposalHistoryId}
                    title={history.title}
                    action={history.action}
                    oldValue={history.oldValue}
                    newValue={history.newValue}
                    userName={history.userNameHistory}
                    emailSentId={history.emailSentId}
                    showEmail={showEmail}
                  />
                )
              }

              if (
                history.type === 'WhatsappProposal' &&
                checkedList.includes('Whatsapp')
              ) {
                renderHistory = (
                  <HistoryTimelineWhatsappProposal
                    key={history.proposalHistoryId}
                    date={history.dateTimeHistory}
                    proposalId={history.proposalHistoryId}
                    title={history.title}
                    action={history.action}
                    oldValue={history.oldValue}
                    newValue={history.newValue}
                    userName={history.userNameHistory}
                    emailSentId={history.emailSentId}
                    showWhatsapp={showWhatsapp}
                  />
                )
              }
              if (
                history.type === 'WhatsappChat' &&
                checkedList.includes('Whatsapp')
              ) {
                renderHistory = (
                  <HistoryTimelineWhatsappChat
                    key={history.proposalHistoryId}
                    date={history.dateTimeHistory}
                    proposalId={history.proposalId}
                    title={history.title}
                    action={history.action}
                    oldValue={history.oldValue}
                    chatId={history.chatId}
                    newValue={history.newValue}
                    userName={history.userNameHistory}
                    emailSentId={history.emailSentId}
                    showWhatsapp={showWhatsapp}
                  />
                )
              }

              if (history.type === 'Task' && checkedList.includes('Tarefas')) {
                renderHistory = (
                  <HistoryTimelineTask
                    key={history.proposalHistoryId}
                    date={history.dateTimeHistory}
                    proposalId={history.proposalHistoryId}
                    title={history.title}
                    action={history.action}
                    oldValue={history.oldValue}
                    newValue={history.newValue}
                    userName={history.userNameHistory}
                  />
                )
              }

              if (
                history.type === 'Document' &&
                checkedList.includes('Documentos')
              ) {
                renderHistory = (
                  <HistoryTimelineDocument
                    key={history.proposalHistoryId}
                    date={history.dateTimeHistory}
                    proposalId={history.proposalHistoryId}
                    title={history.title}
                    action={history.action}
                    oldValue={history.oldValue}
                    newValue={history.newValue}
                    userName={history.userNameHistory}
                  />
                )
              }

              if (
                history.type === 'Comment' &&
                checkedList.includes('Comentários')
              ) {
                renderHistory = (
                  <HistoryTimelineComment
                    key={history.proposalHistoryId}
                    date={history.dateTimeHistory}
                    proposalId={history.proposalHistoryId}
                    title={history.title}
                    action={history.action}
                    oldValue={history.oldValue}
                    newValue={history.newValue}
                    userName={history.userNameHistory}
                  />
                )
              }

              if (history.type === 'proposalSendDate') {
                renderHistory = (
                  <HistoryTimelineSendDate
                    key={history.proposalHistoryId}
                    date={history.dateTimeHistory}
                    proposalId={history.proposalHistoryId}
                    title={history.title}
                    action={history.action}
                    oldValue={history.oldValue}
                    newValue={history.newValue}
                    userName={history.userNameHistory}
                  />
                )
              }

              if (history.type === 'ProposalTaxLocation') {
                renderHistory = (
                  <HistoryTimelineProposalTaxLocation
                    key={history.proposalHistoryId}
                    date={history.dateTimeHistory}
                    proposalId={history.proposalHistoryId}
                    title={history.title}
                    action={history.action}
                    oldValue={history.oldValue}
                    newValue={history.newValue}
                    userName={history.userNameHistory}
                  />
                )
              }

              return renderHistory
            })}
          </Timeline>
        </>
      )}
    </div>
  )
}
HistoryTimeline.propTypes = {
  proposalId: PropTypes.number,
  refreshHistory: PropTypes.number,
  userPermissions: PropTypes.array,
  printLayouts: PropTypes.array,
}

import styles from '@pages/CRM/styles.css'
import { hasPermission } from '@utils'
import { Button, Dropdown, Menu, Tabs, Tooltip, Select, Col } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import router from 'umi/router'
import Document from '../tabs/Document'
import Email from '../tabs/Email/Email'
import ProductsAndServices from '../tabs/ProductsAndServices/ProductsAndServices'
import Tasks from '../tabs/Tasks/Tasks'
import Comments from './Comments'
import HistoryTimeline from './HistoryTimeline/HistoryTimeline'
import Observation from './Observation'
import ProposalClone from './ProposalClone'
import Witness from './Witness'
import { useDetailProposalContext } from '../context/DetailProposalContext.ts'

const { TabPane } = Tabs
const { Option } = Select
export default function ProposalContent(props) {
  const {
    proposalId,
    proposalCanBeUpdate,
    userPermissions,
    proposal,
    owner,
    refreshAll,
    printLayouts,
    totalValue,
    createMessage,
  } = useDetailProposalContext()

  const {
    refreshHistory,
    onChangeTotal,
    onChangeProposal,
    onChangeHistory,
    profitPercent,
    setProfitPercent,
    discountPercent,
    setDiscountPercent,
    discountValue,
    setDiscountValue,
    contacts,
    isRouter,
    onClose,
    onPrint,
    editProposal,
    emailsFrom,
    createHistory,
    allContacts,
    userContact,
  } = props

  const [observationModalVisible, setObservationModalVisible] = useState(false)
  const [keyModalProposalClone, setKeyModalProposalClone] = useState(0)
  const [proposalCloneModalVisible, setProposalCloneModalVisible] = useState(
    false,
  )
  const [witnessModalVisible, setWitnessModalVisible] = useState(false)
  const [keyModalWitness, setKeyModalWitness] = useState(0)
  const [proposalHistory, setProposalHistory] = useState([])
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const isFromTable =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('fromTable')
      : null

  const handleDropdownVisibleChange = visible => {
    setDropdownVisible(visible)
  }

  const menuPrint = (
    <Select
      showSearch
      filterOption={(input, option) =>
        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      onSelect={(_, option) => {
        onPrint(option?.data?.method, option?.data?.documentModelId)
      }}
      style={{ width: 250 }}
      onDropdownVisibleChange={handleDropdownVisibleChange}
    >
      {printLayouts.map(p => (
        <Option key={p.documentModelId} value={p.documentModelId} data={p}>
          {p.description}
        </Option>
      ))}
    </Select>
  )

  const menuOptions = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={event => {
          setObservationModalVisible(true)
        }}
      >
        Observação de impressão
      </Menu.Item>
      {hasPermission(userPermissions, 'Include') && (
        <Menu.Item
          key="2"
          onClick={event => {
            setProposalCloneModalVisible(true)
            setKeyModalProposalClone(keyModalProposalClone + 1)
          }}
        >
          Fazer um clone do negócio
        </Menu.Item>
      )}
      <Menu.Item
        key="3"
        onClick={event => {
          setWitnessModalVisible(true)
          setKeyModalWitness(keyModalWitness + 1)
        }}
      >
        Testemunhas
      </Menu.Item>
    </Menu>
  )

  return (
    <div className="ml-5" style={{ width: '78%' }}>
      <React.Fragment>
        <ProposalClone
          proposalId={proposalId}
          number={proposal?.number}
          toogleModalVisible={() => setProposalCloneModalVisible(false)}
          onChange={id => onChangeProposal(id)}
          visible={proposalCloneModalVisible}
          key={keyModalProposalClone}
          createMessage={createMessage}
          createHistory={createHistory}
          onChangeTotal={onChangeTotal}
        />
      </React.Fragment>

      <React.Fragment>
        <Witness
          proposalId={proposalId}
          number={proposal?.number}
          visible={witnessModalVisible}
          setVisible={setWitnessModalVisible}
          onChange={id => onChangeHistory(id)}
          key={keyModalWitness}
          userPermissions={userPermissions}
        />
      </React.Fragment>

      <Observation
        proposalId={proposalId}
        userPermissions={userPermissions}
        toogleModalVisible={() => setObservationModalVisible(false)}
        onChange={() => onChangeProposal(proposalId)}
        visible={observationModalVisible}
      />

      <Tabs
        defaultActiveKey="1"
        tabBarExtraContent={
          <React.Fragment>
            <Tooltip
              placement="bottom"
              title="Voltar para a listagem de negócios"
            >
              <Button
                shape="circle"
                type="primary"
                ghost
                onClick={e =>
                  isRouter
                    ? router.push({
                        pathname: '/CRM/Proposals',
                        query: {
                          fromTable: isFromTable || true,
                        },
                      })
                    : onClose()
                }
                size="small"
                className="iconButton"
              >
                <i className={`fa fa-angle-left ${styles.crmColorIconEdit}`} />
              </Button>
            </Tooltip>

            <Dropdown
              overlay={menuPrint}
              visible={dropdownVisible}
              onVisibleChange={handleDropdownVisibleChange}
              trigger={['hover']}
              className="ml-1"
            >
              <Button
                shape="circle"
                type="primary"
                ghost
                size="small"
                className="iconButton ml-1"
              >
                <i className={`fa fa-print ${styles.crmColorIconEdit}`} />
              </Button>
            </Dropdown>

            {hasPermission(userPermissions, 'Include') && (
              <Tooltip placement="bottom" title="Criar novo negócio">
                <Button
                  shape="circle"
                  type="primary"
                  ghost
                  size="small"
                  onClick={e => editProposal(0)}
                  className="iconButton ml-1"
                >
                  <i className={`fa fa-plus ${styles.crmColorIconEdit}`} />
                </Button>
              </Tooltip>
            )}

            <Tooltip
              placement="bottom"
              title={
                hasPermission(userPermissions, 'Alter') && proposalCanBeUpdate
                  ? 'Editar cabeçalho do negócio'
                  : 'Consultar cabeçalho do negócio'
              }
            >
              <Button
                shape="circle"
                type="primary"
                ghost
                size="small"
                onClick={e => editProposal(proposalId)}
                className="iconButton ml-1"
              >
                <i
                  className={`fa fa-${
                    hasPermission(userPermissions, 'Alter') &&
                    proposalCanBeUpdate
                      ? 'pencil'
                      : 'search'
                  } ${styles.crmColorIconEdit}`}
                />
              </Button>
            </Tooltip>

            <Dropdown overlay={menuOptions} className="ml-1">
              <Button
                shape="circle"
                type="primary"
                ghost
                size="small"
                className="iconButton ml-1"
              >
                <i className={`fa fa-ellipsis-v ${styles.crmColorIconEdit}`} />
              </Button>
            </Dropdown>
          </React.Fragment>
        }
      >
        <TabPane tab="Tarefas" key="1">
          <Tasks
            proposalId={proposalId}
            onChange={onChangeHistory}
            userPermissions={userPermissions}
            proposalCanBeUpdate={proposalCanBeUpdate}
            proposal={proposal}
            owner={owner}
            key={refreshAll}
          />
        </TabPane>
        <TabPane tab="Produtos e serviços" key="2">
          <ProductsAndServices
            proposalId={proposalId}
            proposal={proposal}
            proposalCanBeUpdate={proposalCanBeUpdate}
            userPermissions={userPermissions}
            onChange={onChangeTotal}
            onChangeProposal={onChangeProposal}
            proposalType={proposal?.proposalType || 1}
            currentDiscountPercent={discountPercent}
            setCurrentDiscountPercent={setDiscountPercent}
            currentDiscountValue={discountValue}
            setCurrentDiscountValue={setDiscountValue}
            currentProfitPercent={profitPercent}
            setCurrentProfitPercent={setProfitPercent}
            owner={owner}
            key={refreshAll + 1}
            number={proposal?.number}
            totalValue={totalValue}
            createHistory={createHistory}
          />
        </TabPane>
        <TabPane tab="Envio de proposta" key="3">
          <Email
            proposal={proposal}
            proposalId={proposalId}
            defaultContacts={contacts}
            userPermissions={userPermissions}
            onChange={onChangeHistory}
            printLayouts={printLayouts}
            emailsFrom={emailsFrom}
            allContacts={allContacts}
            userContact={userContact}
          />
        </TabPane>
        <TabPane tab="Documentos" key="4">
          <Document
            refreshData={onChangeHistory}
            proposal={proposal}
            proposalCanBeUpdate={proposalCanBeUpdate}
            proposalId={proposalId}
            defaultContacts={contacts}
            userPermissions={userPermissions}
            onChange={onChangeHistory}
            printLayouts={printLayouts}
            emailsFrom={emailsFrom}
          />
        </TabPane>
      </Tabs>

      {hasPermission(userPermissions, 'Alter') && proposalCanBeUpdate && (
        <Comments onChange={onChangeHistory} proposalId={proposalId} />
      )}
      <HistoryTimeline
        allContacts={allContacts}
        proposalId={proposalId}
        printLayouts={printLayouts}
        refreshHistory={refreshHistory}
        key={refreshAll + 2}
        proposalHistory={proposalHistory}
        setProposalHistory={setProposalHistory}
      />
    </div>
  )
}

ProposalContent.propTypes = {
  refreshHistory: PropTypes.number,
  onChangeTotal: PropTypes.func,
  onChangeProposal: PropTypes.func,
  onChangeHistory: PropTypes.func,
  profitPercent: PropTypes.number,
  setProfitPercent: PropTypes.func,
  contacts: PropTypes.array,
  isRouter: PropTypes.number,
  onClose: PropTypes.func,
  onPrint: PropTypes.func,
  editProposal: PropTypes.func,
  emailsFrom: PropTypes.array,
}

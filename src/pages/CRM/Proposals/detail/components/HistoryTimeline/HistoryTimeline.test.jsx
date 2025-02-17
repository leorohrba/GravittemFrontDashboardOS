import { apiCRM } from '@services/api'
import { fireEvent, render } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import { act } from 'react-dom/test-utils'
import HistoryTimeline from './HistoryTimeline'

const mock = new MockAdapter(apiCRM)

it('test select all', async () => {
  render(<HistoryTimeline proposalId={1} refreshHistory={1} />)
  await act(async () => {
    await mock.onPost(`/api/crm/historiesByProposalId`).reply(200, {
      proposalHistories: [{ name: 'test' }],
      isOk: true,
      message: '',
    })
  })
  await act(async () => {
    const el = document.querySelectorAll('.ant-checkbox-input')[0]
    await fireEvent.click(el)
  })
  const checkedCheckbox = document.querySelectorAll('.ant-checkbox-checked')
  expect(checkedCheckbox.length).toBe(5)
})
it('test select negócios', async () => {
  render(<HistoryTimeline proposalId={1} refreshHistory={1} />)
  await act(async () => {
    await mock.onPost(`/api/crm/historiesByProposalId`).reply(200, {
      proposalHistories: [{ name: 'test' }],
      isOk: true,
      message: '',
    })
  })
  await act(async () => {
    const el = document.querySelectorAll('.ant-checkbox-input')[1]
    await fireEvent.click(el)
  })
  const checkedCheckbox = document.querySelectorAll('.ant-checkbox-checked')
  expect(checkedCheckbox.length).toBe(3)
})
it('test historiesByProposalId is ok false', async () => {
  render(<HistoryTimeline proposalId={1} refreshHistory={1} />)
  await act(async () => {
    await mock.onPost(`/api/crm/historiesByProposalId`).reply(200, {
      proposalHistories: [{ name: 'test' }],
      isOk: false,
      message: 'Erro',
    })
  })
  expect(document.querySelector('.ant-message-notice').textContent).toBe('Erro')
})
it('test historiesByProposalId catch', async () => {
  render(<HistoryTimeline proposalId={1} refreshHistory={1} />)
  await act(async () => {
    await mock.onPost(`/api/crm/historiesByProposalId`).reply(500, {
      proposalHistories: [{ name: 'test' }],
      isOk: false,
      message: '',
    })
  })
  expect(document.querySelector('.ant-message-notice').textContent).toBe('Erro')
})

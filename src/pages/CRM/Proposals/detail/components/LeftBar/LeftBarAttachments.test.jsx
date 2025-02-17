import { apiCRM } from '@services/api'
import { act, fireEvent, render } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import LeftBarAttachments from './LeftBarAttachments'

const mock = new MockAdapter(apiCRM)

const proposalId = 1
const loadingAttachments = false
const attachments = [
  {
    proposalAttachId: 1,
    fileName: 'test',
  },
]
const onChangeAttachments = jest.fn()
const canBeUpdated = true

describe('click operations', () => {
  it('donwload file', async () => {
    await act(async () => {
      await mock.onGet(`/api/crm/downloadProposalAttach`).reply(200, {
        isOk: true,
        message: '',
        data: ['test'],
      })
    })
    const { getByTestId } = render(
      <LeftBarAttachments
        proposalId={proposalId}
        loading={loadingAttachments}
        attachments={attachments}
        onChange={onChangeAttachments}
        canBeUpdated={canBeUpdated}
      />,
    )
    const donwloadButton = getByTestId('downloadButton')
    await act(async () => {
      await fireEvent.click(donwloadButton)
    })
    expect(
      document.querySelector('.ant-notification-notice-message').textContent,
    ).toBe('Servidor não encontrado')
  })
  describe('delete file', () => {
    it('delete file is ok true', async () => {
      await act(async () => {
        await mock.onGet(`/api/crm/downloadProposalAttach`).reply(200, {
          isOk: true,
          message: '',
          data: ['test'],
        })
      })
      await act(async () => {
        await mock.onDelete(`/api/crm/deleteProposalAttach`).reply(200, {
          isOk: true,
          message: '',
          data: ['test'],
        })
      })
      const { getByTestId, getByText } = render(
        <LeftBarAttachments
          proposalId={proposalId}
          loading={loadingAttachments}
          attachments={attachments}
          onChange={onChangeAttachments}
          canBeUpdated={canBeUpdated}
        />,
      )
      await act(async () => {
        const deleteFileButton = getByTestId('deleteFileButton')
        await deleteFileButton.click()
      })
      await act(async () => {
        const deleteFileAction = getByText('Sim')
        await deleteFileAction.click()
      })
      expect(
        document.querySelector('.ant-notification-notice-message').textContent,
      ).toBe('Servidor não encontrado')
    })
    it('delete file is ok false', async () => {
      await act(async () => {
        await mock.onGet(`/api/crm/downloadProposalAttach`).reply(200, {
          isOk: true,
          message: '',
          data: ['test'],
        })
      })
      await act(async () => {
        await mock.onDelete(`/api/crm/deleteProposalAttach`).reply(200, {
          isOk: false,
          message: 'Erro',
          data: ['test'],
        })
      })
      const { getByTestId, getByText } = render(
        <LeftBarAttachments
          proposalId={proposalId}
          loading={loadingAttachments}
          attachments={attachments}
          onChange={onChangeAttachments}
          canBeUpdated={canBeUpdated}
        />,
      )

      await act(async () => {
        const deleteFileButton = getByTestId('deleteFileButton')
        deleteFileButton.click()
      })
      await act(async () => {
        const deleteFileAction = getByText('Sim')
        deleteFileAction.click()
      })
      expect(document.querySelector('.ant-message-notice').textContent).toBe(
        'Erro',
      )
    })
    it('delete file catch error', async () => {
      await act(async () => {
        await mock.onGet(`/api/crm/downloadProposalAttach`).reply(200, {
          isOk: true,
          message: '',
          data: ['test'],
        })
      })
      await act(async () => {
        await mock.onDelete(`/api/crm/deleteProposalAttach`).reply(500, {
          isOk: true,
          message: '',
          data: ['test'],
        })
      })
      const { getByTestId, getByText } = render(
        <LeftBarAttachments
          proposalId={proposalId}
          loading={loadingAttachments}
          attachments={attachments}
          onChange={onChangeAttachments}
          canBeUpdated={canBeUpdated}
        />,
      )
      await act(async () => {
        const deleteFileButton = getByTestId('deleteFileButton')
        deleteFileButton.click()
      })
      await act(async () => {
        const deleteFileAction = getByText('Sim')
        deleteFileAction.click()
      })
      expect(document.querySelector('.ant-message-notice').textContent).toBe(
        'Erro',
      )
    })
  })
})

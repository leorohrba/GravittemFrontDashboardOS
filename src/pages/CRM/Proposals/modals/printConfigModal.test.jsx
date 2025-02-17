import { apiCRM } from '@services/api'
import { act, fireEvent, render } from '@testing-library/react'
import { Form } from 'antd'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import PrintConfigModal from './printConfigModal'

const mock = new MockAdapter(apiCRM)

const printConfigModalVisible = true
const setPrintConfigModalVisible = jest.fn(() => c => c)
const setPopoverVisible = jest.fn(() => c => c)

const EnhancedForm = Form.create()(PrintConfigModal)

it('submit with data and close modal', async () => {
  await act(async () => {
    mock.onGet(`/api/CRM/ProposalConfiguration`).reply(200, {
      proposalConfiguration: [
        {
          title: 'title2',
          description: 'description',
        },
      ],
      isOk: true,
      message: 'message',
    })
  })
  await act(async () => {
    mock.onPost(`/api/CRM/ProposalConfiguration`).reply(200, {
      proposalConfiguration: {
        title: 'title2',
        description: 'description',
      },

      isOk: true,
      message: '',
    })
  })
  const { getByText, getByPlaceholderText } = render(
    <EnhancedForm
      {...{
        printConfigModalVisible,
        setPrintConfigModalVisible,
        setPopoverVisible,
      }}
    />,
  )

  const titleInput = getByPlaceholderText('Inserir título')
  fireEvent.change(titleInput, {
    target: {
      value: 'title',
    },
  })
  const saveButton = getByText('Salvar')
  await act(async () => {
    await saveButton.click()
  })
  expect(document.querySelector('.ant-message-notice').textContent).toBe(
    'Dados salvos com sucesso!',
  )
  const cancelButton = getByText('Cancelar')
  await act(async () => {
    await cancelButton.click()
  })
})

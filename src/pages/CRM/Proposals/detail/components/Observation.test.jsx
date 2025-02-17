import { apiCRM } from '@services/api'
import { fireEvent, render } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import { act } from 'react-dom/test-utils'
import Observation from './Observation'

const mock = new MockAdapter(apiCRM)

const toogleModalVisible = jest.fn(() => c => c)
const onChange = jest.fn(() => c => c)
const proposalId = 1
const userPermissions = [
  { code: 'VINA', name: 'Visualize' },
  { code: 'EXPT', name: 'ExportExcel' },
  { code: 'INCL', name: 'Include' },
  { code: 'ALTE', name: 'Alter' },
  { code: 'EXCL', name: 'Exclude' },
  { code: 'TRAS', name: 'Trash' },
  { code: 'RECOV', name: 'Recover' },
  { code: 'INSE', name: 'IncludeSearch' },
  { code: 'ALSE', name: 'AlterSearch' },
  { code: 'EXSE', name: 'ExcludeSearch' },
]
const componentVisible = (
  <Observation
    proposalId={proposalId}
    userPermissions={userPermissions}
    toogleModalVisible={toogleModalVisible}
    onChange={onChange}
    visible
  />
)

describe('onSubmit', () => {
  it('test onSubmit with observation isOk true', async () => {
    const { getByText, getByTestId } = render(componentVisible)
    await act(async () => {
      mock.onGet(`/api/crm/proposal`).reply(200, {
        proposal: [
          {
            observation: null,
            canBeUpdated: true,
          },
        ],
        isOk: true,
        message: null,
      })
    })
    await act(async () => {
      mock.onPut(`/api/crm/proposalUpdate`).reply(200, {
        isOk: true,
        message: null,
      })
    })
    const observationField = getByTestId('observation-field')
    const observationValue = 'observação'
    await act(async () => {
      fireEvent.change(observationField, {
        target: { value: observationValue },
      })
    })
    expect(observationField).toHaveTextContent(observationValue)

    const saveButton = getByText('Salvar')
    await act(async () => {
      fireEvent.click(saveButton)
    })
  })
  it('test onSubmit isOk false with validation message', async () => {
    const { getByText } = render(componentVisible)
    await act(async () => {
      mock.onGet(`/api/crm/proposal`).reply(200, {
        proposal: [
          {
            observation: null,
            canBeUpdated: true,
          },
        ],
        isOk: true,
        message: null,
      })
    })
    await act(async () => {
      mock.onPut(`/api/crm/proposalUpdate`).reply(200, {
        isOk: false,
        validationMessageList: ['test'],
      })
    })
    const saveButton = getByText('Salvar')
    await act(async () => {
      fireEvent.click(saveButton)
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'testAtualização não realizada',
    )
  })
  it('test onSubmit isOk false without validation message', async () => {
    const { getByText } = render(componentVisible)
    await act(async () => {
      mock.onGet(`/api/crm/proposal`).reply(200, {
        proposal: [
          {
            observation: null,
            canBeUpdated: true,
          },
        ],
        isOk: true,
        message: null,
      })
    })
    await act(async () => {
      mock.onPut(`/api/crm/proposalUpdate`).reply(200, {
        isOk: false,
        validationMessageList: [],
      })
    })
    const saveButton = getByText('Salvar')
    await act(async () => {
      fireEvent.click(saveButton)
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'testAtualização não realizada',
    )
  })
  it('test onSubmit catch error', async () => {
    const { getByText } = render(componentVisible)
    await act(async () => {
      mock.onGet(`/api/crm/proposal`).reply(200, {
        proposal: [
          {
            observation: null,
            canBeUpdated: true,
          },
        ],
        isOk: true,
        message: null,
      })
    })
    await act(async () => {
      mock.onPut(`/api/crm/proposalUpdate`).reply(500, {
        isOk: false,
        validationMessageList: ['test'],
      })
    })
    const saveButton = getByText('Salvar')
    await act(async () => {
      fireEvent.click(saveButton)
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'testAtualização não realizada',
    )
  })
})
describe('getProposal', () => {
  it('getProposal with proposal empty', async () => {
    render(componentVisible)
    await act(async () => {
      mock
        .onGet(`/api/crm/proposal`)
        .reply(200, { isOk: true, message: '', proposal: [] })
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'testAtualização não realizada',
    )
  })

  it('getProposal with proposal filled', async () => {
    render(componentVisible)
    await act(async () => {
      mock.onGet(`/api/crm/proposal`).reply(200, {
        proposal: [
          {
            observation: null,
            canBeUpdated: true,
          },
        ],
        isOk: true,
        message: null,
      })
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'testAtualização não realizada',
    )
  })
  it('getProposal isOk false', async () => {
    render(componentVisible)
    await act(async () => {
      mock.onGet(`/api/crm/proposal`).reply(200, {
        proposal: [
          {
            observation: null,
            canBeUpdated: true,
          },
        ],
        isOk: false,
        message: 'message',
      })
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'testAtualização não realizada',
    )
  })
  it('getProposal catch error', async () => {
    render(componentVisible)
    await act(async () => {
      mock.onGet(`/api/crm/proposal`).reply(500, {
        proposal: [
          {
            observation: null,
            canBeUpdated: true,
          },
        ],
        isOk: true,
        message: null,
      })
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'testAtualização não realizada',
    )
  })
})

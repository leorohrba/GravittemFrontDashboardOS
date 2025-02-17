import { apiCRM } from '@services/api'
import { fireEvent, render } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import { act } from 'react-dom/test-utils'
import TaskFinalize from './TaskFinalize'

const mock = new MockAdapter(apiCRM)

const taskId = 1
const closeTaskFinalize = jest.fn(() => c => c)
const key = 1
const component = <TaskFinalize {...{ taskId, closeTaskFinalize, key }} />
const successData = {
  task: [
    {
      taskId: 129,
      ownerId: 99,
      responsibleName: 'Franqueado 1',
      taskTypeId: 59,
      taskTypeName: 'E-mail',
      taskTypeIcon: 'fa-paper-plane',
      subject: 'teste',
      expectedDateTime: '2019-12-06T08:00:00',
      expectedDuration: 5,
      sellerId: 1457,
      sellerName: 'Vendedor 1',
      companyId: 212430,
      companyName: 'Pessoa Jurídica sem CNPJ',
      companyShortName: 'Pessoa Jurídica sem CNPJ',
      companyPersonType: 2,
      companyPersonId: 216603,
      franchiseeId: 2,
      franchiseeName: 'Franqueado 1',
      franchiseeOwnerId: 99,
      observation: 'test',
      proposalId: 49,
      realizedDate: null,
      isAllDay: false,
      isDeleted: false,
      isActive: true,
      canBeUpdated: true,
      canBeDeleted: true,
      createUserId: 529,
      createDateTime: '2019-10-28T11:23:49.957',
      lastUpdateUserId: 529,
      lastUpdateDateTime: '2019-10-28T11:25:00.627',
    },
    {
      taskId: 130,
      ownerId: 99,
      responsibleName: 'Franqueado 1',
      taskTypeId: 59,
      taskTypeName: 'E-mail',
      taskTypeIcon: 'fa-paper-plane',
      subject: 'teste1',
      expectedDateTime: '2019-12-06T08:00:00',
      expectedDuration: 5,
      sellerId: 1457,
      sellerName: 'Vendedor 1',
      companyId: 212430,
      companyName: 'Pessoa Jurídica sem CNPJ',
      companyShortName: 'Pessoa Jurídica sem CNPJ',
      companyPersonType: 2,
      companyPersonId: 216603,
      franchiseeId: 2,
      franchiseeName: 'Franqueado 1',
      franchiseeOwnerId: 99,
      observation: null,
      proposalId: 49,
      realizedDate: null,
      isAllDay: true,
      isDeleted: false,
      isActive: true,
      canBeUpdated: true,
      canBeDeleted: true,
      createUserId: 529,
      createDateTime: '2019-10-28T11:23:49.957',
      lastUpdateUserId: 529,
      lastUpdateDateTime: '2019-10-28T11:25:00.627',
    },
    {
      taskId: 130,
      ownerId: 99,
      responsibleName: 'Franqueado 1',
      taskTypeId: 59,
      taskTypeName: 'E-mail',
      taskTypeIcon: 'fa-paper-plane',
      subject: 'teste1',
      expectedDateTime: '2019-12-06T08:00:00',
      expectedDuration: 5,
      sellerId: 1457,
      sellerName: 'Vendedor 1',
      companyId: 212430,
      companyName: 'Pessoa Jurídica sem CNPJ',
      companyShortName: 'Pessoa Jurídica sem CNPJ',
      companyPersonType: 2,
      companyPersonId: 216603,
      franchiseeId: 2,
      franchiseeName: 'Franqueado 1',
      franchiseeOwnerId: 99,
      observation: null,
      proposalId: 49,
      realizedDate: '10/10/2010',
      isAllDay: true,
      isDeleted: false,
      isActive: true,
      canBeUpdated: true,
      canBeDeleted: true,
      createUserId: 529,
      createDateTime: '2019-10-28T11:23:49.957',
      lastUpdateUserId: 529,
      lastUpdateDateTime: '2019-10-28T11:25:00.627',
    },
  ],
  isOk: true,
  message: null,
}
describe('getTasks mock', () => {
  it('test getTasks is ok true', async () => {
    const { getByText } = render(
      <TaskFinalize {...{ taskId, closeTaskFinalize, key }} />,
    )
    await act(async () => {
      mock
        .onGet(`/api/crm/task`, {
          params: { taskId },
        })
        .reply(200, successData)
    })
    expect(getByText(successData.task[0].observation)).toBeInTheDocument()
  })
  it('test getTasks task length 0', async () => {
    render(component)
    await act(async () => {
      mock
        .onGet(`/api/crm/task`, {
          params: { taskId },
        })
        .reply(200, {
          task: [],
          isOk: true,
          message: '',
        })
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'Tarefa não existe ou não há permissão para acesso',
    )
  })
  it('test getTasks is ok false', async () => {
    render(component)
    await act(async () => {
      mock
        .onGet(`/api/crm/task`, {
          params: { taskId },
        })
        .reply(200, {
          task: [],
          isOk: false,
          message: '',
        })
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'Tarefa não existe ou não há permissão para acesso',
    )
  })

  it('test getTasks catch', async () => {
    render(component)
    await act(async () => {
      mock
        .onGet(`/api/crm/task`, {
          params: { taskId },
        })
        .reply(500)
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'Tarefa não existe ou não há permissão para acesso',
    )
  })
})

describe('finalize task', () => {
  it('finalize and open new task', async () => {
    const { getByPlaceholderText } = render(component)
    const insertObservationField = getByPlaceholderText('Inserir observações')
    const observationValue = 'observação'
    fireEvent.change(insertObservationField, {
      target: { value: observationValue },
    })
    expect(insertObservationField).toHaveTextContent(observationValue)
  })
  it('cancel task', async () => {
    const { getByText } = render(component)
    fireEvent.click(getByText('Cancelar'))
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'Tarefa não existe ou não há permissão para acesso',
    )
  })
  it('finalize task', async () => {
    const { getByText } = render(component)
    await act(async () => {
      mock
        .onGet(`/api/crm/task`, {
          params: { taskId },
        })
        .reply(200, successData)
    })
    await act(async () => {
      await fireEvent.click(getByText('Concluir'))
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'Tarefa não existe ou não há permissão para acesso',
    )
  })
  it('finalizeTask is ok true', async () => {
    const { getByText } = render(component)
    await act(async () => {
      mock
        .onGet(`/api/crm/task`, {
          params: { taskId },
        })
        .reply(200, successData)
    })
    await act(async () => {
      await mock
        .onPost(`/api/crm/task`)
        .reply(200, { task: [], isOk: true, message: '' })
    })
    await act(async () => {
      await fireEvent.click(getByText('Concluir e agendar'))
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'Tarefa não existe ou não há permissão para acesso',
    )
  })
  it('finalizeTask is ok false', async () => {
    const { getByText } = render(component)
    await act(async () => {
      mock
        .onGet(`/api/crm/task`, {
          params: { taskId },
        })
        .reply(200, successData)
    })
    await act(async () => {
      await mock.onPost(`/api/crm/task`).reply(200, {
        validationMessageList: [{ name: 'test' }],
        isOk: false,
        message: '',
      })
    })
    await act(async () => {
      await fireEvent.click(getByText('Concluir e agendar'))
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'Tarefa não existe ou não há permissão para acesso',
    )
  })
  it('finalizeTask catch error', async () => {
    const { getByText } = render(component)
    await act(async () => {
      mock
        .onGet(`/api/crm/task`, {
          params: { taskId },
        })
        .reply(200, successData)
    })
    await act(async () => {
      await mock.onPost(`/api/crm/task`).reply(500, {
        validationMessageList: [{ name: 'test' }],
        isOk: false,
        message: '',
      })
    })
    await act(async () => {
      await fireEvent.click(getByText('Concluir e agendar'))
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'Tarefa não existe ou não há permissão para acesso',
    )
  })
})

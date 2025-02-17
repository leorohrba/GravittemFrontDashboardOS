/* eslint-disable jest/expect-expect */
import { apiCRM } from '@services/api'
import { fireEvent, render } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import { act } from 'react-dom/test-utils'
import Tasks from './Tasks'

const mock = new MockAdapter(apiCRM)

const onChangeHistory = jest.fn(() => c => c)
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
const proposalCanBeUpdate = true
const proposal = {}
const ownerProfile = {}
const component = (
  <Tasks
    proposalId={proposalId}
    onChange={onChangeHistory}
    userPermissions={userPermissions}
    proposalCanBeUpdate={proposalCanBeUpdate}
    proposal={proposal}
    ownerProfile={ownerProfile}
  />
)

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
      observation: null,
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
      taskId: 131,
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
      realizedDate: '2019-10-28T11:23:49.957',
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
    const { getByText } = render(component)
    await act(async () => {
      mock.onGet(`/api/crm/Task`).reply(200, successData)
    })
    expect(getByText('teste')).toBeInTheDocument()
  })
  it('test getTasks is ok false', async () => {
    await act(async () => {
      mock.onGet(`/api/crm/Task`).reply(200, {
        isOk: false,
        message: '',
      })
    })
  })
  it('test getTasks catch', async () => {
    render(component)
    await act(async () => {
      mock.onGet(`/api/crm/Task`).reply(500)
    })
  })
})
describe('crud task', () => {
  it('create new task', async () => {
    const { getByText } = render(component)
    await act(async () => {
      mock.onGet(`/api/crm/Task`).reply(200, successData)
    })
    await act(async () => {
      fireEvent.click(getByText('Nova tarefa'))
    })
  })
  describe('delete tasks', () => {
    it('delete one task', async () => {
      const { getByText } = render(component)
      await act(async () => {
        mock.onGet(`/api/crm/Task`).reply(200, successData)
      })
      await act(async () => {
        const el = document.querySelectorAll('.ant-checkbox-input')[1]
        await fireEvent.click(el)
        await fireEvent.click(getByText(`Excluir (1)`))
        fireEvent.click(getByText('Sim'))
      })
      await act(async () => {
        mock
          .onDelete(`/api/crm/task`, {
            params: {
              taskId: 129,
            },
          })
          .reply(200, {
            isOk: false,
            message: '',
          })
      })
    })

    it('delete multiple tasks', async () => {
      const { getByText } = render(component)
      await act(async () => {
        mock.onGet(`/api/crm/Task`).reply(200, successData)
      })
      await act(async () => {
        const el = document.querySelector('.ant-checkbox-input')
        await fireEvent.click(el)
        const deletableSuccessData = successData.task.filter(
          sucData => !sucData.realizedDate,
        )
        await fireEvent.click(
          getByText(`Excluir (${deletableSuccessData.length})`),
        )
        fireEvent.click(getByText('Sim'))
      })
      await act(async () => {
        mock
          .onDelete(`/api/crm/task`, {
            params: {
              taskId: 129,
            },
          })
          .reply(200, {
            isOk: false,
            message: '',
          })
      })
    })
  })
})
describe('test table header', () => {
  it('sort columns', async () => {
    const { getByText } = render(component)
    await act(async () => {
      await fireEvent.click(getByText('Assunto'))
    })
    await act(async () => {
      await fireEvent.click(getByText('Tipo de tarefa'))
    })
    await act(async () => {
      await fireEvent.click(getByText('Vendedor'))
    })
    await act(async () => {
      await fireEvent.click(getByText('Previsão'))
    })
    await act(async () => {
      await fireEvent.click(getByText('Realizada'))
    })
  })
  it('test finalize and schedule button', async () => {
    const { getAllByTestId } = render(component)
    await act(async () => {
      mock.onGet(`/api/crm/Task`).reply(200, successData)
    })
    const finalizeAndScheduleButton = getAllByTestId(
      'finalize-and-schedule-button',
    )
    await act(async () => {
      fireEvent.click(finalizeAndScheduleButton[0])
    })
  })
  it('test postpone task button', async () => {
    const { getAllByTestId } = render(component)
    await act(async () => {
      mock.onGet(`/api/crm/Task`).reply(200, successData)
    })
    const postponeTaskButton = getAllByTestId('pospone-task-button')
    fireEvent.click(postponeTaskButton[0])
  })
  it('test edit task button', async () => {
    const { getAllByTestId } = render(component)
    await act(async () => {
      mock.onGet(`/api/crm/Task`).reply(200, successData)
    })
    const editTaskButton = getAllByTestId('edit-task-button')
    await act(async () => {
      fireEvent.click(editTaskButton[0])
    })
  })
  it('test proposal cant be updated', async () => {
    render(
      <Tasks
        proposalId={proposalId}
        onChange={onChangeHistory}
        userPermissions={userPermissions}
        proposalCanBeUpdate={false}
        proposal={proposal}
        ownerProfile={ownerProfile}
      />,
    )
    await act(async () => {
      mock.onGet(`/api/crm/Task`).reply(200, successData)
    })
  })
})

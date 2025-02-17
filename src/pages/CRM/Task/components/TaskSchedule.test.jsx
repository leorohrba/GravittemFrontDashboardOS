import { apiCRM } from '@services/api'
import { fireEvent, render } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import { act } from 'react-dom/test-utils'
import TaskSchedule from './TaskSchedule'

const mock = new MockAdapter(apiCRM)

const taskId = 1
const closeTaskSchedule = jest.fn(() => c => c)
const key = 1
const isAllDay = true
const component = (
  <TaskSchedule {...{ taskId, closeTaskSchedule, key, isAllDay }} />
)

describe('schedule task', () => {
  it('schedule task 15 minutes ahead no data', async () => {
    await act(async () => {
      mock.onGet(`/api/crm/task`).reply(200, {
        isOk: true,
        message: '',
        task: [],
      })
    })
    const { getByText } = render(component)
    const fifteenMinutesButton = getByText('Daqui 15 minutos')
    await act(async () => {
      fireEvent.click(fifteenMinutesButton)
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'Tarefa não existe ou não há permissão para acesso',
    )
  })
  it('schedule task 15 minutes ahead with data', async () => {
    await act(async () => {
      mock.onGet(`/api/crm/task`).reply(200, {
        isOk: true,
        message: '',
        task: [
          {
            task: 1,
          },
        ],
      })
      expect(document.querySelector('.ant-message-notice').textContent).toBe(
        'Tarefa não existe ou não há permissão para acesso',
      )
    })
    await act(async () => {
      mock.onPost(`/api/crm/task`).reply(200, {
        isOk: true,
        message: '',
        task: [
          {
            task: 1,
          },
        ],
      })
    })
    const { getByText } = render(component)
    const fifteenMinutesButton = getByText('Daqui 15 minutos')
    await act(async () => {
      fireEvent.click(fifteenMinutesButton)
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'Tarefa não existe ou não há permissão para acesso',
    )
  })
  it('schedule task 15 minutes ahead with data is ok false', async () => {
    await act(async () => {
      mock.onGet(`/api/crm/task`).reply(200, {
        isOk: true,
        message: '',
        task: [
          {
            task: 1,
          },
        ],
      })
      expect(document.querySelector('.ant-message-notice').textContent).toBe(
        'Tarefa não existe ou não há permissão para acesso',
      )
    })
    await act(async () => {
      mock.onPost(`/api/crm/task`).reply(200, {
        isOk: false,
        message: '',
        validationMessageList: [
          {
            validationMessageList: 1,
          },
        ],
      })
    })
    const { getByText } = render(component)
    const fifteenMinutesButton = getByText('Daqui 15 minutos')
    await act(async () => {
      fireEvent.click(fifteenMinutesButton)
    })
  })
  it('schedule task 15 minutes ahead with data is ok true and catch error', async () => {
    await act(async () => {
      await mock.onGet(`/api/crm/task`).reply(200, {
        isOk: true,
        message: '',
        task: [
          {
            task: 1,
          },
        ],
      })
    })
    await act(async () => {
      await mock.onPost(`/api/crm/task`).reply(500, {
        isOk: false,
        message: '',
        validationMessageList: [
          {
            validationMessageList: 1,
          },
        ],
      })
    })
    const { getByText } = render(component)
    const fifteenMinutesButton = getByText('Daqui 15 minutos')
    await act(async () => {
      fireEvent.click(fifteenMinutesButton)
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'Tarefa não existe ou não há permissão para acesso',
    )
  })
  it('schedule task 15 minutes ahead with data catch error', async () => {
    await act(async () => {
      mock.onGet(`/api/crm/task`).reply(500, {
        isOk: false,
        message: '',
        task: [
          {
            task: 1,
          },
        ],
      })
    })
    const { getByText } = render(component)
    const fifteenMinutesButton = getByText('Daqui 15 minutos')
    await act(async () => {
      fireEvent.click(fifteenMinutesButton)
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'Tarefa não existe ou não há permissão para acesso',
    )
  })
  it('schedule task 15 minutes ahead with data is ok false and catch error', async () => {
    await act(async () => {
      mock.onGet(`/api/crm/task`).reply(200, {
        isOk: false,
        message: '',
        task: [
          {
            task: 1,
          },
        ],
      })
    })
    await act(async () => {
      mock.onPost(`/api/crm/task`).reply(500, {
        isOk: false,
        message: '',
        validationMessageList: [
          {
            validationMessageList: 1,
          },
        ],
      })
    })
    const { getByText } = render(component)
    const fifteenMinutesButton = getByText('Daqui 15 minutos')
    await act(async () => {
      fireEvent.click(fifteenMinutesButton)
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'Tarefa não existe ou não há permissão para acesso',
    )
  })
  it('schedule task one hour', async () => {
    await act(async () => {
      mock.onGet(`/api/crm/task`).reply(200, {
        isOk: true,
        message: '',
        task: [],
      })
    })
    const { getByText } = render(component)
    const oneHourButton = getByText('Daqui 1 hora')
    await act(async () => {
      fireEvent.click(oneHourButton)
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'Tarefa não existe ou não há permissão para acesso',
    )
  })
  it('schedule task tomorrow', async () => {
    await act(async () => {
      mock.onGet(`/api/crm/task`).reply(200, {
        isOk: true,
        message: '',
        task: [],
      })
    })
    const { getByText } = render(component)
    const tomorrowButton = getByText('Amanhã')
    await act(async () => {
      fireEvent.click(tomorrowButton)
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'Tarefa não existe ou não há permissão para acesso',
    )
  })
  it('schedule task next monday', async () => {
    await act(async () => {
      mock.onGet(`/api/crm/task`).reply(200, {
        isOk: true,
        message: '',
        task: [],
      })
    })
    const { getByText } = render(component)
    const nextMondayButton = getByText('Próxima segunda-feira')
    await act(async () => {
      fireEvent.click(nextMondayButton)
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'Tarefa não existe ou não há permissão para acesso',
    )
  })
  it('schedule task allDay false', async () => {
    await act(async () => {
      mock.onGet(`/api/crm/task`).reply(200, {
        isOk: true,
        message: '',
        task: [],
      })
    })
    const { getByText } = render(
      <TaskSchedule {...{ taskId, closeTaskSchedule, key }} isAllDay={false} />,
    )
    const nextMondayButton = getByText('Próxima segunda-feira')
    await act(async () => {
      fireEvent.click(nextMondayButton)
    })
    expect(document.querySelector('.ant-message-notice').textContent).toBe(
      'Tarefa não existe ou não há permissão para acesso',
    )
  })
})

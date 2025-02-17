import { apiCRM } from '@services/api'
import { act, fireEvent, render } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import Comments from './Comments'

const mock = new MockAdapter(apiCRM)

const feedbackMessage = 'Preencha o campo comentário antes de adicionar!'

it('change comments', async () => {
  const { getByPlaceholderText } = render(
    <Comments onChange={jest.fn(() => c => c)} proposalId={1} />,
  )
  const addComments = getByPlaceholderText('Adicionar comentários')
  await act(async () => {
    fireEvent.change(addComments, { target: { value: 'test' } })
  })
  expect(addComments).toHaveTextContent('test')
})

it('save comment without value', async () => {
  const { getByText } = render(
    <Comments onChange={jest.fn(() => c => c)} proposalId={1} />,
  )

  const addCommentButton = getByText('Adicionar')
  await act(async () => {
    fireEvent.click(addCommentButton)
  })
  expect(document.querySelector('.ant-message-notice').textContent).toBe(
    feedbackMessage,
  )
})
it('save comment with value isOk true', async () => {
  const onChange = jest.fn()
  const { getByText, getByPlaceholderText } = render(
    <Comments onChange={onChange} proposalId={1} />,
  )
  await act(async () => {
    await mock.onPost(`/api/crm/proposalHistory`).reply(200, {
      task: [],
      isOk: true,
      message: '',
      data: ['test'],
    })
  })
  const addComments = getByPlaceholderText('Adicionar comentários')
  await act(async () => {
    fireEvent.change(addComments, {
      target: {
        value: 'test',
      },
    })
  })
  const addCommentButton = getByText('Adicionar')
  await act(async () => {
    fireEvent.click(addCommentButton)
  })
  expect(onChange).toHaveBeenCalled()
})
it('save comment with value isOk false and validation error message', async () => {
  const { getByText, getByPlaceholderText } = render(
    <Comments onChange={jest.fn(() => c => c)} proposalId={1} />,
  )
  await act(async () => {
    await mock.onPost(`/api/crm/proposalHistory`).reply(200, {
      isOk: false,
      message: '',
      validationMessageList: ['test', 'test2'],
    })
  })
  const addComments = getByPlaceholderText('Adicionar comentários')
  await act(async () => {
    fireEvent.change(addComments, {
      target: {
        value: 'test',
      },
    })
  })
  const addCommentButton = getByText('Adicionar')
  await act(async () => {
    fireEvent.click(addCommentButton)
  })
  expect(document.querySelector('.ant-message-notice').textContent).toBe(
    feedbackMessage,
  )
})
it('save comment with value isOk false without validation error message', async () => {
  const { getByText, getByPlaceholderText } = render(
    <Comments onChange={jest.fn(() => c => c)} proposalId={1} />,
  )
  await act(async () => {
    await mock.onPost(`/api/crm/proposalHistory`).reply(200, {
      isOk: false,
      message: '',
      validationMessageList: [],
    })
  })
  const addComments = getByPlaceholderText('Adicionar comentários')
  await act(async () => {
    fireEvent.change(addComments, { target: { value: 'test' } })
  })
  const addCommentButton = getByText('Adicionar')
  await act(async () => {
    fireEvent.click(addCommentButton)
  })
  expect(document.querySelector('.ant-message-notice').textContent).toBe(
    feedbackMessage,
  )
})
it('save comment with value catch error', async () => {
  const { getByText, getByPlaceholderText } = render(
    <Comments onChange={jest.fn(() => c => c)} proposalId={1} />,
  )
  await act(async () => {
    await mock.onPost(`/api/crm/proposalHistory`).reply(500, {
      isOk: false,
      message: '',
      validationMessageList: [],
    })
  })
  const addComments = getByPlaceholderText('Adicionar comentários')
  await act(async () => {
    fireEvent.change(addComments, { target: { value: 'test' } })
  })
  const addCommentButton = getByText('Adicionar')
  await act(async () => {
    fireEvent.click(addCommentButton)
  })
  expect(document.querySelector('.ant-message-notice').textContent).toBe(
    feedbackMessage,
  )
})

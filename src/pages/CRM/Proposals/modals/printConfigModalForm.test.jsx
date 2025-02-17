import { render } from '@testing-library/react'
import React from 'react'
import PrintConfigModalForm from './printConfigModalForm'

it('test form', async () => {
  const getFieldDecorator = jest.fn(() => c => c)
  const handleSubmit = jest.fn(() => c => c)
  const loadingData = false
  const { getByText } = render(
    <PrintConfigModalForm
      loadingData={loadingData}
      getFieldDecorator={getFieldDecorator}
      handleSubmit={handleSubmit}
    />,
  )
  expect(getByText('Título')).toBeInTheDocument()
  expect(getByText('Descrição')).toBeInTheDocument()
})

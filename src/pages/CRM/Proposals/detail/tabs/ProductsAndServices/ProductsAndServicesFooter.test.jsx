import { render } from '@testing-library/react'
import { addBrlCurrencyToNumber } from '@utils'
import ProductsAndServicesFooter from './ProductsAndServicesFooter'

it('test not loading', async () => {
  const recurringValue = 100
  const singleTotalAmount = 10
  const loading = false
  const { getByText } = render(
    <ProductsAndServicesFooter
      {...{ recurringValue, singleTotalAmount, loading }}
    />,
  )
  expect(getByText(addBrlCurrencyToNumber(recurringValue))).toBeInTheDocument()
  expect(
    getByText(addBrlCurrencyToNumber(singleTotalAmount)),
  ).toBeInTheDocument()
})

it('test is loading', async () => {
  const recurringValue = 100
  const singleTotalAmount = 10
  const loading = true
  render(
    <ProductsAndServicesFooter
      {...{
        recurringValue,
        singleTotalAmount,
        loading,
      }}
    />,
  )
  const spinnersQuantity = document.querySelectorAll('.ant-spin-dot').length
  expect(spinnersQuantity).toBeGreaterThan(0)
})

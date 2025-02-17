import { render } from '@testing-library/react'
import HistoryTimelineCheckbox from './HistoryTimelineCheckbox'

it('test checkbox', async () => {
  const { getByText } = render(
    <HistoryTimelineCheckbox
      indeterminate={false}
      onCheckAllChange={jest.fn(() => c => c)}
      checkAll
      plainOptions={[]}
      checkedList={[]}
      onChange={jest.fn(() => c => c)}
    />,
  )
  expect(getByText('Selecionar todos')).toBeInTheDocument()
})

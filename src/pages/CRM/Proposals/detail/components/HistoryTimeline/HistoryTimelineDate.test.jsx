import { render } from '@testing-library/react'
import moment from 'moment'
import HistoryTimelineDate from './HistoryTimelineDate'

it('test date formatted', () => {
  const { getByText } = render(<HistoryTimelineDate date={{}} />)
  expect(getByText(moment().format('D MMM YYYY, HH:mm'))).toBeInTheDocument()
})

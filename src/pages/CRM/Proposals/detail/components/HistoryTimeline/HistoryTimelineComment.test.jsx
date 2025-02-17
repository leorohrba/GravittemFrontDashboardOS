import { render } from '@testing-library/react'
import HistoryTimelineComment from './HistoryTimelineComment'

it('test with comments is rendered correctly', async () => {
  const newValue = 'test/ntest2'
  const { getByText } = render(
    <HistoryTimelineComment
      key={1}
      date={{}}
      proposalId={1}
      title="title"
      action="Alter"
      oldValue=""
      newValue="test/ntest2"
      userName="user"
    />,
  )
  expect(getByText('title por user')).toBeInTheDocument()
  expect(getByText(newValue)).toBeInTheDocument()
})

it('test without comments is rendered correctly', async () => {
  const { getByText } = render(
    <HistoryTimelineComment
      key={1}
      date={{}}
      proposalId={1}
      title="title"
      action="Alter"
      oldValue=""
      newValue=""
      userName="user"
    />,
  )
  expect(getByText('title por user')).toBeInTheDocument()
})

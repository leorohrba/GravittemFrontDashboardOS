import { render } from '@testing-library/react'
import HistoryTimelineAttachment from './HistoryTimelineAttachment'

it('test send action', async () => {
  const { getByText } = render(
    <HistoryTimelineAttachment
      key={1}
      date={{}}
      proposalId={1}
      title="title"
      action="Send"
      oldValue="old"
      newValue="new"
      userName="user"
    />,
  )
  expect(getByText('Enviado por user')).toBeInTheDocument()
  expect(getByText('new')).toBeInTheDocument()
})
it('test deleted action', async () => {
  const { getByText } = render(
    <HistoryTimelineAttachment
      key={1}
      date={{}}
      proposalId={1}
      title="title"
      action="Exclude"
      oldValue="old"
      newValue="new"
      userName="user"
    />,
  )
  expect(getByText('Excluido por user')).toBeInTheDocument()
  expect(getByText('new')).toBeInTheDocument()
})
it('test without new value', async () => {
  const { getByText } = render(
    <HistoryTimelineAttachment
      key={1}
      date={{}}
      proposalId={1}
      title="title"
      action="Exclude"
      oldValue="old"
      newValue=""
      userName="user"
    />,
  )
  expect(getByText('old')).toBeInTheDocument()
})

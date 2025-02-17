import { render } from '@testing-library/react'
import HistoryTimelineTask from './HistoryTimelineTask'

it('with observation', async () => {
  const { getByText } = render(
    <HistoryTimelineTask
      date={{}}
      title="title"
      action="Send"
      oldValue="old"
      newValue='{ "observation":"test"}'
      userName="user"
    />,
  )
  expect(getByText('test')).toBeInTheDocument()
})
it('test Include', async () => {
  const { getByText } = render(
    <HistoryTimelineTask
      date={{}}
      title="title"
      action="Include"
      oldValue="old"
      newValue='{ "observation":"test"}'
      userName="user"
    />,
  )
  expect(getByText('test')).toBeInTheDocument()
})
it('test Exclude', async () => {
  const { getByText } = render(
    <HistoryTimelineTask
      date={{}}
      title="title"
      action="Exclude"
      oldValue="old"
      newValue='{ "observation":"test", "task": {"subject": "test", "expectedDuration": 2 }}'
      userName="user"
    />,
  )
  expect(getByText('test')).toBeInTheDocument()
})

it('without observation', async () => {
  render(
    <HistoryTimelineTask
      date={{}}
      title="title"
      action="Send"
      oldValue="old"
      newValue=""
      userName="user"
    />,
  )
  const node = (
    <body>
      <div />
    </body>
  )
  expect(node).toMatchSnapshot()
})

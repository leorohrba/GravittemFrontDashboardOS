import { render } from '@testing-library/react'
import HistoryTimelineProposal from './HistoryTimelineProposal'

describe('action include', () => {
  it('oldValue and newValue empty', () => {
    const { getByText } = render(
      <HistoryTimelineProposal
        key={1}
        date={{}}
        proposalId={1}
        title="title"
        action="Include"
        oldValue=""
        newValue=""
        userName="user"
      />,
    )
    expect(getByText('title')).toBeInTheDocument()
    expect(getByText(`- por user`)).toBeInTheDocument()
  })
})
describe('Alter action', () => {
  it('oldValue and newValue empty', () => {
    const { getByText } = render(
      <HistoryTimelineProposal
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
    expect(getByText('title')).toBeInTheDocument()
    expect(getByText('Nenhum valor alterado')).toBeInTheDocument()
  })

  it('oldValue empty', () => {
    const { getByText } = render(
      <HistoryTimelineProposal
        key={1}
        date={{}}
        proposalId={1}
        title="title"
        action="Alter"
        oldValue=""
        newValue="test"
        userName="user"
      />,
    )
    expect(getByText('title')).toBeInTheDocument()
    expect(getByText('test')).toBeInTheDocument()
  })
  it('newValue empty', () => {
    const { getByText } = render(
      <HistoryTimelineProposal
        key={1}
        date={{}}
        proposalId={1}
        title="title"
        action="Alter"
        oldValue="old"
        newValue=""
        userName="user"
      />,
    )
    expect(getByText('title sendo retirado o valor')).toBeInTheDocument()
  })
  it('all values filled', () => {
    const { getByText } = render(
      <HistoryTimelineProposal
        key={1}
        date={{}}
        proposalId={1}
        title="title"
        action="Alter"
        oldValue="old"
        newValue="new"
        userName="user"
      />,
    )
    expect(getByText('title de')).toBeInTheDocument()
    expect(getByText('old')).toBeInTheDocument()
  })
})

describe('action Delete', () => {
  it('test component', () => {
    const { getByText } = render(
      <HistoryTimelineProposal
        key={1}
        date={{}}
        proposalId={1}
        title="title"
        action="Delete"
        oldValue=""
        newValue=""
        userName="user"
      />,
    )
    expect(getByText('title')).toBeInTheDocument()
    expect(getByText('title por user')).toBeInTheDocument()
  })
  it('oldValue and newValue empty', () => {
    const { getByText } = render(
      <HistoryTimelineProposal
        key={1}
        date={{}}
        proposalId={1}
        title="title"
        action="Delete"
        oldValue="test"
        newValue=""
        userName="user"
      />,
    )
    expect(getByText('title')).toBeInTheDocument()
    expect(getByText('title, valor: test por user')).toBeInTheDocument()
  })
})

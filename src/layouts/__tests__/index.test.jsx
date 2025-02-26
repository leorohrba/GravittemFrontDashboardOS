import renderer from 'react-test-renderer'
import BasicLayout from '..'

describe('Layout: BasicLayout', () => {
  it('Render correctly', () => {
    const wrapper = renderer.create(<BasicLayout />)
    expect(wrapper.root.children.length).toBe(1)
    const outerLayer = wrapper.root.children[0]
    expect(outerLayer.type).toBe('div')
  })
})

import chai, { expect } from 'chai'
import chaiVirtualDOM from 'chai-virtual-dom'
import { hJSX } from '@cycle/dom'
chai.use(chaiVirtualDOM)

describe('test', () => {
  const vtree =  <h1>test</h1>

  it('should look like', () => {
    const expected = <h1 />
    expect(vtree).to.look.like(expected)
  })

  it('should look exactly like', () => {
    const expected = <h1>{ 'test' }</h1>
    expect(vtree).to.look.exactly.like(expected)
  })
})


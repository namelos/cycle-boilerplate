import { expect } from 'chai'
import { sum, difference, multiply, first, second, parseString } from '../auxiliary'

describe('sum', () => {
  it('sum 1 and 2 should equals 3', () =>
    expect(sum(1, 2)).to.equal(3))
  it('should concat two strings', () =>
    expect(sum('hello', ' world')).to.equal('hello world'))
})

describe('difference', () =>
  it('difference between 3 and 2 should equals 1', () =>
    expect(difference(3, 2)).to.equal(1)))

describe('multiply', () =>
  it('multiply 2 and 3 should equals 6', () =>
    expect(multiply(2, 3)).to.equal(6)))

describe('first', () =>
  it('should return first element in a array pair', () =>
    expect(first(['the 1st', 'the 2nd'])).to.equal('the 1st')))

describe('second', () =>
  it('should return second element in a array pair', () =>
    expect(second(['the 1st', 'the 2nd'])).to.equal('the 2nd')))

describe('parse string', () => {
  it('should split string to array pair', () =>
    expect(parseString("ITEM000003-2")).to.eql(["ITEM000003", 2]))
  it('should give a default 1 value as its quantity', () =>
    expect(parseString("ITEM000001")).to.eql(["ITEM000001", 1]))
})
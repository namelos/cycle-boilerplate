import { expect } from 'chai'
import { buyOneGetOneFree, ninetyFivePercentDiscount } from '../data'
import { getUnit, getPrice, getFormulae } from '../mapping'

describe('getUnit', () =>
  it('should get unit of the gategory', () => 
    expect(getUnit('ITEM000001')).to.equal('个')))

describe('getPrice', () =>
  it('should get price of the category', () =>
    expect(getPrice('ITEM000001')).to.equal(1)))

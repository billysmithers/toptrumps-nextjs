import {Capability} from "../Capability";

describe('Capability', () => {
  it('can instantiate and turn into an object', () => {
    let capability = new Capability('year', 1972)

    expect(capability.toObject()).toStrictEqual({
      capability: 'year',
      value: 1972
    })

    capability = new Capability('weight_(kg)', 1000.97)

    expect(capability.toObject()).toStrictEqual({
      capability: 'weight_(kg)',
      value: 1000.97
    })
  })
})

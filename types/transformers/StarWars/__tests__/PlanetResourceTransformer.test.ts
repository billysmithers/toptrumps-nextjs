import {PlanetResourceTransformer} from "../PlanetResourceTransformer";
import {Card} from "../../../Card";

describe('PlanetResourceTransformer', () => {
  it('can transform planet data', () => {
    const card = new Card(
      'Hoth',
      [
        {
          key: "rotation period",
          value: "23"
        },
        {
          key: "gravity",
          value: "1.1 standard"
        },
        {
          key: "orbital period",
          value: "549"
        },
        {
          key: "diameter",
          value: "7200"
        },
        {
          key: "surface water",
          value: "100"
        },
      ],
      null
    );

    const transformer = new PlanetResourceTransformer
    const transformed = transformer.forCard({
      name: "Hoth",
      rotation_period: "23",
      orbital_period: "549",
      diameter: "7200",
      climate: "frozen",
      gravity: "1.1 standard",
      terrain: "tundra, ice caves, mountain ranges",
      surface_water: "100",
      population: "unknown",
      residents: [],
      films: [
        "https://swapi.dev/api/films/1/"
      ],
      created: "2014-12-10T11:37:19.144000Z",
      edited: "2014-12-20T20:58:18.421000Z",
      url: "https://swapi.dev/api/planets/3/"
    })

    expect(card.toObject()).toStrictEqual(transformed)
  })
})
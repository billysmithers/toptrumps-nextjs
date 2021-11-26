import {CharacterResourceTransformer} from "../CharacterResourceTransformer";
import {Card} from "../../../Card";

describe('CharacterResourceTransformer', () => {
  it('can transform character data', () => {
    const card = new Card(
      'Bulbasaur',
      [
        {
          key: "base experience",
          value: "64"
        },
        {
          key: "height",
          value: "7"
        },
        {
          key: "hp",
          value: "45"
        },
        {
          key: "order",
          value: "1"
        },
        {
          key: "special attack",
          value: "49"
        },
        {
          key: "weight",
          value: "69"
        },
      ],
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
    );

    const transformer = new CharacterResourceTransformer
    const transformed = transformer.forCard({
      id: 1,
      name: "bulbasaur",
      abilities: [],
      base_experience: 64,
      forms: [],
      height: 7,
      is_default: false,
      order: 1,
      weight: 69,
      game_indices: [],
      held_items: [],
      location_area_encounters: "https://pokeapi.co/api/v2/pokemon/1/encounters",
      moves: [],
      past_types: [],
      sprites: {
        other: {
          "official-artwork": {
            front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
          }
        }
      },
      species: {},
      stats: [
        {
          base_stat: 45,
          effort: 0,
          stat: {
            name: "hp",
            url: "https://pokeapi.co/api/v2/stat/1/"
          }
        },
        {
          base_stat: 49,
          effort: 0,
          stat: {
            name: "special-attack",
            url: "https://pokeapi.co/api/v2/stat/2/"
          }
        },
      ],
      types: []
    })

    expect(card.toObject()).toStrictEqual(transformed)
  })
})
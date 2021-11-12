import {Card} from "../Card";

describe('Card', () => {
  it('can instantiate and turn into an object', () => {
    const card = new Card(
      'Ford Mustang',
      [
        {
          key: "year",
          value: "1972"
        },
        {
          key: "engine_size_(cc)",
          value: "2000"
        },
        {
          key: "wheels",
          value: "4"
        },
      ],
    'https://cdn.example.com/image.jpg'
    )

    expect(card.toObject()).toStrictEqual({
      name: 'Ford Mustang',
      capabilities: [
        {
          capability: "engine_size_(cc)",
          value: 2000
        },
        {
          capability: "wheels",
          value: 4
        },
        {
          capability: "year",
          value: 1972
        },
      ],
      imageUrl: 'https://cdn.example.com/image.jpg'
    })
  })
})

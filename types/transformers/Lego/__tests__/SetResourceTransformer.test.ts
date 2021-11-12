import {SetResourceTransformer} from "../SetResourceTransformer";
import {Card} from "../../../Card";

describe('SetResourceTransformer', () => {
  it('can transform set data', () => {
    const card = new Card(
      'Town Mini-Figures',
      [
        {
          key: "year",
          value: "1978"
        },
        {
          key: "num parts",
          value: "12"
        },
        {
          key: "set num",
          value: "11"
        },
      ],
      "https://cdn.rebrickable.com/media/sets/0011-2/3318.jpg"
    );

    const transformer = new SetResourceTransformer
    const transformed = transformer.forCard({
      name: 'Town Mini-Figures',
      set_num: '0011-2',
      year: 1978,
      theme_id: 84,
      num_parts: 12,
      set_img_url: 'https://cdn.rebrickable.com/media/sets/0011-2/3318.jpg',
      set_url: 'https://rebrickable.com/sets/0011-2/town-mini-figures/',
      last_modified_dt: '2013-12-08T15:42:23.174688Z',
    })

    expect(card.toObject()).toStrictEqual(transformed)
  })
})
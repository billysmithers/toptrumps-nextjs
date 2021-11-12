import {TransportResourceTransformer} from "../TransportResourceTransformer";
import {Card} from "../../../Card";

describe('TransportResourceTransformer', () => {
  it('can transform starship data', () => {
    const card = new Card(
      'Death Star',[
        {
          key: "cost in credits",
          value: "1000000000000"
        },
        {
          key: "length",
          value: "120000"
        },
        {
          key: "cargo capacity",
          value: "1000000000000"
        },
        {
          key: "MGLT",
          value: "10"
        },
        {
          key: "consumables (days)",
          value: "1095"
        },
        {
          key: "crew",
          value: "342953"
        },
        {
          key: "passengers",
          value: "843342"
        },
        {
          key: "hyperdrive rating",
          value: "4.0"
        }
      ],
      null
    );

    const transformer = new TransportResourceTransformer();
    const transformed = transformer.forCard({
      name: "Death Star",
      model: "DS-1 Orbital Battle Station",
      manufacturer: "Imperial Department of Military Research, Sienar Fleet Systems",
      cost_in_credits: "1000000000000",
      length: "120000",
      max_atmosphering_speed: "n/a",
      crew: "342,953",
      passengers: "843,342",
      cargo_capacity: "1000000000000",
      consumables: "3 years",
      hyperdrive_rating: "4.0",
      MGLT: "10",
      starship_class: "Deep Space Mobile Battlestation",
      pilots: [],
      films: [
        "https://swapi.dev/api/films/1/"
      ],
      created: "2014-12-10T11:37:19.144000Z",
      edited: "2014-12-20T20:58:18.421000Z",
      url: "https://swapi.dev/api/starships/9/"
    })

    expect(card.toObject()).toStrictEqual(transformed)
  })

  it('can transform vehicle data', () => {
    const card = new Card(
      'Sand Crawler',[
        {
          key: "cargo capacity",
          value: "50000"
        },
        {
          key: "cost in credits",
          value: "150000"
        },
        {
          key: "crew",
          value: "46"
        },
        {
          key: "length",
          value: "36.8"
        },
        {
          key: "max atmosphering speed",
          value: "30"
        },
        {
          key: "consumables (days)",
          value: "56"
        },
        {
          key: "passengers",
          value: "30"
        },
      ],
      null
    );

    const transformer = new TransportResourceTransformer();
    const transformed = transformer.forCard({
      name: "Sand Crawler",
      model: "Digger Crawler",
      manufacturer: "Corellia Mining Corporation",
      cost_in_credits: "150000",
      length: "36.8",
      max_atmosphering_speed: "30",
      crew: "46",
      passengers: "30",
      cargo_capacity: "50000",
      consumables: "2 months",
      vehicle_class: "wheeled",
      pilots: [],
      films: [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/5/"
      ],
      created: "2014-12-10T15:36:25.724000Z",
      edited: "2014-12-20T21:30:21.661000Z",
      url: "https://swapi.dev/api/vehicles/4/"
    })

    expect(card.toObject()).toStrictEqual(transformed)
  })

  it('ignores unapplicable consumables', () => {
    const card = new Card(
      'Sand Crawler',[
        {
          key: "cargo capacity",
          value: "50000"
        },
        {
          key: "cost in credits",
          value: "150000"
        },
        {
          key: "crew",
          value: "46"
        },
        {
          key: "length",
          value: "36.8"
        },
        {
          key: "max atmosphering speed",
          value: "30"
        },
        {
          key: "passengers",
          value: "30"
        },
      ],
      null
    );

    const transformer = new TransportResourceTransformer();

    const unknownConsumables = transformer.forCard({
      name: "Sand Crawler",
      model: "Digger Crawler",
      manufacturer: "Corellia Mining Corporation",
      cost_in_credits: "150000",
      length: "36.8",
      max_atmosphering_speed: "30",
      crew: "46",
      passengers: "30",
      cargo_capacity: "50000",
      consumables: "unknown",
      vehicle_class: "wheeled",
      pilots: [],
      films: [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/5/"
      ],
      created: "2014-12-10T15:36:25.724000Z",
      edited: "2014-12-20T21:30:21.661000Z",
      url: "https://swapi.dev/api/vehicles/4/"
    })

    expect(card.toObject()).toStrictEqual(unknownConsumables)

    const noConsumables = transformer.forCard({
      name: "Sand Crawler",
      model: "Digger Crawler",
      manufacturer: "Corellia Mining Corporation",
      cost_in_credits: "150000",
      length: "36.8",
      max_atmosphering_speed: "30",
      crew: "46",
      passengers: "30",
      cargo_capacity: "50000",
      consumables: "none",
      vehicle_class: "wheeled",
      pilots: [],
      films: [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/5/"
      ],
      created: "2014-12-10T15:36:25.724000Z",
      edited: "2014-12-20T21:30:21.661000Z",
      url: "https://swapi.dev/api/vehicles/4/"
    })

    expect(card.toObject()).toStrictEqual(noConsumables)
  })

  it('formats consumables correctly', () => {
    const transformer = new TransportResourceTransformer();

    const twoDaysCard = new Card(
      'Sand Crawler',[
        {
          key: "cargo capacity",
          value: "50000"
        },
        {
          key: "cost in credits",
          value: "150000"
        },
        {
          key: "crew",
          value: "46"
        },
        {
          key: "length",
          value: "36.8"
        },
        {
          key: "max atmosphering speed",
          value: "30"
        },
        {
          key: "passengers",
          value: "30"
        },
        {
          key: "consumables (days)",
          value: "2"
        },
      ],
      null
    );

    const twoDaysConsumables = transformer.forCard({
      name: "Sand Crawler",
      model: "Digger Crawler",
      manufacturer: "Corellia Mining Corporation",
      cost_in_credits: "150000",
      length: "36.8",
      max_atmosphering_speed: "30",
      crew: "46",
      passengers: "30",
      cargo_capacity: "50000",
      consumables: "2 days",
      vehicle_class: "wheeled",
      pilots: [],
      films: [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/5/"
      ],
      created: "2014-12-10T15:36:25.724000Z",
      edited: "2014-12-20T21:30:21.661000Z",
      url: "https://swapi.dev/api/vehicles/4/"
    })

    expect(twoDaysCard.toObject()).toStrictEqual(twoDaysConsumables)

    const oneWeekCard = new Card(
      'Sand Crawler',[
        {
          key: "cargo capacity",
          value: "50000"
        },
        {
          key: "cost in credits",
          value: "150000"
        },
        {
          key: "crew",
          value: "46"
        },
        {
          key: "length",
          value: "36.8"
        },
        {
          key: "max atmosphering speed",
          value: "30"
        },
        {
          key: "passengers",
          value: "30"
        },
        {
          key: "consumables (days)",
          value: "7"
        },
      ],
      null
    );

    const oneWeekConsumables = transformer.forCard({
      name: "Sand Crawler",
      model: "Digger Crawler",
      manufacturer: "Corellia Mining Corporation",
      cost_in_credits: "150000",
      length: "36.8",
      max_atmosphering_speed: "30",
      crew: "46",
      passengers: "30",
      cargo_capacity: "50000",
      consumables: "1 week",
      vehicle_class: "wheeled",
      pilots: [],
      films: [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/5/"
      ],
      created: "2014-12-10T15:36:25.724000Z",
      edited: "2014-12-20T21:30:21.661000Z",
      url: "https://swapi.dev/api/vehicles/4/"
    })

    expect(oneWeekCard.toObject()).toStrictEqual(oneWeekConsumables)

    const zeroConsumablesCard = new Card(
      'Sand Crawler',[
        {
          key: "cargo capacity",
          value: "50000"
        },
        {
          key: "cost in credits",
          value: "150000"
        },
        {
          key: "crew",
          value: "46"
        },
        {
          key: "length",
          value: "36.8"
        },
        {
          key: "max atmosphering speed",
          value: "30"
        },
        {
          key: "passengers",
          value: "30"
        },
        {
          key: "consumables (days)",
          value: "0"
        },
      ],
      null
    );

    const zeroConsumables = transformer.forCard({
      name: "Sand Crawler",
      model: "Digger Crawler",
      manufacturer: "Corellia Mining Corporation",
      cost_in_credits: "150000",
      length: "36.8",
      max_atmosphering_speed: "30",
      crew: "46",
      passengers: "30",
      cargo_capacity: "50000",
      consumables: "0",
      vehicle_class: "wheeled",
      pilots: [],
      films: [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/5/"
      ],
      created: "2014-12-10T15:36:25.724000Z",
      edited: "2014-12-20T21:30:21.661000Z",
      url: "https://swapi.dev/api/vehicles/4/"
    })

    expect(zeroConsumablesCard.toObject()).toStrictEqual(zeroConsumables)
  })
})

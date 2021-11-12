import {StarshipData, StarshipsFetcher} from "../StarshipsFetcher";
import fetch from "jest-fetch-mock";
import {logTypes} from "../../logTypes";

fetch.enableMocks()

describe('StarshipsFetcher',() => {
  let starshipsFetcher;

  beforeEach(() => {
    fetch.resetMocks()
    starshipsFetcher = new StarshipsFetcher()
  });

  it ('fetches Starships',async () => {
    fetch.mockResponses(
      [
        JSON.stringify({
            next: `${starshipsFetcher.baseUrl}starships/?page=2`,
            results: [
              {
                name: "Death Star"
              },
            ]
        }),
        { status: 200 }
      ],
      [
        JSON.stringify({
          results: [
            {
              name: "Millenium Falcon"
            },
          ]
        }),
        { status: 200 }
      ],
    )

    await starshipsFetcher.fetch().then((starshipsData: StarshipData[]) => {
      expect(starshipsData).toEqual([
        {
          name: "Death Star"
        },
        {
          name: "Millenium Falcon"
        },
      ])
    })
  })

  it ('handles no page data', async() => {
    fetch.mockResponse(JSON.stringify(null), { status: 500 })

    await starshipsFetcher.fetch().then((starshipsData: StarshipData[]) => {
      expect(starshipsData).toBeNull()
    })
  })

  it ('logs exceptions', async() => {
    fetch.mockResponse(JSON.stringify({detail: "not found"}), { status: 404 })
    fetch.mockReject(new Error('Detail: not found'))

    await starshipsFetcher.fetch().then((starshipsData: StarshipData[]) => {
      expect(starshipsData).toBeNull()
    }).catch(() => {
      expect(global.console.error).toHaveBeenCalledWith(
        "Failed to fetch Star Wars starships/ due to issues with the JSON response.",
        {
          exception: "Detail: not found",
          logType: logTypes.STAR_WARS,
          responseBody: {detail: "not found"}
        }
      )
    })
  })
})
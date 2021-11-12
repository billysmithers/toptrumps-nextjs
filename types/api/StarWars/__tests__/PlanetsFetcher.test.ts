import {PlanetData, PlanetsFetcher} from "../PlanetsFetcher";
import fetch from "jest-fetch-mock";
import {logTypes} from "../../logTypes";

fetch.enableMocks()

describe('PlanetsFetcher',() => {
  let planetsFetcher;

  beforeEach(() => {
    fetch.resetMocks()
    planetsFetcher = new PlanetsFetcher()
  });

  it ('fetches Planets',async () => {
    fetch.mockResponses(
      [
        JSON.stringify({
            next: `${planetsFetcher.baseUrl}planets/?page=2`,
            results: [
              {
                name: "Hoth"
              },
            ]
        }),
        { status: 200 }
      ],
      [
        JSON.stringify({
          results: [
            {
              name: "Yavin IV"
            },
          ]
        }),
        { status: 200 }
      ],
    )

    await planetsFetcher.fetch().then((planetData: PlanetData[]) => {
      expect(planetData).toEqual([
        {
          name: "Hoth"
        },
        {
          name: "Yavin IV"
        },
      ])
    })
  })

  it ('handles no page data', async() => {
    fetch.mockResponse(JSON.stringify(null), { status: 500 })

    await planetsFetcher.fetch().then((planetData: PlanetData[]) => {
      expect(planetData).toBeNull()
    })
  })

  it ('logs exceptions', async() => {
    fetch.mockResponse(JSON.stringify({detail: "not found"}), { status: 404 })
    fetch.mockReject(new Error('Detail: not found'))

    await planetsFetcher.fetch().then((planetData: PlanetData[]) => {
      expect(planetData).toBeNull()
    }).catch(() => {
      expect(global.console.error).toHaveBeenCalledWith(
        "Failed to fetch Star Wars planets/ due to issues with the JSON response.",
        {
          exception: "Detail: not found",
          logType: logTypes.STAR_WARS,
          responseBody: {detail: "not found"}
        }
      )
    })
  })
})
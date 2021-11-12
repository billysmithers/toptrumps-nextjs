import {VehicleData, VehiclesFetcher} from "../VehiclesFetcher";
import fetch from "jest-fetch-mock";
import {logTypes} from "../../logTypes";

fetch.enableMocks()

describe('VehiclesFetcher',() => {
  let vehiclesFetcher;

  beforeEach(() => {
    fetch.resetMocks()
    vehiclesFetcher = new VehiclesFetcher()
  });

  it ('fetches Vehicles',async () => {
    fetch.mockResponses(
      [
        JSON.stringify({
            next: `${vehiclesFetcher.baseUrl}vehicles/?page=2`,
            results: [
              {
                name: "Sand Crawler"
              },
            ]
        }),
        { status: 200 }
      ],
      [
        JSON.stringify({
          results: [
            {
              name: "T-16 skyhopper"
            },
          ]
        }),
        { status: 200 }
      ],
    )

    await vehiclesFetcher.fetch().then((vehiclesData: VehicleData[]) => {
      expect(vehiclesData).toEqual([
        {
          name: "Sand Crawler"
        },
        {
          name: "T-16 skyhopper"
        },
      ])
    })
  })

  it ('handles no page data', async() => {
    fetch.mockResponse(JSON.stringify(null), { status: 500 })

    await vehiclesFetcher.fetch().then((vehiclesData: VehicleData[]) => {
      expect(vehiclesData).toBeNull()
    })
  })

  it ('logs exceptions', async() => {
    fetch.mockResponse(JSON.stringify({detail: "not found"}), { status: 404 })
    fetch.mockReject(new Error('Detail: not found'))

    await vehiclesFetcher.fetch().then((vehiclesData: VehicleData[]) => {
      expect(vehiclesData).toBeNull()
    }).catch(() => {
      expect(global.console.error).toHaveBeenCalledWith(
        "Failed to fetch Star Wars vehicles/ due to issues with the JSON response.",
        {
          exception: "Detail: not found",
          logType: logTypes.STAR_WARS,
          responseBody: {detail: "not found"}
        }
      )
    })
  })
})
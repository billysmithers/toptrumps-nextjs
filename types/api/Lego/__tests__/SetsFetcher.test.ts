import {SetData, SetsFetcher} from "../SetsFetcher";
import fetch from "jest-fetch-mock";
import {logTypes} from "../../logTypes";

fetch.enableMocks()

describe('SetsFetcher',() => {
  let setsFetcher;

  beforeEach(() => {
    fetch.resetMocks()
    setsFetcher = new SetsFetcher()
  });

  it ('fetches Sets',async () => {
    fetch.mockResponses(
      [
        JSON.stringify({
            results: [
              {
                name: "Basic set"
              },
              {
                name: "Classic Castle"
              },
            ]
        }),
        { status: 200 }
      ],
    )

    await setsFetcher.fetch().then((setsData: SetData[]) => {
      expect(setsData).toEqual([
        {
          name: "Basic set"
        },
        {
          name: "Classic Castle"
        },
      ])
    })
  })

  it ('handles no page data', async() => {
    fetch.mockResponse(JSON.stringify(null), { status: 500 })

    await setsFetcher.fetch().then((setsData: SetData[]) => {
      expect(setsData).toBeNull()
    })
  })

  it ('logs exceptions', async() => {
    fetch.mockResponse(JSON.stringify({detail: "not found"}), { status: 404 })
    fetch.mockReject(new Error('Detail: not found'))

    await setsFetcher.fetch().then((setsData: SetData[]) => {
      expect(setsData).toBeNull()
    }).catch(() => {
      expect(global.console.error).toHaveBeenCalledWith(
        "Failed to fetch Lego sets due to issues with the JSON response.",
        {
          exception: "Detail: not found",
          logType: logTypes.LEGO,
          responseBody: {detail: "not found"}
        }
      )
    })
  })
})
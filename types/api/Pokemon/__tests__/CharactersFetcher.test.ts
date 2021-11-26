import {CharacterData, CharactersFetcher} from "../CharactersFetcher";
import fetch from "jest-fetch-mock";
import {logTypes} from "../../logTypes";

fetch.enableMocks()

describe('CharactersFetcher',() => {
  let charactersFetcher;

  beforeEach(() => {
    fetch.resetMocks()
    charactersFetcher = new CharactersFetcher()
    charactersFetcher.numberOfCharactersToFetch = 2;
  });

  it ('fetches Characters',async () => {
    fetch.mockResponses(
      [
        JSON.stringify({
          name: "bulbasaur"
        }),
        { status: 200 }
      ],
      [
        JSON.stringify({
          name: "ivysaur"
        }),
        { status: 200 }
      ],
    )

    await charactersFetcher.fetch().then((characterData: CharacterData[]) => {
      expect(characterData).toEqual([
        {
          name: "bulbasaur"
        },
        {
          name: "ivysaur"
        },
      ])
    })
  })

  it ('handles no page data', async() => {
    fetch.mockResponse(JSON.stringify(null), { status: 500 })

    await charactersFetcher.fetch().then((characterData: CharacterData[]) => {
      expect(characterData).toEqual([])
    })
  })

  it ('logs exceptions', async() => {
    fetch.mockResponse(JSON.stringify({detail: "not found"}), { status: 404 })
    fetch.mockReject(new Error('Detail: not found'))

    await charactersFetcher.fetch().then((characterData: CharacterData[]) => {
      expect(characterData).toEqual([])
    }).catch(() => {
      expect(global.console.error).toHaveBeenCalledWith(
        "Failed to fetch Pokemon characters due to issues with the JSON response.",
        {
          exception: "Detail: not found",
          logType: logTypes.POKEMON,
          responseBody: {detail: "not found"}
        }
      )
    })
  })
})

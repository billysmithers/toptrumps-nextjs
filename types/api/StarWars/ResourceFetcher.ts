import {Fetcher} from "../Fetcher"
import {logTypes} from "../logTypes";

export abstract class ResourceFetcher implements Fetcher
{
  baseUrl = 'https://swapi.dev/api/'
  numberOfResourcesToFetch = 30

  abstract fetch(): Promise<Array<any>>;

  protected async fetchByResourceType(resourceEndpoint : ResourceEndpoint)
  {
    let endpoint = ResourceEndpoints[resourceEndpoint]
    let resources = []
    let page = await this.fetchPage(endpoint)

    if (! page) {
      return null;
    }

    if (page.results?.length === 0) {
      return []
    }

    do {
      page.results?.map((result) => {
        resources.push(result)
      })

      if ((page.next ?? "").length > 0) {
        page = await this.fetchPage(endpoint, page.next);
      } else {
        page.results = []
      }
    } while (page.results?.length > 0)

    return resources.slice(0, this.numberOfResourcesToFetch)
  }

  private async fetchPage(type: string, nextUrl?: string): Promise<Response | null>
  {
    try {
      let response

      if (nextUrl) {
        response = await fetch(nextUrl)
      } else {
        response = await fetch(this.baseUrl + type)
      }

      return response.json()
    } catch (e) {
      console.error(
        `Failed to fetch Star Wars ${type} due to issues with the JSON response.`,
        {
          'logType': logTypes.STAR_WARS,
          'responseBody': e.response,
          'exception': e.message,
        }
      );

      return null
    }
  }
}

export enum ResourceEndpoints {
  Films = 'films/',
  People = 'people/',
  Planets = 'planets/',
  Species = 'species/',
  Starships = 'starships/',
  Vehicles = 'vehicles/',
}

type ResourceEndpoint = keyof typeof ResourceEndpoints

type Response = {
  results: Array<any>,
  next?: string | null,
}
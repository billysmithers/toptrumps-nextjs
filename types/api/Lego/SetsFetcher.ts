import {Fetcher} from "../Fetcher"
import {logTypes} from "../logTypes";

export class SetsFetcher implements Fetcher
{
  baseUrl = 'https://rebrickable.com/api/v3/lego/'
  numberOfResourcesToFetch = 32

  public async fetch(): Promise<SetData[]>
  {
    const response = await this.fetchSets();

    if (! response) {
      return null;
    }

    return response.results;
  }

  private async fetchSets(): Promise<Response | null>
  {
    try {
      const response = await fetch(
        `${this.baseUrl}sets/?key=${process.env.REBRICKABLE_API_KEY}&page_size=${this.numberOfResourcesToFetch}`
      )

      return response.json()
    } catch (e) {
      console.error(
        `Failed to fetch Lego sets due to issues with the JSON response.`,
        {
          'logType': logTypes.LEGO,
          'responseBody': e.response,
          'exception': e.message,
        }
      );

      return null
    }
  }
}

type Response = {
  count: number,
  results: Array<any>,
  previous?: string | null,
  next?: string | null,
}

export type SetData = {
  name: string,
  set_num: string,
  year: number,
  theme_id: number,
  num_parts: number,
  set_img_url: string,
  set_url: string,
  last_modified_dt: string
}
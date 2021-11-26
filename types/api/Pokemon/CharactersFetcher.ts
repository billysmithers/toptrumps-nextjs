import {Fetcher} from "../Fetcher"
import {logTypes} from "../logTypes";

export class CharactersFetcher implements Fetcher
{
  data = [];
  baseUrl = 'https://pokeapi.co/api/v2/pokemon/'
  numberOfCharactersToFetch = 32

  public async fetch(): Promise<CharacterData[]>
  {
    await this.fetchCharacters();

    return this.data;
  }

  protected async fetchCharacters()
  {
    let count = 1;

    do {
      let character = await this.fetchCharacter(count);

      if (! character) {
        break;
      }

      this.data.push(character);

      count++;
    } while (count <= this.numberOfCharactersToFetch)
  }

  private async fetchCharacter(id: Number): Promise<CharacterData | null>
  {
    try {
      const response = await fetch(this.baseUrl + id)

      return response.json()
    } catch (e) {
      console.error(
        `Failed to fetch Pokemon characters due to issues with the JSON response.`,
        {
          'logType': logTypes.POKEMON,
          'responseBody': e.response,
          'exception': e.message,
        }
      );

      return null
    }
  }
}

export type CharacterData = {
  id: number,
  name: string,
  abilities: [],
  base_experience: number,
  forms: [],
  height: number,
  is_default: boolean,
  order: number,
  weight: number,
  game_indices: [],
  held_items: [],
  location_area_encounters: string,
  moves: [],
  past_types: [],
  sprites: {
    other: {
      "official-artwork": {
        front_default: string | null
      }
    }
  },
  species: {},
  stats: Stat[],
  types: []
}

export type Stat = {
  base_stat: number,
  effort: number,
  stat: {
    name: string,
    url: string,
  }
}

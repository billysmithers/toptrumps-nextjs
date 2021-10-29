import {PlanetData} from "../../api/StarWars/PlanetsFetcher"
import {ResourceTransformer} from "../ResourceTransformer"
import {Card, CardJson} from "../../Card"

export class PlanetResourceTransformer implements ResourceTransformer
{
  /**
   * Based on the API response from https://swapi.dev/api/planets/4/
   * {
        "name": "Hoth",
        "rotation_period": "23",
        "orbital_period": "549",
        "diameter": "7200",
        "climate": "frozen",
        "gravity": "1.1 standard",
        "terrain": "tundra, ice caves, mountain ranges",
        "surface_water": "100",
        "population": "unknown",
        "residents": [],
        "films": [
        "http://swapi.dev/api/films/2/"
        ],
        "created": "2014-12-10T11:39:13.934000Z",
        "edited": "2014-12-20T20:58:18.423000Z",
        "url": "http://swapi.dev/api/planets/4/"
        }
   * @param resource: Array<PlanetData>
   * @return Card
   */
  public forCard(resource: PlanetData): CardJson
  {
    let capabilities = []

    for (const [key, value] of Object.entries(resource)) {
      if (['name', 'created', 'edited'].includes(key)) {
        continue;
      }

      if (typeof value === "string" && ! isNaN(parseFloat(value))) {
        capabilities.push({ key: key.replace('_', ' '), value: parseFloat(value)});
      }
    }

    return new Card(resource.name, capabilities).toObject();
  }
}

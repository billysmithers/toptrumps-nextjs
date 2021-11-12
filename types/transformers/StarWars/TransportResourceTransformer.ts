import {StarshipData} from "../../api/StarWars/StarshipsFetcher"
import {VehicleData} from "../../api/StarWars/VehiclesFetcher";
import {ResourceTransformer} from "../ResourceTransformer"
import {Card, CardJson} from "../../Card"

export class TransportResourceTransformer implements ResourceTransformer
{
  /**
   * Based on the API response from https://swapi.dev/api/starships/9/
   * {
   * "name": "Death Star",
   * "model": "DS-1 Orbital Battle Station",
   * "manufacturer": "Imperial Department of Military Research, Sienar Fleet Systems",
   * "cost_in_credits": "1000000000000",
   * "length": "120000",
   * "max_atmosphering_speed": "n/a",
   * "crew": "342,953",
   * "passengers": "843,342",
   * "cargo_capacity": "1000000000000",
   * "consumables": "3 years",
   * "hyperdrive_rating": "4.0",
   * "MGLT": "10",
   * "starship_class": "Deep Space Mobile Battlestation",
   * "pilots": [],
   * "films": [
   * "http://swapi.dev/api/films/1/"
   * ],
   * "created": "2014-12-10T16:36:50.509000Z",
   * "edited": "2014-12-20T21:26:24.783000Z",
   * "url": "http://swapi.dev/api/starships/9/"
   * }
   * and https://swapi.dev/api/vehicles/4/
   * {
   * "cargo_capacity": "50000",
   * "consumables": "2 months",
   * "cost_in_credits": "150000",
   * "created": "2014-12-10T15:36:25.724000Z",
   * "crew": "46",
   * "edited": "2014-12-10T15:36:25.724000Z",
   * "length": "36.8",
   * "manufacturer": "Corellia Mining Corporation",
   * "max_atmosphering_speed": "30",
   * "model": "Digger Crawler",
   * "name": "Sand Crawler",
   * "passengers": "30",
   * "vehicle_class": "wheeled"
   * "pilots": [],
   * "films": [
   * "https://swapi.dev/api/films/1/"
   * ],
   * "created": "2014-12-10T15:36:25.724000Z",
	 * "edited": "2014-12-20T21:30:21.661000Z",
   * "url": "https://swapi.dev/api/vehicles/4/",
   * }
   * @param resource: StarshipData | VehicleData
   * @return Card
   */
  public forCard(resource: StarshipData | VehicleData): CardJson
  {
    let capabilities = []

    for (const [key, value] of Object.entries(resource)) {
      if (['name', 'consumables', 'crew', 'passengers', 'created', 'edited'].includes(key)) {
        continue;
      }

      if (typeof value === "string" && ! isNaN(parseFloat(value))) {
        capabilities.push({ key: key.replace(new RegExp('_', 'g'), ' '), value});
      }
    }

    const consumables = TransportResourceTransformer.formatConsumables(resource.consumables);

    if (consumables) {
      capabilities.push(consumables);
    }

    if (resource.crew) {
      capabilities.push({key: "crew", value: resource.crew.replace(',', '')});
    }

    if (resource.passengers) {
      capabilities.push({key: "passengers", value: resource.passengers.replace(',', '')});
    }

    return new Card(resource.name, capabilities, null).toObject();
  }

  private static formatConsumables(consumables: string | null): {key: 'consumables (days)', value: number} | null {
    if (! consumables || ['unknown', 'none'].includes(consumables)) {
      return null;
    }

    const parts = consumables.split(' ');
    const value = parseInt(parts[0]);
    const unitOfMeasure = parts[1] ?? null;
    let valueAsDays;

    switch (unitOfMeasure) {
      case 'week':
      case 'weeks':
        valueAsDays = value * 7;

        break;
      case 'month':
      case 'months':
        valueAsDays = value * 28;

        break;
      case 'year':
      case 'years':
        valueAsDays = value * 365;

        break;
      default: // days
        valueAsDays = value;
    }

    return {
      key: 'consumables (days)', value: valueAsDays,
    };
  }
}

import {ResourceFetcher} from "./ResourceFetcher";

export class VehiclesFetcher extends ResourceFetcher
{
  public async fetch(): Promise<VehicleData[]>
  {
    return this.fetchByResourceType("Vehicles");
  }
}

export type VehicleData = {
  name: string,
  model: string,
  manufacturer: string,
  cost_in_credits: string,
  length: string,
  max_atmosphering_speed: string,
  crew: string,
  passengers: string,
  cargo_capacity: string,
  consumables: string,
  vehicle_class: string,
  pilots: string[],
  films: string[],
  created: string,
  edited: string,
  url: string,
}

import {ResourceFetcher} from "./ResourceFetcher";

export class PlanetsFetcher extends ResourceFetcher
{
  public fetch(): Promise<Array<PlanetData>>
  {
    return this.fetchByResourceType("Planets");
  }
}

export type PlanetData = {
  name: string,
  rotation_period: string,
  orbital_period: string,
  diameter: string,
  climate: string,
  gravity: string,
  terrain: string,
  surface_water: string,
  population: string,
  residents: Array<string>,
  films: Array<string>,
  created: string,
  edited: string,
  url: string,
}

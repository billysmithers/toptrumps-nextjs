import {SetResourceTransformer} from "./Lego/SetResourceTransformer";
import {PlanetResourceTransformer} from "./StarWars/PlanetResourceTransformer";
import {TransportResourceTransformer} from "./StarWars/TransportResourceTransformer";

const LegoSetResourceTransformer = SetResourceTransformer;
const StarWarsPlanetResourceTransformer = PlanetResourceTransformer;
const StarWarsTransportResourceTransformer = TransportResourceTransformer;

export default {
  LegoSetResourceTransformer,
  StarWarsPlanetResourceTransformer,
  StarWarsTransportResourceTransformer
}

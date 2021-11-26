import {SetResourceTransformer} from "./Lego/SetResourceTransformer";
import {CharacterResourceTransformer} from "./Pokemon/CharacterResourceTransformer";
import {PlanetResourceTransformer} from "./StarWars/PlanetResourceTransformer";
import {TransportResourceTransformer} from "./StarWars/TransportResourceTransformer";

const LegoSetResourceTransformer = SetResourceTransformer;
const PokemonCharacterResourceTransformer = CharacterResourceTransformer;
const StarWarsPlanetResourceTransformer = PlanetResourceTransformer;
const StarWarsTransportResourceTransformer = TransportResourceTransformer;

export default {
  LegoSetResourceTransformer,
  PokemonCharacterResourceTransformer,
  StarWarsPlanetResourceTransformer,
  StarWarsTransportResourceTransformer
}

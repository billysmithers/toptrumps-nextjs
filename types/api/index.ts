import {SetsFetcher} from "./Lego/SetsFetcher";
import {CharactersFetcher} from "./Pokemon/CharactersFetcher";
import {PlanetsFetcher} from "./StarWars/PlanetsFetcher";
import {StarshipsFetcher} from "./StarWars/StarshipsFetcher";
import {VehiclesFetcher} from "./StarWars/VehiclesFetcher";

const LegoSetsFetcher = SetsFetcher;
const PokemonCharactersFetcher = CharactersFetcher;
const StarWarsPlanetsFetcher = PlanetsFetcher;
const StarWarsStarshipsFetcher = StarshipsFetcher;
const StarWarsVehiclesFetcher = VehiclesFetcher;

export default {
  LegoSetsFetcher,
  PokemonCharactersFetcher,
  StarWarsPlanetsFetcher,
  StarWarsStarshipsFetcher,
  StarWarsVehiclesFetcher
}

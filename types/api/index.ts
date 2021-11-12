import {SetsFetcher} from "./Lego/SetsFetcher";
import {PlanetsFetcher} from "./StarWars/PlanetsFetcher";
import {StarshipsFetcher} from "./StarWars/StarshipsFetcher";
import {VehiclesFetcher} from "./StarWars/VehiclesFetcher";

const LegoSetsFetcher = SetsFetcher;
const StarWarsPlanetsFetcher = PlanetsFetcher;
const StarWarsStarshipsFetcher = StarshipsFetcher;
const StarWarsVehiclesFetcher = VehiclesFetcher;

export default {
  LegoSetsFetcher,
  StarWarsPlanetsFetcher,
  StarWarsStarshipsFetcher,
  StarWarsVehiclesFetcher
}

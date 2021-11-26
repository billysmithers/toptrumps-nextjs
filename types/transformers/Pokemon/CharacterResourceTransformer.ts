import {CharacterData, Stat} from "../../api/Pokemon/CharactersFetcher"
import {ResourceTransformer} from "../ResourceTransformer"
import {Card, CardJson} from "../../Card"

export class CharacterResourceTransformer implements ResourceTransformer
{
  /**
   * Based on the API response from https://pokeapi.co/api/v2/pokemon/1
   * @param resource: CharacterData
   * @return Card
   */
  public forCard(resource: CharacterData): CardJson
  {
    let capabilities = []

    for (const [key, value] of Object.entries(resource)) {
      if (['id', 'name'].includes(key)) {
        continue;
      }

      if (typeof value === "number" || (typeof value === "string" && ! isNaN(parseFloat(value)))) {
        capabilities.push({ key: key.replace(new RegExp('_', 'g'), ' '), value});
      }
    }

    resource.stats.map((stat: Stat) => {
      capabilities.push({
        key: stat.stat.name.replace(new RegExp('-', 'g'), ' '),
        value: stat.base_stat
      })
    })

    let imageUrl = resource.sprites.other['official-artwork'].front_default

    if (! imageUrl) {
      imageUrl = 'https://cdn.rebrickable.com/media/thumbs/mocs/moc-50293.jpg/300x200.jpg';
    }

    return new Card(CharacterResourceTransformer.toTitleCase(resource.name), capabilities, imageUrl).toObject();
  }

  private static toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
  }
}

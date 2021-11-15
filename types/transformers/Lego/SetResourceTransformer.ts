import {SetData} from "../../api/Lego/SetsFetcher"
import {ResourceTransformer} from "../ResourceTransformer"
import {Card, CardJson} from "../../Card"

export class SetResourceTransformer implements ResourceTransformer
{
  /**
   * Based on the API response from https://rebrickable.com/api/v3/lego/sets/0011-2/
   * {
   * "set_num": "0011-2",
   * "name": "Town Mini-Figures",
   * "year": 1978,
   * "theme_id": 84,
   * "num_parts": 12,
   * "set_img_url": "https://cdn.rebrickable.com/media/sets/0011-2/3318.jpg",
   * "set_url": "https://rebrickable.com/sets/0011-2/town-mini-figures/",
   * "last_modified_dt": "2013-12-08T15:42:23.174688Z"
   * }
   * @param resource: SetData
   * @return CardJson
   */
  public forCard(resource: SetData): CardJson
  {
    let capabilities = []

    for (const [key, value] of Object.entries(resource)) {
      if (['name', 'theme_id', 'last_modified_dt'].includes(key)) {
        continue;
      }

      if (typeof value === "number" || (typeof value === "string" && ! isNaN(parseFloat(value)))) {
        capabilities.push({ key: key.replace(new RegExp('_', 'g'), ' '), value});
      }
    }

    if (! resource.set_img_url) {
      resource.set_img_url = 'https://cdn.rebrickable.com/media/thumbs/mocs/moc-50293.jpg/300x200.jpg';
    }

    return new Card(resource.name, capabilities, resource.set_img_url).toObject();
  }
}

import {CardJson} from "../Card";

export interface ResourceTransformer
{
  forCard(resource: any): CardJson;
}

import {Card} from "../Card";
import {Capability} from "../Capability";

interface PlayerState {
    isTurn: boolean,
    cards: Card[],
    capabilityToUse: string|null,
    shouldAutoChoose: boolean,
}

export default PlayerState
import {Capability} from "../Capability";
import Array from "../utils/Array";
import PlayerState from "./PlayerState";

class TurnWinningDeterminer {
    private playerCapabilities = []
    private winningPlayers = []

    public async whoWonTurn(
        choosingPlayerNumber: number,
        chosenCapability: Capability,
        players: PlayerState[],
    ): Promise<number[]> {
        players.forEach((player, index) => {
            const capability = this.playerCapability(player, chosenCapability)

            if (capability) {
                this.playerCapabilities.push({ playerIndex: index, value: capability.value })
            } else { // the game rule is that if the player does not have a capability they automatically draw the game
                this.winningPlayers.push(index)
            }
        })

        if (this.playerCapabilities.length === 0) {
            return this.winningPlayers
        }

        this.populateWinningPlayers()

        return this.winningPlayers
    }

    private playerCapability(
        player: PlayerState,
        chosenCapability: Capability
    ): Capability|null {
        const card = player.cards[0]

        if (typeof card === 'undefined') {
            return
        }

        return card.capabilities.find(
            capability => capability.capability === chosenCapability.capability
        )
    }

    private populateWinningPlayers() {
        this.playerCapabilities.sort(Array.sortByHighestValue)
        this.winningPlayers.push(this.playerCapabilities[0].playerIndex)
        const winningValue = this.playerCapabilities[0].value
        // remove the winning capability
        this.playerCapabilities.shift();
        // handle a tie
        this.playerCapabilities.forEach((playerCapability) => {
            if (playerCapability.value === winningValue) {
                this.winningPlayers.push(playerCapability.playerIndex)
            }
        })
    }
}

export default TurnWinningDeterminer
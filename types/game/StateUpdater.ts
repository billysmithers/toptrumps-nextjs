import {Capability} from "../Capability";
import {Card} from "../Card";
import PlayerState from "./PlayerState";

interface TurnState {
    turnWinningPlayersDisplay: number[],
    unclaimedCards: Card[],
    players: PlayerState[],
    playerUpNext: number,
    turn: number,
    capabilitiesInfo: string[]
}

class StateUpdater {
    private cards: Card[] = []
    private capabilitiesInfo: string[] = []
    private players: PlayerState[] = []

    public updateAfterTurn(
        winningPlayers: number[],
        chosenCapability: Capability,
        players: PlayerState[],
        unclaimedCards: Card[],
        playerUpNext: number,
        turn: number
    ): TurnState {
        this.players = players

        this.populateCards(winningPlayers)
        this.populateCapabilitiesInfo(chosenCapability)
        this.setPlayersState(winningPlayers, playerUpNext, chosenCapability, unclaimedCards)
        playerUpNext = StateUpdater.setPlayerUpNext(winningPlayers, playerUpNext)
        unclaimedCards = StateUpdater.setUnclaimedCards(winningPlayers, unclaimedCards)

        const winningPlayersForDisplay: number[] = []

        winningPlayers.forEach((winningPlayerIndex) => {
            winningPlayersForDisplay.push(winningPlayerIndex + 1)
        })

        return {
            turnWinningPlayersDisplay: winningPlayersForDisplay,
            unclaimedCards,
            players: this.players,
            playerUpNext,
            turn,
            capabilitiesInfo: this.capabilitiesInfo
        }
    }

    private populateCards(winningPlayers: number[]) {
        this.players.forEach((player, index) => {
            const playersCard = player.cards.shift()

            if (typeof playersCard === 'undefined') {
                return
            }

            if (winningPlayers.indexOf(index) === -1 || this.players.length === winningPlayers.length) {
                this.cards.push(playersCard)
            } else {
                // move the winning players current card to the back of their cards
                this.players[index].cards.push(playersCard)
            }
        })
    }

    private populateCapabilitiesInfo(chosenCapability: Capability) {
        this.players.forEach((player, index) => {
            const playersCard = player.cards.shift()

            if (typeof playersCard === 'undefined') {
                return
            }

            const capability = playersCard.capabilities.find(
                capability => capability.capability === chosenCapability.capability
            )

            if (capability) {
                this.capabilitiesInfo.push(
                    `Player ${index + 1} had ${capability.capability}: ${capability.value} on card ${playersCard.name}`
                )
            } else { // handle a player not having this capability on their card
                this.capabilitiesInfo.push(
                    `Player ${index + 1} had ${chosenCapability.capability}: No value on card ${playersCard.name}`
                )
            }
        })
    }

    private setPlayersState(
        winningPlayers: number[],
        playerUpNext: number,
        chosenCapability: Capability,
        unclaimedCards: Card[]
    ) {
        if (winningPlayers.length > 1) {
            this.players[playerUpNext].capabilityToUse = chosenCapability.capability;
        } else if (winningPlayers.length === 1) {
            const winningPlayersIndex = winningPlayers[0]

            this.players.map((player) => {
                player.isTurn = false;
            })

            this.players[winningPlayersIndex].cards = this.players[winningPlayersIndex].cards.concat(this.cards)
            this.players[winningPlayersIndex].cards = this.players[winningPlayersIndex].cards.concat(unclaimedCards)
            this.players[winningPlayersIndex].capabilityToUse = null
        }
    }

    private static setPlayerUpNext(
        winningPlayers: number[],
        playerUpNext: number,
    ): number {
        if (winningPlayers.length === 1) {
            playerUpNext = winningPlayers[0]
        }

        return playerUpNext
    }

    private static setUnclaimedCards(
        winningPlayers: number[],
        unclaimedCards: Card[]
    ): Card[] {
        if (winningPlayers.length === 1) {
            unclaimedCards = []
        }

        return unclaimedCards
    }
}

export default StateUpdater
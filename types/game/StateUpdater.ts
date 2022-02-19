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
    private playerUpNext: number
    private unclaimedCards: Card[] = []

    public updateAfterTurn(
        winningPlayers: number[],
        chosenCapability: Capability,
        players: PlayerState[],
        unclaimedCards: Card[],
        playerUpNext: number,
        turn: number
    ): TurnState {
        this.players = players

        const playersCards = this.populateCards(winningPlayers)
        this.populateCapabilitiesInfo(playersCards, chosenCapability)
        this.setPlayersState(winningPlayers, playerUpNext, chosenCapability, unclaimedCards)
        this.setPlayerUpNext(winningPlayers, playerUpNext)
        this.setUnclaimedCards(winningPlayers, unclaimedCards)

        const winningPlayersForDisplay: number[] = []

        winningPlayers.forEach((winningPlayerIndex) => {
            winningPlayersForDisplay.push(winningPlayerIndex + 1)
        })

        return {
            turnWinningPlayersDisplay: winningPlayersForDisplay,
            unclaimedCards: this.unclaimedCards,
            players: this.players,
            playerUpNext: this.playerUpNext,
            turn,
            capabilitiesInfo: this.capabilitiesInfo
        }
    }

    private populateCards(winningPlayers: number[]): Card[] {
        const playersCards: Card[] = [];

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

            playersCards[index] = playersCard
        })

        return playersCards
    }

    private populateCapabilitiesInfo(playersCards: Card[], chosenCapability: Capability): void {
        playersCards.forEach((playersCard, index) => {
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
    ): void {
        if (winningPlayers.length > 1) {
            this.players[playerUpNext].capabilityToUse = chosenCapability.capability;
        } else if (winningPlayers.length === 1) {
            const winningPlayersIndex = winningPlayers[0]

            this.players.forEach((player, index) => {
                this.players[index].isTurn = false;
            })

            this.players[winningPlayersIndex].cards = this.players[winningPlayersIndex].cards.concat(this.cards)
            this.players[winningPlayersIndex].cards = this.players[winningPlayersIndex].cards.concat(unclaimedCards)
            this.players[winningPlayersIndex].capabilityToUse = null
        }
    }

    private setPlayerUpNext(
        winningPlayers: number[],
        playerUpNext: number,
    ): void {
        if (winningPlayers.length === 1) {
            playerUpNext = winningPlayers[0]
        }

        this.playerUpNext = playerUpNext
    }

    private setUnclaimedCards(
        winningPlayers: number[],
        unclaimedCards: Card[]
    ): void {
        if (winningPlayers.length === 1) {
            unclaimedCards = []
        } else {
            unclaimedCards = unclaimedCards.concat(this.cards)
        }

        this.unclaimedCards = unclaimedCards
    }
}

export default StateUpdater
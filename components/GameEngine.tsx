import React, {Component} from 'react';
import {CardDeck} from "./CardDeck";
import {Card} from "../types/Card";
import Player from "./Player";
import {UnclaimedCards} from "./UnclaimedCards";
import {capabilityEvent} from "./GameInteraction";
import {Capability} from "../types/Capability";

export default class GameContainer extends Component<{ cards: Card[] }, any> {
    private readonly cards = []
    public state = { // TODO - types for this model
        players: [ // TODO - create this based on number of players
            {
                isTurn: true,
                cards: [],
                capabilityToUse: null,
                shouldAutoChoose: false,
            },
            {
                isTurn: false,
                cards: [],
                capabilityToUse: null,
                shouldAutoChoose: true,
            },
        ],
        turn: 0,
        unclaimedCards: [],
        turnWinningPlayersDisplay: [],
        playerUpNext: 0,
        capabilitiesInfo: [],
        winner: null,
    }

    constructor(props) {
        super(props)
        // this.cards = this.shuffle(props.cards)
        this.cards = this.shuffle(props.cards).slice(0, 10)

        // this.state.players[0].cards = this.cards.slice(0, 15) // TODO - slice based on number of players
        // this.state.players[1].cards = this.cards.slice(15)

        this.state.players[0].cards = this.cards.slice(0, 5)
        this.state.players[1].cards = this.cards.slice(5)

        capabilityEvent.on(
            'playersChoice',
            (chosen: {playerNumber: number, capability: Capability}) => {
                this.actionPlayerChoice(chosen);
            }
        )
    }

    shuffle(array): any[] {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]
            ];
        }

        return array;
    }

    actionPlayerChoice(chosen: {playerNumber: number, capability: Capability}): void {
        this.whoWonTurn(chosen.playerNumber, chosen.capability)
            .then((winningPlayers) => this.updateStateAfterTurn(winningPlayers, chosen.capability))
            .then(() => this.gameHasBeenWon())
            .then(() => {
                if (! this.state.winner) {
                    this.nextCard()
                }
            })
    }

    async whoWonTurn(choosingPlayerNumber: number, chosenCapability: Capability): Promise<number[]> {
        let card
        let capability
        const capabilitiesInfo = []
        const playerCapabilities = []
        const winningPlayers = []

        this.state.players.forEach((player, index) => {
            card = player.cards[0]

            capability = card.capabilities.find(
                capability => capability.capability === chosenCapability.capability
            )

            if (capability) {
                playerCapabilities.push({ playerIndex: index, value: capability.value })

                capabilitiesInfo.push(
                    `Player ${index + 1} had ${capability.capability}: ${capability.value} on card ${card.name}`
                )
            } else { // handle a player not having this capability on their card
                capabilitiesInfo.push(
                    `Player ${index + 1} had ${chosenCapability.capability}: No value on card ${card.name}`
                )
                winningPlayers.push(index)
            }
        })

        playerCapabilities.sort(this.sortCapabilitiesByHighestValue)
        winningPlayers.push(playerCapabilities[0].playerIndex)
        const winningValue = playerCapabilities[0].value
        // remove the winning capability
        playerCapabilities.shift();
        // handle a tie
        playerCapabilities.forEach((playerCapability) => {
            if (playerCapability.value === winningValue) {
                winningPlayers.push(playerCapability.playerIndex)
            }
        })

        this.setState({ capabilitiesInfo })

        return winningPlayers
    }

    sortCapabilitiesByHighestValue(a, b): number {
            if (a.value < b.value) {
            return 1
        }

        if (a.value > b.value) {
            return -1
        }

        return 0
    }

    async updateStateAfterTurn(winningPlayers: number[], chosenCapability: Capability): Promise<void> {
        const cards = []
        const winningPlayersForDisplay = []
        const players = this.state.players.slice()
        let unclaimedCards = this.state.unclaimedCards.slice()
        let playerUpNext = this.state.playerUpNext
        let turn = this.state.turn + 1

        players.forEach((player, index) => {
            const playersCard = player.cards.shift()

            if (winningPlayers.indexOf(index) === -1 || players.length === winningPlayers.length) {
                cards.push(playersCard)
            } else {
                // move the winning players current card to the back of their cards
                player.cards.push(playersCard)
            }
        })

        if (winningPlayers.length > 1) {
            unclaimedCards = unclaimedCards.concat(cards)
            players[playerUpNext].capabilityToUse = chosenCapability.capability;
        } else if (winningPlayers.length === 1) {
            const winningPlayersIndex = winningPlayers[0]
            players.map((player) => {
                player.isTurn = false;
            })

            players[winningPlayersIndex].cards = players[winningPlayersIndex].cards.concat(cards)
            players[winningPlayersIndex].cards = players[winningPlayersIndex].cards.concat(unclaimedCards)
            players[winningPlayersIndex].capabilityToUse = null
            playerUpNext = winningPlayersIndex
            unclaimedCards = []
        }

        winningPlayers.forEach((winningPlayerIndex) => {
            winningPlayersForDisplay.push(winningPlayerIndex + 1)
        })

        this.setState({
            turnWinningPlayersDisplay: winningPlayersForDisplay.reverse(),
            unclaimedCards,
            players,
            playerUpNext,
            turn
        })
    }

    nextCard(): void {
        const players = this.state.players.slice()
        const playerUpNext = players[this.state.playerUpNext];

        playerUpNext.isTurn = true

        if (playerUpNext.shouldAutoChoose || playerUpNext.capabilityToUse) {
            setTimeout(() => this.setState({
                players
            }), 5000)
        } else {
            this.setState({
                players
            })
        }
    }

    gameHasBeenWon(): void {
        this.state.players.forEach((player, index) => {
            if (player.cards.length === this.cards.length) {
                this.setState({
                    winner: index + 1
                })

                return
            }
        })
    }

    render() {
        return (
            <div key="gameEngine" className="px-10">
                <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
                    <CardDeck cards={this.cards}/>
                    <UnclaimedCards cards={this.state.unclaimedCards}/>
                    <div className="max-w-xs m-4" key="turn">
                        <div className="bg-white shadow-xl rounded-lg py-3">
                            <h3 className="text-sm text-gray-900 font-medium leading-8 mx-5">
                                Turn number: { this.state.turn }
                            </h3>
                        </div>
                    </div>
                </div>
                <div key="status" className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mb-8">
                    {
                        this.state.turnWinningPlayersDisplay.length > 0 &&
                        <>
                            <h3 className="text-sm text-gray-900 font-medium leading-8">
                                Player(s) {this.state.turnWinningPlayersDisplay.join(',')} won this turn
                            </h3>
                            <ol className="text-sm text-gray-900 font-medium leading-8">
                                {
                                    this.state.capabilitiesInfo.map((info, index) => (
                                        <li key={`capability-info-${index}`}>{info}</li>
                                    ))
                                }
                            </ol>
                        </>
                    }

                    {
                        this.state.winner &&
                        <h3 className="text-lg text-gray-900 font-bold leading-8">
                            Player {this.state.winner} has won the game
                        </h3>
                    }
                </div>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    <Player
                        number={1}
                        name={'You'}
                        cards={this.state.players[0].cards}
                        shouldAutoChoose={this.state.players[0].shouldAutoChoose}
                        isTurn={this.state.players[0].isTurn}
                        capabilityToUse={this.state.players[0].capabilityToUse}
                    />
                    <Player
                        number={2}
                        name={'Computer'}
                        cards={this.state.players[1].cards}
                        shouldAutoChoose={this.state.players[1].shouldAutoChoose}
                        isTurn={this.state.players[1].isTurn}
                        capabilityToUse={this.state.players[1].capabilityToUse}
                    />
                </div>
            </div>
        )
    }
}
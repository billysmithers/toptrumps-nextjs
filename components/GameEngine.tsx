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
                isTurn: false,
                cards: [],
                capabilityToUse: null,
            },
            {
                isTurn: false,
                cards: [],
                capabilityToUse: null,
            },
        ],
        unclaimedCards: [],
        turnWinningPlayers: [],
        playerUpNext: 0,
        capabilitiesInfo: [],
        winner: null,
    }

    constructor(props) {
        super(props)
        this.cards = this.shuffle(props.cards)

        this.state.players[0].cards = this.cards.slice(0, 16) // TODO - slice based on number of players
        this.state.players[1].cards = this.cards.slice(16)
    }

    componentDidMount() {
        capabilityEvent.on('playersChoice',  (chosen: {playerNumber: number, capability: Capability}) => {
            const winningPlayers = this.whoWonTurn(chosen.playerNumber, chosen.capability)
            this.updateStateAfterTurn(winningPlayers, chosen.capability)
            this.gameHasBeenWon()
        })
    }

    shuffle(array) {
        let currentIndex = array.length,  randomIndex;

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

    whoWonTurn(choosingPlayerNumber: number, chosenCapability: Capability): Array<number> {
        const choosingPlayerIndex = choosingPlayerNumber - 1
        let card
        let capability
        const capabilitiesInfo = []
        const playerCapabilities = []
        const winningPlayers = []

        this.state.players.forEach((player, index) => {
            card = player.cards[0]
            capability = card.capabilities?.find(
                capability => capability.capability === chosenCapability.capability
            )

            if (capability) {
                playerCapabilities.push({ playerIndex: index, value: capability.value })

                capabilitiesInfo.push(`Player ${index + 1} had ${capability.capability}: ${capability.value}`)
            } else { // handle a player not having this capability on their card
                capabilitiesInfo.push(`Player ${index + 1} had ${capability.capability}: No value`)
                winningPlayers.push(index)
            }
        })

        playerCapabilities.sort(this.sortCapabilitiesByHighestValue)
        winningPlayers.push(playerCapabilities[0].playerIndex)
        const winningValue = playerCapabilities[0].value
        playerCapabilities.shift();
        // handle a tie
        playerCapabilities.forEach((playerCapability) => {
            if (playerCapability.value === winningValue) {
                winningPlayers.push(playerCapability.playerIndex)
            }
        })
        this.setState({capabilitiesInfo})

        return winningPlayers
    }

    sortCapabilitiesByHighestValue(a, b) {
            if (a.value < b.value) {
            return 1
        }

        if (a.value > b.value) {
            return -1
        }

        return 0
    }

    updateStateAfterTurn(winningPlayers: Array<number>, chosenCapability: Capability) {
        const cards = []
        const winningPlayersForDisplay = []
        const players = this.state.players.slice()
        let unclaimedCards = this.state.unclaimedCards.slice()
        let playerUpNext = this.state.playerUpNext

        players.forEach((player, index) => {
            if (winningPlayers.indexOf(index) === -1) {
                cards.push(player.cards.shift())
            } else {
                // move the winning players current card to the back of their cards
                player.cards.push(player.cards.shift())
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
            turnWinningPlayers: winningPlayersForDisplay,
            unclaimedCards,
            players,
            playerUpNext
        })
    }

    nextCard(): void {
        const players = this.state.players.slice()

        players[this.state.playerUpNext].isTurn = true

        this.setState({
            players
        })
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
            <div key="gameEngine">
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    <CardDeck cards={this.cards}/>
                    <UnclaimedCards cards={[]}/>
                </div>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    <Player
                        number={1}
                        name={'You'}
                        cards={this.state.players[0].cards}
                        shouldAutoChoose={false}
                        isTurn={this.state.players[0].isTurn}
                        capabilityToUse={this.state.players[0].capabilityToUse}
                    />
                    <Player
                        number={2}
                        name={'Computer'}
                        cards={this.state.players[1].cards}
                        shouldAutoChoose={true}
                        isTurn={this.state.players[1].isTurn}
                        capabilityToUse={this.state.players[1].capabilityToUse}
                    />
                </div>
                <div key="play-card" className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 content-center mb-4">
                    <button
                        onClick={() => this.nextCard()}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                    >
                        Play this card
                    </button>
                    <div className="pt-2">It is player {this.state.playerUpNext + 1}'s turn</div>
                </div>
                <div key="status" className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    {
                        this.state.turnWinningPlayers.length > 0 &&
                        <>
                            <h3 className="text-sm text-gray-900 font-medium leading-8">
                                Player(s) {this.state.turnWinningPlayers.join(',')} won this turn
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
            </div>
        )
    }
}
import React, {Component} from 'react';
import {CardDeck} from "./CardDeck";
import {Card} from "../types/Card";
import Player from "./Player";
import {UnclaimedCards} from "./UnclaimedCards";
import {capabilityEvent} from "./GameInteraction";
import {Capability} from "../types/Capability";

export default class GameContainer extends Component<{ cards: Card[] }> {
    private readonly cards = []
    public state = { // TODO - types for this model
        players: [ // TODO - create this based on number of players
            {
                isTurn: true,
                cards: [],
            },
            {
                isTurn: false,
                cards: [],
            },
        ],
        unclaimedCards: [],
        turnWinningPlayers: [],
        capabilitiesInfo: [],
        capabilityHasBeenSelected: false
    }

    constructor(props) {
        super(props)
        this.cards = this.shuffle(props.cards)

        this.state.players[0].cards = this.cards.slice(0, 16) // TODO - slice based on number of players
        this.state.players[1].cards = this.cards.slice(16)
    }

    componentDidMount() {
        capabilityEvent.on('playersChoice',  (chosen: {playerNumber: number, capability: Capability}) => {
            if (this.state.capabilityHasBeenSelected) {
                return
            }

            const winningPlayers = this.whoWonTurn(chosen.playerNumber, chosen.capability)
            this.updateStateAfterTurn(winningPlayers)
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
        const capabilitiesInfo = []
        const playerCapabilities = []
        const winningPlayers = []

        this.state.players.forEach((player, index) => {
            card = player.cards[0]

            card.capabilities.map((capability) => {
                if (capability.capability === chosenCapability.capability) {
                    playerCapabilities.push({ playerIndex: index, value: capability.value })

                    if (index !== choosingPlayerIndex) {
                        capabilitiesInfo.push(`${card.name} - ${capability.capability}: ${capability.value}`)
                    }
                }
            })
        })

        playerCapabilities.sort(this.sortCapabilitiesByHighestValue)
        winningPlayers.push(playerCapabilities[0].playerIndex);
        const winningValue = playerCapabilities[0].value;
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
            return 1;
        }

        if (a.value > b.value) {
            return -1;
        }

        return 0;
    }

    updateStateAfterTurn(winningPlayers: Array<number>) {
        const cards = []
        const winningPlayersForDisplay = []
        const players = this.state.players.slice();
        console.log(players)
        let unclaimedCards = this.state.unclaimedCards.slice()

        players.forEach((player, index) => {
            if (winningPlayers.indexOf(index) === -1) {
                cards.push(player.cards.shift())
            }
        })

        console.log(cards)

        if (winningPlayers.length > 1) {
            unclaimedCards.concat(cards)
        } else if (winningPlayers.length === 1) {
            const winningPlayersIndex = winningPlayers[0];
console.log(winningPlayersIndex);
            players.map((player) => {
                player.isTurn = false;
            })

            players[winningPlayersIndex].cards.concat(cards);
            players[winningPlayersIndex].cards.concat(unclaimedCards);
            players[winningPlayersIndex].isTurn = true;
            console.log(players[winningPlayersIndex].cards);
            unclaimedCards = []
        }

        winningPlayers.forEach((winningPlayerIndex) => {
            winningPlayersForDisplay.push(winningPlayerIndex + 1)
        })

        console.log(players)

        this.setState({
            turnWinningPlayers: winningPlayersForDisplay,
            players,
            unclaimedCards,
            capabilityHasBeenSelected: true
        })
    }

    // @TODO - check if game has been won and display message
    gameHasBeenWon(): boolean {
        return false;
    }

    // @TODO - play next card on user click
    nextCard() {

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
                    />
                    <Player
                        number={2}
                        name={'Computer'}
                        cards={this.state.players[1].cards}
                        shouldAutoChoose={true}
                        isTurn={this.state.players[1].isTurn}
                    />
                </div>
                <div key="status">
                    {
                        this.state.turnWinningPlayers.length > 0 &&
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                            <h3 className="text-sm text-gray-900 font-medium leading-8">
                                Player(s) {this.state.turnWinningPlayers.join(',')} won this card
                            </h3>
                            <h3 className="text-sm text-gray-900 font-medium leading-8">
                            Other player(s) had {this.state.capabilitiesInfo.join(',')}
                            </h3>
                        </div>
                    }
                </div>
            </div>
        )
    }
}
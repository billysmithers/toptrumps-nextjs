import React, {Component} from 'react';
import {CardDeck} from "./CardDeck";
import {Card} from "../types/Card";
import Player from "./Player";
import {UnclaimedCards} from "./UnclaimedCards";
import {capabilityEvent} from "./GameInteraction";
import {Capability} from "../types/Capability";


export default class GameContainer extends Component<{ cards: Card[] }> {
    private readonly cards = []
    public state = {
        players: [
            {
                isTurn: true,
                cards: [],
                currentCard: 0,
                hasWon: false,
            },
            {
                isTurn: false,
                cards: [],
                currentCard: 0,
                hasWon: false,
            },
        ],
        unclaimedCards: [],
    }

    constructor(props) {
        super(props)
        this.cards = this.shuffle(props.cards)

        this.state.players[0].cards = this.cards.slice(0, 16)
        this.state.players[1].cards = this.cards.slice(16)
    }

    componentDidMount() {
        capabilityEvent.on('playersChoice',  (chosen: {playerNumber: number, capability: Capability}) => {
            console.log(chosen.playerNumber, chosen.capability)

            const playerIndex = chosen.playerNumber - 1;
            let opponentsCard
            let opponentsIndex

            if (playerIndex === 0) {
                opponentsCard = this.state.players[1].cards[this.state.players[1].currentCard]
                opponentsIndex = 1
            } else {
                opponentsCard = this.state.players[0].cards[this.state.players[0].currentCard]
                opponentsIndex = 0
            }

            opponentsCard.capabilities.map((capability) => {
                if (capability.capability === chosen.capability.capability) {
                    console.log(capability.value)

                    if (capability.value > chosen.capability.value) {
                        const newPlayersState = this.state.players.slice()

                        newPlayersState[opponentsIndex].hasWon = true

                        this.setState({
                            players: newPlayersState
                        })

                        console.log(this.state.players[1].hasWon)

                        console.log('opponent has won')
                    }

                    return
                }
            })
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
                        currentCard={this.state.players[0].currentCard}
                        shouldAutoChoose={false}
                        isTurn={this.state.players[0].isTurn}
                        hasWon={this.state.players[0].hasWon}
                    />
                    <Player
                        number={2}
                        name={'Computer'}
                        cards={this.state.players[1].cards}
                        currentCard={this.state.players[1].currentCard}
                        shouldAutoChoose={true}
                        isTurn={this.state.players[1].isTurn}
                        hasWon={this.state.players[1].hasWon}
                    />
                </div>
            </div>
        )
    }
}
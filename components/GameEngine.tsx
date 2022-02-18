import React, {Component} from 'react';
import Array from "../types/utils/Array";
import {CardDeck} from "./CardDeck";
import {Card} from "../types/Card";
import Player from "./Player";
import {UnclaimedCards} from "./UnclaimedCards";
import {capabilityEvent} from "./GameInteraction";
import {Capability} from "../types/Capability";
import PlayerState from "../types/game/PlayerState";
import StateUpdater from "../types/game/StateUpdater";
import TurnWinningDeterminer from "../types/game/TurnWinningDeterminer";

interface IState {
    players: PlayerState[],
    turn: number,
    unclaimedCards: Card[],
    turnWinningPlayersDisplay: number[],
    playerUpNext: number,
    capabilitiesInfo: string[],
    winner: number|null,
}

export default class GameContainer extends Component<{ cards: Card[] }, any> {
    private readonly cards: Card[] = []
    public state: IState = {
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

        // this.cards = Array.shuffle(props.cards)
        this.cards = Array.shuffle(props.cards).slice(0, 10)

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

    actionPlayerChoice(chosen: {playerNumber: number, capability: Capability}): void {
        const turnWinningDeterminer: TurnWinningDeterminer = new TurnWinningDeterminer()
        turnWinningDeterminer.whoWonTurn(chosen.playerNumber, chosen.capability, this.state.players)
            .then((winningPlayers) => this.updateStateAfterTurn(winningPlayers, chosen.capability))
            .then(() => this.gameHasBeenWon())
            .then(() => {
                if (! this.state.winner) {
                    this.nextCard()
                }
            })
    }

    async updateStateAfterTurn(winningPlayers: number[], chosenCapability: Capability): Promise<void> {
        const stateUpdater = new StateUpdater();
        const players = this.state.players.slice()
        let unclaimedCards = this.state.unclaimedCards.slice()
        let playerUpNext = this.state.playerUpNext
        let turn = this.state.turn + 1

        this.setState(stateUpdater.updateAfterTurn(
                winningPlayers,
                chosenCapability,
                players,
                unclaimedCards,
                playerUpNext,
                turn
            )
        )
    }

    nextCard(): void {
        const players = this.state.players.slice()
        const playerUpNext = players[this.state.playerUpNext];

        playerUpNext.isTurn = true

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
                {
                    ! this.state.winner &&
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
                }
            </div>
        )
    }
}
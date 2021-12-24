import React, {Component, FC} from 'react';
import {Card} from "../types/Card";
import {CardBack} from "./CardBack";
import {CardFront} from "./CardFront";
import {capabilityEvent} from "./GameInteraction";
import {Capability} from "../types/Capability";

type PlayerCardProps = {
    playerNumber: number,
    card: Card,
    shouldTurnOver: boolean,
    isPlayersTurn: boolean,
}

export default class Player extends Component<{
    number: number,
    name: string,
    cards: Card[],
    currentCard: number,
    shouldAutoChoose: boolean,
    isTurn: boolean,
    hasWon: boolean,
}> {
    private readonly number
    private readonly name
    private readonly cards
    private readonly currentCard
    private readonly shouldAutoChoose
    private readonly isTurn
    private readonly hasWon

    constructor(props) {
        super(props)
        this.number = props.number
        this.name = props.name
        this.cards = props.cards
        this.currentCard = props.currentCard
        this.shouldAutoChoose = props.shouldAutoChoose
        this.isTurn = props.isTurn
        this.hasWon = props.hasWon
    }

    componentDidMount() {
        capabilityEvent.on('capabilityChosen', (chosen: { card: Card, capability: Capability }) => {
            if (chosen.card.name === this.cards[this.currentCard].name) {
                capabilityEvent.emit('playersChoice', {
                    playerNumber: this.number,
                    capability: chosen.capability
                })
            }
        })
    }

    render() {
        return (
            <div key={`player-${this.number}`}>
                <h2 className="text-xl text-gray-900 font-medium leading-8">Player {this.number} ({this.name})</h2>
                <h3 className="text-sm text-gray-900 font-medium leading-8">Cards: { this.cards.length }</h3>
                <PlayerCard
                    playerNumber={this.number}
                    card={this.cards[this.currentCard]}
                    shouldTurnOver={!this.shouldAutoChoose}
                    isPlayersTurn={this.isTurn}
                />
                {this.hasWon && <h3 className="text-sm text-gray-900 font-medium leading-8">Has won</h3>}
            </div>
        )
    }
}

const PlayerCard: FC<PlayerCardProps> = ({
    playerNumber,
    card,
    shouldTurnOver,
    isPlayersTurn,
}) => <div key={`player-card-${playerNumber}`}>
    { shouldTurnOver ?
        <CardFront card={card} isPlayersTurn={isPlayersTurn} />
        :
        <CardBack />
    }
</div>
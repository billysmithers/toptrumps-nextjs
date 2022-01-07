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
    shouldAutoChoose: boolean,
    isTurn: boolean,
}> {
    private readonly number
    private readonly name
    private readonly cards
    private readonly shouldAutoChoose
    private readonly isTurn

    constructor(props) {
        super(props)
        this.number = props.number
        this.name = props.name
        this.cards = props.cards
        this.shouldAutoChoose = props.shouldAutoChoose
        this.isTurn = props.isTurn
    }

    componentDidMount() {
        capabilityEvent.on('capabilityChosen', (chosen: { card: Card, capability: Capability }) => {
            if (chosen.card.name === this.cards[0].name) {
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
                    card={this.cards[0]}
                    shouldTurnOver={!this.shouldAutoChoose}
                    isPlayersTurn={this.isTurn}
                />
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
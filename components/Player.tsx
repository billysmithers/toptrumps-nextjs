import React, {Component, FC} from 'react';
import {Card} from "../types/Card";
import {CardFront} from "./CardFront";
import {capabilityEvent} from "./GameInteraction";
import {Capability} from "../types/Capability";

type PlayerCardProps = {
    playerNumber: number,
    card: Card,
    shouldDisplayValues: boolean,
    isPlayersTurn: boolean,
}

export default class Player extends Component<{
    number: number,
    name: string,
    cards: Card[],
    shouldAutoChoose: boolean,
    isTurn: boolean,
}> {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        capabilityEvent.on('capabilityChosen', (chosen: { card: Card, capability: Capability }) => {
            if (this.props.cards.length === 0) {
                return
            }

            if (chosen.card.name === this.props.cards[0].name) {
                capabilityEvent.emit('playersChoice', {
                    playerNumber: this.props.number,
                    capability: chosen.capability
                })
            }
        })
    }

    componentDidUpdate() {
        if (this.props.shouldAutoChoose && this.props.isTurn) {
            this.autoChooseCapability()
        }
    }

    autoChooseCapability() {
        console.log('computers turn')
        const card = this.props.cards[0]

        //crudest algorithm to begin with - largest number wins
        card.capabilities.sort(this.sortCapabilitiesByHighestValue)

        capabilityEvent.emit('playersChoice', {
            playerNumber: this.props.number,
            capability: card.capabilities[0]
        })
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

    render() {
        return (
            <div key={`player-${this.props.number}`}>
                <h2 className="text-xl text-gray-900 font-medium leading-8">
                    Player {this.props.number} ({this.props.name})
                </h2>
                <h3 className="text-sm text-gray-900 font-medium leading-8">Cards: { this.props.cards.length }</h3>
                {
                    this.props.cards.length > 0 &&
                    <PlayerCard
                    playerNumber={this.props.number}
                    card={this.props.cards[0]}
                    shouldDisplayValues={!this.props.shouldAutoChoose}
                    isPlayersTurn={this.props.isTurn}
                    />
                }
            </div>
        )
    }
}

const PlayerCard: FC<PlayerCardProps> = ({
    playerNumber,
    card,
    shouldDisplayValues,
    isPlayersTurn,
}) => <div key={`player-card-${playerNumber}`}>
    <CardFront card={card} isPlayersTurn={isPlayersTurn} shouldDisplayValues={shouldDisplayValues} />
</div>
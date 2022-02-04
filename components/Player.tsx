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

export default class Player extends Component< {
    number: number,
    name: string,
    cards: Card[],
    shouldAutoChoose: boolean,
    isTurn: boolean,
    capabilityToUse: string,
}, any> {
    constructor(props) {
        super(props)

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
        if (
            this.props.isTurn &&
            (this.props.shouldAutoChoose || this.props.capabilityToUse)
        ) {
            this.autoChooseCapability()
        }
    }

    autoChooseCapability() {
        const card = this.props.cards[0]
        let capability = null

        if (! card) {
            return
        }

        if (this.props.capabilityToUse) {
            capability = card.capabilities.find((capability) => {
                return capability.capability === this.props.capabilityToUse
            })
        } else if (this.props.shouldAutoChoose) {
            //crudest algorithm to begin with - largest number wins
            card.capabilities.sort(this.sortCapabilitiesByHighestValue)
            capability = card.capabilities[0]
        }

        if (capability) {
            capabilityEvent.emit('playersChoice', {
                playerNumber: this.props.number,
                capability
            })
        }
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
                    this.props.cards.length > 0 && this.props.cards[0] !== undefined &&
                    (<PlayerCard
                    playerNumber={this.props.number}
                    card={this.props.cards[0]}
                    shouldDisplayValues={!this.props.shouldAutoChoose}
                    isPlayersTurn={this.props.isTurn}
                    />)
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
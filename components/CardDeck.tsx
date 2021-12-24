import React, { FC } from 'react';
import {Card} from "../types/Card";

type CardDeckProps = {
    cards: Card[]
}

export const CardDeck: FC<CardDeckProps> = ({ cards }) => <div className="max-w-xs m-4" key="cardDeck">
    <div className="bg-white shadow-xl rounded-lg py-3">
        <h3 className="text-sm text-gray-900 font-medium leading-8 mx-5">Total cards: { cards.length }</h3>
    </div>
</div>
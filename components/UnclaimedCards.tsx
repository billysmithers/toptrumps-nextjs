import React, { FC } from 'react';
import {Card} from "../types/Card";

type UnclaimedCardsProps = {
    cards: Card[]
}

export const UnclaimedCards: FC<UnclaimedCardsProps> = ({ cards }) => <div className="max-w-xs m-4" key="unclaimedCards">
    <div className="bg-white shadow-xl rounded-lg py-3">
        <h3 className="text-sm text-gray-900 font-medium leading-8 mx-5">Unclaimed cards: { cards.length }</h3>
    </div>
</div>

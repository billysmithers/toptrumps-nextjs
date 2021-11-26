import React, { FC } from 'react';

type CardProps = {
    name: string
}

export const CardBack: FC<CardProps> = ({ name }) => <div className="max-w-xs m-4" key="cardBack">
    <div className="bg-white shadow-xl rounded-lg py-3">
        <h2 className="text-center text-xl text-gray-900 font-medium leading-8">
            Top Trumps
        </h2>
        <div style={{minHeight: 250}}>
        </div>
        <h3 className="text-center text-xl text-gray-600 font-medium leading-6">{ name }</h3>
    </div>
</div>

import React, { FC } from 'react';
import Image from "next/image";
import {Card} from "../types/Card";

type CardProps = {
    card: Card
}

export const CardFront: FC<CardProps> = ({ card }) => <div className="max-w-xs m-4" key="cardFront">
    <div className="bg-white shadow-xl rounded-lg py-3">
        <h2 className="text-center text-xl text-gray-900 font-medium leading-8">
            {card.name}
        </h2>
        {card.imageUrl &&
        <div className="relative" style={{ width: '300px', height: '300px', margin: 'auto' }}>
            <Image
                src={card.imageUrl}
                alt={`Picture of ${card.name}`}
                layout="fill"
                objectFit="contain"
            />
        </div>
        }
        <div className="p-2">
            <table className="text-xs my-3">
                <tbody>
                {card.capabilities.map((capability, index) => (
                    <tr className={ index % 2 === 0 ? ' bg-yellow-300' : 'bg-yellow-100' }
                        key={`${capability.capability}-${capability.value}`}
                    >
                        <td className="px-2 py-2 text-black font-semibold">
                            {capability.capability}
                        </td>
                        <td className="px-2 py-2 text-black">
                            {capability.value}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
</div>

import React, { FC } from 'react';
import {Card} from "../types/Card";

export const CardBack: FC = () => <div className="max-w-xs m-4" key="cardBack">
    <div className="bg-white shadow-xl rounded-lg py-3">
        <h2 className="text-center text-xl text-gray-900 font-medium leading-8">
            Top Trumps
        </h2>
        <div style={{minHeight: 300}}>
        </div>
    </div>
</div>

'use client'
import { RefObject, useState } from 'react';
import './PuzzlePiece.scss';

export interface IPieceProps {
    number: number,
    width: number,
    height: number,
    position: {x: number, y: number},
}

interface IPuzzlePieceProps {
    offset: number,
    focused: boolean,
    pieceProps: IPieceProps,
    last: boolean,
    nextToBlank: boolean,
}

interface IPuzzlePieceState {

}

export default function PuzzlePiece(props: IPuzzlePieceProps) {

    const [state, changeState] = useState<IPuzzlePieceState>({});
    const {focused, last, nextToBlank} = props;
    const {pieceProps} = props;
    const {} = state;

    const setState = (nv: Partial<IPuzzlePieceState>) => changeState(prev => ({...prev, ...nv}));

    const canMove = nextToBlank && focused;

    const className = 'PuzzlePiece-root ' + (focused ? ' VT-focused' : '') + (last ? ' VT-last' : '') + (canMove ? ' VT-next' : '');

    const {x, y} = pieceProps.position;

    const left = props.offset + (x * pieceProps.width)  + 'px';
    const top = props.offset + (y * pieceProps.height)  + 'px';

    return (
        <div className={className} style={{left, top}}>
            {pieceProps.number}
        </div>
    );

}
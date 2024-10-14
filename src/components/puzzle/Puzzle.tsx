'use client'
import React, { useEffect, useRef, useState } from 'react';
import './Puzzle.scss';
import PuzzlePiece, { IPieceProps } from '../puzze-piece/PuzzlePiece';

interface IPuzzleProps {
    columns: number,
    rows: number,
}

interface IPuzzleState {

}

export default function Puzzle(props: IPuzzleProps) {

    const {columns, rows} = props;

    const n = rows * columns;

    const padding = 16;

    const pieceWidth = 102;
    const pieceHeight = pieceWidth;
    const mov = [[1,0],[-1,0],[0,1],[0,-1]];

    const width = columns * pieceWidth;
    const height = rows * pieceHeight;

    const [position, setPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
    const [blankPosition, setBlankPosition] = useState<{x: number, y: number}>({x: columns - 1, y: rows - 1});

    const [pieces, setPieces] = useState<IPieceProps[]>([]);
    const [theme, setTheme] = useState<'light'|'dark'|'gray'>('dark');

    const handleKeyDown = (event: React.KeyboardEvent)=>{
        const code = event.key;
        if( code === "r"){
            setPieces(handleRandomizePuzzle);
        }
        if(code === "ArrowRight")
            moveFocus(0);
        if(code === "ArrowLeft")
            moveFocus(1);
        if(code === "ArrowUp")
            moveFocus(3);
        if(code === "ArrowDown")
            moveFocus(2);
        if(code === " ")
            movePiece();
        if(code === "1")
            changeTheme('light');
        if(code === "2")
            changeTheme('dark');
        if(code === "3")
            changeTheme('gray');
        console.log(code)
        console.log(theme)
    }
    const changeTheme = (newTheme: typeof theme)=>{
        setTheme(newTheme);
        localStorage.setItem('theme',newTheme);
    }
    useEffect(
        () => {

            if(pieces.length === 0) setPieces(handleRandomizePuzzle());

        }, [props.columns, props.rows],
    )

    useEffect(
        () => {

            const savedTheme = localStorage.getItem('theme');
            const t = savedTheme === null? 'dark': savedTheme;
            setTheme(t as typeof theme);
        }, [],
    )

    useEffect(
        () => {

            document.documentElement.setAttribute('data-theme',theme);
        }, [theme],
    )
    
    return (
        <div className='Puzzle-root ' tabIndex={0} onKeyDown={handleKeyDown}>
            <div className='Puzzle-table card-shadow' style={{width: width+'px', height: height+'px', padding: padding + 'px'}} >
                {
                     pieces.map((piece, index) => (
                        <PuzzlePiece 
                            offset={padding}
                            focused={isFocused(piece.position)} 
                            last={piece.number === pieces.length} 
                            nextToBlank={(isNextToBlank(piece.position))} 
                            key={piece.number}
                            pieceProps={piece}
                        />
                    ))
                }
            </div>
            <div className='Puzzle-legend card-shadow' style={{width: width +'px'}}>
                <div className='flex-row align-center' style={{marginBottom: 16}}>
                    <div className='Puzzle-legend-key'>R</div>
                    <div>Restart</div>
                </div>
                <div className='flex-row align-center' style={{marginBottom: 16}}>
                    <div className='Puzzle-legend-key'>SPACE</div>
                    <div>Move Green Piece</div>
                </div>
                <div className='flex-row align-center' style={{marginBottom: 0}}>
                    <div className='Puzzle-legend-key'>←</div>
                    <div className='Puzzle-legend-key'>↑</div>
                    <div className='Puzzle-legend-key'>↓</div>
                    <div className='Puzzle-legend-key'>→</div>
                    <div>Change Piece</div>
                </div>
            </div>
        </div>
    );

    function isFocused(piecePosition: {x: number, y: number}): boolean {
        return piecePosition.x === position.x && piecePosition.y === position.y;
    } 

    function moveFocus(a:number) {
        let nx = position.x + mov[a][0]
        let ny = position.y + mov[a][1]
        if(blankPosition.x == nx && blankPosition.y == ny){
            nx = nx + mov[a][0]
            ny = ny + mov[a][1]
        }
        if(nx>=0 && nx <= columns-1 && ny >= 0 && ny <= rows -1)
            setPosition({x: (nx) ,y : (ny)}); 
    } 

    function movePiece() {
        const canMove = isNextToBlank(position);
        if(!canMove) return;
        const newPieces = [...pieces];
        const focusedIndex = pieces.findIndex(piece => isFocused(piece.position))
        const blankIndex = pieces.findIndex(piece => blankPosition.x == piece.position.x && blankPosition . y === piece.position.y)
        const focused = pieces.at(focusedIndex);
        const blank = pieces.at(blankIndex)
        if( focused === undefined || blank === undefined) return;
        const aux = focused.position;
        focused.position = blank.position;
        blank.position = aux;
        newPieces[focusedIndex].position = focused.position;
        newPieces[blankIndex].position = blank.position;
        setPosition(focused.position);
        setBlankPosition(blank.position);
        setPieces(newPieces);

    } 

    function isNextToBlank(piecePosition: {x: number, y: number}): boolean {

        const {x, y} = piecePosition;
        const {x: bX, y: bY} = blankPosition;

        const nX = (((x + 1) === bX) || ((x - 1) === bX)) && (y === bY);
        const nY = (((y + 1) === bY) || ((y - 1) === bY)) && (x === bX);

        return nX || nY;

    }

    function handleRandomizePuzzle() {


        const items = Array.from({length: n}).map((_, index) => index + 1);
        
        const c: IPieceProps[] = Array.from({length: n}).map((_, x) => {

            const index = Math.random() * (items.length);
            const [item] = items.splice(index, 1);
            const position = {
                x: x % columns, y: Math.floor(x / columns)
            };

            
            if(item === n) setBlankPosition(position);

            return ({
                number: item, 
                height: pieceHeight,
                width: pieceWidth,
                position, 
            });
        });
        for (let i = 0; i < c.length; i++) {
            //c[i].
          }
        if(c.at(0)?.number === n) setPosition({x: 1, y: 0});
        else setPosition({x: 0, y: 0});

        return c;

    }
}
import React, { useEffect, useState } from "react";

import styles from './Board.module.css';

import Chessboard from "chessboardjsx";

import bishop_black from '../../img/bishop_black.svg';
import bishop_white from '../../img/bishop_white.svg';
import king_black from '../../img/king_black.svg';
import king_white from '../../img/king_white.svg';
import knight_black from '../../img/knight_black.svg';
import knight_white from '../../img/knight_white.svg';
import pawn_black from '../../img/pawn_black.svg';
import pawn_white from '../../img/pawn_white.svg';
import queen_black from '../../img/queen_black.svg';
import queen_white from '../../img/queen_white.svg';
import rook_black from '../../img/rook_black.svg';
import rook_white from '../../img/rook_white.svg';

const Chess = require("chess.js");

const Board = ({ onMove, chess, currFen, side, notation }) => {

    const [history, setHistory] = useState([]); // moves history

    const [fen, setFen] = useState(currFen);

    useEffect(() => {
        setFen(currFen);
    }, [currFen])

    const onDrop = ({sourceSquare, targetSquare, side}) => {
        
        let move = chess.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q"
        });

        if (move === null) return;

        let history = chess.history({ verbose: true });

        history[history.length - 1].fen = chess.fen();

        setHistory(history);

        onMove(chess.fen(), move);

    }

    return (
        <div>
            <Chessboard 
                id="board"
                position={fen}
                onDrop={onDrop}
                width={850}
                undo={true}
                orientation={side}
                showNotation={notation}
                pieces={{
                    wB: ({ squareWidth, isDragging }) => (
                        <img style={{ width: squareWidth, height: squareWidth }} src={bishop_white} />
                    ),
                    wP: ({ squareWidth, isDragging }) => (
                        <img style={{ width: squareWidth, height: squareWidth }} src={pawn_white} />
                    ),
                    wR: ({ squareWidth, isDragging }) => (
                        <img style={{ width: squareWidth, height: squareWidth }} src={rook_white} />
                    ),
                    wN: ({ squareWidth, isDragging }) => (
                        <img style={{ width: squareWidth, height: squareWidth }} src={knight_white} />
                    ),
                    wQ: ({ squareWidth, isDragging }) => (
                        <img style={{ width: squareWidth, height: squareWidth }} src={queen_white} />
                    ),
                    wK: ({ squareWidth, isDragging }) => (
                        <img style={{ width: squareWidth, height: squareWidth }} src={king_white} />
                    ),
                        
                    bB: ({ squareWidth, isDragging }) => (
                        <img style={{ width: squareWidth, height: squareWidth }} src={bishop_black} />
                    ),
                    bP: ({ squareWidth, isDragging }) => (
                        <img style={{ width: squareWidth, height: squareWidth }} src={pawn_black} />
                    ),
                    bR: ({ squareWidth, isDragging }) => (
                        <img style={{ width: squareWidth, height: squareWidth }} src={rook_black} />
                    ),
                    bN: ({ squareWidth, isDragging }) => (
                        <img style={{ width: squareWidth, height: squareWidth }} src={knight_black} />
                    ),
                    bQ: ({ squareWidth, isDragging }) => (
                        <img style={{ width: squareWidth, height: squareWidth }} src={queen_black} />
                    ),
                    bK: ({ squareWidth, isDragging }) => (
                        <img style={{ width: squareWidth, height: squareWidth }} src={king_black} />
                    ),
                }}
            />
        </div>
    );
};

export default Board;

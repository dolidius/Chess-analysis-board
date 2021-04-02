import React, { useEffect, useState } from "react";

import styles from './Board.module.css';

import Chessboard from "chessboardjsx";

const Chess = require("chess.js");


const Board = ({ onMove, chess, currFen, side }) => {

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
            />
        </div>
    );
};

export default Board;

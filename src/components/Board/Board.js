import React, { useEffect, useState } from "react";

import styles from './Board.module.css';

import Chessboard from "chessboardjsx";

const Chess = require("chess.js");


const Board = ({ onMove, chess, currFen }) => {

    const [history, setHistory] = useState([]); // moves history

    const [fen, setFen] = useState(currFen);

    useEffect(() => {
        setFen(currFen);
    }, [currFen])

    const onDrop = ({sourceSquare, targetSquare}) => {
        
        let move = chess.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q"
        });

        if (move === null) return;

        let history = chess.history({ verbose: true });

        history[history.length - 1].fen = chess.fen();

        setHistory(history);

        onMove(chess.fen(), history);

    }

    return (
        <div>
            <Chessboard 
                id="board"
                position={fen}
                onDrop={onDrop}
                width={850}
                undo={true}
            />
        </div>
    );
};

export default Board;

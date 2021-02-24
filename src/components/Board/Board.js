import React, { useEffect, useState } from "react";

import styles from './Board.module.css';

import Chessboard from "chessboardjsx";

const Chess = require("chess.js");


const Board = ({ onMove, chess, fen }) => {

    const [history, setHistory] = useState([]); // moves history

    const onDrop = ({sourceSquare, targetSquare}) => {
        
        let move = chess.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q"
        });

        if (move === null) return;

        console.log('siema');

        let history = chess.history({ verbose: true });

        history[history.length - 1].fen = chess.fen();

        setHistory(history);

        onMove(chess.fen(), history);

    }

    useEffect(() => {
        console.log(history);
    }, [history]);

    return (
        <div key={fen}>
            <Chessboard 
                id="board"
                position={fen}
                onDrop={onDrop}
                width={850}
            />
        </div>
    );
};

export default Board;

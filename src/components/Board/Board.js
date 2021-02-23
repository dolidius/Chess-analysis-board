import React, { useEffect, useState } from "react";

import styles from './Board.module.css';

import Chessboard from "chessboardjsx";

const Chess = require("chess.js");


const Board = () => {
    const [chess] = useState(
        new Chess()
    );

    const [fen, setFen] = useState(chess.fen()); // curr fen position
    const [history, setHistory] = useState([]); // moves history

    const onDrop = ({sourceSquare, targetSquare}) => {
        
        let move = chess.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q"
        });

        if (move === null) return;

        setFen(chess.fen());

        setHistory(chess.history({ verbose: true }));

    }

    useEffect(() => {
        console.log(history);
    }, [history]);

    return (
        <div>
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

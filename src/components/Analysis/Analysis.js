import React, { useEffect, useState } from "react";

import Board from '../Board/Board';

import styles from './Analysis.module.css';

const Chess = require("chess.js");

const Analysis = () => {

    const [chess] = useState(
        new Chess()
    );

    const [fen, setFen] = useState(chess.fen());
    const [history, setHistory] = useState({});
    const [stockfish] = useState(new Worker("/stockfish.js"));

    useEffect(() => {
        stockfish.postMessage("uci");
        stockfish.postMessage("ucinewgame");
    }, [stockfish]);

    useEffect(() => {
        // stockfish.postMessage("position fen " + fen);
        // stockfish.postMessage("go depth 10");
        // console.log("!NEW MESSAGE!")
        // stockfish.onmessage = function(event) {
        //     console.log(event.data ? event.data : event);
        // };
    }, [fen, stockfish])

    const onMove = (fen, history) => {
        setFen(fen);
        setHistory(history);
    }

    const undoMove = () => {
        console.log(chess.undo());
        console.log(chess.fen());
        setFen(chess.fen());
    }

    return (
        <div className={styles.container}>
            <Board
                onMove={onMove}
                chess={chess}
                fen={fen}
            />

            <div className={styles.menu}>
                <button onClick={undoMove}>undo move</button>
            </div>

        </div>
    );
};

export default Analysis;

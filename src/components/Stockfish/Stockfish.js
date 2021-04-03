import React, { useState, useEffect } from 'react';

import styles from './Stockfish.module.css';

const Chess = require("chess.js");

const stockfish = new Worker("/stockfish.js");

const Stockfish = ({ fen, engineDepth }) => {

    const [depth, setDepth] = useState(engineDepth);
    const [bestLines, setBestLines] = useState([]); // [0]-best, [1]-second best, [2]-third best
    const [bestMove, setBestMove] = useState("");

    useEffect(() => {
        setDepth(engineDepth);
    }, [engineDepth])

    useEffect(() => {
        stockfish.postMessage("uci");
        stockfish.postMessage("ucinewgame");
        stockfish.postMessage("setoption name MultiPV value 3"); // best 3 lines
    }, []);

    useEffect(() => {
        
        stockfish.postMessage("position fen " + fen);
        stockfish.postMessage(`go depth ${depth}`);
        // console.log("!NEW MESSAGE!")
        stockfish.onmessage = function(event) {
            // console.log(event.data ? event.data: event);
            if (event.data.startsWith(`info depth ${depth}`)) {
                let message = event.data.split(' ');

                let index = 0;
                let movesIndex = 0;

                let moves = [];

                for (let i = 0; i < message.length; i ++) {
                    if (message[i] === 'multipv') {
                        index = parseInt(message[i + 1]) - 1;
                    }

                    if (message[i] === 'pv') {
                        movesIndex = i + 1;
                        break;
                    }

                }

                for (let i = movesIndex; i < message.length; i ++) {
                    if (message[i] === 'bmc') break;
                    moves.push(message[i]);
                }

                const bestLinesCopy = bestLines;
                bestLinesCopy[index] = convertStockfishLine(moves);
                setBestLines(bestLinesCopy);

            }

            if (event.data.startsWith("bestmove")) {
                let message = event.data.split(' ');
                setBestMove(message[1]);
            }
        };

    }, [fen]);

    const convertStockfishLine = line => {
        
        const chess2 = new Chess(`${fen}`);

        const convertedLine = [];

        console.log(line);

        for (let i = 0; i < line.length; i ++) {

            const move = line[i];

            const from = move[0] + move[1];
            const to = move[2] + move[3];

            const piece = chess2.get(from).type;
            const piece2 = chess2.get(to);

            let convertedMove = "";

            if (piece === 'p') {
                if (piece2 === null) {
                    convertedMove += to;
                } else {
                    convertedMove += `${move[0]}x${to}`
                }
            } else {
                if (piece2 === null) {
                    convertedMove += piece.toUpperCase() + to;
                } else {
                    convertedMove += `${piece.toUpperCase()}x${to}`
                }
            }

            convertedLine.push(convertedMove);

            chess2.move(from + to, { sloppy: true });

        }

        return convertedLine;

    }

    return (
        <div className={styles.bestLines} onClick={() => console.log(bestLines)}>
            {bestLines.map(bestLine => (
                <div className={styles.bestLine}>
                    {bestLine.map(bestMove => 
                        <div className={styles.bestMove}>
                            {bestMove}
                        </div>    
                    )}
                </div>
            ))}
        </div>
    )

}

export default Stockfish;
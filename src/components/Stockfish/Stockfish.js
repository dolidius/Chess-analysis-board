import React, { useState, useEffect } from 'react';

import styles from './Stockfish.module.css';

const Chess = require("chess.js");

let stockfish = new Worker("/stockfish.js");

const Stockfish = ({ fen, engineDepth, sendEval }) => {

    const [depth, setDepth] = useState(engineDepth);
    const [bestLines, setBestLines] = useState([]); // [0]-best, [1]-second best, [2]-third best
    const [bestMove, setBestMove] = useState("");
    const [currEval, setCurrEval] = useState("0");

    useEffect(() => {
        setDepth(engineDepth);
    }, [engineDepth])

    const convertEvaluation = (ev) => {
        // console.log(ev);
        const chess = new Chess(`${fen}`);

        const turn = chess.turn();

        if (turn === 'b' && !ev.startsWith('M')) {

            if (ev.startsWith('-')) {
                ev = ev.substring(1);
            } else {
                ev = `-${ev}`;
            }
        }

        return ev;
    }

    useEffect(() => {
        sendEval(currEval);
    }, [currEval]);

    useEffect(() => {
        stockfish.terminate();
        
        stockfish = new Worker("/stockfish.js");
        stockfish.postMessage("uci");
        stockfish.postMessage("ucinewgame");
        stockfish.postMessage("setoption name MultiPV value 3");
        stockfish.postMessage(`position fen ${fen}`);
        stockfish.postMessage(`go depth ${depth}`);
        stockfish.onmessage = function(event) {
            // console.log(event.data ? event.data: event);
            if (event.data.startsWith(`info depth`)) {
                let message = event.data.split(' ');

                let index = 0;
                let movesIndex = 0;

                let moves = [];

                let evalutaion = "0";

                for (let i = 0; i < message.length; i ++) {
                    if (message[i] === 'multipv') {
                        index = parseInt(message[i + 1]) - 1;
                    }

                    if (message[i] === 'score' && message[i + 1] === 'cp' && index === 0) {
                        evalutaion = message[i + 2];
                        setCurrEval(convertEvaluation(evalutaion));
                        console.log(evalutaion);
                    }

                    else if (message[i] === 'score' && index === 0) {
                        evalutaion = 'M' + message[i + 2];
                        setCurrEval(convertEvaluation(evalutaion));
                        console.log(evalutaion);
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

    }, [fen, depth]);

    const convertStockfishLine = line => {
        
        const chess2 = new Chess(`${fen}`);

        const convertedLine = [];

        for (let i = 0; i < line.length; i ++) {

            const move = line[i];

            const from = move[0] + move[1];
            const to = move[2] + move[3];

            if (chess2.get(from) === null) {
                break;
            }

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
        <div className={styles.bestLines}>
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
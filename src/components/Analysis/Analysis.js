import React, { useEffect, useState } from "react";

import Board from '../Board/Board';
import Move from '../Move/Move';
import SubAnalysisMove from '../SubAnalysisMove/SubAnalysisMove';

import styles from './Analysis.module.css';

import parser from '@chess-fu/pgn-parser'
const pgnParser = new parser();

const Chess = require("chess.js");

const stockfish = new Worker("/stockfish.js");

const Analysis = () => {

    const [chess] = useState(
        new Chess()
    );

    const [fen, setFen] = useState(chess.fen());

    const [analysisPGN, setAnalysisPGN] = useState("");
    const [loadedPGN, setLoadedPGN] = useState("");
    
    const [depth, setDepth] = useState(10);
    const [bestLines, setBestLines] = useState([]); // [0]-best, [1]-second best, [2]-third best
    const [bestMove, setBestMove] = useState("");

    useEffect(() => {
        chess.header('White', 'unknown')
        chess.header('Black', 'unknown')
    }, [chess])

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

    }, [fen])

    const onMove = (fen) => {
        setFen(fen);
    }

    const undoMove = () => {
        chess.undo();
        setFen(chess.fen());
    }

    const loadPGN = (e) => {
        e.preventDefault();
        const pgn = loadedPGN;
        if (chess.load_pgn(pgn)) {
            setFen(chess.fen());
            setAnalysisPGN(pgn);
            console.log("correct");
            
        } else {
            console.log("wrong");
        }
    }

    const addHeadersToPGN = (headers) => {
        let newPgn = "";

        headers.forEach(header => {
            newPgn += `[${header.name} \"${header.value}\"]\n`;
        });

        newPgn += "\n";

        return newPgn;
    }

    const createPGN = (headers, moves) => {
        let newPgn = addHeadersToPGN(headers);

        let moveNumber = 1;
        let numberTimes = 0;
        let add = false;

        for (let i = 0; i < moves.length; i ++) {
            
            if (numberTimes === 0) {
                newPgn += `${moveNumber}. `;
                add = true;
            }

            if (numberTimes === 1) {
                moveNumber ++;
                numberTimes = 0;
            }

            if (add) {
                numberTimes = 1;
                add = false;
            }

            newPgn += `${moves[i]} `;

        }
        
    }


    const moveHistoryPress = (piece, to, moveNum) => {

        const parsed = pgnParser.parse(analysisPGN);

        const headers = parsed[0].headers;
        const moves = parsed[0].history;

        let newPgn = addHeadersToPGN(headers);

        let moveNumber = 1;
        let numberTimes = 0;
        let add = false;

        let moveNumberOverall = 1;

        for (let i = 0; i < moves.length; i ++) {
            
            if (moves[i].piece != null) {
                
                const move = moves[i];

                if (numberTimes === 0) {
                    newPgn += `${moveNumber}. `;
                    add = true;
                }

                if (numberTimes === 1) {
                    moveNumber ++;
                    numberTimes = 0;
                }

                if (add) {
                    numberTimes = 1;
                    add = false;
                }

                newPgn += `${move.raw} `;

                if (moveNumberOverall === moveNum) {
                    break;
                }

                moveNumberOverall ++;
            }

        }

        if (chess.load_pgn(newPgn)) {
            setFen(chess.fen());
        } else {
            console.log("bugged");
        }

    }

    const onSubAnalysisPress = (piece, to, moveNum, ravNumber) => {

        const parsed = pgnParser.parse(analysisPGN);

        const headers = parsed[0].headers;
        let moves = parsed[0].history;

        let newPgn = addHeadersToPGN(headers);

        let moveNumber = 1;
        let numberTimes = 0;
        let add = false;
        
        for (let i = 0; i < ravNumber.length; i ++) {
            let moveCounter = 0;
            
            for (let j = 0; j < moves.length; j ++) {

                if (moves[j].piece != null) {
                    
                    moveCounter++;

                    if (ravNumber[i] === moveCounter) {
                        moves = moves[j].rav;

                        if (i === ravNumber.length - 1) {
                            //loop through last rav
                            moveCounter = 0;
                            for (let k = 0; k < moves.length; k ++) {
                                if (moves[k].piece != null) {
                                    moveCounter ++;
                                    if (numberTimes === 0) {
                                        newPgn += `${moveNumber}. `;
                                        add = true;
                                    }
                    
                                    if (numberTimes === 1) {
                                        moveNumber ++;
                                        numberTimes = 0;
                                    }
                    
                                    if (add) {
                                        numberTimes = 1;
                                        add = false;
                                    }

                                    newPgn += `${moves[k].raw} `;

                                    if (moveCounter === moveNum) {
                                        break;
                                    }
                                }
                            }

                        }

                        break;
                    }

                    if (numberTimes === 0) {
                        newPgn += `${moveNumber}. `;
                        add = true;
                    }
    
                    if (numberTimes === 1) {
                        moveNumber ++;
                        numberTimes = 0;
                    }
    
                    if (add) {
                        numberTimes = 1;
                        add = false;
                    }

                    newPgn += `${moves[j].raw} `;

                }


            }

        }

        if (chess.load_pgn(newPgn)) {
            setFen(chess.fen());
        } else {
            console.log("bugged");
        }

    }

    const loadSubAnalysis = (moves, ravNumber) => {

        let moveNumber = 1;
        let numberTimes = 0;
        let add = false;

        let moveNumberOverall = 1;

        let subAn = [];

        for (let i = 0; i < moves.length; i ++) {
            
            if (moves[i].piece != null) {
                
                const move = moves[i];

                if (numberTimes === 0) {
                    subAn.push(<div>{moveNumber}</div>);
                    add = true;
                }

                if (numberTimes === 1) {
                    moveNumber ++;
                    numberTimes = 0;
                }

                if (add) {
                    numberTimes = 1;
                    add = false;
                }

                subAn.push(
                    <SubAnalysisMove
                        piece={move.piece}
                        to={move.to}
                        ravNumber={ravNumber}
                        raw={move.raw}
                        moveNumberOverall={moveNumberOverall}
                        onSubAnalysisPress={onSubAnalysisPress}
                    />
                )

                if (move.rav) {
                    //subanalysis
                    const sub = loadSubAnalysis(move.rav, [...ravNumber, moveNumberOverall]);
                    subAn.push(<div className={styles.subAnalysisInside}>({sub})</div>);
                }

                moveNumberOverall ++;
            }

        }

        return subAn;

    }

    const convertStockfishLine = line => {
        
        const chess2 = new Chess(`${fen}`);

        const convertedLine = [];

        for (let i = 0; i < line.length; i ++) {

            const move = line[i];

            const from = move[0] + move[1];
            const to = move[2] + move[3];

            const piece = chess2.get(from).type;

            let convertedMove = "";

            if (piece === 'p') {
                convertedMove += to;
            } else {
                convertedMove += piece.toUpperCase() + to;
            }

            convertedLine.push(convertedMove);

            chess2.move(from+to, { sloppy: true });

        }

        return convertedLine;

    }

    let moveNumber = 1;
    let numberTimes = 0;
    let add = false;

    let moveNumberOverall = 1;

    return (
        <div className={styles.container}>
            <Board
                onMove={onMove}
                chess={chess}
                currFen={fen}
            />

            <div className={styles.menu}>
                <form className={styles.loadPGN} onSubmit={loadPGN}>
                    <textarea 
                        type="text" 
                        value={loadedPGN}
                        onChange={e => setLoadedPGN(e.target.value)}
                    />
                    <input type="submit" value="Load PGN" />
                </form>
                <button onClick={() => console.log(bestLines)}>elo</button>

                <div className={styles.bestLines}>

                    {bestLines.map(bestLine => {
                    })}

                </div>

                <div className={styles.history}>
                    {analysisPGN !== '' &&
                        pgnParser.parse(analysisPGN)[0].history.map((move, i) => {
                            let returnedComp = [];

                            if (move.piece != null) {

                                if (numberTimes === 0) {
                                    returnedComp.push(
                                        <div className={styles.moveNum} key={moveNumber}>
                                            {moveNumber}.
                                        </div>
                                    )
                                    add = true;
                                }
                
                                if (numberTimes === 1) {
                                    moveNumber ++;
                                    numberTimes = 0;
                                }
                
                                if (add) {
                                    numberTimes = 1;
                                    add = false;
                                }

                                returnedComp.push( 
                                    <Move
                                        key={moveNumber + move.piece + move.to}
                                        onMoveClick={moveHistoryPress}
                                        piece={move.piece}
                                        to={move.to}
                                        moveNum={moveNumberOverall}
                                        raw={move.raw}
                                    />
                                );

                                if (move.rav) {
                                    //subanalysis
                                    const sub = loadSubAnalysis(move.rav, [moveNumberOverall]);
                                    returnedComp.push(<div className={styles.subAnalysis}>({sub})</div>);
                                }

                                moveNumberOverall ++;

                            }
                            return ( 
                                returnedComp
                            );
                        })
                    }
                </div>
                
            </div>

        </div>
    );
};

export default Analysis;
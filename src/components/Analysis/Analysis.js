import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faCog, faSync } from '@fortawesome/free-solid-svg-icons'

import Board from '../Board/Board';
import Move from '../Move/Move';
import SubAnalysisMove from '../SubAnalysisMove/SubAnalysisMove';
import Stockfish from '../Stockfish/Stockfish';
import MenuButtons from '../MenuButtons/MenuButtons';
import LoadGamePopup from '../LoadGamePopup/LoadGamePopup';
import SettingsPopup from '../SettingPopup/SettingsPopup';

import styles from './Analysis.module.css';

import parser from '@chess-fu/pgn-parser'
const pgnParser = new parser();

const Chess = require("chess.js");



const Analysis = () => {

    const [chess] = useState(
        new Chess()
    );

    const [fen, setFen] = useState(chess.fen());

    const [analysisPGN, setAnalysisPGN] = useState("");
    const [loadedPGN, setLoadedPGN] = useState("");

    const [orientation, setOrientation] = useState('white');

    const [currMove, setCurrMove] = useState({
        moveNum: 0,
        ravNumber: [],
        whichRav: []
    });

    const [isLoadActive, setLoadActive] = useState(false);
    const [isSettingsActive, setSettingsActive] = useState(false);

    const [depth, setDepth] = useState(10);

    const [notation, setNotation] = useState(true);

    useEffect(() => {
        //podswietl curr move
    }, [currMove])

    useEffect(() => {
        chess.header('White', 'unknown')
        chess.header('Black', 'unknown')
    }, [chess])


    const undoMove = () => {
        chess.undo();
        setFen(chess.fen());
    }

    const setCurrMoveToLast = pgn => {
        
        const parsed = pgnParser.parse(pgn);
        const moves = parsed[0].history;
        let moveCounter = 0;

        for (let i = 0; i < moves.length; i ++) {
            if (moves[i].piece != null) moveCounter ++;
        }

        setCurrMove({
            moveNum: moveCounter,
            ravNumber: [],
            whichRav: []
        });

    }

    const loadPGN = (pgn) => {
        if (chess.load_pgn(pgn)) {
            setFen(chess.fen());
            setAnalysisPGN(pgn);
            setCurrMoveToLast(pgn);
            console.log("correct");
            setLoadActive(false);
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

    

    

    const moveHistoryPress = (piece, to, moveNum) => {

        const parsed = pgnParser.parse(analysisPGN);

        const headers = parsed[0].headers;
        const moves = parsed[0].history;

        let moveNumberOverall = 1;

        const parsedMoves = [];

        for (let i = 0; i < moves.length; i ++) {
            
            if (moves[i].piece != null) {
                
                const move = moves[i];

                parsedMoves.push(move.raw);
               
                if (moveNumberOverall === moveNum) {
                    break;
                }

                moveNumberOverall ++;
            }

        }

        let newPgn = createPGN(headers, parsedMoves);

        if (chess.load_pgn(newPgn)) {
            setFen(chess.fen());
            setCurrMove({
                moveNum,
                ravNumber: [],
                whichRav: []
            });
        } else {
            console.log("bugged");
        }

    }

    const onSubAnalysisPress = (piece, to, moveNum, ravNumber, whichRav) => {

        const parsed = pgnParser.parse(analysisPGN);

        const headers = parsed[0].headers;
        let moves = parsed[0].history;

        const parsedMoves = [];

        let depth = 0;

        for (let i = 0; i < ravNumber.length; i ++) {
            let moveCounter = 0;
            
            for (let j = 0; j < moves.length; j ++) {

                if (moves[j].piece != null) {
                    
                    moveCounter++;

                    if (ravNumber[i] === moveCounter) {
                        moves = moves[j + (whichRav[depth] - 1)].rav;
                        depth ++;

                        if (i === ravNumber.length - 1) {
                            // check which rav
                            // moves = moves[j + (whichRav - 1)].rav;

                            // loop through last rav
                            moveCounter = 0;
                            for (let k = 0; k < moves.length; k ++) {

                                if (moves[k].piece != null) {
                                    moveCounter ++;

                                    parsedMoves.push(moves[k].raw);

                                    if (moveCounter === moveNum) {
                                        setCurrMove({
                                            moveNum,
                                            ravNumber,
                                            whichRav
                                        });
                                        break;
                                    }
                                }
                            }

                        }

                        break;
                    }

                    parsedMoves.push(moves[j].raw);

                }

            }

        }

        let newPgn = createPGN(headers, parsedMoves);

        if (chess.load_pgn(newPgn)) {
            setFen(chess.fen());
            setCurrMove({
                moveNum,
                ravNumber,
                whichRav
            });
            
        } else {
            console.log("bugged");
        }


    }

    const loadSubAnalysis = (moves, ravNumber, whichRav) => {

        let moveNumber = 1;
        let numberTimes = 0;
        let add = false;

        let moveNumberOverall = 1;

        let subAn = [];

        let whichRavNum = 1;

        for (let i = 0; i < moves.length; i ++) {
            const move = moves[i];
            
            if (moves[i].piece != null) {

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
                        whichRav={whichRav}
                    />
                )

                if (move.rav) {
                    //subanalysis
                    const sub = loadSubAnalysis(move.rav, [...ravNumber, moveNumberOverall], [...whichRav, whichRavNum]);
                    subAn.push(<div className={styles.subAnalysisInside}>({sub})</div>);
                }

                moveNumberOverall ++;
            }

            if (!move.piece && move.rav) {
                whichRavNum ++;
                const sub = loadSubAnalysis(move.rav, [moveNumberOverall - 1], [...whichRav, whichRavNum]);
                subAn.push(<div className={styles.subAnalysis}>({sub})</div>);
            }

        }

        return subAn;

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

        return newPgn;
        
    }

    const createPGNWithSubRec = (pgn, moves, moveNumber, numberTimes, add, isSub) => {

        if (isSub) {
            const isBlack = numberTimes === 0;
            moveNumber = isBlack ? moveNumber - 1 : moveNumber;

            if (isBlack) {
                pgn += `(${moveNumber}... `;
                numberTimes = 1;
            } else {
                pgn += `(`;
                numberTimes = 0;
            }

        }

        for (let i = 0; i < moves.length; i ++) {

            if (moves[i].piece != null) {
                if (numberTimes === 0) {
                    pgn += `${moveNumber}. `;
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

                pgn += `${moves[i].raw} `;
            }

            if (moves[i].rav) {
                pgn = createPGNWithSubRec(pgn, moves[i].rav, moveNumber, numberTimes, add, true);
            }

        }

        if (isSub) pgn += ") ";

        return pgn
    }

    const createPGNWithSub = (headers, moves) => {

        let pgn = addHeadersToPGN(headers);
        console.log(pgn);

        let moveNumber = 1;
        let numberTimes = 0;
        let add = false;

        pgn = createPGNWithSubRec(pgn, moves, moveNumber, numberTimes, add, false);

        return pgn;

    }

    const addMove = (moves, newMove) => {

        let moveNumberOverall = 0;

        console.log(moves);

        for (let i = 0; i < currMove.ravNumber.length; i ++) {

            for (let j = 0; j < moves.length; j ++) {
                if (moves[j].piece != null) {
                    moveNumberOverall ++;

                    if (currMove.ravNumber[i] === moveNumberOverall) {
                        moves = moves[j + currMove.whichRav[i] - 1].rav;
                        moveNumberOverall = 0;
                        break;
                    }

                }

            }

        }

        console.log(moves);
        let newCurr = currMove;

        for (let i = 0; i < moves.length; i ++) {

            if (moves[i].piece != null) {
                moveNumberOverall ++;

                if (currMove.moveNum === moveNumberOverall) {
                    //we found curr move :D

                    let newMoveObj = {
                        piece: newMove.piece.toUpperCase(),
                        to: newMove.to,
                        raw: `${newMove.san}`
                    }

                    if (i === moves.length - 1) {
                        moves[i + 1] = newMoveObj;
                        newCurr = {
                            moveNum: currMove.moveNum + 1,
                            ravNumber: currMove.ravNumber,
                            whichRav: currMove.whichRav
                        }
                    } else {

                        //check if there is a raw with that move in db
                        if (moves[i + 1].raw === newMoveObj.raw) {
                            //next move is the same as made
                            console.log('next jest ten sam w tym samym depthie')
                            newCurr = {
                                moveNum: currMove.moveNum + 1,
                                ravNumber: currMove.ravNumber,
                                whichRav: currMove.whichRav
                            }
                        } else {

                            let exists = false;

                            let k = i + 1;
                            for (let k = i + 1; k < moves.length; k ++) {
                                if (!moves[k].rav) {
                                    break;
                                } else {
                                    if (moves[k].rav[0].raw === newMoveObj.raw) {
                                        //exists sub with same move
                                        exists = true;
                                        console.log('jest taki sam sub');
                                    }
                                }
                            }

                            if (!exists) {
                                if (moves[i + 1].rav) {
                                    //po k nowy elem
                                    insertAt(moves, k + 1, {rav: [newMoveObj]});
                                    newCurr = {
                                        moveNum: 1,
                                        ravNumber: [...currMove.ravNumber, currMove.moveNum + 1],
                                        whichRav: [...currMove.whichRav, k + 1]
                                    }
                                } else {
                                    moves[i + 1].rav = [newMoveObj]
                                    newCurr = {
                                        moveNum: 1,
                                        ravNumber: [...currMove.ravNumber, currMove.moveNum + 1],
                                        whichRav: [...currMove.whichRav, 1]
                                    }
                                }
                            }

                        }

                    }

                    break;

                }

            }

        }

        return newCurr;


    }

    function insertAt(array, index, element) {
        array.splice(index, 0, element);
    }

    const onMove = (fen, move) => {

        const parsed = pgnParser.parse(analysisPGN);

        let newAnalysisPGN;

        if (!parsed[0]) {
            newAnalysisPGN = `1. ${move.san}`
            setCurrMove({
                moveNum: 1,
                ravNumber: [],
                whichRav: []
            });
        } else {
            const headers = parsed[0] ? parsed[0].headers : []; 
            let moves = parsed[0] ? parsed[0].history : [];
            
            const newCurr = addMove(moves, move);
            newAnalysisPGN = createPGNWithSub(headers, moves);
            setCurrMove(newCurr);
        }

        setAnalysisPGN(newAnalysisPGN);
        setFen(fen);

    }

    const backgroundLoadExit = (e, modal) => {
        if (e.target === modal.current) {
            setLoadActive(false);
        }
    }

    const backgroundSettingsExit = (e, modal) => {
        if (e.target === modal.current) {
            setSettingsActive(false);
        }
    }

    const resetBoard = () => {
        setAnalysisPGN("");
        setCurrMove({
            moveNum: 0,
            ravNumber: [],
            whichRav: []
        });
        chess.reset();
        setFen(chess.fen());
    }

    const flipBoard = () => {
        if (orientation === 'white') {
            setOrientation('black');
        } else {
            setOrientation('white');
        }
    }

    let moveNumber = 1;
    let numberTimes = 0;
    let add = false;

    let moveNumberOverall = 1;
    let whichRav = 1;


    return (
        <div className={styles.container}>

            <LoadGamePopup
                isActive={isLoadActive}
                setLoadActive={setLoadActive}
                loadPGN={loadPGN}
                backgroundLoadExit={backgroundLoadExit}
            />

            <SettingsPopup
                isActive={isSettingsActive}
                setSettingsActive={setSettingsActive}
                backgroundSettingsExit={backgroundSettingsExit}
                depth={depth}
                setDepth={setDepth}
                notation={notation}
                setNotation={setNotation}
            />

            <Board
                onMove={onMove}
                chess={chess}
                currFen={fen}
                side={orientation}
                notation={notation}
            />

            <div className={styles.menu}>

                <MenuButtons
                    setLoadActive={setLoadActive}
                    resetBoard={resetBoard}
                    flipBoard={flipBoard}
                    setSettingsActive={setSettingsActive}
                />

                <Stockfish
                    fen={fen}
                    engineDepth={depth}
                />

                <div className={styles.history}>
                    {analysisPGN !== '' &&
                        pgnParser.parse(analysisPGN)[0].history.map((move, i) => {
                            let returnedComp = [];

                            if (move.piece != null) {

                                whichRav = 1;

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
                                    const sub = loadSubAnalysis(move.rav, [moveNumberOverall], [whichRav]);
                                    returnedComp.push(<div className={styles.subAnalysis}>({sub})</div>);
                                }

                                moveNumberOverall ++;

                            }

                            if (!move.piece && move.rav) {
                                whichRav ++;
                                const sub = loadSubAnalysis(move.rav, [moveNumberOverall - 1], [whichRav]);
                                returnedComp.push(<div className={styles.subAnalysis}>({sub})</div>);
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
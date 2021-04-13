import React, { useEffect, useState } from "react";

import styles from "./EvalBar.module.css";

const EvalBar = ({ evaluation, getCurrPlayer }) => {
    const [wHeight, setWHeight] = useState(50);

    useEffect(() => {
        if (evaluation.startsWith("M")) {
            if (evaluation === "M0") {
                console.log(getCurrPlayer());
                if (getCurrPlayer() === "b") {
                    setWHeight(100);
                } else {
                    setWHeight(0);
                }
            } else {
                const currPlayer = getCurrPlayer();

                if (
                    (currPlayer === "w" && evaluation[1] != "-") ||
                    (currPlayer === "b" && evaluation[1] === "-")
                ) {
                    setWHeight(100);
                } else {
                    setWHeight(0);
                }
            }
        } else {
            let adv;

            if (evaluation.startsWith("-")) {
                adv = "b";
            } else {
                adv = "w";
            }

            evaluation = Math.abs(parseFloat(evaluation) / 100);

            const evaluated = evaluateFunc(evaluation);

            if (adv === "w") setWHeight(50 + evaluated);
            else setWHeight(50 - evaluated);
        }
    }, [evaluation]);

    const evaluateFunc = (x) => {
        if (x === 0) {
            return 0;
        } else if (x < 7) {
            return -(0.322495 * Math.pow(x, 2)) + 7.26599 * x + 4.11834;
        } else {
            return (8 * x) / 145 + 5881 / 145;
        }
    };

    const printEvaluation = () => {
        let printed = evaluation;

        if (evaluation.startsWith("M")) {
            if (evaluation[1] === "-") {
                printed = printed.slice(0, 1) + printed.slice(2);
            }
        } else {
            printed = parseFloat(evaluation) / 100;
        }

        return printed;
    };

    return (
        <div className={styles.bar}>
            <div
                style={{ height: `${100 - wHeight}%` }}
                className={styles.barBlack}
            >
                <span>{wHeight < 50 ? printEvaluation() : ""}</span>
            </div>

            <div style={{ height: `${wHeight}%` }} className={styles.barWhite}>
                <div style={{ flex: "1" }} />
                <span>{wHeight >= 50 ? printEvaluation() : ""}</span>
            </div>
        </div>
    );
};

export default EvalBar;

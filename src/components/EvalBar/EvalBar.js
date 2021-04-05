import React, { useEffect, useState } from 'react';

import styles from './EvalBar.module.css';

const EvalBar = ({ evaluation }) => {

    const [wHeight, setWHeight] = useState(50);

    useEffect(() => {

        let adv;

        if (evaluation.startsWith('-')) {
            adv = 'b';
        } else {
            adv = 'w';
        }

        evaluation = Math.abs(parseFloat(evaluation) / 100);

        const evaluated = evaluateFunc(evaluation);

        if (adv === 'w') setWHeight(50 + evaluated);
        else setWHeight(50 - evaluated);
        
    }, [evaluation]);

    const evaluateFunc = x => {
        if (x === 0) {
            return 0;
        } else if (x < 7) {
            return (-(0.322495*Math.pow(x,2)) + 7.26599*x + 4.11834)
        } else {
            return ((8*x/145) + (5881/145))
        }
    }
    

    return (
        <div className={styles.bar}>

            <div style={ {height: `${100 - wHeight}%`}} className={styles.barBlack}>
                <span>{wHeight < 50 ? parseFloat(evaluation) / 100 : ""}</span>
            </div>

            <div style={{ height: `${wHeight}%` }} className={styles.barWhite}>
                <div style={{ flex: '1' }} />
                <span>{wHeight >= 50 ? parseFloat(evaluation) / 100 : ""}</span>
            </div>

        </div>
    );
}

export default EvalBar;
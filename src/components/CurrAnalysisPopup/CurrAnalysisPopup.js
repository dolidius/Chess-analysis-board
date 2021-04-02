import React, { useState, createRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import styles from "./CurrAnalysisPopup.module.css";

const CurrAnalysisPopup = ({ isActive, setActive, backgroundCurrAnalysisExit, analysisPGN }) => {

    const [modal] = useState(createRef());

    if (isActive) {
        return (
            <div ref={modal} onClick={(e) => backgroundCurrAnalysisExit(e, modal)} className={styles.container}>
                <div className={styles.box}>
                    <div
                        onClick={() => setActive(false)}
                        className={styles.exit}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </div>

                    <div className={styles.currPGN}>
                        <div className={styles.pgnLabel}>PGN:</div>
                        <textarea 
                            className={styles.pgnArea}
                            type="text"
                            value={analysisPGN}
                            disabled
                        />
                    </div>

                </div>
            </div>
        );
    } else {
        return null;
    }
};

export default CurrAnalysisPopup;

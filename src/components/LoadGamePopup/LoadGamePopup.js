import React, { useState, createRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import styles from "./LoadGamePopup.module.css";

const LoadGamePopup = ({
    isActive,
    setLoadActive,
    loadPGN,
    backgroundLoadExit,
}) => {
    const [loadedPGN, setLoadedPGN] = useState("");

    const [modal] = useState(createRef());

    if (isActive) {
        return (
            <div
                ref={modal}
                onClick={(e) => backgroundLoadExit(e, modal)}
                className={styles.container}
            >
                <div className={styles.box}>
                    <div
                        onClick={() => setLoadActive(false)}
                        className={styles.exit}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                    <form
                        className={styles.loadPGN}
                        onSubmit={(e) => {
                            e.preventDefault();
                            loadPGN(loadedPGN);
                            setLoadedPGN("");
                        }}
                    >
                        <textarea
                            className={styles.pgnArea}
                            type="text"
                            value={loadedPGN}
                            onChange={(e) => setLoadedPGN(e.target.value)}
                            placeholder="Enter your PGN here..."
                        />
                        <input
                            type="submit"
                            value="Load PGN"
                            className={styles.pgnLoadBtn}
                        />
                    </form>
                </div>
            </div>
        );
    } else {
        return null;
    }
};

export default LoadGamePopup;

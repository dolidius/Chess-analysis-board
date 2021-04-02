import React, { useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import styles from './LoadGamePopup.module.css';

const LoadGamePopup = ({ isActive, setLoadActive, loadPGN }) => {

    const [loadedPGN, setLoadedPGN] = useState("");

    if (isActive) {
        return (
            <div className={styles.container}>
                <div className={styles.box}>
                    <div onClick={() => setLoadActive(false)} className={styles.exit}>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                    <form className={styles.loadPGN} onSubmit={(e) => {e.preventDefault(); loadPGN(loadedPGN);}}>
                        <textarea 
                            className={styles.pgnArea}
                            type="text" 
                            value={loadedPGN}
                            onChange={e => setLoadedPGN(e.target.value)}
                        />
                        <input 
                            type="submit" 
                            value="Load PGN" 
                            className={styles.pgnLoadBtn}
                        />

                    </form>
                </div>
            </div>
        )
    } else {
        return null;
    }

    
}

export default LoadGamePopup;
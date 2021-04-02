import React, { useState, createRef } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import Switch from '../Switch/Switch';

import styles from './SettingsPopup.module.css';

const SettingsPopup = ({ isActive, setSettingsActive, backgroundSettingsExit, depth, setDepth, notation, setNotation }) => {

    const [modal] = useState(createRef());

    const [newDepth, setNewDepth] = useState(depth);

    const [showNotation, setShowNotation] = useState(true);

    const confirmSettings = (e) => {
        e.preventDefault();

        if (newDepth >= 1 && newDepth <= 30) {
            setDepth(newDepth);
        }

        setNotation(showNotation);

        setSettingsActive(false);

    }

    if (isActive) {
        return (
            <div ref={modal} onClick={(e) => backgroundSettingsExit(e, modal)} className={styles.container}>
                <div className={styles.box}>
                    <div onClick={() => setSettingsActive(false)} className={styles.exit}>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>

                    <form onSubmit={confirmSettings} className={styles.settingsForm}>

                        <div className={styles.settingsItem}>
                            <div className={styles.settingsLabel}>
                                <label>Depth (0 - 30):</label>
                            </div>
                            <div className={styles.settingsInput}>
                                <input
                                    value={newDepth}
                                    onChange={e => setNewDepth(e.target.value)}
                                    className={styles.basicTextInput} 
                                    type="number" 
                                    min={1} 
                                    max={30} 
                                />
                            </div>
                        </div>

                        <div className={styles.settingsItem}>
                            <div className={styles.settingsLabel}> 
                                <label>Show Notation:</label>
                            </div>
                            <div className={styles.settingsInput}> 
                                <Switch
                                    checked={notation}
                                    setCheck={setShowNotation}
                                /> 
                            </div>
                        </div>

                        <div className={styles.settingsItem}>
                            <div className={styles.settingsLabel}>
                                <label>Upload your own styles:</label>
                            </div>
                            <div className={styles.settingsInput}>
                                <input disabled type="file" min={1} max={30} />
                            </div>
                        </div>

                        <div className={styles.submitSettings}>
                            <button type="submit">Submit</button>
                        </div>

                    </form> 

                </div>
            </div>
        );
    } else {
        return null;
    }
    
}

export default SettingsPopup
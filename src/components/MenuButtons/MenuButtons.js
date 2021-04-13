import React from "react";

import styles from './MenuButtons.module.css';

import Switch from '../Switch/Switch';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faCog, faSync } from "@fortawesome/free-solid-svg-icons";

const MenuButtons = ({ setLoadActive, resetBoard, flipBoard, setSettingsActive, setCurrAnalysisActive, evaluation, setEngineStarted, engineStarted }) => {
    console.log(evaluation);
    return (
        <nav className={styles.menuNav}>
            
            {engineStarted && 
                <div className={styles.evaluationNum}>
                    {evaluation[0] === 'M' ? (evaluation[1] === '-' ? evaluation.slice(0, 1) + evaluation.slice(2) : evaluation) : parseFloat(evaluation) / 100}
                </div>
            }

            <button 
                className={styles.navBtn} 
                style={{ borderRight: 'none', marginLeft: '3px' }}
                onClick={() => setLoadActive(true)}
            >
                    Load Game
            </button>

            <button onClick={resetBoard} className={styles.navBtn}>Reset Board</button>

            <button onClick={() => setSettingsActive(true)} className={styles.navBtnIcon} style={{marginLeft: '15px'}}>
                <FontAwesomeIcon icon={faCog} />
            </button>

            <button onClick={flipBoard} className={styles.navBtnIcon}>
                <FontAwesomeIcon icon={faSync} />
            </button>

            <button onClick={() => setCurrAnalysisActive(true)} className={styles.navBtnIcon}>
                <FontAwesomeIcon icon={faSave} />
            </button>

            <div style={{ flex: 1 }}></div>

            <Switch
                checked={engineStarted}
                setCheck={setEngineStarted}
            />

        </nav>
    );
};

export default MenuButtons;
import React from "react";

import styles from './MenuButtons.module.css';

import Switch from '../Switch/Switch';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faCog, faSync } from "@fortawesome/free-solid-svg-icons";

const MenuButtons = ({ setLoadActive, resetBoard, flipBoard, setSettingsActive, setCurrAnalysisActive }) => {
    return (
        <nav className={styles.menuNav}>

            <div className={styles.evaluationNum}>
                +0.1
            </div>

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

            <Switch />

        </nav>
    );
};

export default MenuButtons;
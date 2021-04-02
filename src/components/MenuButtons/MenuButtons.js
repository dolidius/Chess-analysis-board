import React from "react";

import styles from './MenuButtons.module.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faCog, faSync } from "@fortawesome/free-solid-svg-icons";

const MenuButtons = ({ setLoadActive }) => {
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

            <button className={styles.navBtn}>Reset Board</button>

            <button className={styles.navBtnIcon} style={{marginLeft: '15px'}}>
                <FontAwesomeIcon icon={faCog} />
            </button>

            <button className={styles.navBtnIcon}>
                <FontAwesomeIcon icon={faSync} />
            </button>

            <button className={styles.navBtnIcon}>
                <FontAwesomeIcon icon={faSave} />
            </button>

            <div style={{ flex: 1 }}></div>

            <label class={styles.switch}>
                <input type="checkbox" />
                <span class={styles.slider}></span>
            </label>

        </nav>
    );
};

export default MenuButtons;
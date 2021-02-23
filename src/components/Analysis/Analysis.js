import React from "react";

import Board from '../Board/Board';

import styles from './Analysis.module.css';

const Analysis = () => {
    
    return (
        <div className={styles.container}>
            <Board />
            <div className={styles.menu}>

            </div>
        </div>
    );
};

export default Analysis;

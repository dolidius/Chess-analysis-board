import React from 'react';
import styles from './Move.module.css';

const Move = ({ piece, to, onMoveClick, moveNum, raw }) => {
    return (
        <div className={styles.move} onClick={() => onMoveClick(piece, to, moveNum)}>
            {raw}
        </div>
    )
}

export default Move;
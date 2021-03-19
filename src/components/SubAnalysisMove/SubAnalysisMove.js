import React from 'react';
import styles from './SubAnalysisMove.module.css';

const SubAnalysisMove = ({ piece, to, ravNumber, raw, moveNumberOverall, onSubAnalysisPress }) => {

    const handlePress = () => {
        console.log(moveNumberOverall);
    }
    
    return (
        <div onClick={() => onSubAnalysisPress(piece, to, moveNumberOverall, ravNumber)} className={styles.subMove}>
            {raw},
        </div>
    );
}

export default SubAnalysisMove;
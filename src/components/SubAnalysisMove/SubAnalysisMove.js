import React from 'react';
import styles from './SubAnalysisMove.module.css';

const SubAnalysisMove = ({ piece, to, ravNumber, raw, moveNumberOverall, onSubAnalysisPress, whichRav }) => {
    return (
        <div onClick={() => {onSubAnalysisPress(piece, to, moveNumberOverall, ravNumber, whichRav); console.log(ravNumber); console.log(whichRav); console.log('-------------------')}} className={styles.subMove}>
            {raw}
        </div>
    );
}

export default SubAnalysisMove;
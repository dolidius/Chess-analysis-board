import React from "react";
import styles from "./SubAnalysisMove.module.css";

const SubAnalysisMove = ({
    piece,
    to,
    ravNumber,
    raw,
    moveNumberOverall,
    onSubAnalysisPress,
    whichRav,
    isActive
}) => {
    return (
        <div
            onClick={() => {
                onSubAnalysisPress(
                    piece,
                    to,
                    moveNumberOverall,
                    ravNumber,
                    whichRav
                );
            }}
            className={styles.subMove}
            style={ isActive ? { color: "rgba(255,255,255,0.5)" } : {} }
        >
            {raw}
        </div>
    );
};

export default SubAnalysisMove;

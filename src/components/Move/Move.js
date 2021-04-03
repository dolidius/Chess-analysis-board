import React from "react";
import styles from "./Move.module.css";

const Move = ({ piece, to, onMoveClick, moveNum, raw, isActive }) => {
    return (
        <div
            className={styles.move}
            onClick={() => onMoveClick(piece, to, moveNum)}
            style={ isActive ? { backgroundColor: "#2F2B2F" } : {}}
        >
            {raw}
        </div>
    );
};

export default Move;

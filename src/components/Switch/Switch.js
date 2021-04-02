import React from 'react';

import styles from './Switch.module.css';

const Switch = ({ checked, setCheck }) => {
    return (
        <label class={styles.switch}>
            <input
                defaultChecked={checked}
                onChange={() => setCheck(!checked)}
                type="checkbox"
            />
            <span class={styles.slider}></span>
        </label>
    );
}

export default Switch;
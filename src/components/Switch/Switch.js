import React from 'react';

import styles from './Switch.module.css';

const Switch = () => {
    return (
        <label class={styles.switch}>
            <input type="checkbox" />
            <span class={styles.slider}></span>
        </label>
    );
}

export default Switch;
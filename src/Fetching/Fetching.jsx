import React from 'react';
import styles from './Fetching.module.css';

function Fetching({prevFetchProgress, playlistLength}) {
    return(
        <>
            <h1 className={styles.title}>Loading Videos</h1>
            <div className={styles['fetching-progress']}>
            <div>{`${prevFetchProgress} / ${playlistLength}`}</div>
            {/* Progress bar */}
            <div className={styles['progress']}>
                <div className={styles['progress--fill']} />
            </div>
            </div>
        </>
    )
}

export default Fetching;
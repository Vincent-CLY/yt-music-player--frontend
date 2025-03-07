import React, { useState, useRef, useCallback, useEffect } from 'react';
import LoaderIcon from '../assets/Loader.svg?react';
import { handleChange } from '../utils/urlInputUtils/handleChange';
import { handleSubmit } from '../utils/urlInputUtils/handleSubmit';
import styles from './Input.module.css';
import Fetching from '../Fetching/Fetching';

function Input(setState) {

  const [isValid, setIsValid] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [playlistURL, setPlaylistURL] = useState('');

  
  return (
    <>
      <h1 className={styles.title}>Music Player</h1>
      <form className={styles['form-group']} onSubmit={(e) => handleSubmit(e, setIsValid, playlistURL, isFetching, setIsFetching, setState)}>
        <div className={styles['input-group']}>
          <input
            id="url"
            type="text"
            className={`${styles['url-input']} ${
              !isValid ? styles['error-input'] : ''
            }`}
            placeholder="Enter YouTube Playlist URL or ID"
            onChange={(e) => handleChange(e, setIsValid, setIsEmpty, setPlaylistURL)}
          />
          <button
            disabled={isFetching | isEmpty}
            type="submit"
            className={styles['submit-btn']}
          >
            {isFetching ? <LoaderIcon /> : 'GO!'}
          </button>
        </div>
        {!isValid && (
          <label htmlFor="url" className={styles.error}>
            Playlist URL or ID is not valid{' '}
          </label>
        )} 
      </form>
    </>
  )
}

export default Input;

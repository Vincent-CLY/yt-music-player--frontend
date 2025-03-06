import React, { useState, useRef } from 'react';
import NextSongIcon from '../assets/PlayerNextIcon.svg?react';
import PrevSongIcon from '../assets/PlayerPreviousIcon.svg?react';
import PlaySongIcon from '../assets/PlayerPlayIcon.svg?react';
import PauseSongIcon from '../assets/PlayerPauseIcon.svg?react';
import StartSongIcon from '../assets/PlayerStartIcon.svg?react';
import EndSongIcon from '../assets/PlayerEndIcon.svg?react';
import styles from './Playing.module.css';

function Playing() {
  return (
    <>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube-nocookie.com/embed/${videoID}`}
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
      <h1>Now Playing</h1>
      <img className={styles['player-thumbnail']} src={thumbnail} alt={title} />
      <div className={styles['player-title']}>{title}</div>
      <div className={styles['playlist-author']}>{author}</div>
      <div
        className={styles['progress-bar']}
        onMouseEnter={() => setShowKnob(1)}
        onMouseLeave={() => setShowKnob(0)}
        onMouseDown={handleMouseClick}
        onClick={handleMouseClick}
        ref={progressBarRef}
      >
        <div
          className={styles['progress-bar--filled']}
          style={{ width: `${progress}%` }}
        >
          <div
            className={styles['progress-bar--knob']}
            style={{ transform: `scale(${showKnob})` }}
          ></div>
        </div>
        <span className={styles['current-time']}>{currentTime}</span>
        <span className={styles['end-time']}>{endTime}</span>
      </div>
      <div className={styles.controls}>
        <PrevSongIcon />
        <StartSongIcon />
        {isPlaying ? (
          <PauseSongIcon onClick={() => setIsPlaying(false)} />
        ) : (
          <PlaySongIcon onClick={() => setIsPlaying(true)} />
        )}
        <NextSongIcon />
        <EndSongIcon width="50px" height="50px" onClick={next} />
      </div>
    </>
  );
}

export default Playing;

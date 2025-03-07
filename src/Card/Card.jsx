import React, { useState, useRef } from 'react';
import styles from './Card.module.css';
import Fetching from '../Fetching/Fetching';
import Input from '../Input/Input';
import Player from '../Player/Player';

function Card() {
  const [prevFetchProgress, setPrevFetchProgress] = useState(0);
  const [nowFetchProgress, setNowFetchProgress] = useState(0);
  const [playlistLength, setPlaylistLength] = useState(0);
  const [playIndex, setPlayIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [state, setState] = useState('input'); // input, fetching, playing, error
  const [videoID, setVideoID] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [showKnob, setShowKnob] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressBarRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [endTime, setEndTime] = useState('0:00');

  return (
    <div className={`card ${styles[state]}`}>
      {state == 'input' && (
        <Input useState={setState}/>
      )}

      {state == 'fetching' && (
        <Fetching prevFetchProgress={prevFetchProgress} playlistLength={playlistLength} />
      )}

      {state == 'playing' && (
        <Player />
      )}
    </div>
  );
}

export default Card;

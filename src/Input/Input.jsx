import React, { useState, useRef, useCallback, useEffect } from 'react';
import LoaderIcon from '../assets/Loader.svg?react';
import NextSongIcon from '../assets/PlayerNextIcon.svg?react';
import PrevSongIcon from '../assets/PlayerPreviousIcon.svg?react';
import PlaySongIcon from '../assets/PlayerPlayIcon.svg?react';
import PauseSongIcon from '../assets/PlayerPauseIcon.svg?react';
import StartSongIcon from '../assets/PlayerStartIcon.svg?react';
import EndSongIcon from '../assets/PlayerEndIcon.svg?react';
import styles from './Input.module.css';
import Fetching from '../Fetching/Fetching';

// const extractPlaylistID = (playlistURL) => {
//   const urlPattern =
//     /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)?(\/playlist\?list=)?([\w-]+).*$/;
//   const match = playlistURL.match(urlPattern);
//   return match[5];
// };

// const shuffle = (length) => {
//   let arr = [];
//   for (let i = 0; i < length; i++) {
//     arr.push(i);
//   }
//   for (let i = length - 1; i > 0; i--) {
//     const randomIndex = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
//   }
//   console.log(`Shuffle2: ${arr}`);
//   return arr;
// };

// const convertTime = (duration) => {
//   const min = Math.floor(duration / 60);
//   const sec = duration % 60;
//   if (sec < 10) {
//     return `${min}:0${sec}`;
//   }
//   return `${min}:${sec}`;
// };

function Input() {
  const [playlistURL, setplaylistURL] = useState('');
  const [playlistID, setPlaylistID] = useState('');
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isEmpty, setIsEmpty] = useState(true);
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

  useEffect(() => {
    if (nowFetchProgress == 0) return;
    const timeout = setTimeout(() => {
      if (prevFetchProgress < nowFetchProgress) {
        setPrevFetchProgress((p) => p + 1);
      }
    }, 4);
    return () => clearTimeout(timeout);
  }, [nowFetchProgress, prevFetchProgress]);

  useEffect(() => {
    if (!loadingFetch) return;

    let firstMsg = true;
    let playlistItems = [];
    let eventSource = new EventSource(
      `https://yt-music-player-backend.vercel.app/api/playlists/${playlistID}`
    );

    const handleError = (error) => {
      console.error(`Error occured: ${error}`);
      eventSource.close();
      setIsValid(false);
      setLoadingFetch(false);
    };

    eventSource.onmessage = (e) => {
      setState('fetching');
      try {
        const data = JSON.parse(e.data);
        if (firstMsg) {
          const totalItemsPattern = /(\d+)/g;
          const length = parseInt(data.match(totalItemsPattern).join(''));
          setPlaylistLength(length);
          firstMsg = false;
        } else {
          data.forEach((item) => {
            playlistItems.push(JSON.stringify(item));
          });
          setNowFetchProgress((n) => {
            return n + data.length;
          });
        }
      } catch (error) {
        setState('error');
        console.error('Error parsing data:', error);
      }
    };
    eventSource.addEventListener('playlistFetchFailed', handleError);
    eventSource.onerror = handleError;

    eventSource.addEventListener('complete', () => {
      console.log('End of stream');
      eventSource.close();
      let finalPlaylistLength;
      let playlistLengthDiff;
      setNowFetchProgress((n) => {
        finalPlaylistLength = n;
        return 0;
      });
      setPlaylistLength((p) => {
        playlistLengthDiff = p - finalPlaylistLength;
        console.log(`Difference: ${playlistLengthDiff}`);
        return finalPlaylistLength;
      });
      setPrevFetchProgress((p) => {
        return finalPlaylistLength;
      });

      window.localStorage.setItem(
        'playlistItems',
        JSON.stringify(playlistItems)
      );
      window.localStorage.setItem(
        'playOrder',
        JSON.stringify(
          shuffle(
            JSON.parse(window.localStorage.getItem('playlistItems')).length
          )
        )
      );
      setPlayIndex(-1);
      next();
      // setInterval(() => {
      //   setState('playing');
      //   setPrevFetchProgress(0);
      //   setNowFetchProgress(0);
      // }, 4000);
    });
    return () => {
      eventSource.close();
    };
  }, [loadingFetch, playlistID]);

  useEffect(() => {
    if (playIndex == -1) return;
    // console.log(playIndex);
    window.localStorage.setItem('playIndex', playIndex);
    setVideoID(
      JSON.parse(
        JSON.parse(window.localStorage.getItem('playlistItems'))[
          JSON.parse(window.localStorage.getItem('playOrder'))[playIndex]
        ]
      ).id
    );
    setThumbnail(
      JSON.parse(
        JSON.parse(window.localStorage.getItem('playlistItems'))[
          JSON.parse(window.localStorage.getItem('playOrder'))[playIndex]
        ]
      ).thumbnail.url
    );
    setTitle(
      JSON.parse(
        JSON.parse(window.localStorage.getItem('playlistItems'))[
          JSON.parse(window.localStorage.getItem('playOrder'))[playIndex]
        ]
      ).title
    );
    setAuthor(
      JSON.parse(
        JSON.parse(window.localStorage.getItem('playlistItems'))[
          JSON.parse(window.localStorage.getItem('playOrder'))[playIndex]
        ]
      ).author
    );
    setDuration(
      JSON.parse(
        JSON.parse(window.localStorage.getItem('playlistItems'))[playIndex]
      ).duration
    );
    setProgress(0);
    setCurrentTime(convertTime(0));
    setEndTime(
      convertTime(
        JSON.parse(
          JSON.parse(window.localStorage.getItem('playlistItems'))[playIndex]
        ).duration
      )
    );
  }, [playIndex]);

  useEffect(() => {
    const videoId = 'YOUR_VIDEO_ID'; // Replace with your YouTube video ID
    const audioElement = document.getElementById('youtube-audio');

    fetch(`https://www.youtube.com/get_video_info?video_id=${videoId}`)
      .then((response) => response.text())
      .then((data) => {
        const videoInfo = new URLSearchParams(data);
        const playerResponse = JSON.parse(videoInfo.get('player_response'));
        const audioFormats =
          playerResponse.streamingData.adaptiveFormats.filter((format) =>
            format.mimeType.includes('audio')
          );
        const audioUrl = audioFormats[0].url;
        audioElement.src = audioUrl;
      })
      .catch((error) => console.error('Error fetching video info:', error));
  }, [videoID]);

  const handleChange = (e) => {
    setIsValid(true);
    if (e.target.value != '') {
      setIsEmpty(false);
      setplaylistURL(e.target.value);
      console.log(e.target.value);
    } else {
      setIsEmpty(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsValid(true);
    if (playlistURL) {
      const playlistID = extractPlaylistID(playlistURL);
      setPlaylistID(playlistID);
      setLoadingFetch(true);
      console.log(playlistID);
    } else {
      console.log('Please Enter Playlist URL!');
    }
  };

  const handleMouseClick = useCallback(
    (e) => {
      if (!progressBarRef.current) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const percentage = Math.min(Math.max((x / width) * 100, 0), 100);
      setProgress(percentage);
      console.log(percentage, duration);
      console.log(
        Math.min(Math.floor((duration * percentage) / 100), duration)
      );
      console.log(
        convertTime(
          Math.min(Math.floor((duration * percentage) / 100), duration)
        )
      );
      setCurrentTime(
        convertTime(
          Math.min(Math.floor((duration * percentage) / 100), duration)
        )
      );
    },
    [duration]
  );

  const back = () => {
    setState('input');
  };

  const next = () => {
    setPlayIndex(playIndex + 1);
    console.log(playIndex);
  };

  return (
    <div className={`card ${styles[state]}`}>
      {state == 'input' && (
        <>
          <h1 className={styles.title}>Music Player</h1>
          <form className={styles['form-group']} onSubmit={handleSubmit}>
            <div className={styles['input-group']}>
              <input
                id="url"
                type="text"
                className={`${styles['url-input']} ${
                  !isValid ? styles['error-input'] : ''
                }`}
                placeholder="Enter YouTube Playlist URL or ID"
                onChange={handleChange}
              />
              <button
                disabled={loadingFetch | isEmpty}
                type="submit"
                className={styles['submit-btn']}
              >
                {loadingFetch ? <LoaderIcon /> : 'GO!'}
              </button>
            </div>
            {!isValid && (
              <label htmlFor="url" className={styles.error}>
                Playlist URL or ID is not valid{' '}
              </label>
            )} 
          </form>
        </>
      )}

      {state == 'fetching' && (
        <Fetching prevFetchProgress={prevFetchProgress} playlistLength={playlistLength} />
      )}

      {state == 'playing' && (
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
          <img
            className={styles['player-thumbnail']}
            src={thumbnail}
            alt={title}
          />
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
            <PrevSongIcon width="50px" height="50px" fill="#532e09" />
            <StartSongIcon width="50px" height="50px" fill="#532e09" />
            {isPlaying ? (
              <PauseSongIcon
                width="50px"
                height="50px"
                fill="#532e09"
                onClick={() => setIsPlaying(false)}
              />
            ) : (
              <PlaySongIcon
                width="50px"
                height="50px"
                fill="#532e09"
                onClick={() => setIsPlaying(true)}
              />
            )}
            <NextSongIcon width="50px" height="50px" fill="#532e09" />
            <EndSongIcon
              width="50px"
              height="50px"
              fill="#532e09"
              onClick={next}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Input;

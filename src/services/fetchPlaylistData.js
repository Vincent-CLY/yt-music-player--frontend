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
      setInterval(() => {
        setState('playing');
        setPrevFetchProgress(0);
      }, 4000);
    });
    return () => {
      eventSource.close();
    };
  }, [loadingFetch, playlistID]);
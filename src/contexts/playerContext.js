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
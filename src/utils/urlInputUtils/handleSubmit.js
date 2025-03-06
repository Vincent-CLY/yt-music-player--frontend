export const handleSubmit = async (e) => {
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
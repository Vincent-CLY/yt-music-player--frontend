import { extractPlaylistID } from "./extractPlaylist";

export const handleSubmit = async (e, setIsValid, playlistURL, setPlaylistID, setLoadingFetch) => {
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
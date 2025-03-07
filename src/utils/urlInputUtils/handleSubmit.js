import { extractPlaylistID } from "./extractPlaylist";
import { fetchPlaylistData } from "../../services/fetchPlaylistData"

export const handleSubmit = async (e, setIsValid, playlistURL, isFetching, setIsFetching, setState) => {
    e.preventDefault();
    // setIsValid(true);
    if (playlistURL) {
      const playlistID = extractPlaylistID(playlistURL);
      console.log(playlistID);
      setIsFetching(true)
      fetchPlaylistData(playlistID, setIsValid, etching, setIsFetching, setState);
      console.log(isFetching)
    } else {
      console.log('Please Enter Playlist URL!');
    }
  };
export const extractPlaylistID = (playlistURL) => {
    const urlPattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)?(\/playlist\?list=)?([\w-]+).*$/;
    const match = playlistURL.match(urlPattern);
    return match[5];
};
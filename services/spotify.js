const SpotifyWebApi = require('spotify-web-api-node');
export const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUrl = "http://localhost:3000/";
const clientId = "2b1886d9552e4eb59d3f9f17848a44af";
const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-modify-playback-state",
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
];

export const getTokenForUrl = () => {
  if (typeof window !== "undefined" && window.location.hash !== "") {
        // Client-side-only code
        return window.location.hash
          .substring(1)
          .split("&")
          .reduce((initial, item) => {
            let parts = item.split("=");
            initial[parts[0]] = parts;
            return initial;
          }, {}).access_token[1];
      }
  };

  const token = getTokenForUrl();

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

export const shuffle =async (playlistId, playlistLength,playlistName)=>{
    let tracks =await getPlaylistTracks(playlistId,playlistLength);
    tracks.sort(() => Math.random() - 0.5);
    let playlist = await spotifyApi.createPlaylist(`${playlistName}(shuffled)`,{ 'description': 'My description', 'public': false })
    for(let i =0; i< playlistLength; i+=100){
      let songs = tracks.splice(0,100);
        await spotifyApi.addTracksToPlaylist(playlist.body.id, songs);
    }
    window.location.replace(playlist.body.external_urls.spotify);
}

 export async function getUserPlaylists() {
  const me = await spotifyApi.getMe();
  const data = await spotifyApi.getUserPlaylists(me.body.id)
  let playlists = []

  for (let playlist of data.body.items) {
    playlists.push({name:playlist.name, id:playlist.id,length:playlist.tracks.total})
  }
  return playlists
}

async function getPlaylistTracks(playlistId, playlistLength) {
  let tracks = [];
  for(let i =0; i< playlistLength; i+=100){
    const data = await spotifyApi.getPlaylistTracks(playlistId, {
      offset: i,
      limit: 100,
      fields: 'items'
    })
    
    for (let track_obj of data.body.items) {
      const track = track_obj.track;
      tracks.push(`spotify:track:${track.id}`);
    }
  }
    return tracks;
  }

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;

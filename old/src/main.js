import Cookies from 'js-cookie';
let tracks = [];
let features = [];

document.getElementById('login-status').innerHTML = Cookies.get('access_token') ? 'Logged in' : 'Not logged in';




async function loadTracks() {
    document.getElementById('status').innerHTML = 'Loading...';
    document.getElementById('get').disabled = true;
    let tracks_generator = select_playlist.value === 'saved' ? getSavedTracks() : getPlayListTracks(select_playlist.value);
    for await (let { items, total } of tracks_generator) {
        // console.log(items)
        addTracks(items, tracks.length);
        tracks = tracks.concat(items);
        let percentage = Math.round(tracks.length / total * 100);
        document.getElementById('status').innerHTML = `Loaded ${tracks.length} of ${total} tracks (${percentage}%)`;
        document.getElementById('progress').value = percentage;
    }
    document.getElementById('get2').disabled = false;
}

function addTracks(items, counter) {
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let item_number = counter + i + 1;
        // display tracks image and label, keep the image small
        let trackLabel = document.createElement('p');
        trackLabel.textContent = `${item_number}. ${item.track.name}`
        document.body.appendChild(trackLabel);

        let trackImage = document.createElement('img');
        trackImage.src = item.track.album.images[0].url;
        trackImage.style.width = '80px';
        document.body.appendChild(trackImage);
    }
}



async function loadAudioFeatures() {
    document.getElementById('status2').innerHTML = 'Loading...';
    document.getElementById('get2').disabled = true;
    for await (let { audio_features, total} of getTracksAudioFeatures(tracks)) {
        features = features.concat(audio_features);
        let percentage = Math.round(features.length / total * 100);
        document.getElementById('status2').innerHTML = `Loaded ${features.length} of ${total} audio features (${percentage}%)`;
        document.getElementById('progress2').value = percentage;
    }
    console.log(features);
}


let select_playlist = document.getElementById('select-playlist');
let playlist_generator = getPlaylists();
async function loadSomePlaylists() {
    let playlists = (await playlist_generator.next()).value.items;
    for (let playlist of playlists) {
        let option = document.createElement('option');
        option.value = playlist.id;
        option.textContent = playlist.name;
        select_playlist.appendChild(option);
    }
}   
await loadSomePlaylists();
document.getElementById('get').addEventListener('click', loadTracks);
document.getElementById('get2').addEventListener('click', loadAudioFeatures);

// const script = document.createElement("script");
// script.src = "https://sdk.scdn.co/spotify-player.js";
// script.async = true;

// document.body.appendChild(script);

// window.onSpotifyWebPlaybackSDKReady = () => {

//     const player = new window.Spotify.Player({
//         name: 'BPM BEAST',
//         getOAuthToken: cb => { cb(Cookies.get('access_token')); },
//         volume: 1
//     });

//     // setPlayer(player);

//     player.addListener('ready', ({ device_id }) => {
//         console.log('Ready with Device ID', device_id);
//         // setTimeout(() => {
//         //     spot('https://api.spotify.com/v1/me/player/play', {
//         //         device_id: device_id,
//         //         uris: ['spotify:track:7xGfFoTpQ2E7fRF5lN10tr']
//         //     }, 'PUT');
//         // }, 5000);
//     });

//     player.addListener('not_ready', ({ device_id }) => {
//         console.log('Device ID has gone offline', device_id);
//     });


//     player.connect();

//     window.player = player;

// };



window.getTracksByBPM = getTracksByBPM;
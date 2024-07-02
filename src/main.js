import Cookies from 'js-cookie'
// window.Cookies = Cookies
if (Cookies.get('access_token')) {
    // document.write('logged in')
}

async function spot(endpoint, options, method = 'GET') {
    if (Cookies.get('access_token') === undefined) {
        throw new Error('Not logged in')
    }

    let url = endpoint;
    if (options) {
        url += '?' + new URLSearchParams(options).toString();
    }

    let response = await fetch(url, {
        method: method,
        headers: {
            'Authorization': 'Bearer ' + Cookies.get('access_token')
        }
    })
    
    if (method === 'GET') {
        return await response.json()
    } else {
        return response
    }
}

async function* getSavedTracks(offset = 0) {
    let MAX_SPOTIFY_LIMIT = 50;
    let response = await spot('https://api.spotify.com/v1/me/tracks', {
        limit: MAX_SPOTIFY_LIMIT,
        offset: offset
    });
    yield response;
    while (response.next) {
        response = await spot(response.next);
        yield response;
    }
}

window.spot = spot;
window.getSavedTracks = getSavedTracks;

let tracks = [];

for await (let { items, total } of getSavedTracks()) {
    console.log(items)
    addTracks(items, tracks.length);
    tracks = tracks.concat(items);
    document.getElementById('status').innerHTML = `Loaded ${tracks.length} of ${total} tracks (${Math.round(tracks.length / total * 100)}%)`;
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
import Cookies from 'js-cookie'
let tracks = [];
let features = [];

document.getElementById('login-status').innerHTML = Cookies.get('access_token') ? 'Logged in' : 'Not logged in';

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
    });
    
    if (response.status === 401) {
        console.log('Refreshing token');
        await fetch('/api/refresh').then(res => res.json()).then(data => data.access_token);
        return await spot(endpoint, options, method);
    }

    if (response.status === 429) {
        let retryAfter = response.headers.get('Retry-After');
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return await spot(endpoint, options, method);
    }

    if  (!response.ok) {
        console.log(response);
        throw new Error(response.statusText);
    }

    if (method === 'GET') {
        return await response.json()
    } else {
        return response
    }
}

function getAllPlayListTracks(playlist_id) {
    return getTracks(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`);
}

function getAllSavedTracks() {
    return getTracks('https://api.spotify.com/v1/me/tracks');
}

async function* getTracks(endpoint) {
    let MAX_SPOTIFY_LIMIT = 50;
    let response = await spot(endpoint, {
        limit: MAX_SPOTIFY_LIMIT,
    });
    yield response;
    while (response.next) {
        response = await spot(response.next);
        yield response;
    }
}

async function loadTracks() {
    document.getElementById('status').innerHTML = 'Loading...';
    document.getElementById('get').disabled = true;
    for await (let { items, total } of getAllPlayListTracks('4z8jDyYBtoC21zRoJfSLqL')) {
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

async function* getTracksAudioFeatures(tracks) {
    let MAX_SPOTIFY_LIMIT = 100;
    let ids = tracks.map(track => track.track.id);
    for (let i = 0; i < ids.length; i += MAX_SPOTIFY_LIMIT) {
        let response = await spot('https://api.spotify.com/v1/audio-features', {
            ids: ids.slice(i, i + MAX_SPOTIFY_LIMIT).join(',')
        });
        yield { audio_features: response.audio_features, total: ids.length};
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

function getTracksByBPM(bpm, tolerance = 5, sorting_method = 'closest') {
    let tracks = features.filter(feature => Math.abs(feature.tempo - bpm) <= tolerance);
    const sorting_methods = {
        closest: (a, b) => Math.abs(a.tempo - bpm) - Math.abs(b.tempo - bpm),
        fastest: (a, b) => a.tempo - b.tempo,
        slowest: (a, b) => b.tempo - a.tempo
    };
    return tracks.sort(sorting_methods[sorting_method]);
}

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



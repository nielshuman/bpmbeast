import Cookies from 'js-cookie'
// window.Cookies = Cookies
if (Cookies.get('access_token')) {
    // document.write('logged in')
}

async function spot(endpoint, options) {
    if (Cookies.get('access_token') === undefined) {
        throw new Error('Not logged in')
    }
    let url = endpoint + '?' + new URLSearchParams(options).toString()
    return await fetch(url, {
        headers: {
            'Authorization': 'Bearer ' + Cookies.get('access_token')
        }
    }).then(res => res.json())
}

window.spot = spot
let first25 = await spot('https://api.spotify.com/v1/me/tracks', {offset: 0, limit: 50})
let next25 = await spot(first25.next)


let tracks = first25.items.concat(next25.items);

for (let i = 0; i < tracks.length; i++) {
    let item = tracks[i];
    // display tracks image and label, keep the image small
    let trackLabel = document.createElement('p');
    trackLabel.textContent = (i + 1) + '. ' + item.track.name;
    document.body.appendChild(trackLabel);

    let trackImage = document.createElement('img');
    trackImage.src = item.track.album.images[0].url;
    trackImage.style.width = '80px';
    document.body.appendChild(trackImage);
}

const script = document.createElement("script");
script.src = "https://sdk.scdn.co/spotify-player.js";
script.async = true;

document.body.appendChild(script);

window.onSpotifyWebPlaybackSDKReady = () => {

    const player = new window.Spotify.Player({
        name: 'BPM BEAST',
        getOAuthToken: cb => { cb(Cookies.get('access_token')); },
        volume: 1
    });

    // setPlayer(player);

    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });

    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });


    player.connect();

    window.player = player;

};
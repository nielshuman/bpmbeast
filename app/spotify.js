'use client';
import Cookies from 'js-cookie';

export async function spot(endpoint, options, method = 'GET', body = null) {
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
        },
        body: body? JSON.stringify(body) : null 
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

/**
 * Retrieves all items from the specified endpoint in batches.
 * Returns a generator that yields each batch.
*/

async function* getAll(endpoint, step=50) {
    let response = await spot(endpoint, {
        limit: step,
    });
    yield response;
    while (response.next) {
        response = await spot(response.next);
        yield response;
    }
}

export const getSavedTracks = () => getAll('https://api.spotify.com/v1/me/tracks');
export const getPlaylists = () => getAll('https://api.spotify.com/v1/me/playlists');
export const getPlayListTracks = playlist_id => getAll(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`);

export async function* getTracksAudioFeatures(tracks) {
    let MAX_SPOTIFY_LIMIT = 100;
    let ids = tracks.map(track => track.id);
    for (let i = 0; i < ids.length; i += MAX_SPOTIFY_LIMIT) {
        let response = await spot('https://api.spotify.com/v1/audio-features', {
            ids: ids.slice(i, i + MAX_SPOTIFY_LIMIT).join(',')
        });
        yield { items: response.audio_features, total: ids.length};
    }
}

export function getTracksByTempo(tracks, {tolerance, enableTime, sort, targetTempo}) {
    // console.log(tracks, targetTempo, tolerance, sorting_method, enableTime);
    let foundTracks = tracks.filter(track => {
        let tempo = track.features.tempo;   
        let full_time_matches = (Math.abs(tempo - targetTempo) <= tolerance);
        let half_time_matches = (Math.abs(tempo / 2 - targetTempo) <= tolerance);
        let double_time_matches = (Math.abs(tempo * 2 - targetTempo) <= tolerance);
        return full_time_matches || (enableTime && (half_time_matches || double_time_matches));
    });
    const sorting_methods = {
        closest: (a, b) => Math.abs(a.features.tempo - targetTempo) - Math.abs(b.features.tempo - targetTempo),
        slowest: (a, b) => a.features.tempo - b.features.tempo,
        fastest: (a, b) => b.features.tempo - a.features.tempo
    };
    return foundTracks.sort(sorting_methods[sort]);
}


export function webPlaybackSDK() {
    return new Promise(resolve => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);    

        window.onSpotifyWebPlaybackSDKReady = () => {
            resolve(window.Spotify)
        }
    })
}

export async function startPlayback(device_id, body) {
    return await spot('https://api.spotify.com/v1/me/player/play', { device_id }, 'PUT', body);
}
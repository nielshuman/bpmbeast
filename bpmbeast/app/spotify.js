'use client';
import Cookies from 'js-cookie';

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
    let ids = tracks.map(track => track.track.id);
    for (let i = 0; i < ids.length; i += MAX_SPOTIFY_LIMIT) {
        let response = await spot('https://api.spotify.com/v1/audio-features', {
            ids: ids.slice(i, i + MAX_SPOTIFY_LIMIT).join(',')
        });
        yield { items: response.audio_features, total: ids.length};
    }
}
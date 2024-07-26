'use client';
import { useState, useEffect } from 'react';
import useAsyncEffect from 'use-async-effect';
import { getPlayListTracks, getPlaylists, getSavedTracks, getTracksAudioFeatures } from './spotify';

export default function PlaylistLoader() {
  // const [statusText, setStatusText] = useState('Ready');
  // let statusText;
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Ready')
  // const [tracks, setTracks] = useState([])
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(false)
  const [playlistId, setPlaylistId] = useState('saved')

  async function loadTracksAndFeatures() {
    setLoading(true);
    setStatus('Loading songs...')
    let tracks = await loadTracks();
    setStatus('Loading features...')
    setFeatures(await loadFeatures(tracks));
    setLoading(false);
  }

  async function loadTracks() {
    let tracks_generator = playlistId === 'saved' ? getSavedTracks() : getPlayListTracks(playlistId)
    let tracks = []
    for await (const { items, total } of tracks_generator) {
      // setTracks(prev => [...prev, ...items])
      tracks.push(...items);
      setProgress(tracks.length / total)
    }
    return tracks;
  }

  async function loadFeatures(tracks) {
    let features_generator = getTracksAudioFeatures(tracks)
    let features = [];
    for await (const { items, total } of features_generator) {
      // setFeatures(prev => [...prev, ...items])
      features.push(...items);
      setProgress(features.length / total)
    }
  }

  return (<>
    <PlaylistSelector onChange={e => setPlaylistId(e.target.value)}/>
    <button disabled={loading} onClick={loadTracksAndFeatures}> Tarp! </button>
    <p>{loading ? `${status} (${Math.floor(progress * 100)}%)` : 'Ready'}</p>
    <progress value={progress} max={1}></progress>
    <p>selected playlist: {playlistId}</p>
  </>)
}

export function PlaylistSelector({ onChange }) {
  let [playlists, setPlaylists] = useState([{ name: '❤️ Liked Songs', id: 'saved' }])
  useAsyncEffect(async () => {
    for await (const { items } of getPlaylists()) {
      setPlaylists(prev => { return [...prev, ...items]; })
    }
  }, [])
  // useEffect(() => {(async ()=> {
  //   // window.getPlaylists = getPlaylists  
  //   for await (const {items} of getPlaylists()) {
  //     // setPlaylists(prev => {return [...prev, ...items];})
  //     console.log(items)
  //   }
  // })()}, [])

  return <select onChange={onChange}>
    {playlists.map(playlist =>
      <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
    )}
  </select>
}
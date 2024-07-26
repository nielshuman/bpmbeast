'use client';
import { useState, useEffect } from 'react';
import useAsyncEffect from 'use-async-effect';
import { getPlaylists, getSavedTracks, getTracksAudioFeatures } from './spotify';

export function PlaylistSelector() {
    let [playlists, setPlaylists] = useState([{ name: '❤️ Liked Songs', id: 'saved' }])
    useAsyncEffect(async ()=> {
      for await (const {items} of getPlaylists()) {
        setPlaylists(prev => {return [...prev, ...items];})
      }
    }, [])
    // useEffect(() => {(async ()=> {
    //   // window.getPlaylists = getPlaylists  
    //   for await (const {items} of getPlaylists()) {
    //     // setPlaylists(prev => {return [...prev, ...items];})
    //     console.log(items)
    //   }
    // })()}, [])

    return <select>
      {playlists.map(playlist =>
        <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
      )}
    </select>
  }

  export default function PlaylistLoader() {
    // const [statusText, setStatusText] = useState('Ready');
    let statusText;
    const [progress, setProgress] = useState(0)
    const [tracks, setTracks] = useState([])
    const [features, setFeatures] = useState([])
    const [loading, setLoading] = useState(false)
    
    async function loadTracksAndFeatures() {
      setLoading(true);
      await loadTracks();
    }

    async function loadTracks() {
      let tracks_generator = getSavedTracks()
      for await (const { items, total } of tracks_generator) {
        setTracks(prev => [...prev, ...items])
        setProgress(prev => prev + (items.length/total))
      }
    }

    async function loadFeatures() {
      let features_generator = getTracksAudioFeatures(tracks)
      console.log(tracks)
    }


    if(loading) {
      statusText = `Loading songs... ${Math.floor(progress*100)}%`;
    } else {
      statusText = `Ready`
    }
  
    return (<>
      <PlaylistSelector />
      <button disabled={loading} onClick={loadTracksAndFeatures}> Tarp! </button>
      <p>{statusText}</p>
    </>)
  }
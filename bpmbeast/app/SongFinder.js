'use client';
import { useState, useEffect } from 'react';
import useAsyncEffect from 'use-async-effect';
import { getPlayListTracks, getPlaylists, getSavedTracks, getTracksAudioFeatures, getTracksByTempo } from './spotify';

export default function SongFinder() {
  const [options, setOptions] = useState({
    tolerance: 5,
    enable_half_and_double_time: true,
    sorting_method: 'slowest'
  })
  const [tracks, setTracks] = useState([])
  const [targetTempo, setTargetTempo] = useState(100)
  let foundTracks = getTracksByTempo(tracks, targetTempo, options)
  return (<>
    <PlaylistLoader setTracks={setTracks}/>
    <hr></hr>
    <TempoSelector value={targetTempo} setValue={setTargetTempo} />
    <SearchOptions options={options} setOptions={setOptions}/>
    <div>
      {foundTracks.map(track => <>
        <Track key={track.id} track={track}></Track>
      </>)}
    </div>
  </>)
}

function SearchOptions({options, setOptions}) {
  return <div>
    <select value={options.sorting_method} onChange={e => setOptions(options => (
      {...options, sorting_method: e.target.value}))}>
      <option value="slowest">Slowest</option>
      <option value="fastest">Fastest</option>
      <option value="closest">Closest</option>
    </select>
    <input type='number' value={options.tolerance} onChange={e => setOptions(options => (
      {...options, tolerance: Number(e.target.value)}))} />
    <input type='checkbox' checked={options.enable_half_and_double_time} onChange={e => setOptions(options => (
      {...options, enable_half_and_double_time: !options.enable_half_and_double_time}))} />
  </div>
}

function PlaylistLoader({setTracks}) {
  const [playlistId, setPlaylistId] = useState('saved');
  const [status, setStatus] = useState({
    loading: false,
    text: 'Ready',
    progress: 0
  })

  async function loadTracksWithFeatures() {
    setStatus({loading: true, text: 'Loading tracks...', progress: 0})
    let tracks = await loadTracks();
    setStatus({loading: true, text: 'Loading features...', progress: 0})
    let features = await loadFeatures(tracks);
    console.log(tracks, features)
    for (let track of tracks) {
      track.features = features.find(f => f.id === track.id);
    }
    setTracks(tracks);
    setStatus({loading: false,text: 'Done',progress: 0})
  }

  async function loadTracks() {
    let tracks_generator = playlistId === 'saved' ? getSavedTracks() : getPlayListTracks(playlistId)
    let tracks = []
    for await (const { items, total } of tracks_generator) {
      // setTracks(prev => [...prev, ...items])
      for (let item of items) {
        tracks.push(item.track)
      }
      // setProgress(tracks.length / total)
      setStatus(prev => ({...prev, progress: tracks.length / total}))
    }
    return tracks;
  }

  async function loadFeatures(tracks) {
    let features_generator = getTracksAudioFeatures(tracks)
    let features = [];
    for await (const { items, total } of features_generator) {
      // setFeatures(prev => [...prev, ...items])
      features.push(...items);
      // setProgress(features.length / total)
      setStatus(prev => ({...prev, progress: features.length / total}))
    }
    return features;
  }


  return <>
    <PlaylistSelector onChange={e => setPlaylistId(e.target.value)}></PlaylistSelector>
    <button disabled={status.loading} onClick={loadTracksWithFeatures}> Tarp! </button>
    <p>{status.text} {status.loading? `(${Math.floor(status.progress*100)}%)` : ''}</p>
    <progress value={status.progress} max={1}></progress>
  </>
}

function PlaylistSelector({ onChange }) {
  let [playlists, setPlaylists] = useState([{ name: '❤️ Liked Songs', id: 'saved' }])
  
  useAsyncEffect(async () => {
    for await (const { items } of getPlaylists()) {
      setPlaylists(prev => { return [...prev, ...items]; })
    }
  }, [])

  return <select onChange={onChange}>
    {playlists.map(playlist =>
      <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
    )}
  </select>

}

function TempoSelector({value, setValue}) {
  // const [value, setValue] = useState(100);
  return <>
    <input type="number" value={value} onChange={e=>setValue(Number(e.target.value))}></input>
    <button onClick={() => setValue(prev => prev-1)}>-</button>
    <button onClick={() => setValue(prev => prev+1)}>+</button>
    <h3>{value} BPM</h3>
  </>
}

function Track({track}) {
  return <div style={{display: 'flex'}}>
    <img height="50px" src={track.album.images[0].url} alt={track.name} />
    <h3>{track.name} - {track.features.tempo} BPM</h3>
  </div>
}
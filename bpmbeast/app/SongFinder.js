'use client';
import { useState, useEffect } from 'react';
import useAsyncEffect from 'use-async-effect';
import { getPlayListTracks, getPlaylists, getSavedTracks, getTracksAudioFeatures, getTracksByBPM } from './spotify';

export default function SongFinder() {
  // const [statusText, setStatusText] = useState('Ready');
  // let statusText;
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Ready')
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(false)
  const [playlistId, setPlaylistId] = useState('saved')
  const [tempo, setTempo] = useState(100)
  const [foundFeatures, setFoundFeatures] = useState([])
  const [options, setOptions] = useState({
    tolerance: 5,
    enable_half_and_double_time: true,
    sorting_method: 'slowest'
  })
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
    return features;
  }
  
  const statusText = loading ? `${status} (${Math.floor(progress * 100)}%)` : `Ready (${features.length} tracks loaded)`
  return (<>
    <PlaylistSelector onChange={e => setPlaylistId(e.target.value)}/>
    {/* <p>selected playlist: {playlistId}</p> */}
    <PlaylistLoader onClick={loadTracksAndFeatures} loading={loading} statusText={statusText} progress={progress}/>
    <hr></hr>
    <TempoSelector value={tempo} setValue={setTempo} />
    <hr></hr>
    <SearchOptions options={options} setOptions={setOptions}/>
    <button onClick={()=>setFoundFeatures(getTracksByBPM(features, tempo, options))}>Search song!</button>
    <hr></hr>
    <div>
      {foundFeatures.map(feature => <a key={feature.id} href={feature.track_href}> {feature.tempo} </a>)}
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
    <p>{JSON.stringify(options)}</p>
  </div>
}

function PlaylistLoader({loading, statusText, onClick, progress}) {
  return <>
    <button disabled={loading} onClick={onClick}> Tarp! </button>
    <p>{statusText}</p>
    <progress value={progress} max={1}></progress>
  </>
}

function PlaylistSelector({ onChange }) {
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

function TempoSelector({value, setValue}) {
  // const [value, setValue] = useState(100);
  return <>
    <input type="number" value={value} onChange={e=>setValue(Number(e.target.value))}></input>
    <button onClick={() => setValue(prev => prev-1)}>-</button>
    <button onClick={() => setValue(prev => prev+1)}>+</button>
    <h3>{value} BPM</h3>
  </>
}
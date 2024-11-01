'use client';
import { useState, useEffect } from 'react';
import useAsyncEffect from 'use-async-effect';
import { getPlayListTracks, getPlaylists, getSavedTracks, getTracksAudioFeatures, getTracksByTempo } from '../app/spotify';
import { Button, ButtonGroup, Card, CardBody, CardHeader, Chip, Input, Progress, Select, SelectItem, Switch } from '@nextui-org/react';
import Image from 'next/image';
import { IoIosCheckmark, IoIosCheckmarkCircle } from "react-icons/io";
import { color } from 'framer-motion';

const READY = 0;
const LOADING_TRACKS = 1;
const LOADING_FEATURES = 2;
const DONE = 3;

export function SearchOptions({options, setOptions}) {
  return <div className='w-full flex gap-4 flex-wrap'>  
    <Select className='w-1/4 min-w-48' label='Sorting method' selectedKeys={[options.sorting_method]} onSelectionChange={sorting_method => setOptions(options => ( {...options, sorting_method}))}>
      <SelectItem key="slowest">Slowest</SelectItem>
      <SelectItem key="fastest">Fastest</SelectItem>
      <SelectItem key="closest">Closest</SelectItem>
    </Select>
    <Input className={'w-1/4 min-w-16'} label='Tolerance' type='number' value={options.tolerance} onValueChange={tolerance => setOptions(options => ({...options, tolerance}))} />
    <Switch defaultChecked={options.enable_half_and_double_time} onChange={e => setOptions(options => (
      {...options, enable_half_and_double_time: !options.enable_half_and_double_time}))}>
        halftime/doubletime
    </Switch>
  </div>
}

export function PlaylistLoader({setTracks}) {
  const [playlistId, setPlaylistId] = useState('saved');
  const [status, setStatus] = useState({
    loading: false,
    stage: READY,
    progress: 0
  })

  async function loadTracksWithFeatures() {
    setStatus({loading: true, stage: LOADING_TRACKS, progress: 0})
    let tracks = await loadTracks();
    setStatus({loading: true, stage: LOADING_FEATURES, progress: 0})
    let features = await loadFeatures(tracks);

    for (let track of tracks) {
      track.features = features.find(f => f.id === track.id);
    }
    tracks = tracks.filter(t => t.features !== undefined)    
    setTracks(tracks);
    setStatus({loading: false, stage: DONE, progress: 1})
  }

  async function loadTracks() {
    let tracks_generator = playlistId === 'saved' ? getSavedTracks() : getPlayListTracks(playlistId)
    let tracks = []
    for await (const { items, total } of tracks_generator) {
      for (let item of items) {
        tracks.push(item.track)
      }
      setStatus(prev => ({...prev, progress: tracks.length / total}))
    }
    let length = tracks.length;
    tracks = tracks.filter(t => t !== null);
    console.log(`${length - tracks.length} null-tracks removed`)
    length = tracks.length;
    tracks = tracks.filter((track, index, self) => self.findIndex(t => t.id === track.id) === index)
    console.log(`${length - tracks.length} duplicate tracks removed`)
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

    const filtered_features = features.filter(f => f !== null);
    console.log(`${features.length - filtered_features.length} null-features removed`)
    return filtered_features;
  }

  const pending = {isDisabled: true}
  const current = {color: 'primary'}
  const done = {color: 'success', variant: 'faded', startContent: <IoIosCheckmarkCircle />}

  return <>
    <PlaylistSelector onChange={e => setPlaylistId(e.target.value)}></PlaylistSelector>
    <Button disabled={status.loading} onClick={loadTracksWithFeatures}>Load</Button>
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Chip {...(status.stage < LOADING_TRACKS ? pending : status.stage == LOADING_TRACKS ? current : done)}> 
            1. Getting your tracks
          </Chip>
          <Chip {...(status.stage < LOADING_FEATURES ? pending : status.stage == LOADING_FEATURES ? current : done)}>
            2. Getting their BPM info
          </Chip>
        </div>
      </CardHeader>
      <CardBody>
        <Progress aria-label={'Progress'} value={status.progress} minValue={0} maxValue={1} showValueLabel={true}></Progress>
      </CardBody>
    </Card>
  </>
}

export function PlaylistSelector({ onChange }) {
  let [playlists, setPlaylists] = useState([{ name: '❤️ Liked Songs', id: 'saved' }])
  
  useAsyncEffect(async () => {
    for await (const { items } of getPlaylists()) {
      setPlaylists(prev => { return [...prev, ...items]; })
    }
  }, [])

  return <Select aria-label="Select a playlist" onChange={onChange}>
    {playlists.map(playlist =>
      <SelectItem key={playlist.id} value={playlist.id}>{playlist.name}</SelectItem>
    )}
  </Select>

}

export function TempoSelector({value, setValue}) {
  // const [value, setValue] = useState(100);
  return <div className="flex flex-col">
    {/* <Input type="number" value={value} onChange={e=>setValue(Number(e.target.value))}></Input> */}
    <h2 className="text-2xl font-bold text-center">{value} BPM</h2>
    <h3 className="text text-center pb-3">Target tempo</h3>
    <ButtonGroup>
      <Button onClick={() => setValue(prev => prev-1)}>-</Button>
      <Button onClick={() => setValue(prev => prev+1)}>+</Button>
    </ButtonGroup>
  </div>
}
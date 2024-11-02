const READY = 0;
const LOADING_TRACKS = 1;
const LOADING_FEATURES = 2;
const DONE = 3;

import { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { getPlayListTracks, getPlaylists, getSavedTracks, getTracksAudioFeatures, getTracksByTempo } from '../app/spotify';
import { IoIosCheckmark, IoIosCheckmarkCircle } from "react-icons/io";
import { Button, Card, CardBody, CardHeader, Chip, Progress, Select, SelectItem } from '@nextui-org/react';


export default function PlaylistLoader({setTracks}) {
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
    
    const chip1 = status.stage < LOADING_TRACKS ? pending : status.stage == LOADING_TRACKS ? current : done
    const chip2 = status.stage < LOADING_FEATURES ? pending : status.stage == LOADING_FEATURES ? current : done
    return <>
      <PlaylistSelector onChange={e => setPlaylistId(e.target.value)}></PlaylistSelector>
      <Button disabled={status.loading} onClick={loadTracksWithFeatures}>Load</Button>
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Chip {...chip1} > 1. Getting your tracks </Chip>
            <Chip {...chip2} > 2. Getting their BPM info </Chip>
          </div>
        </CardHeader>
        <CardBody>
          <Progress aria-label={'Progress'} value={status.progress} minValue={0} maxValue={1} showValueLabel={true}></Progress>
        </CardBody>
      </Card>
    </>
}

function PlaylistSelector({ onChange }) {
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
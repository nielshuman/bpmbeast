'use client';

import { useEffect, useState } from "react";
import SongFinder, { SearchOptions, TempoSelector, Track } from "./SongFinder";
import { PlaylistLoader } from "./SongFinder";
import SongPlayer from "./SongPlayer";
import { getTracksByTempo } from "../app/spotify";

export default function Beast () {
    const [tracks, setTracks] = useState([])
    useEffect(() => setTracks(JSON.parse(localStorage.getItem('tracks') || '[]')), [])
    const [searchOptions, setSearchOptions] = useState({
        tolerance: 2,
        enable_half_and_double_time: false,
        sorting_method: 'slowest'
      })
    const [targetTempo, setTargetTempo] = useState(100)

    const tracks_loaded = Boolean(tracks.length)
    const results = getTracksByTempo(tracks, targetTempo, searchOptions)

    
    return <> 
    { tracks_loaded? 
        <>
            <TempoSelector value={targetTempo} setValue={setTargetTempo} />
            <SearchOptions options={searchOptions} setOptions={setSearchOptions}/>
            <SongPlayer tracks={results}/> 
            <div>
            {results.map(track => <>
                <Track key={track.id} track={track}></Track>
            </>)}
            </div>
        </>
        : <PlaylistLoader setTracks={tracks => {
            setTracks(tracks);
            localStorage.setItem('tracks', JSON.stringify(tracks));
        }}/> 
        }
    </> 
}
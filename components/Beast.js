'use client';

import { useEffect, useState } from "react";
import { SearchOptions, TempoSelector } from "./SongFinder";
import { PlaylistLoader } from "./SongFinder";
import SongPlayer from "./SongPlayer";
import { getTracksByTempo } from "../app/spotify";
import Queue from "./Queue";
import s from './Beast.module.css'

export default function Beast () {
    const [tracks, setTracks] = useState([])
    useEffect(() => setTracks(JSON.parse(localStorage.getItem('tracks') || '[]')), [])
    const [searchOptions, setSearchOptions] = useState({
        tolerance: 0.5,
        enable_half_and_double_time: false,
        sorting_method: 'slowest'
      })
    const [targetTempo, setTargetTempo] = useState(100)

    const tracks_loaded = Boolean(tracks.length)
    const results = getTracksByTempo(tracks, targetTempo, searchOptions)

    
    return <div className={s.container + ' flex-1'}> 
    { tracks_loaded? 
        <>
            <SongPlayer tracks={results}/>
            <TempoSelector value={targetTempo} setValue={setTargetTempo} />
            <SearchOptions options={searchOptions} setOptions={setSearchOptions}/>
            <Queue results={results}/>
        </>
        : <PlaylistLoader setTracks={tracks => {
            setTracks(tracks);
            localStorage.setItem('tracks', JSON.stringify(tracks));
        }}/> 
        }
    </div> 
}
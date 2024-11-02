'use client';

import { useEffect, useState } from "react";
import { SearchOptions, TempoSelector } from "./SearchOptions";
import PlaylistLoader from "./PlaylistLoader";
import SongPlayer from "./SongPlayer";
import { getTracksByTempo } from "../app/spotify";
import Queue from "./Queue";
import s from './Beast.module.css'
import Cookies from "js-cookie";

export default function Beast () {
    const [tracks, setTracks] = useState([])
    useEffect(() => setTracks(JSON.parse(localStorage.getItem('tracks') || '[]')), [])
    useEffect(() => {
        if (tracks.length) {
            Cookies.set('tracks_loaded', 'true')
            // console.warn('setting localstorage')
            localStorage.setItem('tracks', JSON.stringify(tracks));
        } else {
            Cookies.set('tracks_loaded', 'false')
        }
    }, [tracks])
    // search options
    const [tolerance, setTolerance] = useState(0.5)
    const [enableTime, setEnableTime] = useState(false)
    const [sort, setSort] = useState('slowest')
    const [targetTempo, setTargetTempo] = useState(100)
    const searchOptions = {tolerance, enableTime, sort, targetTempo}
    const setSearchOptions = {setTolerance, setEnableTime, setSort, setTargetTempo}
    const tracks_loaded = Boolean(tracks.length)
    const results = getTracksByTempo(tracks, targetTempo, searchOptions)

    const main = <>
        <SongPlayer tracks={results}/>
        <TempoSelector value={targetTempo} setValue={setTargetTempo} />
        <SearchOptions options={searchOptions} setOptions={setSearchOptions}/>
        <Queue results={results}/>
    </>
    
    const loader = <PlaylistLoader setTracks={tracks => {
        setTracks(tracks);
    }}/>

    return <div className={s.container + ' flex-1'}> 
        { tracks_loaded? main : loader}
    </div> 
}
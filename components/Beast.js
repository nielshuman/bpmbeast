'use client';

import { useEffect, useRef, useState } from "react";
import { SearchOptions, TempoSelector } from "./SearchOptions";
import PlaylistLoader from "./PlaylistLoader";
import SongPlayer from "./SongPlayer";
import { getTracksByTempo } from "../app/spotify";
import Queue from "./Queue";
import s from './Beast.module.css'
import Cookies from "js-cookie";
import useEvent from "react-use-event";

export default function Beast ({loaded_cookie}) {
    const [tracks, setTracks] = useState([])
    const [tolerance, setTolerance] = useState(0.5)
    const [enableTime, setEnableTime] = useState(false)
    const [sort, setSort] = useState('slowest')
    const [targetTempo, setTargetTempo] = useState(100)
    const searchOptions = {tolerance, enableTime, sort, targetTempo}
    const setSearchOptions = {setTolerance, setEnableTime, setSort, setTargetTempo}
    const [skipCheck, setSkipCheck] = useState(loaded_cookie.value === 'true')
    
    useEffect(() => {
        setSkipCheck(false);
        setTracks(JSON.parse(localStorage.getItem('tracks') || '[]'))
    }, []);
    
    useEvent('delete_tracks', () => {
        localStorage.removeItem('tracks');
        Cookies.set('tracks_loaded', 'false');
        setTracks([]);
    });
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
    
    // console.log(loaded_cookie)
    const tracks_loaded = skipCheck || tracks.length > 0
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
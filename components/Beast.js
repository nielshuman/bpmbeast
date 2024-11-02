'use client';

import { useEffect, useRef, useState } from "react";
import { SearchOptions, TempoSelector } from "./SearchOptions";
import PlaylistLoader from "./PlaylistLoader";
import SongPlayer, { dummyTrack } from "./SongPlayer";
import { getTracksByTempo, webPlaybackSDK } from "../app/spotify";
import Queue from "./Queue";
import s from './Beast.module.css'
import Cookies from "js-cookie";
import useEvent from "react-use-event";
import useAsyncEffect from "use-async-effect";

export default function Beast ({loaded_cookie}) {
    // tracks management
    const [tracks, setTracks] = useState([])
    const [skipCheck, setSkipCheck] = useState(loaded_cookie.value === 'true')

    useEffect(() => {
        setSkipCheck(false);
        setTracks(JSON.parse(localStorage.getItem('tracks') || '[]'))
    }, []);

    useEffect(() => {
        if (tracks.length) {
            Cookies.set('tracks_loaded', 'true')
            // console.warn('setting localstorage')
            localStorage.setItem('tracks', JSON.stringify(tracks));
        } else {
            Cookies.set('tracks_loaded', 'false')
        }
    }, [tracks])

    useEvent('delete_tracks', () => {
        localStorage.removeItem('tracks');
        Cookies.set('tracks_loaded', 'false');
        setTracks([]);
    });

    // Search options
    const [tolerance, setTolerance] = useState(0.5)
    const [enableTime, setEnableTime] = useState(false)
    const [sort, setSort] = useState('slowest')
    const [targetTempo, setTargetTempo] = useState(100)
    const searchOptions = {tolerance, enableTime, sort, targetTempo}
    const setSearchOptions = {setTolerance, setEnableTime, setSort, setTargetTempo}
    
    // web playback sdk
    const [player, setPlayer] = useState(undefined)
    const [deviceId, setDeviceId] = useState(undefined)
    const [ready, setReady] = useState(false)
    const [paused, setPaused] = useState(false)
    const [active, setActive] = useState(false)
    const [currentTrack, setCurrentTrack] = useState(dummyTrack)
    const playbackprops = {player, deviceId, ready, paused, active, currentTrack}

    useAsyncEffect(async () => {
        const { Player } = await webPlaybackSDK()

        const player = new Player({
            name: 'BPM Beast',
            getOAuthToken: cb => { cb(Cookies.get('access_token')); },
            volume: 0.5

        });

        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            setDeviceId(device_id);
            setReady(true);
        });
        
        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
            setReady(false);
        });

        player.addListener('player_state_changed', ( state => {
            if (!state) {
                return;
            }
        
            setCurrentTrack(state.track_window.current_track);
            setPaused(state.paused);
            
        
            player.getCurrentState().then( state => { 
                (!state)? setActive(false) : setActive(true) 
            });
        }));

        console.log('setting player')
        setPlayer(player);
    }, [])
    
    // console.log(loaded_cookie)
    const tracks_loaded = skipCheck || tracks.length > 0
    const results = getTracksByTempo(tracks, targetTempo, searchOptions)
    
    const main = <>
        <SongPlayer tracks={results} playbackprops={playbackprops}/> 
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
'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { SearchOptions, TempoSelector } from "./SearchOptions";
import PlaylistLoader from "./PlaylistLoader";
import SongPlayer, { dummyTrack } from "./SongPlayer";
import { getTracksByTempo, startPlayback, webPlaybackSDK } from "../app/spotify";
import Queue from "./Queue";
import s from './Beast.module.css'
import Cookies from "js-cookie";
import useEvent from "react-use-event";
import useAsyncEffect from "use-async-effect";
import useStateRef from "react-usestateref";

export default function Beast ({tracks_loaded_srv}) {
    // tracks management
    const [tracks, setTracks] = useState([])
    const [skipCheck, setSkipCheck] = useState(tracks_loaded_srv)

    // load tracks from localstorage
    useEffect(() => {
        setSkipCheck(false);
        setTracks(JSON.parse(localStorage.getItem('tracks') || '[]'))
    }, []);

    // save tracks to localstorage when playlist is updated
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
        player.pause();
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
    
    // initialize web playback sdk
    useAsyncEffect(async () => {
        console.log('INITIALIZING WEB PLAYBACK SDK')
        const { Player } = await webPlaybackSDK()
        
        const player = new Player({
            name: 'BPM Beast',
            getOAuthToken: cb => { cb(Cookies.get('access_token')); },
            volume: 0.5
            
        });

        setPlayer(player);

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
        player.connect();
    }, [])
    
    const tracks_loaded = skipCheck || tracks.length > 0
    const results = useMemo(() => getTracksByTempo(tracks, searchOptions), [tracks, tolerance, enableTime, sort, targetTempo])
    
    useEffect(() => {
        // console.table({player, deviceId, tracks});
        if (player && deviceId && results.length) {
            if (currentTrack.uri !== results[0].uri) {
                // console.log('starting playback', results[0].uri)
                startPlayback(deviceId, {uris: results.map(track => track.uri)})
            }
        }
    }, [results, deviceId, player]);

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
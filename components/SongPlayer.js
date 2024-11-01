'use client';

import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import styles from './SongPlayer.module.css';
import { spot, startPlayback, webPlaybackSDK } from '../app/spotify';
import useAsyncEffect from "use-async-effect";
import { Button, ButtonGroup, Card, CardBody } from "@nextui-org/react";
import { MdPause, MdPlayArrow, MdSkipNext } from "react-icons/md";
import { MdSkipPrevious } from "react-icons/md";

const dummyTrack = {
    name: "No song playing",
    album: {
        images: [
            { url: "/album_placeholder.png" }
        ]
    },
    artists: [
        { name: "-" }
    ],
    features: {
        tempo: 0
    }
}


export default function SongPlayer({tracks}) {
    const [player, setPlayer] = useState(undefined)
    const [deviceId, setDeviceId] = useState(undefined)
    const [ready, setReady] = useState(false)

    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(dummyTrack);

    current_track.features = tracks.find(track => track.uri === current_track.uri)?.features || dummyTrack.features;
    
    useAsyncEffect(async () => {
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
        
            setTrack(state.track_window.current_track);
            setPaused(state.paused);
            
        
            player.getCurrentState().then( state => { 
                (!state)? setActive(false) : setActive(true) 
            });
        
        }));

        player.connect();
        return player.disconnect;
    }, []);

    useEffect(() => {
        // console.table({player, deviceId, tracks});
        if (player && deviceId && tracks.length) {
            if (current_track.uri !== tracks[0].uri) {
                startPlayback(deviceId, {uris: tracks.map(track => track.uri)})
            }
        }
    }, [player, deviceId, tracks]);
    // function playSomething() {
    //     startPlayback(deviceId, {uris: ['spotify:track:1JSTJqkT5qHq8MDJnJbRE1']})
    // }

    return (
        <div className="flex flex-col gap-2 justify-center flex-1">
                {/* <h1 style={{textAlign: 'center'}} className={'text-2xl'}>{ready? "Ready" : "Not ready"}</h1> */}
                    <div className={'flex flex-row justify-center content-center gap-3 pb-1.5'}>
                        
                        <img src={current_track.album.images[0].url} className={'rounded-md h-24'} alt="" />
                        <div className="flex flex-col content-center justify-center">
                                <div className="text-xl">{current_track.name }</div>
                                <div>{current_track.artists.map((a)=>a.name).join(', ')}</div>
                                <div className="text-slate-400">~ {current_track.features.tempo.toFixed(1)} BPM</div>
                        </div>
                    </div>
                <ButtonGroup>
                    <Button onClick={()=> {player.previousTrack()}}><MdSkipPrevious /></Button>
                    <Button onClick={()=> {player.togglePlay()}}>{is_paused? <MdPlayArrow />: <MdPause />}</Button>
                    <Button onClick={()=> {player.nextTrack()}}><MdSkipNext /></Button>
                </ButtonGroup>
        </div>
    )

}
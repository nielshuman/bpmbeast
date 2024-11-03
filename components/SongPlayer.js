'use client';

import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import styles from './SongPlayer.module.css';
import { spot, startPlayback, webPlaybackSDK } from '../app/spotify';
import useAsyncEffect from "use-async-effect";
import { Button, ButtonGroup, Card, CardBody } from "@nextui-org/react";
import { MdPause, MdPlayArrow, MdSkipNext } from "react-icons/md";
import { MdSkipPrevious } from "react-icons/md";

export const dummyTrack = {
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


export default function SongPlayer({tracks, playbackprops}) {
    
    const {player, deviceId, ready, paused, active, currentTrack} = playbackprops;

    currentTrack.features = tracks.find(track => track.uri === currentTrack.uri)?.features || dummyTrack.features;

    useEffect(() => {
        // console.table({player, deviceId, tracks});
        if (player && deviceId && tracks.length) {
            if (currentTrack.uri !== tracks[0].uri) {
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
                        
                        <img src={currentTrack.album.images[0].url} className={'rounded-md h-24'} alt="" />
                        <div className="flex flex-col content-center justify-center">
                                <div className="text-xl">{currentTrack.name }</div>
                                <div>{currentTrack.artists.map((a)=>a.name).join(', ')}</div>
                                <div className="text-slate-400">~ {currentTrack.features.tempo.toFixed(1)} BPM</div>
                        </div>
                    </div>
                <ButtonGroup>
                    <Button onClick={()=> {player.previousTrack()}}><MdSkipPrevious /></Button>
                    <Button onClick={()=> {player.togglePlay()}}>{paused? <MdPlayArrow />: <MdPause />}</Button>
                    <Button onClick={()=> {player.nextTrack()}}><MdSkipNext /></Button>
                </ButtonGroup>
        </div>
    )

}
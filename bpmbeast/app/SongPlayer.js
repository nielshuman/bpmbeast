'use client';

import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import styles from './SongPlayer.module.css';

const dummyTrack = {
    name: "No song playing",
    album: {
        images: [
            { url: "/album_placeholder.png" }
        ]
    },
    artists: [
        { name: "By no one" }
    ]
}


export default function SongPlayer({token}) {
    const [player, setPlayer] = useState(undefined)
    const [deviceId, setDeviceId] = useState(undefined)
    const [ready, setReady] = useState(false)

    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(dummyTrack);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            window.cookies = Cookies;
            const player = new window.Spotify.Player({
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
            function cleanup() {
                player.disconnect();
            }
            return cleanup;
        };
    }, []);

    return (
        <>
            <h1 style={{textAlign: 'center'}}>{ready? "Ready" : "Not ready"}</h1>
            <div className={styles.container}>
                <div className={styles.main_wrapper}>
                    <img src={current_track.album.images[0].url} 
                         className={styles.now_playing__cover} alt="" />
    
                    <div className={styles.now_playing__side}>
                        <div className={styles.now_playing__name}>{
                                      current_track.name
                                      }</div>
    
                        <div className={styles.now_playing__artist}>{
                                      current_track.artists[0].name
                                      }</div>
                    </div>
                </div>
            </div>
         </>
    )

}
'use client';

import Cookies from "js-cookie";
import { useState, useEffect } from "react";

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}


export default function SongPlayer({token}) {
    const [player, setPlayer] = useState(undefined)
    const [deviceId, setDeviceId] = useState(undefined)
    const [ready, setReady] = useState(false)

    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);

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
            <div className="container">
            {ready ? <h1>Ready to play</h1> : <h1>Not ready</h1>}
                <div className="main-wrapper">
                    <img src={current_track.album.images[0].url} 
                         className="now-playing__cover" alt="" />
    
                    <div className="now-playing__side">
                        <div className="now-playing__name">{
                                      current_track.name
                                      }</div>
    
                        <div className="now-playing__artist">{
                                      current_track.artists[0].name
                                      }</div>
                    </div>
                </div>
            </div>
         </>
    )

}
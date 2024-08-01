'use client';

import { useState } from "react";
import SongFinder from "./SongFinder";
import { PlaylistLoader } from "./SongFinder";
import SongPlayer from "./SongPlayer";

export default function Beast () {
    const [tracks, setTracks] = useState([])
    const [results, setResults] = useState([])

    return <>
        {
        tracks.length? <> <SongFinder tracks={tracks} setResults={setResults} /> <SongPlayer /> </>
        : <PlaylistLoader setTracks={setTracks}/> 
        }
    </> 
}
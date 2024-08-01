'use client';

import { useState } from "react";
import SongFinder, { SearchOptions, TempoSelector, Track } from "./SongFinder";
import { PlaylistLoader } from "./SongFinder";
import SongPlayer from "./SongPlayer";
import { getTracksByTempo } from "./spotify";

export default function Beast () {
    const [tracks, setTracks] = useState([])
    // const [results, setResults] = useState([])
    const [searchOptions, setSearchOptions] = useState({
        tolerance: 5,
        enable_half_and_double_time: true,
        sorting_method: 'slowest'
      })
    const [targetTempo, setTargetTempo] = useState(100)

    let results = getTracksByTempo(tracks, targetTempo, searchOptions)

    
    return <> 
    { tracks.length? 
        <>
            <TempoSelector value={targetTempo} setValue={setTargetTempo} />
            <SearchOptions options={searchOptions} setOptions={setSearchOptions}/>
            <div>
            {results.map(track => <>
                <Track key={track.id} track={track}></Track>
            </>)}
            </div>
            <SongPlayer tracks={results}/> 
        </>
        : <PlaylistLoader setTracks={setTracks}/> 
        }
    </> 
}
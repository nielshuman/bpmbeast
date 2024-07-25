'use client';
import { useState } from 'react';


export function PlaylistSelector() {

    let [playlists, setPlaylists] = useState([{ name: '❤️ Liked Songs', id: 'saved' }])
  
    return <select>
      {playlists.map(playlist =>
        <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
      )}
    </select>
  }
import Image from "next/image";
import dynamic from 'next/dynamic'
// import Cookies from 'js-cookie';
// import "./globals.css";
import { LoginBar } from "./loginbar";
import SongFinder, { TempoSelector } from "./SongFinder";
import SongPlayer from "./SongPlayer"
import Beast from "./beast";
import { cookies } from "next/headers"

// import styles from "./page.module.css";
// const PlaylistSelector = dynamic(() => import('./PlaylistSelector'), { ssr: false })

export default function Home() {
  let logged_in = Boolean(cookies().get('access_token'))
  return <main>
    <LoginBar logged_in={logged_in}/>
    <hr>
    </hr>
    {logged_in? <Beast /> : <div>Log in to use the beast</div>}
  </main>
}
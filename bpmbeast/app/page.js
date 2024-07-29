import Image from "next/image";
import dynamic from 'next/dynamic'
// import Cookies from 'js-cookie';
// import "./globals.css";
import { LoginBar } from "./loginbar";
import SongFinder, { TempoSelector } from "./SongFinder";
import SongPlayer from "./SongPlayer"
// import styles from "./page.module.css";
// const PlaylistSelector = dynamic(() => import('./PlaylistSelector'), { ssr: false })

export default function Home() {
  return <main>
    <LoginBar />
    <hr></hr>
    <br></br>
    <SongFinder />
    <hr></hr>
    <SongPlayer />
    {/* <TempoSelector></TempoSelector> */}

  </main>
}
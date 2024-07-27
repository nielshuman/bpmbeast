import Image from "next/image";
import dynamic from 'next/dynamic'
// import Cookies from 'js-cookie';
import "./globals.css";
import { LoginBar } from "./loginbar";
import PlaylistSelector, { TempoSelector } from "./PlaylistLoader";
// import styles from "./page.module.css";
// const PlaylistSelector = dynamic(() => import('./PlaylistSelector'), { ssr: false })

export default function Home() {
  return <main>
    <LoginBar />
    <PlaylistSelector />
    <TempoSelector></TempoSelector>
  </main>
}
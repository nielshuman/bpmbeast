import Image from "next/image";
import "./globals.css";
// import Cookies from 'js-cookie';
import { LoginBar } from "./loginbar";
import { PlaylistSelector } from "./client";
// import styles from "./page.module.css";

export default function Home() {
  return <main>
    <LoginBar />
    <PlaylistSelector />
  </main>
}


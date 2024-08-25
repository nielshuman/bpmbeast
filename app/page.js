import { LoginBar } from "@/components/loginbar";
import * as SpotifyLoginButton from "@/components/SpotifyLoginButton";

import Beast from "./beast";
import { cookies } from "next/headers"

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

import './globals.css'
import { Button, Progress } from "@nextui-org/react";

// import styles from "./page.module.css";
// const PlaylistSelector = dynamic(() => import('./PlaylistSelector'), { ssr: false })

export default function Home() {
  let logged_in = Boolean(cookies().get('access_token'))
  return <main className={inter.className}>
      <LoginBar logged_in={logged_in}/>
      <hr>
      </hr>

      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>

      {logged_in? <Beast /> : <div>
        Log in to use the beasty beast <br />
        <SpotifyLoginButton.normal href={'/api/login'} width={'250px'}/>
      </div>}
    </main>
}
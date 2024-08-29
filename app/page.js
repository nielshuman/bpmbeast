import { LoginBar } from "@/components/LoginBar";
import Beast from "@/components/beast";
import * as SpotifyLoginButton from "@/components/SpotifyLoginButton";

import { cookies } from "next/headers"
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

import { Button, Progress } from "@nextui-org/react";

// import styles from "./page.module.css";
// const PlaylistSelector = dynamic(() => import('./PlaylistSelector'), { ssr: false })

export default function Home() {
  let logged_in = Boolean(cookies().get('access_token'))
  return <main className={`dark text-foreground bg-background ${inter.className} flex min-h-full flex-col`}>
      <LoginBar logged_in={logged_in}/>

      {logged_in? <Beast /> : <LoginView /> }
    </main>
}

function LoginView() {
  return <div>
        Log in to use the beasty beast <br />
        <SpotifyLoginButton.normal href={'/api/login'} width={'250px'}/>
      </div>
}
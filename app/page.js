import { LoginBar } from "@/components/LoginBar";
import Beast from "@/components/Beast";
import SpotifyLoginButtons from "@/components/SpotifyLoginButton";

import { cookies } from "next/headers"
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import { Button, Progress } from "@nextui-org/react";

// import styles from "./page.module.css";
// const PlaylistSelector = dynamic(() => import('./PlaylistSelector'), { ssr: false })

export default function Home() {
  let logged_in = Boolean(cookies().get('access_token'))
  return <div className={`dark text-foreground bg-background ${inter.className} flex min-h-screen min-h-full flex-col`}>
      <LoginBar logged_in={logged_in}/>
      <main className="flex flex-col flex-1 items-center">
        {logged_in? <Beast loaded_cookie={cookies().get('tracks_loaded')}/> : <LoginView />}
      </main>
    </div>
}

function LoginView() {
  return <div>
        Log in to use the beasty beast <br />
        <SpotifyLoginButtons.normal href={'/api/login'} width={'250px'}/>
      </div>
}
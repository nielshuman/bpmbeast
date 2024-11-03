import { LoginBar } from "@/components/LoginBar";
import Beast from "@/components/Beast";
import SpotifyLoginButtons from "@/components/SpotifyLoginButton";

import { cookies } from "next/headers"
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import { Button, Chip, Progress } from "@nextui-org/react";

// import styles from "./page.module.css";
// const PlaylistSelector = dynamic(() => import('./PlaylistSelector'), { ssr: false })

export default function Home() {
  let logged_in = Boolean(cookies().get('access_token'))
  let tracks_loaded_srv = cookies().get('tracks_loaded') === 'true'
  
  return <div className={`dark text-foreground bg-background ${inter.className} flex min-h-screen min-h-full flex-col`}>
      <LoginBar logged_in={logged_in}/>
      <main className="flex flex-col flex-1 items-center">
        {logged_in? <Beast tracks_loaded_srv={tracks_loaded_srv}/> : <LoginView />}
      </main>
    </div>
}

function LoginView() {
  return <div className="flex flex-col items-center">
    <div className="flex gap-2 items-center">
        <h1 className="text-3xl"> BPM Beast </h1> <Chip color='primary'>Beta</Chip>
    </div>
        <span className="pb-5 text-center"> Please log in to use BPM Beast. <br/>
        This is a closed beta (so expect some bugs). </span>
        <SpotifyLoginButtons.normal href={'/api/login'} width={'250px'}/>
    </div>
}
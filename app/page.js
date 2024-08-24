import { LoginBar } from "./components/loginbar";
import Beast from "./beast";
import { cookies } from "next/headers"
import * as SpotifyLoginButton from "./components/SpotifyLoginButton";
// import styles from "./page.module.css";
// const PlaylistSelector = dynamic(() => import('./PlaylistSelector'), { ssr: false })

export default function Home() {
  let logged_in = Boolean(cookies().get('access_token'))
  return <main>
    <LoginBar logged_in={logged_in}/>
    <hr>
    </hr>
    {logged_in? <Beast /> : <div>
      Log in to use the beasty beast <br />
      <SpotifyLoginButton.normal href={'/api/login'} width={'250px'}/>
    </div>}
  </main>
}
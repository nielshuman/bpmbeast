import Cookies from "js-cookie";
import * as SpotifyLoginButton from "./SpotifyLoginButton";
import s from './loginbar.module.css'  
import { cookies } from "next/headers";

// TODO: Refresh enzo

export async function LoginBar({logged_in}) {
  let profile;  
  if (logged_in) {
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET", headers: { Authorization: `Bearer ${cookies().get('access_token').value}` }
    });
    profile = await response.json() 
  }
  return <div className={s.bar}>
        BPM Beast
        {logged_in? <UserView profile={profile} /> : <SpotifyLoginButton.small href={'/api/login'} width={'100px'}/>}    
  </div>
}

export function UserView({profile}) {
  return <div> Logged in as {profile.display_name}</div>
}
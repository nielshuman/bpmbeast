import Cookies from "js-cookie";
import * as SpotifyLoginButton from "./SpotifyLoginButton";
import s from './loginbar.module.css'  
import { cookies } from "next/headers";
import Image from "next/image";

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
  console.log(profile)
  return <div className={s.UserView}> 
      <Image className={s.rounded} src={profile.images[1].url} width={50} height={50}></Image> 
      <span class={s.userName}> {profile.display_name} </span>
    </div>
}
import SpotifyLoginButtons from "./SpotifyLoginButton";
import s from './LoginBar.module.css'  
import { cookies } from "next/headers";
import { UserView } from "./UserView";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
// TODO: Refresh enzo

export async function LoginBar({logged_in}) {
  let profile;  
  if (logged_in) {
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET", headers: { Authorization: `Bearer ${cookies().get('access_token').value}` }
    });
    profile = await response.json() 
  }
  // return <div className={s.bar}>
  //   <span> BPM Beast </span>
  //   {logged_in? <UserView profile={profile} /> : <SpotifyLoginButtons.small href={'/api/login'} width={'100px'}/>}    
  // </div>
  return <Navbar maxWidth="full" className={s.container}>
    <NavbarBrand> BPM Beast </NavbarBrand>
    <NavbarContent justify="end">
      {logged_in? <UserView profile={profile} /> : <SpotifyLoginButtons.small href={'/api/login'} width={'100px'}/>}
    </NavbarContent>
  </Navbar>
}


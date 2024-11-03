import SpotifyLoginButtons from "./SpotifyLoginButton";
import s from './LoginBar.module.css'  
import { cookies } from "next/headers";
import { UserView } from "./UserView";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
// TODO: Refresh enzo

export async function LoginBar({logged_in}) {
  return <Navbar maxWidth="full" className={s.container}>
    <NavbarBrand> BPM Beast </NavbarBrand>
    <NavbarContent justify="end">
      {logged_in? <UserView /> : <SpotifyLoginButtons.small href={'/api/login'} width={'100px'}/>}
    </NavbarContent>
  </Navbar>
}


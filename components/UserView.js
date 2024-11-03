'use client'; // tijdelijke bugfix
// TODO: refresh token server side

import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import s from './UserView.module.css'
import { IoLogOut } from "react-icons/io5";
import { FaExchangeAlt } from "react-icons/fa";
import useEvent from "react-use-event";
import useAsyncEffect from "use-async-effect";
import { spot } from "@/app/spotify";
import { useState } from "react";

const dummyProfile = {
    display_name: "Loading...",
    images: [
        { url: "/album_placeholder.png" },
        { url: "/album_placeholder.png" }
    ]
}

export function UserView() {
    const [profile, setProfile] = useState(dummyProfile);
    useAsyncEffect(async () => setProfile(await spot('https://api.spotify.com/v1/me')), []);
    const deleteEvent = useEvent('delete_tracks');
    function onAction(e) {
      console.log(e)
      if (e == 'change') {
          deleteEvent();
      }
    }
    return <Dropdown backdrop="blur">
      <DropdownTrigger>
        <div className={s.UserView}>
          <Avatar src={profile.images[1].url} size="small" />
          <span className={s.userName}> {profile.display_name} </span>
        </div>
      </DropdownTrigger>
  
      <DropdownMenu onAction={onAction}>
        <DropdownItem key="change" startContent={<FaExchangeAlt />}>Change playlist</DropdownItem>
        <DropdownItem key="logout" href="/api/logout" className="text-danger" color="danger" startContent={<IoLogOut />}>Logout</DropdownItem>
      </DropdownMenu>
    </Dropdown> 
  }
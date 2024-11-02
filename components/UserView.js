'use client'; // tijdelijke bugfix
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import s from './UserView.module.css'
import { IoLogOut } from "react-icons/io5";
import { FaExchangeAlt } from "react-icons/fa";
import useEvent from "react-use-event";
export function UserView({profile}) {
    // console.log(profile)
    const deleteEvent = useEvent('delete_tracks');

    function onAction(e) {
      console.log(e)
      if (e == 'change') {
          deleteEvent();
          // window.location.reload();
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
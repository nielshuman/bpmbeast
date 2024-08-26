'use client'; // tijdelijke bugfix
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import s from './UserView.module.css'
import { IoLogOut } from "react-icons/io5";
export function UserView({profile}) {
    console.log(profile)
    return <Dropdown backdrop="blur">
      <DropdownTrigger>
        <div className={s.UserView}>
          <Avatar src={profile.images[1].url} size="small" />
          <span className={s.userName}> {profile.display_name} </span>
        </div>
      </DropdownTrigger>
  
      <DropdownMenu>
        <DropdownItem key="logout" href="/api/logout" className="text-danger" color="danger" startContent={<IoLogOut />}>Logout</DropdownItem>
      </DropdownMenu>
    </Dropdown> 
  }
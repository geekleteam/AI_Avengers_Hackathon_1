"use client"
import { Button } from '@/components/ui/button'
import { LogoutLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { Search, Send, ChevronDown, LogOut, Settings, Users } from 'lucide-react'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from '@/components/ui/separator'
import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'

export interface TEAM {
  createdBy: String,
  teamName: String,
  _id: String
}

function Header() {
  const { user }: any = useKindeBrowserClient()
  const [activeTeam, setActiveTeam] = useState<TEAM>()
  const [teamList, setTeamList] = useState<TEAM[]>([])

  const convex = useConvex()
  const router = useRouter()

  const menu = [
    // {
    //   id: 1,
    //   name: 'Create Team',
    //   path: '/teams/create',
    //   icon: Users
    // },
    {
      id: 2,
      name: 'Settings',
      path: '',
      icon: Settings
    }
  ]

  // useEffect(() => {
  //   user && getTeamList()
  // }, [user])


  // const getTeamList = async () => {
  //   const result = await convex.query(api.teams.getTeam, { email: user?.email })
  //   setTeamList(result)
  //   setActiveTeam(result[0])
  // }

  const onMenuClick = (item: any) => {
    if (item.path) {
      router.push(item.path)
    }
  }

  return (
    <div className='flex justify-end w-full items-center gap-2'>
      <Popover>
        <PopoverTrigger>
          <div className='flex items-center gap-3 cursor-pointer'>
            <Image src={user?.picture} alt='user-profile-image' width={30} height={30} className='rounded-full' />
            <h2 className='flex gap-2 items-center font-bold text-[17px]'>{user?.given_name} <ChevronDown /></h2>
          </div>
        </PopoverTrigger>
        <PopoverContent className='ml-7 p-4'>
          <div>
            {menu.map((item, index) => (
              <h2 className='flex gap-2 cursor-pointer items-center p-2 hover:bg-gray-100 rounded-lg text-sm' key={index} onClick={() => onMenuClick(item)}><item.icon className='h-4 w-4' /> {item.name}</h2>
            ))}
            <LogoutLink>
              <h2 className='flex gap-2 cursor-pointer items-center p-2 hover:bg-gray-100 rounded-lg text-sm'><LogOut className='h-4 w-4' /> Logout</h2>
            </LogoutLink>
          </div>
          <Separator className='mt-2' />
          {user && <div className='mt-2 flex gap-2 items-center'>
            <div>
              <h2 className='text-[14px] font-bold'>{user?.given_name} {user?.family_name}</h2>
              <h2 className='text-[12px] text-gray-500'>{user?.email}</h2>
            </div>
          </div>}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default Header




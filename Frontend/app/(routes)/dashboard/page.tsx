"use client"
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { LogoutLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { useConvex, useMutation, useQuery } from 'convex/react'
import React, { useContext, useEffect, useState } from 'react'
import Header from './_components/Header'

import { Archive, Flag, Github, Plus } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { WorkspaceListContext } from '@/app/_context/WorkspacesListContext'
import { toast } from 'sonner'
import WorkspaceList from './_components/WorkspaceList'
import { WorkspaceProvider } from '@/app/_context/WorkspaceContext'

export default function Dashboard() {

  const convex = useConvex()

  const { user }: any = useKindeBrowserClient()

  // const userEmail = user?.email || ''; 
  // const getUser = useQuery(api.user.getUser, { email: userEmail });


  const createUser = useMutation(api.user.createUser)

  const createWorkspace = useMutation(api.workspaces.createWorkspace)

  const { workspaceList_, setWorkspaceList_ } = useContext(WorkspaceListContext)
  const [totalWorkspaces, setTotalWorkspaces] = useState(0)
  const [workspaceInput, setWorkspaceInput] = useState("")

  const [activeTeam, setActiveTeam] = useState(null)

  useEffect(() => {
    getWorkspaces()
}, [])

  useEffect(() => {
    if (user) {
      checkUser()
    }
  }, [user])

const checkUser = async () => {
  const result = await convex.query(api.user.getUser,{email:user?.email});
  if (!result?.length) {
    createUser({
      name: user?.given_name,
      email: user?.email,
      image: user?.picture
    }).then((resp) => { console.log(resp) })
  }
}
const onWorkspaceCreate = (name: string) => {
  const userEmail = user?.email || ''
  //@ts-ignore
  const teamIdString = activeTeam?._id?.toString() || ''
  createWorkspace({
    name: name,
    teamId: teamIdString,
    userId: userEmail,
    archive: false
  }).then((resp: any) => {
    if (resp) {
      getWorkspaces()
      toast("Workspace Created Successfully!")
    }
  }, (e: any) => {
    toast("Error while creating workspace")
  })
}

const getWorkspaces = async () => {
  //@ts-ignore
  const teamId = (activeTeam?._id ?? '').toString()
  const result = await convex.query(api.workspaces.getWorkspaces, { teamId })
  setWorkspaceList_(result)
  setTotalWorkspaces(result?.length)
}


  return (
    <div className='p-8'>
    <Header />
    <div className='flex justify-center'>
    <div className='w-3/5 mt-16'>
    <Dialog>
      <DialogTrigger className='w-full' asChild>
      <Button className='w-12 h-12 p-0 shadow-lg flex items-center justify-center bg-transparent hover:bg-blue-500 hover:text-white transition duration-200 ease-in-out'>
                <Plus className='h-12 w-12 p-2 text-gray-700 hover:text-white transition duration-200 ease-in-out' />
              </Button>
      </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
            <DialogDescription>
              <Input placeholder='Enter workspace Name' className='mt-3' onChange={(e) => setWorkspaceInput(e.target.value)} />
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="">
            <DialogClose asChild>
              <Button type="button" className='bg-blue-400 hover:bg-blue-500' onClick={() => onWorkspaceCreate(workspaceInput)}>
                Create
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
    </Dialog>
    <WorkspaceList />
    </div>
    </div>
  </div>
  )
}

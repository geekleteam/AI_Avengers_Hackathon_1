"use client"
import { api } from '@/convex/_generated/api';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useConvex } from 'convex/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { WorkspaceListContext } from '@/app/_context/WorkspacesListContext';

function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const convex = useConvex()

    const router = useRouter()

    const { user }: any = useKindeBrowserClient()
    const [workspaceList_,setWorkspaceList_] = useState()

    useEffect(() => {
        user && checkTeam();
    }, [user])

    const checkTeam = async () => {
        const result = await convex.query(api.teams.getTeam,
            { email: user?.email });

        if (!result?.length) {
            router.push('teams/create')
        }
    }

    return (
        <div>
            <WorkspaceListContext.Provider value={{workspaceList_,setWorkspaceList_}}>
                <div className='grid grid-cols-4'>
                    <div className='col-span-4'>
                        {children}
                    </div>
                </div>
            </WorkspaceListContext.Provider>
        </div>
    )
}

export default DashboardLayout
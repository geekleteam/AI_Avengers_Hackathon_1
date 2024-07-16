"use client"

import React, { useEffect, useState } from 'react'
import WorkspaceHeader from './_components/WorkspaceHeader'
import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Canvas from './_components/Canvas'
import Sidebar from './_components/SideMenu'
import { Workspace as WORKSPACE} from '@/app/(routes)/dashboard/_components/WorkspaceList';
import { WorkspaceProvider } from '@/app/_context/WorkspaceContext'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { ChatProvider } from '@/app/_context/ChatContext'

function Workspace({ params }: any) {

    const [triggerSave, setTriggerSave] = useState(false)
    const [showDiagramMenu, setShowDiagramMenu] = useState(false);
    const { user }: any = useKindeBrowserClient()
    const convex = useConvex();
    const [workspaceData,setWorkspaceData] = useState<WORKSPACE | any>();

    useEffect(() => {
        params.workspaceId&&getWorkspaceData()
    }, [])

    const getWorkspaceData = async () => {
        if(!user || !params.workspaceId) return;
        const result = await convex.query(api.workspaces.getWorkspaceById,{_id:params.workspaceId, userId: user?.email})
        setWorkspaceData(result)
    }

    const handleDiagramClick = () => {
        setShowDiagramMenu(!showDiagramMenu);
    };

    return (
        <WorkspaceProvider>
        <ChatProvider>
            <WorkspaceHeader onSave={() => setTriggerSave(!triggerSave)} />
            <Sidebar />
            <div className='grid grid-cols-1 md:grid-cols-2'>
                <div className='pl-4 h-screen w-screen border-l'>
                    <Canvas onSaveTrigger={triggerSave} workspaceId={params.workspaceId} workspaceData={workspaceData}/>
                </div>
            </div>
        </ChatProvider>
        </WorkspaceProvider>
    )
}

export default Workspace

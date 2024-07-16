"use client"
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Workspace } from '@/app/(routes)/dashboard/_components/WorkspaceList';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { useWorkspace } from '@/app/_context/WorkspaceContext';
import ExcalidrawWrapper from './ExcalidrawWrapper';
import aiToExcalidraw from '../_utils/aiToExcalidraw';
import { useChat } from '@/app/_context/ChatContext';

const Excalidraw = dynamic(() => import('@excalidraw/excalidraw').then(mod => mod.Excalidraw), { ssr: false });

interface CanvasProps {
    onSaveTrigger: any, 
    workspaceId: string, 
    conversationId?: string,
    workspaceData: string
}

function Canvas({ onSaveTrigger, workspaceId, workspaceData, conversationId }: CanvasProps) {
   // const [whiteBoardData, setWhiteBoardData] = useState<any[]>([]);
    const {whiteBoardData} = useChat();
    const saveWorkspace = useMutation(api.workspaces.editWorkspace);
    const { workspace, editWorkspace } = useWorkspace();

    // useEffect(() => {
    //     const fetchAiToExcalidraw = async () => {
    //         try {
    //             // const data = await aiToExcalidraw();
    //             // console.log('Fetched Data:', data);
    //             // setWhiteBoardData(data as any);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };
    //     fetchAiToExcalidraw();
    // }, []);

    useEffect(() => {
        if (onSaveTrigger) {
            saveWhiteboard();
        }
    }, [onSaveTrigger]);

    const saveWhiteboard = async () => {
        if (workspace) {
            const updatedConversations = workspace.conversations.map(conversation => 
                conversation.conversationId === conversationId 
                ? { ...conversation, whiteboardData: JSON.stringify(whiteBoardData) } 
                : conversation
            );

            const updatedWorkspace = { ...workspace, conversations: updatedConversations };
            editWorkspace(updatedWorkspace);

            try {
                await editWorkspace({
                    ...workspace,
                    conversations: updatedConversations,
                    updatedOn: new Date().toISOString()
                });
                console.log('Workspace data saved successfully');
            } catch (error) {
                console.error('Error saving workspace data:', error);
            }
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
        }}>
            <div style={{
                width: '90%',
                height: '90%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative'
                }}>
                    <ExcalidrawWrapper sceneElements={whiteBoardData?.length > 0 ? whiteBoardData : undefined} />
                </div>
            </div>
        </div>
    );
}

export default Canvas;
